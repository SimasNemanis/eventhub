const Booking = require('../models/Booking'); const Event = require('../models/Event'); const Resource = require('../models/Resource'); const conflictService = require('../services/conflictService'); const notificationService = require('../services/notificationService');

exports.getAll = async (req, res, next) => { try { const { booking_type, status, date, sort = '-created_date' } = req.query;

const filters = {};
if (booking_type) filters.booking_type = booking_type;
if (status) filters.status = status;
if (date) filters.date = date;

const bookings = await Booking.findAll(filters, sort);

res.json({
  success: true,
  count: bookings.length,
  data: bookings
});
} catch (error) { next(error); } };

exports.getMyBookings = async (req, res, next) => { try { const bookings = await Booking.findByUserId(req.user.id);

res.json({
  success: true,
  count: bookings.length,
  data: bookings
});
} catch (error) { next(error); } };

exports.getById = async (req, res, next) => { try { const booking = await Booking.findById(req.params.id);

if (!booking) {
  return res.status(404).json({ error: 'Booking not found' });
}

if (booking.created_by !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

res.json({
  success: true,
  data: booking
});
} catch (error) { next(error); } };

exports.create = async (req, res, next) => { try { const bookingData = { ...req.body, created_by: req.user.id };

if (bookingData.booking_type === 'resource' && bookingData.resource_id) {
  const conflicts = await conflictService.checkResourceBookingConflicts(
    bookingData.resource_id,
    bookingData.date,
    bookingData.start_time,
    bookingData.end_time
  );

  if (conflicts.length > 0) {
    return res.status(409).json({
      error: 'Resource is already booked for this time slot',
      conflicts
    });
  }
}

if (bookingData.booking_type === 'event' && bookingData.event_id) {
  const event = await Event.findById(bookingData.event_id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (event.registered_count >= event.capacity) {
    return res.status(400).json({ error: 'Event is full' });
  }

  await Event.update(event.id, {
    registered_count: event.registered_count + 1
  });
}

const booking = await Booking.create(bookingData);

if (req.user.notification_preferences?.booking_confirmations) {
  await notificationService.sendBookingConfirmation(req.user, booking);
}

res.status(201).json({
  success: true,
  data: booking
});
} catch (error) { next(error); } };

exports.update = async (req, res, next) => { try { const booking = await Booking.findById(req.params.id);

if (!booking) {
  return res.status(404).json({ error: 'Booking not found' });
}

if (booking.created_by !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

const updatedBooking = await Booking.update(req.params.id, req.body);

res.json({
  success: true,
  data: updatedBooking
});
} catch (error) { next(error); } };

exports.delete = async (req, res, next) => { try { const booking = await Booking.findById(req.params.id);

if (!booking) {
  return res.status(404).json({ error: 'Booking not found' });
}

if (booking.created_by !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

if (booking.booking_type === 'event' && booking.event_id) {
  const event = await Event.findById(booking.event_id);
  if (event) {
    await Event.update(event.id, {
      registered_count: Math.max(0, event.registered_count - 1)
    });
  }
}

await Booking.delete(req.params.id);

res.json({
  success: true,
  message: 'Booking cancelled successfully'
});
} catch (error) { next(error); } };