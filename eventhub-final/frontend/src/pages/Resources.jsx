import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await api.get('/resources');
      setResources(response.data.data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.type === filter);

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('room')}
          className={`px-4 py-2 rounded ${filter === 'room' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Rooms
        </button>
        <button
          onClick={() => setFilter('equipment')}
          className={`px-4 py-2 rounded ${filter === 'equipment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Equipment
        </button>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{resource.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                resource.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {resource.available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Type:</span> {resource.type}</p>
              <p><span className="font-medium">Capacity:</span> {resource.capacity}</p>
              {resource.location && (
                <p><span className="font-medium">Location:</span> {resource.location}</p>
              )}
            </div>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={!resource.available}
            >
              {resource.available ? 'Book Resource' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No resources found.
        </div>
      )}
    </div>
  );
}
