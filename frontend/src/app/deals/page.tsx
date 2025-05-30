'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';

// Mock data
const mockDeals = [
  {
    id: 1,
    title: 'Enterprise Software Solution',
    company: 'Acme Corp',
    contact: 'John Smith',
    value: '$150,000',
    stage: 'Prospecting',
    probability: 20,
    closeDate: '2024-03-15',
    description: 'Custom enterprise software development project'
  },
  {
    id: 2,
    title: 'Cloud Migration Project',
    company: 'TechStart Inc',
    contact: 'Sarah Johnson',
    value: '$85,000',
    stage: 'Qualification',
    probability: 40,
    closeDate: '2024-02-28',
    description: 'Complete cloud infrastructure migration'
  },
  {
    id: 3,
    title: 'Marketing Automation Setup',
    company: 'Growth Co',
    contact: 'Mike Wilson',
    value: '$25,000',
    stage: 'Proposal',
    probability: 70,
    closeDate: '2024-02-15',
    description: 'Marketing automation platform implementation'
  },
  {
    id: 4,
    title: 'Data Analytics Platform',
    company: 'Analytics Plus',
    contact: 'Lisa Chen',
    value: '$200,000',
    stage: 'Negotiation',
    probability: 80,
    closeDate: '2024-02-10',
    description: 'Custom data analytics and reporting platform'
  }
];

const stages = [
  { name: 'Prospecting', color: 'bg-gray-100' },
  { name: 'Qualification', color: 'bg-blue-100' },
  { name: 'Proposal', color: 'bg-yellow-100' },
  { name: 'Negotiation', color: 'bg-orange-100' },
  { name: 'Closed Won', color: 'bg-green-100' },
  { name: 'Closed Lost', color: 'bg-red-100' }
];

export default function DealsPage() {
  const [deals, setDeals] = useState(mockDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const getDealsForStage = (stageName: string) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const getTotalValue = (stageName: string) => {
    const stageDeals = getDealsForStage(stageName);
    return stageDeals.reduce((sum, deal) => {
      const value = parseFloat(deal.value.replace('$', '').replace(',', ''));
      return sum + value;
    }, 0);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage your sales opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Table
              </button>
            </div>
            <Button onClick={handleAddDeal}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Deal
            </Button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Pipeline Value</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ${deals.reduce((sum, deal) => sum + parseFloat(deal.value.replace('$', '').replace(',', '')), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Deals</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{deals.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Avg Deal Size</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ${Math.round(deals.reduce((sum, deal) => sum + parseFloat(deal.value.replace('$', '').replace(',', '')), 0) / deals.length).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Kanban Board */}
        {viewMode === 'kanban' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {stages.map((stage) => (
                  <div key={stage.name} className="flex-shrink-0 w-80">
                    <div className={`${stage.color} rounded-lg p-4 mb-4`}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                        <span className="text-sm text-gray-600">
                          {getDealsForStage(stage.name).length} deals
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        ${getTotalValue(stage.name).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {getDealsForStage(stage.name).map((deal) => (
                        <div
                          key={deal.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleEditDeal(deal)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
                            <span className="text-lg font-bold text-green-600">{deal.value}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{deal.company}</p>
                          <p className="text-xs text-gray-500 mb-3">{deal.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Close: {deal.closeDate}
                            </span>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${deal.probability}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{deal.probability}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Close Date
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                          <div className="text-sm text-gray-500">{deal.contact}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {deal.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{deal.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deal.closeDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditDeal(deal)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deal Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedDeal ? 'Edit Deal' : 'Add New Deal'}
          size="lg"
        >
          <DealForm
            deal={selectedDeal}
            onSave={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
}

// Deal Form Component
function DealForm({ deal, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    company: deal?.company || '',
    contact: deal?.contact || '',
    value: deal?.value || '',
    stage: deal?.stage || 'Prospecting',
    probability: deal?.probability || 20,
    closeDate: deal?.closeDate || '',
    description: deal?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deal Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deal Value
          </label>
          <input
            type="text"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="$50,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stages.map((stage) => (
              <option key={stage.name} value={stage.name}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Close Date
          </label>
          <input
            type="date"
            value={formData.closeDate}
            onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Probability (%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{formData.probability}%</div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {deal ? 'Update' : 'Create'} Deal
        </Button>
      </div>
    </form>
  );
} 