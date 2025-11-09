import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Resources from './pages/Resources';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import CalendarView from './pages/CalendarView';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';

// NEW IMPORTS - Add these for CRUD functionality
import CreateEvent from './pages/CreateEvent';
import CreateResource from './pages/CreateResource';
import EditEvent from './pages/EditEvent';
import EditResource from './pages/EditResource';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Layout>
                  <Events />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Layout>
                  <Resources />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBookings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Layout>
                  <CalendarView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* NEW ADMIN CRUD ROUTES - Add these */}
          
          {/* Event CRUD */}
          <Route
            path="/admin/events/create"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <CreateEvent />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <EditEvent />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Resource CRUD */}
          <Route
            path="/admin/resources/create"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <CreateResource />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resources/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <EditResource />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
