const Rating = require('../models/Rating');

exports.getAll = async (req, res, next) => { try { const { rating_type, event_id, resource_id, sort = '-created_date' } = req.query;

const filters = {};
if (rating_type) filters.rating_type = rating_type;
if (event_id) filters.event_id = event_id;
if (resource_id) filters.resource_id = resource_id;

const ratings = await Rating.findAll(filters, sort);

res.json({
  success: true,
  count: ratings.length,
  data: ratings
});
} catch (error) { next(error); } };

exports.getById = async (req, res, next) => { try { const rating = await Rating.findById(req.params.id);

if (!rating) {
  return res.status(404).json({ error: 'Rating not found' });
}

res.json({
  success: true,
  data: rating
});
} catch (error) { next(error); } };

exports.create = async (req, res, next) => { try { const ratingData = { ...req.body, created_by: req.user.id };

const rating = await Rating.create(ratingData);

res.status(201).json({
  success: true,
  data: rating
});
} catch (error) { next(error); } };

exports.update = async (req, res, next) => { try { const rating = await Rating.findById(req.params.id);

if (!rating) {
  return res.status(404).json({ error: 'Rating not found' });
}

if (rating.created_by !== req.user.id) {
  return res.status(403).json({ error: 'Access denied' });
}

const updatedRating = await Rating.update(req.params.id, req.body);

res.json({
  success: true,
  data: updatedRating
});
} catch (error) { next(error); } };

exports.delete = async (req, res, next) => { try { const rating = await Rating.findById(req.params.id);

if (!rating) {
  return res.status(404).json({ error: 'Rating not found' });
}

if (rating.created_by !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

await Rating.delete(req.params.id);

res.json({
  success: true,
  message: 'Rating deleted successfully'
});
} catch (error) { next(error); } };