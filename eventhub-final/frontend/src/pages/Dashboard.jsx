import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Package, TrendingUp, Users, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
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

  // ✅ FIX: Use dedicated /my-bookings endpoint instead of client-side filtering
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

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const availableResources = resources.filter(r => r.available);
  const myActiveBookings = bookings.filter(b => b.status === 'confirmed');

  const stats = [
    {
      title: "Upcoming Events",
      value: events.filter(e => e.status === 'upcoming').length,
      icon: Calendar,
      color: "bg-blue-500",
      link: createPageUrl("Events")
    },
    {
      title: "Available Resources",
      value: availableResources.length,
      icon: Package,
      color: "bg-green-500",
      link: createPageUrl("Resources")
    },
    {
      title: "My Bookings",
      value: myActiveBookings.length,
      icon: TrendingUp,
      color: "bg-purple-500",
      link: createPageUrl("MyBookings")
    },
    {
      title: "Total Events",
      value: events.length,
      icon: Users,
      color: "bg-orange-500",
      link: createPageUrl("Events")
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your events and bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <div className="p-6">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={createPageUrl("Events")}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.start_time} - {event.end_time}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          {event.registered_count || 0} / {event.capacity} registered
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to={createPageUrl("Events")}
                className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View all events →
              </Link>
            </div>
          </div>

          {/* My Active Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Active Bookings</h2>
            </div>
            <div className="p-6">
              {myActiveBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active bookings</p>
              ) : (
                <div className="space-y-4">
                  {myActiveBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          {booking.booking_type === 'event' ? 'Event' : 'Resource'}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {booking.start_time} - {booking.end_time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to={createPageUrl("MyBookings")}
                className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View all bookings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
