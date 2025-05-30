import request from 'supertest';
import express from 'express';
import adminRouter from '../admin';
import { supabase } from '../../config/supabase';

const app = express();
app.use(express.json());
app.use('/api/v1/admin', adminRouter);

describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return paginated users for admin', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User One',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('users').select().mockResolvedValueOnce({
        data: mockUsers,
        error: null,
        count: 2,
      });

      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it('should handle search parameters', async () => {
      const search = 'admin';
      await request(app)
        .get(`/api/v1/admin/users?search=${search}`)
        .set('Authorization', 'Bearer admin-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.from('users').or)
        .toHaveBeenCalledWith(`name.ilike.%${search}%,email.ilike.%${search}%`);
    });

    it('should filter by role', async () => {
      await request(app)
        .get('/api/v1/admin/users?role=admin')
        .set('Authorization', 'Bearer admin-token');

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      expect(mockSupabase.from('users').eq)
        .toHaveBeenCalledWith('role', 'admin');
    });
  });

  describe('POST /api/v1/admin/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: 'New User',
        role: 'user',
        password: 'password123',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.auth.admin.createUser.mockResolvedValueOnce({
        data: {
          user: {
            id: '3',
            email: newUser.email,
            user_metadata: { name: newUser.name },
          },
        },
        error: null,
      });

      mockSupabase.from('users').insert().mockResolvedValueOnce({
        data: { id: '3', ...newUser },
        error: null,
      });

      const response = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', 'Bearer admin-token')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', 'Bearer admin-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle duplicate email', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.auth.admin.createUser.mockResolvedValueOnce({
        data: null,
        error: { message: 'User already exists' },
      });

      const response = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', 'Bearer admin-token')
        .send({
          email: 'existing@example.com',
          name: 'Existing User',
          role: 'user',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/admin/users/:id', () => {
    it('should update user details', async () => {
      const updateData = {
        name: 'Updated Name',
        role: 'admin',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('users').update().eq().mockResolvedValueOnce({
        data: { id: '1', email: 'user@example.com', ...updateData },
        error: null,
      });

      const response = await request(app)
        .put('/api/v1/admin/users/1')
        .set('Authorization', 'Bearer admin-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.role).toBe(updateData.role);
    });

    it('should handle non-existent user', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('users').update().eq().mockResolvedValueOnce({
        data: null,
        error: { message: 'User not found' },
      });

      const response = await request(app)
        .put('/api/v1/admin/users/999')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/admin/users/:id', () => {
    it('should delete user', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.auth.admin.deleteUser.mockResolvedValueOnce({
        data: {},
        error: null,
      });

      mockSupabase.from('users').delete().eq().mockResolvedValueOnce({
        data: {},
        error: null,
      });

      const response = await request(app)
        .delete('/api/v1/admin/users/1')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should prevent self-deletion', async () => {
      const response = await request(app)
        .delete('/api/v1/admin/users/current-admin-id')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('cannot delete yourself');
    });
  });

  describe('GET /api/v1/admin/pipelines', () => {
    it('should return all pipelines', async () => {
      const mockPipelines = [
        {
          id: '1',
          name: 'Sales Pipeline',
          stages: ['lead', 'qualified', 'proposal', 'negotiation', 'closed'],
          is_default: true,
        },
        {
          id: '2',
          name: 'Custom Pipeline',
          stages: ['initial', 'demo', 'trial', 'decision'],
          is_default: false,
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('pipelines').select().mockResolvedValueOnce({
        data: mockPipelines,
        error: null,
      });

      const response = await request(app)
        .get('/api/v1/admin/pipelines')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPipelines);
    });
  });

  describe('POST /api/v1/admin/pipelines', () => {
    it('should create new pipeline', async () => {
      const newPipeline = {
        name: 'New Pipeline',
        stages: ['stage1', 'stage2', 'stage3'],
        is_default: false,
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('pipelines').insert().mockResolvedValueOnce({
        data: { id: '3', ...newPipeline },
        error: null,
      });

      const response = await request(app)
        .post('/api/v1/admin/pipelines')
        .set('Authorization', 'Bearer admin-token')
        .send(newPipeline);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newPipeline.name);
      expect(response.body.stages).toEqual(newPipeline.stages);
    });

    it('should validate pipeline data', async () => {
      const response = await request(app)
        .post('/api/v1/admin/pipelines')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/admin/settings', () => {
    it('should return system settings', async () => {
      const mockSettings = {
        company_name: 'Test Company',
        email_notifications: true,
        auto_assign_leads: false,
        default_pipeline_id: '1',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('settings').select().single.mockResolvedValueOnce({
        data: mockSettings,
        error: null,
      });

      const response = await request(app)
        .get('/api/v1/admin/settings')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSettings);
    });
  });

  describe('PUT /api/v1/admin/settings', () => {
    it('should update system settings', async () => {
      const updateSettings = {
        company_name: 'Updated Company',
        email_notifications: false,
        auto_assign_leads: true,
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('settings').update().mockResolvedValueOnce({
        data: updateSettings,
        error: null,
      });

      const response = await request(app)
        .put('/api/v1/admin/settings')
        .set('Authorization', 'Bearer admin-token')
        .send(updateSettings);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updateSettings);
    });
  });

  describe('GET /api/v1/admin/analytics', () => {
    it('should return system analytics', async () => {
      const mockAnalytics = {
        total_users: 25,
        active_users: 20,
        total_contacts: 150,
        total_deals: 75,
        total_revenue: 500000,
        conversion_rate: 0.15,
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      
      // Mock multiple queries for analytics
      mockSupabase.from('users').select().mockResolvedValueOnce({
        data: new Array(25),
        error: null,
        count: 25,
      });

      mockSupabase.from('contacts').select().mockResolvedValueOnce({
        data: new Array(150),
        error: null,
        count: 150,
      });

      mockSupabase.from('deals').select().mockResolvedValueOnce({
        data: new Array(75),
        error: null,
        count: 75,
      });

      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total_users');
      expect(response.body).toHaveProperty('total_contacts');
      expect(response.body).toHaveProperty('total_deals');
    });
  });

  describe('Authorization', () => {
    it('should require admin role for all endpoints', async () => {
      const endpoints = [
        { method: 'get', path: '/api/v1/admin/users' },
        { method: 'post', path: '/api/v1/admin/users' },
        { method: 'get', path: '/api/v1/admin/pipelines' },
        { method: 'get', path: '/api/v1/admin/settings' },
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          [endpoint.method](endpoint.path)
          .set('Authorization', 'Bearer user-token'); // Non-admin token

        expect(response.status).toBe(403);
        expect(response.body.error).toContain('admin');
      }
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 