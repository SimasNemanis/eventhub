const Resource = require('../models/Resource');

exports.getAll = async (req, res, next) => { try { const { type, available, sort = 'name' } = req.query;

const filters = {};
if (type) filters.type = type;
if (available !== undefined) filters.available = available === 'true';

const resources = await Resource.findAll(filters, sort);

res.json({
  success: true,
  count: resources.length,
  data: resources
});
} catch (error) { next(error); } };

exports.getById = async (req, res, next) => { try { const resource = await Resource.findById(req.params.id);

if (!resource) {
  return res.status(404).json({ error: 'Resource not found' });
}

res.json({
  success: true,
  data: resource
});
} catch (error) { next(error); } };

exports.create = async (req, res, next) => { try { const resource = await Resource.create(req.body);

res.status(201).json({
  success: true,
  data: resource
});
} catch (error) { next(error); } };

exports.update = async (req, res, next) => { try { const resource = await Resource.findById(req.params.id);

if (!resource) {
  return res.status(404).json({ error: 'Resource not found' });
}

const updatedResource = await Resource.update(req.params.id, req.body);

res.json({
  success: true,
  data: updatedResource
});
} catch (error) { next(error); } };

exports.delete = async (req, res, next) => { try { const resource = await Resource.findById(req.params.id);

if (!resource) {
  return res.status(404).json({ error: 'Resource not found' });
}

await Resource.delete(req.params.id);

res.json({
  success: true,
  message: 'Resource deleted successfully'
});
} catch (error) { next(error); } };