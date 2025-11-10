import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Package, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

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

  // ✅ FIX: Use dedicated /my-bookings endpoint instead of client-side filtering
  // This ensures only the current user's bookings are fetched from the server
  const { data: bookings = [], isLoading } = useQuery({
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

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data.data || [];
    },
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await fetch('/api/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      return data.data || [];
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (booking) => {
      // Update booking status to cancelled
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (!response.ok) throw new Error('Failed to cancel booking');

      // If it's an event booking, decrease the registered count
      if (booking.booking_type === 'event') {
        const event = events.find(e => e.id === booking.event_id);
        if (event && event.registered_count > 0) {
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myBookings']);
      queryClient.invalidateQueries(['events']);
    },
  });

  const getEventDetails = (eventId) => events.find(e => e.id === eventId);
  const getResourceDetails = (resourceId) => resources.find(r => r.id === resourceId);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true;
    if (activeTab === "events") return booking.booking_type === "event";
    if (activeTab === "resources") return booking.booking_type === "resource";
    if (activeTab === "active") return booking.status === "confirmed";
    if (activeTab === "cancelled") return booking.status === "cancelled";
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">View and manage your event registrations and resource bookings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: "all", label: "All Bookings" },
                { id: "events", label: "Events" },
                { id: "resources", label: "Resources" },
                { id: "active", label: "Active" },
                { id: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-2 text-gray-500">
              {activeTab === "all" 
                ? "You haven't made any bookings yet."
                : `You don't have any ${activeTab} bookings.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              const isEvent = booking.booking_type === "event";
              const details = isEvent 
                ? getEventDetails(booking.event_id)
                : getResourceDetails(booking.resource_id);

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {isEvent ? (
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        ) : (
                          <Package className="h-5 w-5 text-green-600 mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-500">
                          {isEvent ? "Event" : "Resource"}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {details?.title || details?.name || "Unknown"}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {booking.start_time} - {booking.end_time}
                      </div>
                      {details?.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {details.location}
                        </div>
                      )}
                    </div>

                    {booking.purpose && (
                      <p className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Purpose:</span> {booking.purpose}
                      </p>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => cancelBookingMutation.mutate(booking)}
                        disabled={cancelBookingMutation.isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {cancelBookingMutation.isLoading ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
