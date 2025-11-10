import React, { useState, useEffect } from "react";
import api from "../api/client";
import { Search, Filter } from "lucide-react";
import { Input } from "../components/ui/input";
import EventCard from "../components/EventCard";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get('/events'),
        api.get('/bookings/my-bookings') // ✅ FIX: Use /my-bookings endpoint
      ]);

      setEvents(eventsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    try {
      await api.post('/bookings', {
        booking_type: 'event',
        event_id: event.id,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        status: 'confirmed'
      });

      await api.put(`/events/${event.id}`, {
        registered_count: (event.registered_count || 0) + 1
      });

      loadData(); // Reload data
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
    }
  };

  const handleJoinWaitlist = async (event) => {
    try {
      await api.post('/waiting-list', {
        event_id: event.id,
        status: 'waiting'
      });

      alert('Successfully joined waiting list!');
    } catch (error) {
      console.error('Error joining waiting list:', error);
      alert('Failed to join waiting list');
    }
  };

  // Check if user is registered for an event
  const registeredEventIds = new Set(
    bookings
      .filter(b => b.booking_type === 'event' && b.status === 'confirmed')
      .map(b => b.event_id)
  );

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "workshop", "seminar", "conference", "training", "meeting", "social", "other"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Events</h1>
          <p className="text-gray-600">Discover and register for upcoming events</p>
        </div>

        <div className="bg-white rounded-lg p-6 elevation-1 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all material-button ${
                      categoryFilter === category
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={categoryFilter === category ? { backgroundColor: 'var(--md-primary)' } : {}}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg h-96 elevation-1 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={() => handleRegister(event)}
                onJoinWaitlist={() => handleJoinWaitlist(event)}
                isRegistered={registeredEventIds.has(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 elevation-1 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--md-primary)', opacity: 0.1 }}>
                <Search className="w-10 h-10" style={{ color: 'var(--md-primary)' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
