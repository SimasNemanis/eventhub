import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    myBookings: 0,
    availableResources: 0,
    totalUsers: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [eventsData, bookingsData, resourcesData] = await Promise.all([
        api.entities.Event.list(),
        api.entities.Booking.list(),
        api.entities.Resource.list()
      ]);

      // Handle response - check if data is wrapped or direct
      const events = eventsData.data || eventsData || [];
      const bookings = bookingsData.data || bookingsData || [];
      const resources = resourcesData.data || resourcesData || [];

      // Get upcoming events (future dates)
      const upcomingEvents = events.filter(event => new Date(event.start_time) >= new Date());
      
      // Count available resources
      const availableResources = resources.filter(r => r.available).length;

      setRecentEvents(upcomingEvents.slice(0, 5));
      setRecentBookings(bookings.slice(0, 5));
      
      setStats({
        upcomingEvents: upcomingEvents.length,
        myBookings: bookings.length,
        availableResources: availableResources,
        totalUsers: 0
      });

      // If admin, load user count
      if (user?.role === 'admin') {
        const usersData = await api.entities.User.list();
        const users = usersData.data || usersData || [];
        setStats(prev => ({ ...prev, totalUsers: users.length }));
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
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
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your events and bookings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Upcoming Events</p>
              <p className="text-3xl font-bold mt-2">{stats.upcomingEvents}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">My Bookings</p>
              <p className="text-3xl font-bold mt-2">{stats.myBookings}</p>
            </div>
            <Clock className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Available Resources</p>
              <p className="text-3xl font-bold mt-2">{stats.availableResources}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/events" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition">
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description?.substring(0, 80)}...</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">{new Date(event.start_time).toLocaleDateString()}</span>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Recent Bookings</h2>
            <Link to="/my-bookings" className="text-green-600 hover:text-green-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Booking #{booking.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.start_time).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/events"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-medium">Browse Events</p>
          </Link>
          <Link
            to="/resources"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium">View Resources</p>
          </Link>
          <Link
            to="/calendar"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium">Calendar View</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
