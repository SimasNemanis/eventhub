import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to EventHub
          </h1>
          <p className="text-2xl mb-8 text-blue-100">
            Manage events and resources effortlessly
          </p>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            The all-in-one platform for event registration and resource booking. 
            Schedule smarter, collaborate better, and never worry about conflicts.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              Login
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16">
            <div>
              <p className="text-4xl font-bold">500+</p>
              <p className="text-blue-100">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold">10K+</p>
              <p className="text-blue-100">Events Managed</p>
            </div>
            <div>
              <p className="text-4xl font-bold">99.9%</p>
              <p className="text-blue-100">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need in One Platform
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Event Management</h3>
              <p className="text-gray-600">
                Browse, register, and manage all your event participation in one place
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Resource Booking</h3>
              <p className="text-gray-600">
                Book rooms, equipment, and facilities with real-time availability
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Conflict Prevention</h3>
              <p className="text-gray-600">
                Smart scheduling system prevents double-bookings automatically
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Updates</h3>
              <p className="text-gray-600">
                Get real-time notifications about your bookings and events
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Why Choose EventHub?</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p>Streamlined event registration process</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p>Real-time resource availability tracking</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p>Automatic conflict detection</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p>Comprehensive management dashboard</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p>Mobile-responsive design</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p>Secure and reliable platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users managing their events efficiently
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
