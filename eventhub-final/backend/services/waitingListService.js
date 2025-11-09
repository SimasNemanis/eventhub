const WaitingList = require('../models/WaitingList'); const notificationService = require('./notificationService');

const addToWaitingList = async (eventId, user) => { const existingEntries = await WaitingList.findAll({ event_id: eventId }); const position = existingEntries.length + 1;

const entry = await WaitingList.create({ event_id: eventId, user_id: user.id, user_email: user.email, position, status: 'waiting' });

return entry; };

const notifyNextInLine = async (eventId, event) => { const waitlist = await WaitingList.findAll( { event_id: eventId, status: 'waiting' }, 'position' );

if (waitlist.length > 0) { const nextEntry = waitlist[0];

await WaitingList.update(nextEntry.id, {
  status: 'notified',
  notified_date: new Date().toISOString()
});

await notificationService.sendWaitingListNotification(
  { email: nextEntry.user_email },
  event
);
} };

module.exports = { addToWaitingList, notifyNextInLine };