import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BookingDialog({ resource, onClose, onConfirm, existingBookings }) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    start_time: "09:00",
    end_time: "10:00",
    purpose: "",
    notes: ""
  });
  const [conflict, setConflict] = useState(null);

  const checkConflict = (date, startTime, endTime) => {
    const conflicts = existingBookings.filter(booking => {
      if (booking.date !== date) return false;
      
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });
    
    return conflicts.length > 0 ? conflicts[0] : null;
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (field === 'date' || field === 'start_time' || field === 'end_time') {
      const conflictFound = checkConflict(newData.date, newData.start_time, newData.end_time);
      setConflict(conflictFound);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conflict) {
      onConfirm(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full elevation-5 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Resource</h2>
            <p className="text-sm text-gray-600 mt-1">{resource.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              min={today}
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-sm font-medium text-gray-700 mb-2 block">
                Start Time
              </Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time" className="text-sm font-medium text-gray-700 mb-2 block">
                End Time
 
 {
  "name": "Event",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Event title"
    },
    "description": {
      "type": "string",
      "description": "Event description"
    },
    "category": {
      "type": "string",
      "enum": [
        "workshop",
        "seminar",
        "conference",
        "training",
        "meeting",
        "social",
        "other"
      ],
      "description": "Event category"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Event date"
    },
    "start_time": {
      "type": "string",
      "description": "Start time (HH:MM format)"
    },
    "end_time": {
      "type": "string",
      "description": "End time (HH:MM format)"
    },
    "location": {
      "type": "string",
      "description": "Event location"
    },
    "capacity": {
      "type": "number",
      "description": "Maximum number of attendees"
    },
    "registered_count": {
      "type": "number",
      "default": 0,
      "description": "Current number of registered attendees"
    },
    "image_url": {
      "type": "string",
      "description": "Event cover image"
    },
    "status": {
      "type": "string",
      "enum": [
        "upcoming",
        "ongoing",
        "completed",
        "cancelled"
      ],
      "default": "upcoming"
    },
    "is_recurring": {
      "type": "boolean",
      "default": false,
      "description": "Whether this is a recurring event"
    },
    "recurrence_pattern": {
      "type": "string",
      "enum": [
        "daily",
        "weekly",
        "biweekly",
        "monthly"
      ],
      "description": "How often the event repeats"
    },
    "recurrence_end_date": {
      "type": "string",
      "format": "date",
      "description": "When to stop creating recurring events"
    },
    "series_id": {
      "type": "string",
      "description": "Groups recurring events together"
    },
    "assigned_resource_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [],
      "description": "IDs of resources assigned to this event"
    }
  },
  "required": [
    "title",
    "date",
    "start_time",
    "end_time",
    "capacity"
 
 {
  "name": "Resource",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Resource name"
    },
    "type": {
      "type": "string",
      "enum": [
        "room",
        "equipment",
        "vehicle",
        "facility",
        "technology",
        "other"
      ],
      "description": "Resource type"
    },
    "description": {
      "type": "string",
      "description": "Resource description"
    },
    "capacity": {
      "type": "number",
      "description": "Resource capacity (if applicable)"
    },
    "location": {
      "type": "string",
      "description": "Resource location"
    },
    "image_url": {
      "type": "string",
      "description": "Resource image"
    },
    "features": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Resource features and amenities"
    },
    "available": {
      "type": "boolean",
      "default": true,
      "description": "Current availability status"
    }
  },
  "required": [
    "name",
    "type"
  ]
}
{
  "name": "Booking",
  "type": "object",
  "properties": {
    "booking_type": {
      "type": "string",
      "enum": [
        "event",
        "resource"
      ],
      "description": "Type of booking"
    },
    "event_id": {
      "type": "string",
      "description": "Related event ID (for event bookings)"
    },
    "resource_id": {
      "type": "string",
      "description": "Related resource ID (for resource bookings)"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Booking date"
    },
    "start_time": {
      "type": "string",
      "description": "Start time (HH:MM format)"
    },
    "end_time": {
      "type": "string",
      "description": "End time (HH:MM format)"
    },
    "purpose": {
      "type": "string",
      "description": "Purpose of resource booking"
    },
    "status": {
      "type": "string",
      "enum": [
        "confirmed",
        "pending",
        "cancelled"
      ],
      "default": "confirmed"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes"
    }
  },
  "required": [
    "booking_type",
 
 {
  "name": "Rating",
  "type": "object",
  "properties": {
    "rating_type": {
      "type": "string",
      "enum": [
        "event",
        "resource"
      ],
      "description": "Type of rating"
    },
    "event_id": {
      "type": "string",
      "description": "Related event ID"
    },
    "resource_id": {
      "type": "string",
      "description": "Related resource ID"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Rating from 1 to 5 stars"
    },
    "review": {
      "type": "string",
      "description": "Written review"
    }
  },
  "required": [
    "rating_type",
    "rating"
  ]
}
{
  "name": "WaitingList",
  "type": "object",
  "properties": {
    "event_id": {
      "type": "string",
      "description": "Event ID"
    },
    "user_email": {
      "type": "string",
      "description": "User email"
    },
    "position": {
      "type": "number",
      "description": "Position in waiting list"
    },
    "status": {
      "type": "string",
      "enum": [
        "waiting",
        "notified",
        "converted"
      ],
      "default": "waiting",
      "description": "Waiting list status"
    },
    "notified_date": {
      "type": "string",
      "format": "date-time",
      "description": "When user was notified of available spot"
    }
  },
  "required": [
    "event_id",
    "user_email"
 
 