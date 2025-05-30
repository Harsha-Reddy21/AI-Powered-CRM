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

// Mock activities router
const mockActivitiesRouter = express.Router();

mockActivitiesRouter.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, contact_id } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('activities')
      .select('*, contacts(first_name, last_name, email)', { count: 'exact' });

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (contact_id) {
      query = query.eq('contact_id', contact_id);
    }

    const { data: activities, error, count } = await query
      .order('scheduled_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    res.json({
      activities,
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

mockActivitiesRouter.post('/', async (req, res) => {
  try {
    const { type, title, description, contact_id, scheduled_at, status } = req.body;

    if (!type || !title || !contact_id) {
      return res.status(400).json({ error: 'Type, title, and contact_id are required' });
    }

    const { data: activity, error } = await supabase
      .from('activities')
      .insert({
        type,
        title,
        description,
        contact_id,
        scheduled_at,
        status: status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

mockActivitiesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const { data: activity, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/v1/activities', mockActivitiesRouter);

describe('Activities API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/activities', () => {
    it('should return paginated activities', async () => {
      const mockActivities = [
        {
          id: '1',
          type: 'call',
          title: 'Discovery Call',
          description: 'Initial discovery call with prospect',
          contact_id: '1',
          scheduled_at: '2024-01-15T10:00:00Z',
          status: 'completed',
          contacts: { first_name: 'John', last_name: 'Smith', email: 'john@example.com' },
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.select.mockResolvedValueOnce({
        data: mockActivities,
        error: null,
        count: 1,
      });

      const response = await request(app)
        .get('/api/v1/activities')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        activities: mockActivities,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should filter activities by type', async () => {
      const type = 'call';
      await request(app)
        .get(`/api/v1/activities?type=${type}`)
        .set('Authorization', 'Bearer fake-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.eq).toHaveBeenCalledWith('type', type);
    });

    it('should filter activities by status', async () => {
      const status = 'completed';
      await request(app)
        .get(`/api/v1/activities?status=${status}`)
        .set('Authorization', 'Bearer fake-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.eq).toHaveBeenCalledWith('status', status);
    });

    it('should filter activities by contact_id', async () => {
      const contact_id = '1';
      await request(app)
        .get(`/api/v1/activities?contact_id=${contact_id}`)
        .set('Authorization', 'Bearer fake-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.eq).toHaveBeenCalledWith('contact_id', contact_id);
    });
  });

  describe('POST /api/v1/activities', () => {
    it('should create a new activity', async () => {
      const newActivity = {
        type: 'meeting',
        title: 'Product Demo',
        description: 'Live demo of our platform features',
        contact_id: '1',
        scheduled_at: '2024-01-16T15:00:00Z',
        status: 'scheduled',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '2', ...newActivity },
        error: null,
      });

      const response = await request(app)
        .post('/api/v1/activities')
        .set('Authorization', 'Bearer fake-token')
        .send(newActivity);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: '2',
        type: newActivity.type,
        title: newActivity.title,
      }));
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/activities')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Type, title, and contact_id are required');
    });

    it('should set default status to pending', async () => {
      const newActivity = {
        type: 'email',
        title: 'Follow-up Email',
        contact_id: '1',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '3', ...newActivity, status: 'pending' },
        error: null,
      });

      await request(app)
        .post('/api/v1/activities')
        .set('Authorization', 'Bearer fake-token')
        .send(newActivity);

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' })
      );
    });
  });

  describe('PUT /api/v1/activities/:id', () => {
    it('should update an activity', async () => {
      const activityId = '1';
      const updates = {
        status: 'completed',
        description: 'Call completed successfully',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: activityId, ...updates },
        error: null,
      });

      const response = await request(app)
        .put(`/api/v1/activities/${activityId}`)
        .set('Authorization', 'Bearer fake-token')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: activityId,
        status: updates.status,
        description: updates.description,
      }));
    });

    it('should update the updated_at timestamp', async () => {
      const activityId = '1';
      const updates = { status: 'completed' };

      await request(app)
        .put(`/api/v1/activities/${activityId}`)
        .set('Authorization', 'Bearer fake-token')
        .send(updates);

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ updated_at: expect.any(String) })
      );
    });
  });
}); 