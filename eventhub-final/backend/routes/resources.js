const express = require('express'); const { body } = require('express-validator'); const resourceController = require('../controllers/resourceController'); const { authenticate, authorize } = require('../middleware/auth'); const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', resourceController.getAll);

router.get('/:id', resourceController.getById);

router.post('/', authenticate, authorize('admin'), [ body('name').trim().notEmpty(), body('type').isIn(['room', 'equipment', 'vehicle', 'facility', 'technology', 'other']) ], validate, resourceController.create );

router.put('/:id', authenticate, authorize('admin'), resourceController.update );

router.delete('/:id', authenticate, authorize('admin'), resourceController.delete );

module.exports = router;