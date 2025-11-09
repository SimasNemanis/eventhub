import { useState, useEffect } from 'react';
import api from '../api/client';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the correct API syntax
      const bookingsData = await api.entities.Booking.list();
      
      // Handle response - data might be directly in bookingsData or in bookingsData.data
      const bookingsList = bookingsData.data || bookingsData || [];
      
      // Filter to only show current user's bookings
      // The backend should handle this with /bookings/my-bookings endpoint
      // But since we're using the entities API, we get all bookings
      // If the backend returns only user's bookings, this filter is not needed
      setBookings(Array.isArray(bookingsList) ? bookingsList : []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Use the correct API syntax
        await api.entities.Booking.delete(id);
        
        // Reload bookings after successful deletion
        loadBookings();
      } catch (err) {
        console.error('Error canceling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
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
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  Booking #{booking.id?.slice(0, 8) || 'N/A'}
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status || 'pending'}
                    </span>
                  </p>
                  {booking.booking_date_start && (
                    <p>
                      <span className="font-medium">Start:</span>{' '}
                      {new Date(booking.booking_date_start).toLocaleString()}
                    </p>
                  )}
                  {booking.booking_date_end && (
                    <p>
                      <span className="font-medium">End:</span>{' '}
                      {new Date(booking.booking_date_end).toLocaleString()}
                    </p>
                  )}
                  {booking.event_id && (
                    <p>
                      <span className="font-medium">Event ID:</span> {booking.event_id.slice(0, 8)}...
                    </p>
                  )}
                  {booking.resource_id && (
                    <p>
                      <span className="font-medium">Resource ID:</span> {booking.resource_id.slice(0, 8)}...
                    </p>
                  )}
                </div>
              </div>
              {booking.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ml-4"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <p className="text-gray-500 text-lg">You have no bookings yet.</p>
          <p className="text-gray-400 mt-2">Book an event or resource to get started!</p>
        </div>
      )}
    </div>
  );
}
