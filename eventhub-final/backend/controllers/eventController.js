const Event = require('../models/Event'); const conflictService = require('../services/conflictService'); const recurringEventService = require('../services/recurringEventService'); const notificationService = require('../services/notificationService');

exports.getAll = async (req, res, next) => { try { const { category, status, date_from, date_to, sort = '-date' } = req.query;

const filters = {};
if (category) filters.category = category;
if (status) filters.status = status;
if (date_from) filters.date_from = date_from;
if (date_to) filters.date_to = date_to;

const events = await Event.findAll(filters, sort);

res.json({
  success: true,
  count: events.length,
  data: events
});
} catch (error) { next(error); } };

exports.getById = async (req, res, next) => { try { const event = await Event.findById(req.params.id);

if (!event) {
  return res.status(404).json({ error: 'Event not found' });
}

res.json({
  success: true,
  data: event
});
} catch (error) { next(error); } };

exports.create = async (req, res, next) => { try { const eventData = req.body;

if (eventData.assigned_resource_ids && eventData.assigned_resource_ids.length > 0) {
  const conflicts = await conflictService.checkResourceConflicts(
    eventData.assigned_resource_ids,
    eventData.date,
    eventData.start_time,
    eventData.end_time
  );

  if (conflicts.length > 0) {
    return res.status(409).json({
      error: 'Resource conflict detected',
      conflicts
    });
  }
}

if (eventData.is_recurring) {
  const events = await recurringEventService.createRecurringEvents(eventData);
  
  return res.status(201).json({
    success: true,
    message: `Created ${events.length} recurring events`,
    data: events
  });
}

const event = await Event.create(eventData);

res.status(201).json({
  success: true,
  data: event
});
} catch (error) { next(error); } };

exports.update = async (req, res, next) => { try { const event = await Event.findById(req.params.id);

if (!event) {
  return res.status(404).json({ error: 'Event not found' });
}

if (req.body.assigned_resource_ids && req.body.assigned_resource_ids.length > 0) {
  const conflicts = await conflictService.checkResourceConflicts(
    req.body.assigned_resource_ids,
    req.body.date || event.date,
    req.body.start_time || event.start_time,
    req.body.end_time || event.end_time,
    req.params.id
  );

  if (conflicts.length > 0) {
    return res.status(409).json({
      error: 'Resource conflict detected',
      conflicts
    });
  }
}

const updatedEvent = await Event.update(req.params.id, req.body);

res.json({
  success: true,
  data: updatedEvent
});
} catch (error) { next(error); } };

exports.delete = async (req, res, next) => { try { const event = await Event.findById(req.params.id);

if (!event) {
  return res.status(404).json({ error: 'Event not found' });
}

await Event.delete(req.params.id);

res.json({
  success: true,
  message: 'Event deleted successfully'
});
} catch (error) { next(error); } };