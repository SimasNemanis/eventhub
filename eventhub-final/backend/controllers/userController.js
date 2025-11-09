const User = require('../models/User');

exports.getAll = async (req, res, next) => { try { const { role, sort = 'full_name' } = req.query;

const filters = {};
if (role) filters.role = role;

const users = await User.findAll(filters, sort);

const sanitizedUsers = users.map(user => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  role: user.role,
  phone: user.phone,
  department: user.department,
  created_date: user.created_date
}));

res.json({
  success: true,
  count: sanitizedUsers.length,
  data: sanitizedUsers
});
} catch (error) { next(error); } };

exports.getById = async (req, res, next) => { try { const user = await User.findById(req.params.id);

if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

if (req.params.id !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

const sanitizedUser = {
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  role: user.role,
  phone: user.phone,
  department: user.department,
  bio: user.bio,
  avatar_url: user.avatar_url,
  created_date: user.created_date
};

res.json({
  success: true,
  data: sanitizedUser
});
} catch (error) { next(error); } };

exports.update = async (req, res, next) => { try { const user = await User.findById(req.params.id);

if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

if (req.params.id !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Access denied' });
}

const allowedUpdates = ['full_name', 'phone', 'department', 'bio', 'avatar_url'];

if (req.user.role === 'admin') {
  allowedUpdates.push('role');
}

const updates = {};
Object.keys(req.body).forEach(key => {
  if (allowedUpdates.includes(key)) {
    updates[key] = req.body[key];
  }
});

const updatedUser = await User.update(req.params.id, updates);

res.json({
  success: true,
  data: updatedUser
});
} catch (error) { next(error); } };

exports.delete = async (req, res, next) => { try { const user = await User.findById(req.params.id);

if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

await User.delete(req.params.id);

res.json({
  success: true,
  message: 'User deleted successfully'
});
} catch (error) { next(error); } };