const express = require('express'); const userController = require('../controllers/userController'); const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), userController.getAll );

router.get('/:id', authenticate, userController.getById );

router.put('/:id', authenticate, userController.update );

router.delete('/:id', authenticate, authorize('admin'), userController.delete );

module.exports = router;