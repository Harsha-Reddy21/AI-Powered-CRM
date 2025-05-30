import { Router, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { authenticateUser } from '../middleware/auth';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get contacts with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or email
 *     responses:
 *       200:
 *         description: List of contacts
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('contacts')
      .select('*, company:companies(name)', { count: 'exact' });

    // Apply search filter if provided
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: contacts, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({
      contacts,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    next(error);
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateUser, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([req.body])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({ contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    next(error);
  }
});

export default router; 