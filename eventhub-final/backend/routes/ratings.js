const express = require('express'); const { body } = require('express-validator'); const ratingController = require('../controllers/ratingController'); const { authenticate } = require('../middleware/auth'); const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', ratingController.getAll);

router.get('/:id', ratingController.getById);

router.post('/', authenticate, [ body('rating_type').isIn(['event', 'resource']), body('rating').isInt({ min: 1, max: 5 }) ], validate, ratingController.create );

router.put('/:id', authenticate, ratingController.update );

router.delete('/:id', authenticate, ratingController.delete );

module.exports = router;