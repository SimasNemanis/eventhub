const express = require('express'); const { body } = require('express-validator'); const bookingController = require('../controllers/bookingController'); const { authenticate } = require('../middleware/auth'); const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, bookingController.getAll);

router.get('/my-bookings', authenticate, bookingController.getMyBookings);

router.get('/:id', authenticate, bookingController.getById);

router.post('/', authenticate, [ body('booking_type').isIn(['event', 'resource']), body('date').isISO8601(), body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) ], validate, bookingController.create );

router.put('/:id', authenticate, bookingController.update );

router.delete('/:id', authenticate, bookingController.delete );

module.exports = router;