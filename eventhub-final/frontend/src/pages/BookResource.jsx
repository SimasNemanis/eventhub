import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import api from '../api/client';

export default function BookResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  
  const [formData, setFormData] = useState({
    date: '',
    start_time: '09:00',
    end_time: '10:00',
    purpose: '',
    notes: ''
  });

  useEffect(() => {
    loadResource();
  }, [id]);

  useEffect(() => {
    // Check availability when date/time changes
    if (formData.date && formData.start_time && formData.end_time) {
      checkAvailability();
      loadBookedSlots();
    }
  }, [formData.date, formData.start_time, formData.end_time]);

  const loadResource = async () => {
    try {
      setLoading(true);
      const resourceData = await api.entities.Resource.getById(id);
      const resourceObj = resourceData.data || resourceData;
      setResource(resourceObj);
    } catch (error) {
      console.error('Error loading resource:', error);
      alert('Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      setChecking(true);
      const response = await fetch(
        `/api/proxy/bookings/resources/${id}/availability?date=${formData.date}&start_time=${formData.start_time}&end_time=${formData.end_time}`
      );
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setChecking(false);
    }
  };

  const loadBookedSlots = async () => {
    try {
      const response = await fetch(
        `/api/proxy/bookings/resources/${id}/slots?date=${formData.date}`
      );
      const data = await response.json();
      if (data.success) {
        setBookedSlots(data.booked_slots || []);
      }
    } catch (error) {
      console.error('Error loading booked slots:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!availability?.available) {
      alert('This time slot is not available. Please choose a different time.');
      return;
    }

    try {
      await api.entities.Booking.create({
        booking_type: 'resource',
        resource_id: id,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        purpose: formData.purpose,
        notes: formData.notes,
        status: 'confirmed'
      });

      alert('Resource booked successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMsg = error.response?.data?.error || 'Failed to create booking';
      alert(errorMsg);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h2>
          <button
            onClick={() => navigate('/resources')}
            className="text-blue-600 hover:underline"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book Resource</h1>

        {/* Resource Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{resource.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <span className="ml-2">{resource.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Capacity:</span>
              <span className="ml-2">{resource.capacity} people</span>
            </div>
            {resource.location && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Location:</span>
                <span className="ml-2">{resource.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Booking Details</h3>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Availability Status */}
          {formData.date && formData.start_time && formData.end_time && (
            <div className="mb-4">
              {checking ? (
                <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                  <Loader className="w-5 h-5 mr-2 animate-spin text-gray-600" />
                  <span className="text-gray-600">Checking availability...</span>
                </div>
              ) : availability ? (
                <div className={`flex items-start p-4 rounded-lg ${
                  availability.available 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {availability.available ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Available</p>
                        <p className="text-sm text-green-600">{availability.message}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Not Available</p>
                        <p className="text-sm text-red-600">{availability.message}</p>
                        {availability.conflicts && availability.conflicts.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-red-700">Conflicting bookings:</p>
                            <ul className="text-sm text-red-600 mt-1 space-y-1">
                              {availability.conflicts.map((conflict, idx) => (
                                <li key={idx}>
                                  {conflict.start_time} - {conflict.end_time}
                                  {conflict.purpose && `: ${conflict.purpose}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Booked Slots for Selected Date */}
          {formData.date && bookedSlots.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">
                Already booked on {new Date(formData.date).toLocaleDateString()}:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                {bookedSlots.map((slot, idx) => (
                  <li key={idx}>
                    {slot.start_time} - {slot.end_time}
                    {slot.purpose && ` (${slot.purpose})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Purpose */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              placeholder="e.g., Team meeting, Workshop, Training"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any special requirements or notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!availability?.available || checking}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                availability?.available && !checking
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {checking ? 'Checking...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/resources')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
