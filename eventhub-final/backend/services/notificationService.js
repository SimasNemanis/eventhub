const { sendEmail } = require('../config/email');

const sendBookingConfirmation = async (user, booking) => { const subject = 'Booking Confirmation - EventHub'; const html = <h2>Booking Confirmed!</h2> <p>Hello ${user.full_name},</p> <p>Your booking has been confirmed.</p> <p><strong>Date:</strong> ${booking.date}</p> <p><strong>Time:</strong> ${booking.start_time} - ${booking.end_time}</p> <p>Thank you for using EventHub!</p> ;

await sendEmail(user.email, subject, html); };

const sendWaitingListNotification = async (user, event) => { const subject = 'Spot Available - EventHub'; const html = <h2>A Spot is Now Available!</h2> <p>Hello ${user.full_name},</p> <p>Great news! A spot has opened up for "${event.title}".</p> <p><strong>Date:</strong> ${event.date}</p> <p><strong>Time:</strong> ${event.start_time} - ${event.end_time}</p> <p>Register now before it's gone!</p> ;

await sendEmail(user.email, subject, html); };

const sendEventReminder = async (user, event) => { const subject = Reminder: ${event.title} - EventHub; const html = <h2>Event Reminder</h2> <p>Hello ${user.full_name},</p> <p>This is a reminder for your upcoming event:</p> <p><strong>${event.title}</strong></p> <p><strong>Date:</strong> ${event.date}</p> <p><strong>Time:</strong> ${event.start_time} - ${event.end_time}</p> <p><strong>Location:</strong> ${event.location || 'TBD'}</p> <p>See you there!</p> ;

await sendEmail(user.email, subject, html); };

module.exports = { sendBookingConfirmation, sendWaitingListNotification, sendEventReminder };