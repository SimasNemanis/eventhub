import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import api from '../api/client';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, bookingsData] = await Promise.all([
        api.entities.Event.list(),
        api.entities.Booking.list()
      ]);

      const eventsList = eventsData.data || eventsData || [];
      const bookingsList = bookingsData.data || bookingsData || [];

      setEvents(eventsList);
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill to complete weeks
  const startDay = monthStart.getDay();
  const endDay = monthEnd.getDay();
  const prevMonthDays = Array(startDay).fill(null);
  const nextMonthDays = Array(6 - endDay).fill(null);
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      if (!event.date) return false;
      try {
        return isSameDay(new Date(event.date), date);
      } catch (e) {
        return false;
      }
    });
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    return bookings.filter(booking => {
      if (!booking.date) return false;
      try {
        return isSameDay(new Date(booking.date), date);
      } catch (e) {
        return false;
      }
    });
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateBookings = getBookingsForDate(selectedDate);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">View all events and bookings in calendar format</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {allDays.map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : [];
                  const dayBookings = day ? getBookingsForDate(day) : [];
                  const hasActivity = dayEvents.length > 0 || dayBookings.length > 0;
                  const isSelected = day && isSameDay(day, selectedDate);
                  const isCurrentDay = day && isToday(day);

                  return (
                    <button
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day || !isSameMonth(day, currentDate)}
                      className={`aspect-square p-2 rounded-lg transition-all relative ${
                        !day || !isSameMonth(day, currentDate)
                          ? 'text-gray-300 cursor-default'
                          : isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : isCurrentDay
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {day && (
                        <>
                          <span className="text-sm">{format(day, 'd')}</span>
                          {hasActivity && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {dayEvents.length > 0 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              )}
                              {dayBookings.length > 0 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Bookings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>

              {/* Events */}
              {selectedDateEvents.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Events ({selectedDateEvents.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => (
                      <div key={event.id} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="font-medium text-gray-900 mb-1">{event.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.start_time} - {event.end_time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bookings */}
              {selectedDateBookings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Bookings ({selectedDateBookings.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedDateBookings.map(booking => (
                      <div key={booking.id} className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <p className="font-medium text-gray-900 mb-1">
                          {booking.booking_type === 'event' ? 'Event Booking' : 'Resource Booking'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{booking.start_time} - {booking.end_time}</span>
                        </div>
                        {booking.purpose && (
                          <p className="text-sm text-gray-600">{booking.purpose}</p>
                        )}
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Activity */}
              {selectedDateEvents.length === 0 && selectedDateBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No events or bookings on this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
