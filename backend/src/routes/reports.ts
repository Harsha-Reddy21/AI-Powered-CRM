import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Deal Analytics APIs
router.get('/deals/analytics', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date, user_id, pipeline_id } = req.query;
    
    let query = supabase
      .from('deals')
      .select(`
        id,
        title,
        value,
        stage_id,
        owner_id,
        created_at,
        closed_at,
        stages (
          name,
          is_closed_won,
          is_closed_lost
        ),
        pipelines (
          name
        ),
        profiles!deals_owner_id_fkey (
          full_name
        )
      `);

    // Apply filters
    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }
    if (user_id) {
      query = query.eq('owner_id', user_id);
    }
    if (pipeline_id) {
      query = query.eq('pipeline_id', pipeline_id);
    }

    const { data: deals, error } = await query;

    if (error) throw error;

    // Calculate analytics
    const totalDeals = deals?.length || 0;
    const totalValue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
    const wonDeals = deals?.filter(deal => deal.stages?.is_closed_won) || [];
    const lostDeals = deals?.filter(deal => deal.stages?.is_closed_lost) || [];
    const openDeals = deals?.filter(deal => !deal.stages?.is_closed_won && !deal.stages?.is_closed_lost) || [];
    
    const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const lostValue = lostDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const openValue = openDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    const winRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;

    // Pipeline breakdown
    const pipelineStats = deals?.reduce((acc, deal) => {
      const pipelineName = deal.pipelines?.name || 'Unknown';
      if (!acc[pipelineName]) {
        acc[pipelineName] = { count: 0, value: 0 };
      }
      acc[pipelineName].count++;
      acc[pipelineName].value += deal.value || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>) || {};

    res.json({
      success: true,
      data: {
        summary: {
          totalDeals,
          totalValue,
          wonDeals: wonDeals.length,
          lostDeals: lostDeals.length,
          openDeals: openDeals.length,
          wonValue,
          lostValue,
          openValue,
          winRate: Math.round(winRate * 100) / 100,
          averageDealSize: Math.round(averageDealSize * 100) / 100
        },
        pipelineStats,
        deals: deals || []
      }
    });
  } catch (error) {
    console.error('Error fetching deal analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch deal analytics' });
  }
});

// Performance Metrics APIs
router.get('/performance/users', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = supabase
      .from('deals')
      .select(`
        owner_id,
        value,
        created_at,
        closed_at,
        stages (
          is_closed_won,
          is_closed_lost
        ),
        profiles!deals_owner_id_fkey (
          full_name,
          email
        )
      `);

    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    const { data: deals, error } = await query;

    if (error) throw error;

    // Calculate performance by user
    const userPerformance = deals?.reduce((acc, deal) => {
      const userId = deal.owner_id;
      const userName = deal.profiles?.full_name || deal.profiles?.email || 'Unknown';
      
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          userName,
          totalDeals: 0,
          totalValue: 0,
          wonDeals: 0,
          lostDeals: 0,
          wonValue: 0,
          openDeals: 0,
          openValue: 0
        };
      }

      acc[userId].totalDeals++;
      acc[userId].totalValue += deal.value || 0;

      if (deal.stages?.is_closed_won) {
        acc[userId].wonDeals++;
        acc[userId].wonValue += deal.value || 0;
      } else if (deal.stages?.is_closed_lost) {
        acc[userId].lostDeals++;
      } else {
        acc[userId].openDeals++;
        acc[userId].openValue += deal.value || 0;
      }

      return acc;
    }, {} as Record<string, any>) || {};

    // Calculate win rates and averages
    const performanceData = Object.values(userPerformance).map((user: any) => ({
      ...user,
      winRate: user.totalDeals > 0 ? Math.round((user.wonDeals / user.totalDeals) * 10000) / 100 : 0,
      averageDealSize: user.totalDeals > 0 ? Math.round((user.totalValue / user.totalDeals) * 100) / 100 : 0
    }));

    res.json({ success: true, data: performanceData });
  } catch (error) {
    console.error('Error fetching user performance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user performance' });
  }
});

// Activity Analytics
router.get('/activity/analytics', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    let query = supabase
      .from('activities')
      .select(`
        id,
        type,
        created_at,
        user_id,
        deal_id,
        contact_id,
        duration,
        profiles!activities_user_id_fkey (
          full_name
        )
      `);

    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: activities, error } = await query;

    if (error) throw error;

    // Calculate activity analytics
    const totalActivities = activities?.length || 0;
    const activityTypes = activities?.reduce((acc, activity) => {
      const type = activity.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const userActivity = activities?.reduce((acc, activity) => {
      const userId = activity.user_id;
      const userName = activity.profiles?.full_name || 'Unknown';
      
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          userName,
          totalActivities: 0,
          types: {}
        };
      }

      acc[userId].totalActivities++;
      const type = activity.type || 'unknown';
      acc[userId].types[type] = (acc[userId].types[type] || 0) + 1;

      return acc;
    }, {} as Record<string, any>) || {};

    res.json({
      success: true,
      data: {
        summary: {
          totalActivities,
          activityTypes
        },
        userActivity: Object.values(userActivity),
        activities: activities || []
      }
    });
  } catch (error) {
    console.error('Error fetching activity analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch activity analytics' });
  }
});

