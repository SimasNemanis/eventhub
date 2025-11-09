const bcrypt = require('bcryptjs'); const { generateToken } = require('../config/jwt'); const User = require('../models/User');

exports.register = async (req, res, next) => { try { const { email, password, full_name } = req.body;

const existingUser = await User.findByEmail(email);
if (existingUser) {
  return res.status(400).json({ error: 'Email already registered' });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  email,
  password: hashedPassword,
  full_name,
  role: 'user'
});

const token = generateToken(user.id, user.email, user.role);

res.status(201).json({
  success: true,
  token,
  user: {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role
  }
});
} catch (error) { next(error); } };

exports.login = async (req, res, next) => { try { const { email, password } = req.body;

const user = await User.findByEmail(email);
if (!user) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

const isValidPassword = await bcrypt.compare(password, user.password);
if (!isValidPassword) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

const token = generateToken(user.id, user.email, user.role);

res.json({
  success: true,
  token,
  user: {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role
  }
});
} catch (error) { next(error); } };

exports.getMe = async (req, res, next) => { try { const user = await User.findById(req.user.id);

res.json({
  success: true,
  user: {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    phone: user.phone,
    department: user.department,
    bio: user.bio,
    avatar_url: user.avatar_url,
    notification_preferences: user.notification_preferences,
    theme_preference: user.theme_preference,
    created_date: user.created_date
  }
});
} catch (error) { next(error); } };

exports.updateMe = async (req, res, next) => { try { const allowedUpdates = [ 'full_name', 'phone', 'department', 'bio', 'avatar_url', 'notification_preferences', 'theme_preference' ];

const updates = {};
Object.keys(req.body).forEach(key => {
  if (allowedUpdates.includes(key)) {
    updates[key] = req.body[key];
  }
});

const user = await User.update(req.user.id, updates);

res.json({
  success: true,
  user
});
} catch (error) { next(error); } };

exports.logout = async (req, res) => { res.json({ success: true, message: 'Logged out successfully' }); };