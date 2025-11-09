const express = require('express'); const { body } = require('express-validator'); const eventController = require('../controllers/eventController'); const { authenticate, authorize } = require('../middleware/auth'); const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', eventController.getAll);

router.get('/:id', eventController.getById);

router.post('/', authenticate, authorize('admin'), [ body('title').trim().notEmpty(), body('date').isISO8601(), body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), body('capacity').isInt({ min: 1 }) ], validate, eventController.create );

router.put('/:id', authenticate, authorize('admin'), eventController.update );

router.delete('/:id', authenticate, authorize('admin'), eventController.delete );

module.exports = router;