import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Package, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  // ✅ FIX: Fetch user's bookings from /my-bookings endpoint
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      if (!event.date) return false;
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    });
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      if (!booking.date) return false;
      try {
        const bookingDate = parseISO(booking.date);
        return isSameDay(bookingDate, date);
      } catch {
        return false;
      }
    });
  };

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

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-2 text-gray-600">View your events and bookings in calendar format</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const dayBookings = getBookingsForDate(day);
                  const hasItems = dayEvents.length > 0 || dayBookings.length > 0;
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        min-h-[80px] p-2 border rounded-lg text-left transition-all
                        ${!isSameMonth(day, currentDate) ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
                        ${isToday ? 'bg-blue-50' : ''}
                        ${hasItems ? 'hover:shadow-md' : 'hover:border-gray-300'}
                      `}
                    >
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      {hasItems && (
                        <div className="space-y-1">
                          {dayEvents.length > 0 && (
                            <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                              {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                            </div>
                          )}
                          {dayBookings.length > 0 && (
                            <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                              {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
              </h2>
            </div>

            <div className="p-6">
              {!selectedDate ? (
                <p className="text-gray-500 text-center py-8">Click on a date to view details</p>
              ) : (
                <div className="space-y-6">
                  {/* Events */}
                  {selectedDateEvents.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        Events
                      </h3>
                      <div className="space-y-3">
                        {selectedDateEvents.map(event => (
                          <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {event.start_time} - {event.end_time}
                              </div>
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {event.registered_count || 0} / {event.capacity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bookings */}
                  {selectedDateBookings.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-green-600" />
                        My Bookings
                      </h3>
                      <div className="space-y-3">
                        {selectedDateBookings.map(booking => (
                          <div key={booking.id} className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-500">
                                {booking.booking_type}
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {booking.start_time} - {booking.end_time}
                              </div>
                              {booking.purpose && (
                                <p className="text-xs">{booking.purpose}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDateEvents.length === 0 && selectedDateBookings.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No events or bookings on this date</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
