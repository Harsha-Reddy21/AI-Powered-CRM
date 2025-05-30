import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// User Management APIs
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        last_sign_in_at,
        profiles (
          avatar_url,
          phone,
          department
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

router.post('/users/invite', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, role, full_name } = req.body;

    // Create user invitation
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name,
        role: role || 'rep'
      }
    });

    if (authError) throw authError;

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email,
        full_name,
        role: role || 'rep'
      })
      .select()
      .single();

    if (profileError) throw profileError;

    res.json({ success: true, data: { user: authData.user, profile } });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ success: false, error: 'Failed to invite user' });
  }
});

router.patch('/users/:userId/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, error: 'Failed to update user role' });
  }
});

router.patch('/users/:userId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, error: 'Failed to update user status' });
  }
});

// Pipeline Configuration APIs
router.get('/pipelines', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: pipelines, error } = await supabase
      .from('pipelines')
      .select(`
        *,
        stages (
          id,
          name,
          order_index,
          color,
          is_closed_won,
          is_closed_lost
        )
      `)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: pipelines });
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pipelines' });
  }
});

router.post('/pipelines', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, is_default } = req.body;

    const { data: pipeline, error } = await supabase
      .from('pipelines')
      .insert({ name, description, is_default })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: pipeline });
  } catch (error) {
    console.error('Error creating pipeline:', error);
    res.status(500).json({ success: false, error: 'Failed to create pipeline' });
  }
});

router.patch('/pipelines/:pipelineId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { pipelineId } = req.params;
    const { name, description, is_default } = req.body;

    const { data, error } = await supabase
      .from('pipelines')
      .update({ name, description, is_default })
      .eq('id', pipelineId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating pipeline:', error);
    res.status(500).json({ success: false, error: 'Failed to update pipeline' });
  }
});

router.post('/pipelines/:pipelineId/stages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { pipelineId } = req.params;
    const { name, color, order_index, is_closed_won, is_closed_lost } = req.body;

    const { data: stage, error } = await supabase
      .from('stages')
      .insert({
        pipeline_id: pipelineId,
        name,
        color,
        order_index,
        is_closed_won: is_closed_won || false,
        is_closed_lost: is_closed_lost || false
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: stage });
  } catch (error) {
    console.error('Error creating stage:', error);
    res.status(500).json({ success: false, error: 'Failed to create stage' });
  }
});

router.patch('/stages/:stageId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { stageId } = req.params;
    const { name, color, order_index, is_closed_won, is_closed_lost } = req.body;

    const { data, error } = await supabase
      .from('stages')
      .update({ name, color, order_index, is_closed_won, is_closed_lost })
      .eq('id', stageId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({ success: false, error: 'Failed to update stage' });
  }
});

router.delete('/stages/:stageId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { stageId } = req.params;

    // Check if stage has deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('id')
      .eq('stage_id', stageId)
      .limit(1);

    if (dealsError) throw dealsError;

    if (deals && deals.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete stage with existing deals' 
      });
    }

    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', stageId);

    if (error) throw error;

    res.json({ success: true, message: 'Stage deleted successfully' });
  } catch (error) {
    console.error('Error deleting stage:', error);
    res.status(500).json({ success: false, error: 'Failed to delete stage' });
  }
});

// Integration Settings APIs
router.get('/integrations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: integrations, error } = await supabase
      .from('integration_settings')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({ success: true, data: integrations || [] });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch integrations' });
  }
});

router.post('/integrations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, type, config, is_enabled } = req.body;

    const { data: integration, error } = await supabase
      .from('integration_settings')
      .insert({
        name,
        type,
        config,
        is_enabled: is_enabled || false
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: integration });
  } catch (error) {
    console.error('Error creating integration:', error);
    res.status(500).json({ success: false, error: 'Failed to create integration' });
  }
});

router.patch('/integrations/:integrationId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const { name, config, is_enabled } = req.body;

    const { data, error } = await supabase
      .from('integration_settings')
      .update({ name, config, is_enabled })
      .eq('id', integrationId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating integration:', error);
    res.status(500).json({ success: false, error: 'Failed to update integration' });
  }
});

router.delete('/integrations/:integrationId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { integrationId } = req.params;

    const { error } = await supabase
      .from('integration_settings')
      .delete()
      .eq('id', integrationId);

    if (error) throw error;

    res.json({ success: true, message: 'Integration deleted successfully' });
  } catch (error) {
    console.error('Error deleting integration:', error);
    res.status(500).json({ success: false, error: 'Failed to delete integration' });
  }
});

export default router; 