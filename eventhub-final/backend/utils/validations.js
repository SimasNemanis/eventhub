const { body, param, query } = require('express-validator');

const eventValidation = { create: [ body('title').trim().notEmpty().withMessage('Title is required'), body('date').isISO8601().withMessage('Valid date is required'), body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required'), body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required'), body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'), body('category').isIn(['workshop', 'seminar', 'conference', 'training', 'meeting', 'social', 'other']) ] };

const bookingValidation = { create: [ body('booking_type').isIn(['event', 'resource']).withMessage('Invalid booking type'), body('date').isISO8601().withMessage('Valid date is required'), body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required'), body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required') ] };

const resourceValidation = { create: [ body('name').trim().notEmpty().withMessage('Name is required'), body('type').isIn(['room', 'equipment', 'vehicle', 'facility', 'technology', 'other']) ] };

module.exports = { eventValidation, bookingValidation, resourceValidation };