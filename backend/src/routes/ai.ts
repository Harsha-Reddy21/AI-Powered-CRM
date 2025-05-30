import { Router, Request, Response, NextFunction } from 'express';
import { aiService } from '../ai/ai.service';

const router = Router();

/**
 * @swagger
 * /api/v1/ai/deal-coach/{dealId}:
 *   post:
 *     summary: Get AI coaching recommendations for a deal
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: dealId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealData:
 *                 type: object
 *     responses:
 *       200:
 *         description: AI coaching recommendations
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/deal-coach/:dealId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dealId } = req.params;
    const { dealData } = req.body;

    if (!dealData) {
      res.status(400).json({ error: 'Deal data is required' });
      return;
    }

    // Add dealId to the data for context
    const enrichedDealData = { ...dealData, id: dealId };

    const result = await aiService.getDealCoaching(enrichedDealData);

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json({
      dealId,
      coaching: result.data,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Deal coach error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/ai/persona-builder/{contactId}:
 *   post:
 *     summary: Build AI-generated persona for a contact
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactData:
 *                 type: object
 *     responses:
 *       200:
 *         description: AI-generated persona
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/persona-builder/:contactId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contactId } = req.params;
    const { contactData } = req.body;

    if (!contactData) {
      res.status(400).json({ error: 'Contact data is required' });
      return;
    }

    const enrichedContactData = { ...contactData, id: contactId };

    const result = await aiService.buildPersona(enrichedContactData);

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json({
      contactId,
      persona: result.data,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Persona builder error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/ai/objection-handler:
 *   post:
 *     summary: Get AI suggestions for handling customer objections
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objectionText:
 *                 type: string
 *               dealTitle:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerRole:
 *                 type: string
 *               stage:
 *                 type: string
 *               value:
 *                 type: string
 *               background:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI objection handling suggestions
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/objection-handler', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { objectionText } = req.body;

    if (!objectionText || objectionText.trim().length === 0) {
      res.status(400).json({ error: 'Objection text is required' });
      return;
    }

    const result = await aiService.handleObjection(req.body);

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json({
      objection: objectionText,
      suggestions: result.data,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Objection handler error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/ai/win-loss-analysis/{dealId}:
 *   post:
 *     summary: Generate AI-powered win-loss analysis for a completed deal
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: dealId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealData:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [won, lost]
 *     responses:
 *       200:
 *         description: AI win-loss analysis
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/win-loss-analysis/:dealId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dealId } = req.params;
    const { dealData, status } = req.body;

    if (!dealData || !status) {
      res.status(400).json({ error: 'Deal data and status are required' });
      return;
    }

    if (!['won', 'lost'].includes(status)) {
      res.status(400).json({ error: 'Status must be either "won" or "lost"' });
      return;
    }

    const enrichedDealData = { ...dealData, id: dealId, status };

    const result = await aiService.analyzeWinLoss(enrichedDealData);

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json({
      dealId,
      status,
      analysis: result.data,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Win-loss analysis error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/ai/health:
 *   get:
 *     summary: Check AI service health
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI service is healthy
 *       500:
 *         description: AI service error
 */
router.get('/health', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Simple health check by making a minimal AI call
    const testData = {
      title: 'Test Deal',
      value: '$1000',
      stage: 'Prospecting',
      probability: 50,
      closeDate: '2024-12-31',
      description: 'Test description',
      contact: 'Test Contact',
      company: 'Test Company'
    };

    const result = await aiService.getDealCoaching(testData);
    
    res.json({
      status: result.success ? 'healthy' : 'degraded',
      ai_service: result.success,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      ai_service: false,
      error: 'AI service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 