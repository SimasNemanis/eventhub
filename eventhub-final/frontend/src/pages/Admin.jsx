import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
      const [eventsRes, resourcesRes, usersRes] = await Promise.all([
        api.get('/events'),
        api.get('/resources'),
        api.get('/users')
      ]);
      setEvents(eventsRes.data.data);
      setResources(resourcesRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        loadData();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/resources/${id}`);
        loadData();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
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
            <h2 className="text-2xl font-bold mb-4">Manage Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-gray-600">{event.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Resources</h2>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{resource.name}</h3>
                    <p className="text-gray-600">{resource.type}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border p-4 rounded">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
