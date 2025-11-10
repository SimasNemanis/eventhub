import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import EventCard from "../components/EventCard";

export default function Events() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data.data;
    },
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data.data || [];
    },
  });

  // ✅ FIX: Use dedicated /my-bookings endpoint instead of client-side filtering
  // This ensures we only check the current user's event registrations
  const { data: bookings = [] } = useQuery({
    queryKey: ['myBookings', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!user?.id,
  });

  // Filter only event bookings from user's bookings
  const myEventBookings = bookings.filter(b => b.booking_type === 'event');

  const { data: waitingList = [] } = useQuery({
    queryKey: ['myWaitingList', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/waiting-list/my-waitlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        // If endpoint doesn't exist, return empty array
        if (response.status === 404) return [];
        throw new Error('Failed to fetch waiting list');
      }
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!user?.id,
  });

  const registerMutation = useMutation({
    mutationFn: async (event) => {
      // Create booking for the event
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          booking_type: 'event',
          event_id: event.id,
          date: event.date,
          start_time: event.start_time,
          end_time: event.end_time,
          status: 'confirmed'
        })
      });

      if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        throw new Error(error.message || 'Failed to register for event');
      }

      // Update event registered count
      await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          registered_count: (event.registered_count || 0) + 1
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['myBookings']);
    },
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: async (event) => {
      const response = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          event_id: event.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join waiting list');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myWaitingList']);
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (event) => {
      // Find the booking for this event
      const booking = myEventBookings.find(b => b.event_id === event.id && b.status === 'confirmed');
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Cancel the booking
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel registration');
      }

      // Decrease event registered count
      if (event.registered_count > 0) {
        await fetch(`/api/events/${event.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            registered_count: event.registered_count - 1
          })
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['myBookings']);
    },
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(events.map(e => e.category).filter(Boolean))];

  // Helper function to check if user is registered for an event
  const isRegistered = (eventId) => {
    return myEventBookings.some(b => b.event_id === eventId && b.status === 'confirmed');
  };

  // Helper function to check if user is on waiting list
  const isOnWaitingList = (eventId) => {
    return waitingList.some(w => w.event_id === eventId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-600">Discover and register for upcoming events</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No events are currently available"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={isRegistered(event.id)}
                isOnWaitingList={isOnWaitingList(event.id)}
                onRegister={() => registerMutation.mutate(event)}
                onUnregister={() => unregisterMutation.mutate(event)}
                onJoinWaitlist={() => joinWaitlistMutation.mutate(event)}
                isLoading={
                  registerMutation.isLoading ||
                  unregisterMutation.isLoading ||
                  joinWaitlistMutation.isLoading
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
