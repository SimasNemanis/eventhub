const express = require('express'); const cors = require('cors'); const dotenv = require('dotenv'); const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth'); const eventRoutes = require('./routes/events'); const resourceRoutes = require('./routes/resources'); const bookingRoutes = require('./routes/bookings'); const ratingRoutes = require('./routes/ratings'); const waitingListRoutes = require('./routes/waitingList'); const userRoutes = require('./routes/users');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true })); app.use(express.json()); app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes); app.use('/api/events', eventRoutes); app.use('/api/resources', resourceRoutes); app.use('/api/bookings', bookingRoutes); app.use('/api/ratings', ratingRoutes); app.use('/api/waiting-list', waitingListRoutes); app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => { res.json({ status: 'OK', message: 'EventHub API is running', timestamp: new Date().toISOString() }); });

app.get('/', (req, res) => { res.json({ message: 'EventHub API', version: '1.0.0', endpoints: [ '/api/auth', '/api/events', '/api/resources', '/api/bookings', '/api/ratings', '/api/waiting-list', '/api/users' ] }); });

app.use(errorHandler);

app.use((req, res) => { res.status(404).json({ success: false, error: 'Route not found' }); });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(🚀 EventHub API server running on port ${PORT}); console.log(📝 Environment: ${process.env.NODE_ENV || 'development'}); console.log(🔗 Health check: http://localhost:${PORT}/api/health); });

process.on('unhandledRejection', (err) => { console.error('❌ Unhandled Promise Rejection:', err); process.exit(1); });