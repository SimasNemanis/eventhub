/**
 * Create page URL from page name
 * Converts page names to URL paths
 */
export const createPageUrl = (pageName) => {
  const routes = {
    'Dashboard': '/',
    'Events': '/events',
    'Resources': '/resources',
    'MyBookings': '/my-bookings',
    'Landing': '/',
    'Profile': '/profile',
    'CalendarView': '/calendar',
    'Calendar': '/calendar',
    'Analytics': '/analytics',
    'Admin': '/admin',
  };

  return routes[pageName] || '/';
};

/**
 * Get page name from current path
 */
export const getPageName = (pathname) => {
  const pathToName = {
    '/': 'Dashboard',
    '/events': 'Events',
    '/resources': 'Resources',
    '/my-bookings': 'My Bookings',
    '/profile': 'Profile',
    '/calendar': 'Calendar',
    '/analytics': 'Analytics',
    '/admin': 'Admin',
  };

  return pathToName[pathname] || 'EventHub';
};
