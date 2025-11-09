import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Package, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['myBookings', user?.email],
    queryFn: () => api.entities.Booking.filter({ created_by: user?.email }, '-date'),
    enabled: !!user?.email,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.entities.Event.list(),
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.entities.Resource.list(),
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (booking) => {
      await api.entities.Booking.update(booking.id, { status: 'cancelled' });
      if (booking.booking_type === 'event') {
        const event = events.find(e => e.id === booking.event_id);
        if (event) {
          await api.entities.Event.update(event.id, {
            registered_count: Math.max(0, (event.registered_count || 0) - 1)
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
    return booking.booking_type === activeTab;
  });

  const activeBookings = filteredBookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your event registrations and resource bookings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg elevation-1 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: "all", label: "All Bookings" },
              { id: "event", label: "Event Registrations" },
              { id: "resource", label: "Resource Bookings" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === tab.id ? { borderColor: 'var(--md-primary)', color: 'var(--md-primary)' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg h-32 elevation-1 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Active Bookings */}
            {activeBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Bookings</h2>
                <div className="space-y-4">
                  {activeBookings.map((booking) => {
                    const isEvent = booking.booking_type === 'event';
                    const details = isEvent 
                      ? getEventDetails(booking.event_id)
                      : getResourceDetails(booking.resource_id);

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-lg p-6 elevation-1 hover-elevation-2 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isEvent ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {isEvent ? (
                                <Calendar className="w-6 h-6 text-blue-600" />
                              ) : (
                                <Package className="w-6 h-6 text-green-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {isEvent ? details?.title : details?.name}
                              </h3>
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-1" style={{ backgroundColor: 'var(--md-primary)', color: 'white' }}>
                                {isEvent ? 'Event Registration' : 'Resource Booking'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => cancelBookingMutation.mutate(booking)}
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors material-button flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>

                        {details?.description && (
                          <p className="text-gray-600 mb-4">{details.description}</p>
                        )}

                        {!isEvent && booking.purpose && (
                          <p className="text-gray-700 mb-4">
                            <span className="font-medium">Purpose:</span> {booking.purpose}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: 'var(--md-primary)' }} />
                            <span className="font-medium">{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" style={{ color: 'var(--md-primary)' }} />
                            <span>{booking.start_time} - {booking.end_time}</span>
                          </div>
                          {details?.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" style={{ color: 'var(--md-primary)' }} />
                              <span>{details.location}</span>
                            </div>
 
 import React, { useState } from "react";
