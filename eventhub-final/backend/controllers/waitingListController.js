const WaitingList = require('../models/WaitingList'); const waitingListService = require('../services/waitingListService');

exports.getAll = async (req, res, next) => { try { const { event_id, status, sort = 'position' } = req.query;

const filters = {};
if (event_id) filters.event_id = event_id;
if (status) filters.status = status;

const waitlist = await WaitingList.findAll(filters, sort);

res.json({
  success: true,
  count: waitlist.length,
  data: waitlist
});
} catch (error) { next(error); } };

exports.getMyWaitlist = async (req, res, next) => { try { const waitlist = await WaitingList.findByUserId(req.user.id);

res.json({
  success: true,
  count: waitlist.length,
  data: waitlist
});
} catch (error) { next(error); } };

exports.create = async (req, res, next) => { try { const { event_id } = req.body;

const existing = await WaitingList.findByEventAndUser(event_id, req.user.id);

if (existing) {
  return res.status(400).json({ error: 'Already on waiting list' });
}

const entry = await waitingListService.addToWaitingList(event_id, req.user);

res.status(201).json({
  success: true,
  data: entry
});
} catch (error) { next(error); } };

exports.delete = async (req, res, next) => { try { const entry = await WaitingList.findById(req.params.id);

if (!entry) {
  return res.status(404).json({ error: 'Waiting list entry not found' });
}

if (entry.user_id !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

await WaitingList.delete(req.params.id);

res.json({
  success: true,
  message: 'Removed from waiting list'
});
} catch (error) { next(error); } };