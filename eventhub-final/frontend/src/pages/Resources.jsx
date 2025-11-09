import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Users, Package } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const resourcesData = await api.entities.Resource.list();
      const resourcesList = Array.isArray(resourcesData) 
        ? resourcesData 
        : (resourcesData.data || resourcesData.resources || []);
      
      console.log('Loaded resources:', resourcesList);
      setResources(resourcesList);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && resource.available !== false) ||
                               (availabilityFilter === 'unavailable' && resource.available === false);
    
    return matchesSearch && matchesType && matchesAvailability;
  });

  // Get unique resource types from the data
  const resourceTypes = ['all', ...new Set(resources.map(r => r.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-gray-600">Browse and book available resources</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Resource Type
              </label>
              <div className="flex gap-2 overflow-x-auto">
                {resourceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      typeFilter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="flex gap-2">
                {['all', 'available', 'unavailable'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setAvailabilityFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      availabilityFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Resource Image */}
                {resource.image_url && (
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={resource.image_url} 
                      alt={resource.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{resource.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      resource.available !== false
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resource.available !== false ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Type Badge */}
                  {resource.type && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                      {resource.type}
                    </span>
                  )}

                  {/* Description */}
                  {resource.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {resource.capacity && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Capacity:</span>
                        <span className="ml-1">{resource.capacity} people</span>
                      </div>
                    )}
                    
                    {resource.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Location:</span>
                        <span className="ml-1">{resource.location}</span>
                      </div>
                    )}

                    {resource.features && resource.features.length > 0 && (
                      <div className="flex items-start">
                        <Package className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <span className="font-medium">Features:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {resource.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                {feature}
                              </span>
                            ))}
                            {resource.features.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                +{resource.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {user ? (
                    <Link
                      to={`/resources/${resource.id}/book`}
                      className={`block w-full py-2 px-4 rounded-lg font-medium text-center transition ${
                        resource.available === false
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {resource.available === false ? 'Not Available' : 'Book Resource'}
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full py-2 px-4 rounded-lg font-medium text-center bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Login to Book
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
