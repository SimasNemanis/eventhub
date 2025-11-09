import React from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';

export default function ResourceList({ resources, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  resource.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {resource.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <span className="font-medium">{resource.type}</span>
                <span>Capacity: {resource.capacity}</span>
                {resource.location && (
                  <span className="text-gray-500">{resource.location}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(resource)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit resource"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(resource.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete resource"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {resources.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No resources found</p>
        </div>
      )}
    </div>
  );
}
