import { supabase } from '../config/supabase';

export interface SampleContact {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  status: 'lead' | 'prospect' | 'customer';
  source?: string;
  notes?: string;
}

export interface SampleDeal {
  title: string;
  description?: string;
  value: number;
  stage: string;
  probability: number;
  contact_id?: string;
  pipeline_id?: string;
  close_date?: string;
  notes?: string;
}

export interface SampleActivity {
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description?: string;
  contact_id?: string;
  deal_id?: string;
  scheduled_at?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  outcome?: 'positive' | 'neutral' | 'negative';
  notes?: string;
}

export const sampleContacts: SampleContact[] = [
  {
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@acmecorp.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    title: 'CTO',
    status: 'lead',
    source: 'website',
    notes: 'Interested in enterprise solutions. High budget potential.',
  },
  {
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@techstart.com',
    phone: '+1 (555) 987-6543',
    company: 'TechStart Inc',
    title: 'VP of Operations',
    status: 'prospect',
    source: 'referral',
    notes: 'Looking for cloud migration services. Timeline: Q2 2024.',
  },
  {
    first_name: 'Michael',
    last_name: 'Davis',
    email: 'mdavis@innovatesolutions.com',
    phone: '+1 (555) 456-7890',
    company: 'Innovate Solutions',
    title: 'CEO',
    status: 'customer',
    source: 'trade_show',
    notes: 'Existing customer. Potential for upsell opportunities.',
  },
  {
    first_name: 'Emily',
    last_name: 'Chen',
    email: 'emily.chen@dataanalytics.com',
    phone: '+1 (555) 234-5678',
    company: 'DataAnalytics Plus',
    title: 'Head of Technology',
    status: 'prospect',
    source: 'linkedin',
    notes: 'Needs custom analytics platform. Budget approved.',
  },
  {
    first_name: 'Robert',
    last_name: 'Wilson',
    email: 'rwilson@growthco.com',
    phone: '+1 (555) 345-6789',
    company: 'Growth Co',
    title: 'Marketing Director',
    status: 'lead',
    source: 'cold_email',
    notes: 'Interested in marketing automation tools.',
  },
  {
    first_name: 'Lisa',
    last_name: 'Brown',
    email: 'lisa.brown@retailplus.com',
    phone: '+1 (555) 567-8901',
    company: 'Retail Plus',
    title: 'Operations Manager',
    status: 'prospect',
    source: 'webinar',
    notes: 'Looking for inventory management solutions.',
  },
  {
    first_name: 'David',
    last_name: 'Martinez',
    email: 'david@consulting360.com',
    phone: '+1 (555) 678-9012',
    company: 'Consulting 360',
    title: 'Partner',
    status: 'customer',
    source: 'referral',
    notes: 'Long-term client. Always interested in new offerings.',
  },
  {
    first_name: 'Jennifer',
    last_name: 'Taylor',
    email: 'jennifer.taylor@financetech.com',
    phone: '+1 (555) 789-0123',
    company: 'FinanceTech Solutions',
    title: 'CFO',
    status: 'lead',
    source: 'website',
    notes: 'Evaluating financial software options. High-value prospect.',
  }
];

export const sampleDeals: Omit<SampleDeal, 'contact_id' | 'pipeline_id'>[] = [
  {
    title: 'Enterprise Software License',
    description: 'Multi-year enterprise software licensing deal with implementation services',
    value: 250000,
    stage: 'Prospecting',
    probability: 25,
    close_date: '2024-04-15',
    notes: 'Initial discussions ongoing. Need to schedule technical demo.',
  },
  {
    title: 'Cloud Infrastructure Migration',
    description: 'Complete migration of on-premise infrastructure to cloud',
    value: 150000,
    stage: 'Qualification',
    probability: 40,
    close_date: '2024-03-30',
    notes: 'Technical requirements gathering in progress.',
  },
  {
    title: 'Data Analytics Platform',
    description: 'Custom data analytics and reporting platform development',
    value: 350000,
    stage: 'Proposal',
    probability: 70,
    close_date: '2024-02-28',
    notes: 'Proposal submitted. Awaiting final approval from board.',
  },
  {
    title: 'Marketing Automation Setup',
    description: 'Implementation of marketing automation platform and training',
    value: 75000,
    stage: 'Negotiation',
    probability: 85,
    close_date: '2024-02-15',
    notes: 'Contract terms under negotiation. Close to final agreement.',
  },
  {
    title: 'Inventory Management System',
    description: 'Custom inventory management system for retail operations',
    value: 125000,
    stage: 'Qualification',
    probability: 35,
    close_date: '2024-05-01',
    notes: 'Competing with two other vendors. Price is a key factor.',
  },
  {
    title: 'Financial Reporting Dashboard',
    description: 'Executive financial reporting and dashboard solution',
    value: 95000,
    stage: 'Prospecting',
    probability: 20,
    close_date: '2024-06-30',
    notes: 'Early stage opportunity. Need to understand full requirements.',
  }
];

