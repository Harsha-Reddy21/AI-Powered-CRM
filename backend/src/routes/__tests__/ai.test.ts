import request from 'supertest';
import express from 'express';
import aiRouter from '../ai';
import { supabase } from '../../config/supabase';

const app = express();
app.use(express.json());
app.use('/api/v1/ai', aiRouter);

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

describe('AI API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/ai/deal-coach', () => {
    it('should provide deal coaching advice', async () => {
      const mockDeal = {
        id: '1',
        title: 'Test Deal',
        value: 10000,
        stage: 'proposal',
        contact_id: '1',
      };

      const mockContact = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('deals').select().eq().single.mockResolvedValueOnce({
        data: mockDeal,
        error: null,
      });

      mockSupabase.from('contacts').select().eq().single.mockResolvedValueOnce({
        data: mockContact,
        error: null,
      });

      const mockOpenAI = require('openai').OpenAI;
      const mockCreate = mockOpenAI().chat.completions.create;
      mockCreate.mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              advice: 'Focus on value proposition',
              next_steps: ['Schedule follow-up', 'Send proposal'],
              risk_assessment: 'Medium',
              confidence_score: 75,
            }),
          },
        }],
      });

      const response = await request(app)
        .post('/api/v1/ai/deal-coach')
        .set('Authorization', 'Bearer fake-token')
        .send({ deal_id: '1' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('advice');
      expect(response.body).toHaveProperty('next_steps');
      expect(response.body).toHaveProperty('risk_assessment');
      expect(response.body).toHaveProperty('confidence_score');
    });

    it('should handle missing deal', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('deals').select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Deal not found' },
      });

      const response = await request(app)
        .post('/api/v1/ai/deal-coach')
        .set('Authorization', 'Bearer fake-token')
        .send({ deal_id: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/ai/deal-coach')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/ai/persona-builder', () => {
    it('should build contact persona', async () => {
      const mockContact = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        job_title: 'CEO',
      };

      const mockActivities = [
        {
          id: '1',
          type: 'email',
          description: 'Sent proposal',
          contact_id: '1',
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('contacts').select().eq().single.mockResolvedValueOnce({
        data: mockContact,
        error: null,
      });

      mockSupabase.from('activities').select().eq().mockResolvedValueOnce({
        data: mockActivities,
        error: null,
      });

      const mockOpenAI = require('openai').OpenAI;
      const mockCreate = mockOpenAI().chat.completions.create;
      mockCreate.mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              persona: {
                name: 'The Executive Decision Maker',
                traits: ['results-oriented', 'time-conscious', 'strategic'],
                communication_style: 'direct',
                pain_points: ['efficiency', 'ROI'],
                motivations: ['growth', 'competitive advantage'],
              },
            }),
          },
        }],
      });

      const response = await request(app)
        .post('/api/v1/ai/persona-builder')
        .set('Authorization', 'Bearer fake-token')
        .send({ contact_id: '1' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('persona');
      expect(response.body.persona).toHaveProperty('name');
      expect(response.body.persona).toHaveProperty('traits');
      expect(response.body.persona).toHaveProperty('communication_style');
    });
  });

  describe('POST /api/v1/ai/objection-handler', () => {
    it('should handle objections', async () => {
      const objection = "It's too expensive";
      
      const mockOpenAI = require('openai').OpenAI;
      const mockCreate = mockOpenAI().chat.completions.create;
      mockCreate.mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              response: 'I understand cost is a concern. Let me show you the ROI...',
              strategy: 'value-based',
              follow_up_questions: ['What budget range were you considering?'],
            }),
          },
        }],
      });

      const response = await request(app)
        .post('/api/v1/ai/objection-handler')
        .set('Authorization', 'Bearer fake-token')
        .send({ objection });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('strategy');
      expect(response.body).toHaveProperty('follow_up_questions');
    });

    it('should validate objection input', async () => {
      const response = await request(app)
        .post('/api/v1/ai/objection-handler')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/ai/win-loss-analysis', () => {
    it('should analyze won deals', async () => {
      const mockDeals = [
        {
          id: '1',
          title: 'Won Deal',
          value: 10000,
          stage: 'won',
          close_date: '2024-01-15',
        },
        {
          id: '2',
          title: 'Lost Deal',
          value: 5000,
          stage: 'lost',
          close_date: '2024-01-10',
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from('deals').select().in().mockResolvedValueOnce({
        data: mockDeals,
        error: null,
      });

      const mockOpenAI = require('openai').OpenAI;
      const mockCreate = mockOpenAI().chat.completions.create;
      mockCreate.mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              analysis: {
                win_rate: 50,
                avg_deal_size: 7500,
                key_success_factors: ['strong value proposition', 'good timing'],
                improvement_areas: ['pricing strategy', 'competitor analysis'],
                recommendations: ['Focus on larger deals', 'Improve discovery process'],
              },
            }),
          },
        }],
      });

      const response = await request(app)
        .post('/api/v1/ai/win-loss-analysis')
        .set('Authorization', 'Bearer fake-token')
        .send({ deal_ids: ['1', '2'] });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('analysis');
      expect(response.body.analysis).toHaveProperty('win_rate');
      expect(response.body.analysis).toHaveProperty('key_success_factors');
      expect(response.body.analysis).toHaveProperty('recommendations');
    });

    it('should handle empty deal list', async () => {
      const response = await request(app)
        .post('/api/v1/ai/win-loss-analysis')
        .set('Authorization', 'Bearer fake-token')
        .send({ deal_ids: [] });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error handling', () => {
    it('should handle OpenAI API errors', async () => {
      const mockOpenAI = require('openai').OpenAI;
      const mockCreate = mockOpenAI().chat.completions.create;
      mockCreate.mockRejectedValueOnce(new Error('OpenAI API error'));

      const response = await request(app)
        .post('/api/v1/ai/objection-handler')
        .set('Authorization', 'Bearer fake-token')
        .send({ objection: 'Test objection' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed AI responses', async () => {
      const mockOpenAI = require('openai').OpenAI;
      const mockCreate = mockOpenAI().chat.completions.create;
      mockCreate.mockResolvedValueOnce({
        choices: [{
          message: {
            content: 'Invalid JSON response',
          },
        }],
      });

      const response = await request(app)
        .post('/api/v1/ai/objection-handler')
        .set('Authorization', 'Bearer fake-token')
        .send({ objection: 'Test objection' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 