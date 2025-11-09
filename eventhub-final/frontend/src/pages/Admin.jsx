import React, { useState } from "react";
import { api } from "../api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { addDays, addWeeks, addMonths } from "date-fns";
import EventForm from "../components/admin/EventForm";
import ResourceForm from "../components/admin/ResourceForm";
import EventList from "../components/admin/EventList";
import ResourceList from "../components/admin/ResourceList";

export default function Admin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("events");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.entities.Event.list('-created_date'),
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.entities.Resource.list('-created_date'),
  });

  const generateRecurringEvents = (baseEvent) => {
    const events = [];
    const startDate = new Date(baseEvent.date);
    const endDate = new Date(baseEvent.recurrence_end_date);
    const seriesId = `series_${Date.now()}`;
    
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      const eventData = {
        ...baseEvent,
        date: currentDate.toISOString().split('T')[0],
        series_id: seriesId,
        registered_count: 0
      };
      
      delete eventData.recurrence_end_date;
      events.push(eventData);
      
      switch (baseEvent.recurrence_pattern) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'biweekly':
          currentDate = addWeeks(currentDate, 2);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
    }
    
    return events;
  };

  const createEventMutation = useMutation({
    mutationFn: async (data) => {
      if (data.is_recurring) {
        const recurringEvents = generateRecurringEvents(data);
        await api.entities.Event.bulkCreate(recurringEvents);
      } else {
        await api.entities.Event.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setShowEventForm(false);
      setEditingEvent(null);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Event.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setShowEventForm(false);
      setEditingEvent(null);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id) => api.entities.Event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });

  const createResourceMutation = useMutation({
    mutationFn: (data) => api.entities.Resource.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      setShowResourceForm(false);
      setEditingResource(null);
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Resource.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      setShowResourceForm(false);
      setEditingResource(null);
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (id) => api.entities.Resource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
    },
  });

  const handleEventSubmit = (data) => {
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleResourceSubmit = (data) => {
    if (editingResource) {
      updateResourceMutation.mutate({ id: editingResource.id, data });
    } else {
      createResourceMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage events and resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white dark:bg-gray-800">
            <TabsTrigger value="events" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-700">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-700">
              <Package className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="bg-white dark:bg-gray-800 rounded-lg elevation-1 p-6 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Events</h2>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setShowEventForm(true);
                  }}
                  className="px-6 py-3 rounded-lg text-white font-medium ripple material-button flex items-center gap-2"
                  style={{ backgroundColor: 'var(--md-primary)' }}
 
 