const Event = require('../models/Event'); const Booking = require('../models/Booking');

const checkResourceConflicts = async (resourceIds, date, startTime, endTime, excludeEventId = null) => { const conflicts = [];

for (const resourceId of resourceIds) { let query = SELECT e.*, array_agg(e.assigned_resource_ids) as resources FROM events e WHERE e.date = $1 AND $2 = ANY(e.assigned_resource_ids) AND ( ($3 >= e.start_time AND $3 < e.end_time) OR ($4 > e.start_time AND $4 <= e.end_time) OR ($3 <= e.start_time AND $4 >= e.end_time) ) ;

const params = [date, resourceId, startTime, endTime];

if (excludeEventId) {
  query += ' AND e.id != $5';
  params.push(excludeEventId);
}

query += ' GROUP BY e.id';

const Event = require('../models/Event');
const result = await Event.findAll({ date });

const conflictingEvents = result.filter(e => {
  if (excludeEventId && e.id === excludeEventId) return false;
  
  const eventResourceIds = e.assigned_resource_ids || [];
  if (!eventResourceIds.includes(resourceId)) return false;

  return (
    (startTime >= e.start_time && startTime < e.end_time) ||
    (endTime > e.start_time && endTime <= e.end_time) ||
    (startTime <= e.start_time && endTime >= e.end_time)
  );
});

if (conflictingEvents.length > 0) {
  conflicts.push({
    resourceId,
    conflictingEvents
  });
}
}

return conflicts; };

const checkResourceBookingConflicts = async (resourceId, date, startTime, endTime, excludeBookingId = null) => { const bookings = await Booking.findByResourceAndDate(resourceId, date, excludeBookingId);

const conflicts = bookings.filter(booking => { return ( (startTime >= booking.start_time && startTime < booking.end_time) || (endTime > booking.start_time && endTime <= booking.end_time) || (startTime <= booking.start_time && endTime >= booking.end_time) ); });

return conflicts; };

module.exports = { checkResourceConflicts, checkResourceBookingConflicts };