import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Package, LayoutDashboard, BookMarked, User, CalendarDays, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', to: '/events', icon: Calendar },
    { name: 'Resources', to: '/resources', icon: Package },
    { name: 'Calendar', to: '/calendar', icon: CalendarDays },
    { name: 'My Bookings', to: '/my-bookings', icon: BookMarked },
  ];

  const userNavigation = [
    { name: 'Profile', to: '/profile', icon: User },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin', to: '/admin', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Main Navigation */}
            <div className="flex">
              <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700">
                <Calendar className="w-8 h-8 mr-2" />
                EventHub
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center space-x-2">
                    <Link
                      to="/profile"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user.full_name || user.name || 'Profile'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </Link>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
