import request from 'supertest';
import express from 'express';
import contactsRouter from '../contacts';
import { supabase } from '../../config/supabase';

const app = express();
app.use(express.json());
app.use('/api/v1/contacts', contactsRouter);

describe('Contacts API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/contacts', () => {
    it('should return paginated contacts', async () => {
      const mockContacts = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('contacts').select().mockResolvedValueOnce({
        data: mockContacts,
        error: null,
        count: 1,
      });

      const response = await request(app)
        .get('/api/v1/contacts')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        contacts: mockContacts,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should handle search parameters', async () => {
      const search = 'john';
      await request(app)
        .get(`/api/v1/contacts?search=${search}`)
        .set('Authorization', 'Bearer fake-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.from('contacts').or)
        .toHaveBeenCalledWith(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    });
  });

  describe('POST /api/v1/contacts', () => {
    it('should create a new contact', async () => {
      const newContact = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('contacts').insert().mockResolvedValueOnce({
        data: { id: '2', ...newContact },
        error: null,
      });

      const response = await request(app)
        .post('/api/v1/contacts')
        .set('Authorization', 'Bearer fake-token')
        .send(newContact);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: '2',
        ...newContact,
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/contacts')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 