const express = require('express'); const { body } = require('express-validator'); const waitingListController = require('../controllers/waitingListController'); const { authenticate } = require('../middleware/auth'); const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticate, waitingListController.getAll);

router.get('/my-waitlist', authenticate, waitingListController.getMyWaitlist);

router.post('/', authenticate, [ body('event_id').notEmpty() ], validate, waitingListController.create );

router.delete('/:id', authenticate, waitingListController.delete );

module.exports = router;