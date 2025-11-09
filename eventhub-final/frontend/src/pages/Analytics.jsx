import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalResources: 0,
    totalBookings: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      // Use correct API syntax
      const [eventsData, resourcesData, usersData, bookingsData] = await Promise.all([
        api.entities.Event.list(),
        api.entities.Resource.list(),
        api.entities.User.list(),
        api.entities.Booking.list()
      ]);

      // Handle response - data might be directly in the response or in response.data
      const events = eventsData.data || eventsData || [];
      const resources = resourcesData.data || resourcesData || [];
      const users = usersData.data || usersData || [];
      const bookings = bookingsData.data || bookingsData || [];

      setStats({
        totalEvents: Array.isArray(events) ? events.length : 0,
        totalResources: Array.isArray(resources) ? resources.length : 0,
        totalBookings: Array.isArray(bookings) ? bookings.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0
      });
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalEvents}</p>
            </div>
            <div className="text-blue-600 text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">Total Resources</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalResources}</p>
            </div>
            <div className="text-green-600 text-4xl">🏢</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">Total Bookings</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalBookings}</p>
            </div>
            <div className="text-purple-600 text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="text-orange-600 text-4xl">👥</div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Activity Summary</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• {stats.totalEvents} events created</li>
              <li>• {stats.totalResources} resources available</li>
              <li>• {stats.totalBookings} total bookings made</li>
              <li>• {stats.totalUsers} registered users</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Platform Status</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">All systems operational</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Database connected</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">API responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📊 More Analytics Coming Soon</h3>
        <p className="text-blue-800">
          Advanced analytics including event attendance, resource utilization rates, 
          booking trends, and user engagement metrics will be available in future updates.
        </p>
      </div>
    </div>
  );
}
