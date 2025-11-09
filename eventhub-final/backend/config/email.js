const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({ host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });

const sendEmail = async (to, subject, html) => { try { await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html }); console.log(📧 Email sent to ${to}); } catch (error) { console.error('❌ Email error:', error); throw error; } };

module.exports = { sendEmail };