// Win-Loss Analysis
router.get('/winloss/analysis', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    let query = supabase
      .from('deals')
      .select(`
        id,
        title,
        value,
        created_at,
        closed_at,
        win_reason,
        loss_reason,
        close_notes,
        stage_id,
        stages (
          name,
          is_closed_won,
          is_closed_lost
        ),
        profiles!deals_owner_id_fkey (
          full_name
        ),
        contacts (
          company,
          industry
        )
      `)
      .or('stages.is_closed_won.eq.true,stages.is_closed_lost.eq.true');

    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }
    if (user_id) {
      query = query.eq('owner_id', user_id);
    }

    const { data: closedDeals, error } = await query;

    if (error) throw error;

    const wonDeals = closedDeals?.filter(deal => deal.stages?.is_closed_won) || [];
    const lostDeals = closedDeals?.filter(deal => deal.stages?.is_closed_lost) || [];

    // Analyze win reasons
    const winReasons = wonDeals.reduce((acc, deal) => {
      const reason = deal.win_reason || 'Not specified';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze loss reasons
    const lossReasons = lostDeals.reduce((acc, deal) => {
      const reason = deal.loss_reason || 'Not specified';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Industry analysis
    const industryPerformance = closedDeals?.reduce((acc, deal) => {
      const industry = deal.contacts?.industry || 'Unknown';
      if (!acc[industry]) {
        acc[industry] = { won: 0, lost: 0, totalValue: 0, wonValue: 0 };
      }
      
      acc[industry].totalValue += deal.value || 0;
      if (deal.stages?.is_closed_won) {
        acc[industry].won++;
        acc[industry].wonValue += deal.value || 0;
      } else {
        acc[industry].lost++;
      }
      
      return acc;
    }, {} as Record<string, any>) || {};

    // Calculate win rates by industry
    const industryStats = Object.entries(industryPerformance).map(([industry, stats]: [string, any]) => ({
      industry,
      ...stats,
      winRate: stats.won + stats.lost > 0 ? Math.round((stats.won / (stats.won + stats.lost)) * 10000) / 100 : 0
    }));

    res.json({
      success: true,
      data: {
        summary: {
          totalClosed: closedDeals?.length || 0,
          won: wonDeals.length,
          lost: lostDeals.length,
          winRate: closedDeals?.length ? Math.round((wonDeals.length / closedDeals.length) * 10000) / 100 : 0,
          wonValue: wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
          lostValue: lostDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
        },
        winReasons,
        lossReasons,
        industryStats,
        recentWins: wonDeals.slice(0, 10),
        recentLosses: lostDeals.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error fetching win-loss analysis:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch win-loss analysis' });
  }
});

// Export functionality
router.get('/export/deals', authenticateToken, async (req, res) => {
  try {
    const { format, start_date, end_date, user_id } = req.query;

    let query = supabase
      .from('deals')
      .select(`
        id,
        title,
        value,
        created_at,
        closed_at,
        win_reason,
        loss_reason,
        stages (
          name,
          is_closed_won,
          is_closed_lost
        ),
        profiles!deals_owner_id_fkey (
          full_name,
          email
        ),
        contacts (
          first_name,
          last_name,
          company,
          email
        )
      `);

    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }
    if (user_id) {
      query = query.eq('owner_id', user_id);
    }

    const { data: deals, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = [
        'ID', 'Title', 'Value', 'Stage', 'Owner', 'Contact', 'Company',
        'Created Date', 'Closed Date', 'Status', 'Win Reason', 'Loss Reason'
      ];

      const csvRows = deals?.map(deal => [
        deal.id,
        deal.title || '',
        deal.value || 0,
        deal.stages?.name || '',
        deal.profiles?.full_name || '',
        `${deal.contacts?.first_name || ''} ${deal.contacts?.last_name || ''}`.trim(),
        deal.contacts?.company || '',
        deal.created_at,
        deal.closed_at || '',
        deal.stages?.is_closed_won ? 'Won' : deal.stages?.is_closed_lost ? 'Lost' : 'Open',
        deal.win_reason || '',
        deal.loss_reason || ''
      ]) || [];

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="deals_export.csv"');
      res.send(csvContent);
    } else {
      // Return JSON
      res.json({ success: true, data: deals });
    }
  } catch (error) {
    console.error('Error exporting deals:', error);
    res.status(500).json({ success: false, error: 'Failed to export deals' });
  }
});

export default router; 