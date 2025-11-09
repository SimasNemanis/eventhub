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

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [eventsRes, resourcesRes, usersRes] = await Promise.all([
        api.get('/events'),
        api.get('/resources'),
        api.get('/users')
      ]);

      setStats({
        totalEvents: eventsRes.data.data?.length || 0,
        totalResources: resourcesRes.data.data?.length || 0,
        totalBookings: 0,
        totalUsers: usersRes.data.data?.length || 0
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Resources</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalResources}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
        <p className="text-gray-600">
          Your EventHub platform is running smoothly. Check back later for more detailed analytics and reports.
        </p>
      </div>
    </div>
  );
}
