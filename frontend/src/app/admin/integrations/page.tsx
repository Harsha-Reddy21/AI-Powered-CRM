'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  Mail, 
  Linkedin, 
  Calendar,
  Database,
  Webhook,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'email' | 'calendar' | 'social' | 'crm' | 'webhook' | 'database';
  description: string;
  is_enabled: boolean;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  config: Record<string, any>;
  last_sync?: string;
  created_at: string;
}

interface IntegrationTemplate {
  type: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'password' | 'url' | 'select';
    required: boolean;
    options?: string[];
  }>;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  const [configForm, setConfigForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const integrationTemplates: IntegrationTemplate[] = [
    {
      type: 'email',
      name: 'Email Sync',
      description: 'Sync emails with Gmail, Outlook, or other email providers',
      icon: Mail,
      color: 'bg-blue-500',
      fields: [
        { key: 'provider', label: 'Email Provider', type: 'select', required: true, options: ['Gmail', 'Outlook', 'Exchange'] },
        { key: 'email', label: 'Email Address', type: 'text', required: true },
        { key: 'api_key', label: 'API Key', type: 'password', required: true }
      ]
    },
    {
      type: 'social',
      name: 'LinkedIn Integration',
      description: 'Connect with LinkedIn for lead generation and social selling',
      icon: Linkedin,
      color: 'bg-blue-600',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'redirect_uri', label: 'Redirect URI', type: 'url', required: true }
      ]
    },
    {
      type: 'calendar',
      name: 'Calendar Sync',
      description: 'Sync meetings and events with Google Calendar or Outlook',
      icon: Calendar,
      color: 'bg-green-500',
      fields: [
        { key: 'provider', label: 'Calendar Provider', type: 'select', required: true, options: ['Google Calendar', 'Outlook Calendar'] },
        { key: 'api_key', label: 'API Key', type: 'password', required: true }
      ]
    },
    {
      type: 'webhook',
      name: 'Webhook Integration',
      description: 'Send real-time data to external systems via webhooks',
      icon: Webhook,
      color: 'bg-purple-500',
      fields: [
        { key: 'url', label: 'Webhook URL', type: 'url', required: true },
        { key: 'secret', label: 'Secret Key', type: 'password', required: false },
        { key: 'events', label: 'Events', type: 'select', required: true, options: ['Deal Created', 'Deal Updated', 'Contact Created'] }
      ]
    },
    {
      type: 'crm',
      name: 'CRM Integration',
      description: 'Connect with Salesforce, HubSpot, or other CRM systems',
      icon: Database,
      color: 'bg-orange-500',
      fields: [
        { key: 'provider', label: 'CRM Provider', type: 'select', required: true, options: ['Salesforce', 'HubSpot', 'Pipedrive'] },
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'instance_url', label: 'Instance URL', type: 'url', required: false }
      ]
    }
  ];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      // Simulate API call - replace with actual API call
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          name: 'Gmail Sync',
          type: 'email',
          description: 'Sync emails with Gmail',
          is_enabled: true,
          status: 'connected',
          config: { provider: 'Gmail', email: 'admin@company.com' },
          last_sync: '2024-01-15T10:30:00Z',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'LinkedIn Sales Navigator',
          type: 'social',
          description: 'LinkedIn integration for lead generation',
          is_enabled: true,
          status: 'connected',
          config: { client_id: 'linkedin_client_123' },
          last_sync: '2024-01-15T09:15:00Z',
          created_at: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          name: 'Salesforce Sync',
          type: 'crm',
          description: 'Sync data with Salesforce CRM',
          is_enabled: false,
          status: 'error',
          config: { provider: 'Salesforce' },
          created_at: '2024-01-03T00:00:00Z'
        }
      ];
      setIntegrations(mockIntegrations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      setLoading(false);
    }
  };

  const handleAddIntegration = (template: IntegrationTemplate) => {
    setSelectedTemplate(template);
    setConfigForm({});
    setShowAddModal(true);
  };

  const handleSaveIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setSaving(true);
    try {
      // Simulate API call - replace with actual API call
      console.log('Saving integration:', { template: selectedTemplate, config: configForm });
      
      // Reset form and close modal
      setConfigForm({});
      setSelectedTemplate(null);
      setShowAddModal(false);
      
      // Refresh integrations list
      await fetchIntegrations();
    } catch (error) {
      console.error('Error saving integration:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleIntegration = async (integrationId: string, enabled: boolean) => {
    try {
      // Simulate API call - replace with actual API call
      console.log(`Toggling integration ${integrationId} to ${enabled}`);
      
      // Update local state
      setIntegrations(integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, is_enabled: enabled }
          : integration
      ));
    } catch (error) {
      console.error('Error toggling integration:', error);
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;
    
    try {
      // Simulate API call - replace with actual API call
      console.log(`Deleting integration ${integrationId}`);
      
      // Update local state
      setIntegrations(integrations.filter(integration => integration.id !== integrationId));
    } catch (error) {
      console.error('Error deleting integration:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge variant="default">Connected</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      default: return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Integration Settings</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integration Settings</h2>
          <p className="text-muted-foreground">
            Manage email sync, LinkedIn, and other third-party integrations
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.is_enabled && i.status === 'connected').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.status === 'error').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {integrations.find(i => i.last_sync) ? 'Recent' : 'Never'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Integrations</CardTitle>
          <CardDescription>
            Manage your connected services and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const template = integrationTemplates.find(t => t.type === integration.type);
              const Icon = template?.icon || Settings;
              
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${template?.color || 'bg-gray-500'} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{integration.name}</p>
                        {getStatusIcon(integration.status)}
                        {getStatusBadge(integration.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(integration.created_at)}
                        {integration.last_sync && (
                          <> • Last sync {formatDate(integration.last_sync)}</>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={integration.is_enabled}
                        onChange={(e) => toggleIntegration(integration.id, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Enabled</span>
                    </label>
                    
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteIntegration(integration.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Connect with popular services to enhance your CRM workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrationTemplates.map((template) => {
              const Icon = template.icon;
              const isConnected = integrations.some(i => i.type === template.type);
              
              return (
                <div key={template.type} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      {isConnected && <Badge variant="outline" className="text-xs">Connected</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <Button 
                    variant={isConnected ? "outline" : "primary"}
                    size="sm" 
                    className="w-full"
                    onClick={() => handleAddIntegration(template)}
                    disabled={isConnected}
                  >
                    {isConnected ? 'Already Connected' : 'Connect'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Integration Modal */}
      {showAddModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${selectedTemplate.color} text-white`}>
                <selectedTemplate.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Connect {selectedTemplate.name}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {selectedTemplate.description}
            </p>
            
            <form onSubmit={handleSaveIntegration} className="space-y-4">
              {selectedTemplate.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={configForm[field.key] || ''}
                      onChange={(e) => setConfigForm({ ...configForm, [field.key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={configForm[field.key] || ''}
                      onChange={(e) => setConfigForm({ ...configForm, [field.key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={saving}>
                  <Key className="mr-2 h-4 w-4" />
                  Connect Integration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 