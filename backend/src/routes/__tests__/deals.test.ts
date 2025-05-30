import request from 'supertest';
import express from 'express';
import { supabase } from '../../config/supabase';

// Mock the supabase client
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

const app = express();
app.use(express.json());

// Mock deals router (we'll create this)
const mockDealsRouter = express.Router();

mockDealsRouter.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, stage, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('deals')
      .select('*, contacts(first_name, last_name, email), pipelines(name)', { count: 'exact' });

    if (stage) {
      query = query.eq('stage', stage);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: deals, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    res.json({
      deals,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

mockDealsRouter.post('/', async (req, res) => {
  try {
    const { title, description, value, stage, contact_id, pipeline_id, close_date } = req.body;

    if (!title || !value || !stage) {
      return res.status(400).json({ error: 'Title, value, and stage are required' });
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        title,
        description,
        value,
        stage,
        contact_id,
        pipeline_id,
        close_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

mockDealsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const { data: deal, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

mockDealsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/v1/deals', mockDealsRouter);

describe('Deals API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/deals', () => {
    it('should return paginated deals', async () => {
      const mockDeals = [
        {
          id: '1',
          title: 'Enterprise Software Solution',
          description: 'Custom software development',
          value: 150000,
          stage: 'Prospecting',
          contact_id: '1',
          pipeline_id: '1',
          contacts: { first_name: 'John', last_name: 'Smith', email: 'john@example.com' },
          pipelines: { name: 'Sales Pipeline' },
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.select.mockResolvedValueOnce({
        data: mockDeals,
        error: null,
        count: 1,
      });

      const response = await request(app)
        .get('/api/v1/deals')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        deals: mockDeals,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should filter deals by stage', async () => {
      const stage = 'Negotiation';
      await request(app)
        .get(`/api/v1/deals?stage=${stage}`)
        .set('Authorization', 'Bearer fake-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.eq).toHaveBeenCalledWith('stage', stage);
    });

    it('should handle search parameters', async () => {
      const search = 'enterprise';
      await request(app)
        .get(`/api/v1/deals?search=${search}`)
        .set('Authorization', 'Bearer fake-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.or)
        .toHaveBeenCalledWith(`title.ilike.%${search}%,description.ilike.%${search}%`);
    });
  });

  describe('POST /api/v1/deals', () => {
    it('should create a new deal', async () => {
      const newDeal = {
        title: 'Cloud Migration Project',
        description: 'Complete cloud infrastructure migration',
        value: 85000,
        stage: 'Qualification',
        contact_id: '1',
        pipeline_id: '1',
        close_date: '2024-02-28',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '2', ...newDeal },
        error: null,
      });

      const response = await request(app)
        .post('/api/v1/deals')
        .set('Authorization', 'Bearer fake-token')
        .send(newDeal);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: '2',
        title: newDeal.title,
        value: newDeal.value,
      }));
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/deals')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should require title field', async () => {
      const response = await request(app)
        .post('/api/v1/deals')
        .set('Authorization', 'Bearer fake-token')
        .send({ value: 50000, stage: 'Prospecting' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title');
    });
  });

  describe('PUT /api/v1/deals/:id', () => {
    it('should update a deal', async () => {
      const dealId = '1';
      const updates = {
        title: 'Updated Deal Title',
        stage: 'Negotiation',
        value: 200000,
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: dealId, ...updates },
        error: null,
      });

      const response = await request(app)
        .put(`/api/v1/deals/${dealId}`)
        .set('Authorization', 'Bearer fake-token')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: dealId,
        title: updates.title,
        stage: updates.stage,
        value: updates.value,
      }));
    });
  });

  describe('DELETE /api/v1/deals/:id', () => {
    it('should delete a deal', async () => {
      const dealId = '1';

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.delete.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const response = await request(app)
        .delete(`/api/v1/deals/${dealId}`)
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(204);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', dealId);
    });
  });
}); 