export const sampleActivities: Omit<SampleActivity, 'contact_id' | 'deal_id'>[] = [
  {
    type: 'call',
    title: 'Discovery Call with CTO',
    description: 'Initial discovery call to understand technical requirements and current pain points',
    scheduled_at: '2024-01-15T10:00:00Z',
    status: 'completed',
    outcome: 'positive',
    notes: 'Great conversation. They are very interested in our enterprise solution. Next step: technical demo.',
  },
  {
    type: 'email',
    title: 'Follow-up Proposal',
    description: 'Send detailed proposal based on discovery call findings',
    scheduled_at: '2024-01-16T14:00:00Z',
    status: 'completed',
    outcome: 'neutral',
    notes: 'Proposal sent. Waiting for initial feedback.',
  },
  {
    type: 'meeting',
    title: 'Technical Demo Session',
    description: 'Live demonstration of platform capabilities and technical features',
    scheduled_at: '2024-01-20T15:00:00Z',
    status: 'scheduled',
    notes: 'Demo scheduled with technical team. Prepare use case scenarios.',
  },
  {
    type: 'call',
    title: 'Budget Discussion',
    description: 'Discussion about budget allocation and timeline for implementation',
    scheduled_at: '2024-01-18T11:00:00Z',
    status: 'scheduled',
    notes: 'CFO will join the call to discuss financial aspects.',
  },
  {
    type: 'task',
    title: 'Prepare Contract Documentation',
    description: 'Draft initial contract based on negotiated terms',
    scheduled_at: '2024-01-22T09:00:00Z',
    status: 'pending',
    notes: 'Legal team needs to review contract terms before sending.',
  },
  {
    type: 'email',
    title: 'Check-in on Proposal Status',
    description: 'Follow up on proposal submission and gather feedback',
    scheduled_at: '2024-01-19T10:00:00Z',
    status: 'pending',
    notes: 'Send friendly follow-up to maintain momentum.',
  },
  {
    type: 'meeting',
    title: 'Stakeholder Presentation',
    description: 'Present solution to key stakeholders and decision makers',
    scheduled_at: '2024-01-25T14:00:00Z',
    status: 'scheduled',
    notes: 'Board members will attend. Prepare executive summary and ROI calculations.',
  },
  {
    type: 'call',
    title: 'Implementation Planning',
    description: 'Discuss implementation timeline and resource requirements',
    scheduled_at: '2024-01-12T16:00:00Z',
    status: 'completed',
    outcome: 'positive',
    notes: 'Agreed on 6-month implementation timeline. Resource allocation discussed.',
  }
];

export async function insertSampleData() {
  try {
    console.log('Inserting sample data...');

    // Insert contacts
    console.log('Inserting contacts...');
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(sampleContacts)
      .select();

    if (contactsError) {
      throw new Error(`Error inserting contacts: ${contactsError.message}`);
    }

    console.log(`Inserted ${contacts?.length || 0} contacts`);

    // Get pipeline for deals
    const { data: pipelines, error: pipelinesError } = await supabase
      .from('pipelines')
      .select('id')
      .limit(1);

    if (pipelinesError || !pipelines || pipelines.length === 0) {
      throw new Error('No pipelines found. Please create a pipeline first.');
    }

    const pipelineId = pipelines[0].id;

    // Insert deals with contact associations
    console.log('Inserting deals...');
    const dealsWithContacts = sampleDeals.map((deal, index) => ({
      ...deal,
      contact_id: contacts?.[index % contacts.length]?.id,
      pipeline_id: pipelineId,
    }));

    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .insert(dealsWithContacts)
      .select();

    if (dealsError) {
      throw new Error(`Error inserting deals: ${dealsError.message}`);
    }

    console.log(`Inserted ${deals?.length || 0} deals`);

    // Insert activities with contact and deal associations
    console.log('Inserting activities...');
    const activitiesWithRelations = sampleActivities.map((activity, index) => ({
      ...activity,
      contact_id: contacts?.[index % contacts.length]?.id,
      deal_id: deals?.[index % deals.length]?.id,
    }));

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .insert(activitiesWithRelations)
      .select();

    if (activitiesError) {
      throw new Error(`Error inserting activities: ${activitiesError.message}`);
    }

    console.log(`Inserted ${activities?.length || 0} activities`);

    console.log('Sample data insertion completed successfully!');
    return {
      contacts: contacts?.length || 0,
      deals: deals?.length || 0,
      activities: activities?.length || 0,
    };
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

export async function clearSampleData() {
  try {
    console.log('Clearing sample data...');

    // Delete in reverse order to respect foreign key constraints
    await supabase.from('activities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('deals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('contacts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Sample data cleared successfully!');
  } catch (error) {
    console.error('Error clearing sample data:', error);
    throw error;
  }
}

// CLI utility functions
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'insert') {
    insertSampleData()
      .then((result) => {
        console.log('Sample data inserted:', result);
        process.exit(0);
      })
      .catch((error) => {
        console.error('Failed to insert sample data:', error);
        process.exit(1);
      });
  } else if (command === 'clear') {
    clearSampleData()
      .then(() => {
        console.log('Sample data cleared');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Failed to clear sample data:', error);
        process.exit(1);
      });
  } else {
    console.log('Usage: ts-node sample-data.ts [insert|clear]');
    process.exit(1);
  }
} 