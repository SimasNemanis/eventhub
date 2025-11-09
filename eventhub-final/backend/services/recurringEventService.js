const { addDays, addWeeks, addMonths } = require('date-fns'); const { v4: uuidv4 } = require('uuid'); const Event = require('../models/Event');

const createRecurringEvents = async (baseEventData) => { const events = []; const startDate = new Date(baseEventData.date); const endDate = new Date(baseEventData.recurrence_end_date); const seriesId = series_${uuidv4()};

let currentDate = startDate;

while (currentDate <= endDate) { const eventData = { ...baseEventData, date: currentDate.toISOString().split('T')[0], series_id: seriesId, registered_count: 0 };

delete eventData.is_recurring;
delete eventData.recurrence_end_date;

const event = await Event.create(eventData);
events.push(event);

switch (baseEventData.recurrence_pattern) {
  case 'daily':
    currentDate = addDays(currentDate, 1);
    break;
  case 'weekly':
    currentDate = addWeeks(currentDate, 1);
    break;
  case 'biweekly':
    currentDate = addWeeks(currentDate, 2);
    break;
  case 'monthly':
    currentDate = addMonths(currentDate, 1);
    break;
  default:
    currentDate = endDate;
}
}

return events; };

module.exports = { createRecurringEvents };