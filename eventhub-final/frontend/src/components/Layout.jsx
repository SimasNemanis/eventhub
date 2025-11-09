import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
                EventHub
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Dashboard
                </Link>
                <Link to="/events" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Events
                </Link>
                <Link to="/resources" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Resources
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <span className="text-gray-700 mr-4">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
