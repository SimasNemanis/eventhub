// COMPLETE App.jsx with ALL CRUD routes + Resource Booking + AuthProvider
// Replace your existing App.jsx with this

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Public/User pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Resources from './pages/Resources';
import CalendarView from './pages/CalendarView';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import BookResource from './pages/BookResource';

// Admin pages
import Admin from './pages/Admin';
import CreateEvent from './pages/CreateEvent';
import CreateResource from './pages/CreateResource';
import EditEvent from './pages/EditEvent';
import EditResource from './pages/EditResource';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with Layout */}
          <Route element={<Layout />}>
            {/* User routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Resource Booking */}
            <Route path="/resources/:id/book" element={<BookResource />} />
            
            {/* Admin routes - COMPLETE CRUD */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Event CRUD */}
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<EditEvent />} />
            
            {/* Resource CRUD */}
            <Route path="/admin/resources/create" element={<CreateResource />} />
            <Route path="/admin/resources/edit/:id" element={<EditResource />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
