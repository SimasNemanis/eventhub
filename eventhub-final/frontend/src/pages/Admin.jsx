import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus } from 'lucide-react';
import api from '../api/client';

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, resourcesData, usersData] = await Promise.all([
        api.entities.Event.list(),
        api.entities.Resource.list(),
        api.entities.User.list()
      ]);
      
      // Handle response - check if data is wrapped or direct
      setEvents(eventsData.data || eventsData || []);
      setResources(resourcesData.data || resourcesData || []);
      setUsers(usersData.data || usersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.entities.Event.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.entities.Resource.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <Link
                to="/admin/events/create"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
            </div>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border p-4 rounded flex justify-between items-center hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-gray-600">
                        {event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {event.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        to={`/admin/events/edit/${event.id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No events found</p>
                <Link
                  to="/admin/events/create"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Event
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Resources</h2>
              <Link
                to="/admin/resources/create"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                Create Resource
              </Link>
            </div>
            {resources.length > 0 ? (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="border p-4 rounded flex justify-between items-center hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{resource.name}</h3>
                      <p className="text-gray-600">Type: {resource.type}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Capacity: {resource.capacity} | 
                        Status: {resource.available ? '✓ Available' : '✗ Unavailable'}
                      </p>
                      {resource.location && (
                        <p className="text-sm text-gray-500">Location: {resource.location}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        to={`/admin/resources/edit/${resource.id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No resources found</p>
                <Link
                  to="/admin/resources/create"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Resource
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
            {users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border p-4 rounded hover:bg-gray-50 transition">
                    <h3 className="font-bold text-lg">{user.full_name || user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {user.id.slice(0, 8)}...
                      </span>
                      {user.created_date && (
                        <span className="text-sm text-gray-500">
                          Joined: {new Date(user.created_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No users found</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
