import { http, HttpResponse } from 'msw';

// Mock API handlers
export const handlers = [
  // Mock authentication endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
    });
  }),

  // Mock contacts endpoints
  http.get('/api/contacts', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Test Company',
        created_at: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  http.post('/api/contacts', () => {
    return HttpResponse.json({
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      company: 'Test Corp',
      created_at: '2024-01-01T00:00:00Z',
    });
  }),

  // Mock deals endpoints
  http.get('/api/deals', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Deal',
        value: 10000,
        stage: 'proposal',
        contact_id: '1',
        created_at: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  // Mock AI endpoints
  http.post('/api/ai/deal-coach', () => {
    return HttpResponse.json({
      advice: 'Test AI advice for deal coaching',
      suggestions: ['Follow up with client', 'Prepare proposal'],
    });
  }),

  http.post('/api/ai/persona-builder', () => {
    return HttpResponse.json({
      persona: {
        name: 'Test Persona',
        traits: ['decision-maker', 'budget-conscious'],
        communication_style: 'formal',
      },
    });
  }),

  // Mock admin endpoints
  http.get('/api/admin/users', () => {
    return HttpResponse.json([
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        created_at: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  // Mock reports endpoints
  http.get('/api/reports/deals', () => {
    return HttpResponse.json({
      total_deals: 50,
      total_value: 500000,
      won_deals: 20,
      lost_deals: 10,
      pending_deals: 20,
    });
  }),
]; 