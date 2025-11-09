const express = require('express'); const { body } = require('express-validator'); const authController = require('../controllers/authController'); const { authenticate } = require('../middleware/auth'); const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', [ body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 }), body('full_name').trim().notEmpty() ], validate, authController.register );

router.post('/login', [ body('email').isEmail().normalizeEmail(), body('password').notEmpty() ], validate, authController.login );

router.get('/me', authenticate, authController.getMe);

router.put('/me', authenticate, authController.updateMe);

router.post('/logout', authenticate, authController.logout);

module.exports = router;