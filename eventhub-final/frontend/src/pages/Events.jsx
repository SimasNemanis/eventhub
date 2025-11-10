import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, bookingsData] = await Promise.all([
        api.entities.Event.list(),
        api.entities.Booking.list()
      ]);

      const eventsList = eventsData.data || eventsData || [];
      const bookingsList = bookingsData.data || bookingsData || [];

      setEvents(eventsList);
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    try {
      // Create booking with correct fields matching database schema
      await api.entities.Booking.create({
        booking_type: 'event',
        event_id: event.id,
        date: event.date,           // Use event's date
        start_time: event.start_time,
        end_time: event.end_time,
        status: 'confirmed'
      });
      
      alert(`Successfully registered for ${event.title}!`);
      loadData(); // Reload to update registration status
    } catch (error) {
      console.error('Error registering for event:', error);
      const errorMsg = error.response?.data?.errors?.map(e => e.msg).join(', ') ||
                      error.response?.data?.error ||
                      'Failed to register for event';
      alert(errorMsg);
    }
  };

  const registeredEventIds = new Set(bookings.map(b => b.event_id));

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'workshop', 'seminar', 'conference', 'training', 'meeting', 'social', 'other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Events</h1>
          <p className="text-gray-600">Discover and register for upcoming events</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      categoryFilter === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEventIds.has(event.id);
              const isFull = event.capacity && event.registered_count >= event.capacity;

              return (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      {event.category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {event.category}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description || 'No description available'}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {/* Fixed: Use event.date for date display */}
                      <div className="flex items-center">
                        <span className="font-medium mr-2">📅</span>
                        {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
                      </div>
                      {/* Fixed: Use event.start_time directly (it's already HH:MM format) */}
                      <div className="flex items-center">
                        <span className="font-medium mr-2">🕐</span>
                        {event.start_time || 'TBA'} - {event.end_time || 'TBA'}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">📍</span>
                          {event.location}
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">👥</span>
                          {event.registered_count || 0} / {event.capacity}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRegister(event)}
                      disabled={isRegistered || isFull}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                        isRegistered
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : isFull
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRegistered ? '✓ Registered' : isFull ? 'Event Full' : 'Register'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
