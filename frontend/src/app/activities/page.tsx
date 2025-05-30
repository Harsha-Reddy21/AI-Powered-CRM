'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';

// Mock data
const mockActivities = [
  {
    id: 1,
    type: 'Call',
    title: 'Discovery Call with John Smith',
    contact: 'John Smith',
    company: 'Acme Corp',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: '45 min',
    status: 'Completed',
    notes: 'Discussed their current software needs and pain points. They are interested in our enterprise solution.',
    outcome: 'Positive'
  },
  {
    id: 2,
    type: 'Email',
    title: 'Follow-up proposal sent',
    contact: 'Sarah Johnson',
    company: 'TechStart Inc',
    date: '2024-01-14',
    time: '2:30 PM',
    status: 'Completed',
    notes: 'Sent detailed proposal for cloud migration project. Awaiting response.',
    outcome: 'Neutral'
  },
  {
    id: 3,
    type: 'Meeting',
    title: 'Product Demo',
    contact: 'Mike Wilson',
    company: 'Growth Co',
    date: '2024-01-16',
    time: '3:00 PM',
    duration: '60 min',
    status: 'Scheduled',
    notes: 'Live demo of marketing automation features.',
    outcome: 'Pending'
  },
  {
    id: 4,
    type: 'Task',
    title: 'Prepare contract for Analytics Plus',
    contact: 'Lisa Chen',
    company: 'Analytics Plus',
    date: '2024-01-17',
    time: '9:00 AM',
    status: 'Pending',
    notes: 'Draft contract based on final negotiations.',
    outcome: 'Pending'
  }
];

const activityTypes = ['All', 'Call', 'Email', 'Meeting', 'Task'];
const statusOptions = ['All', 'Completed', 'Scheduled', 'Pending', 'Cancelled'];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(mockActivities);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const filteredActivities = activities.filter(activity => {
    const matchesType = selectedType === 'All' || activity.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || activity.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Call':
        return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
      case 'Email':
        return 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
      case 'Meeting':
        return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z';
      case 'Task':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Positive':
        return 'text-green-600';
      case 'Negative':
        return 'text-red-600';
      case 'Neutral':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your customer interactions and sales activities
            </p>
          </div>
          <Button onClick={handleAddActivity}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Activity
          </Button>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Activities</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{activities.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {activities.filter(a => a.status === 'Completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {activities.filter(a => a.status === 'Scheduled').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {activities.filter(a => a.status === 'Pending').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="space-y-0">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="border-b border-gray-200 p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleEditActivity(activity)}
              >
                <div className="flex items-start space-x-4">
                  {/* Activity Type Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getActivityIcon(activity.type)} />
                      </svg>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.contact} • {activity.company}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        {activity.outcome !== 'Pending' && (
                          <span className={`text-sm font-medium ${getOutcomeColor(activity.outcome)}`}>
                            {activity.outcome}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {activity.date}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {activity.time}
                      </span>
                      {activity.duration && (
                        <span className="text-gray-400">• {activity.duration}</span>
                      )}
                    </div>

                    {activity.notes && (
                      <p className="mt-3 text-sm text-gray-700 line-clamp-2">{activity.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedActivity ? 'Edit Activity' : 'Add New Activity'}
          size="lg"
        >
          <ActivityForm
            activity={selectedActivity}
            onSave={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
}

// Activity Form Component
function ActivityForm({ activity, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    type: activity?.type || 'Call',
    title: activity?.title || '',
    contact: activity?.contact || '',
    company: activity?.company || '',
    date: activity?.date || '',
    time: activity?.time || '',
    duration: activity?.duration || '',
    status: activity?.status || 'Pending',
    notes: activity?.notes || '',
    outcome: activity?.outcome || 'Pending'
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
            Activity Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
            <option value="Task">Task</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
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
            Contact
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
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (optional)
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 30 min"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outcome
          </label>
          <select
            value={formData.outcome}
            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add notes about this activity..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {activity ? 'Update' : 'Create'} Activity
        </Button>
      </div>
    </form>
  );
}