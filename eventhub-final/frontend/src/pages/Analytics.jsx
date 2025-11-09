import React, { useState } from "react";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Calendar, Package, BarChart3, Download } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.entities.Event.list(),
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.entities.Resource.list(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['allBookings'],
    queryFn: () => api.entities.Booking.list(),
  });

  const { data: ratings = [] } = useQuery({
    queryKey: ['ratings'],
    queryFn: () => api.entities.Rating.list(),
  });

  // Event Stats
  const eventsByCategory = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(eventsByCategory).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  }));

  // Resource Utilization
  const resourcesByType = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1;
    return acc;
  }, {});

  const resourceTypeData = Object.entries(resourcesByType).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  }));

  // Resource Assignment Stats - with safe array handling
  const resourceUsageMap = {};
  resources.forEach(resource => {
    const assignedEvents = events.filter(e => {
      const resourceIds = e.assigned_resource_ids || [];
      return Array.isArray(resourceIds) && resourceIds.includes(resource.id);
    });
    resourceUsageMap[resource.id] = {
      name: resource.name,
      type: resource.type,
      totalAssignments: assignedEvents.length
    };
  });

  const topUsedResources = Object.values(resourceUsageMap)
    .filter(r => r.totalAssignments > 0)
    .sort((a, b) => b.totalAssignments - a.totalAssignments)
    .slice(0, 5)
    .map(r => ({
      name: r.name,
      assignments: r.totalAssignments
    }));

  // Booking Trends (last 6 months)
  const bookingsByMonth = bookings.reduce((acc, booking) => {
    const month = new Date(booking.date).toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.entries(bookingsByMonth).map(([month, count]) => ({
    month,
    bookings: count
  })).slice(-6);

  // Rating Stats
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      change: "+12%",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Total Resources",
      value: resources.length,
      change: "+8%",
      icon: Package,
      color: "bg-green-500"
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      change: "+23%",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Avg Rating",
      value: averageRating,
      change: "+0.3",
      icon: BarChart3,
      color: "bg-orange-500"
    }
  ];

  const COLORS = ['#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb'];

  const exportReport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      summary: {
        totalEvents: events.length,
        totalResources: resources.length,
        totalBookings: bookings.length,
        averageRating: averageRating
      },
      eventsByCategory,
      resourcesByType,
      bookingTrends: bookingsByMonth,
      resourceUsage: resourceUsageMap
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Insights and statistics about your platform</p>
          </div>
          <button
            onClick={exportReport}
            className="px-6 py-3 rounded-lg text-white font-medium ripple material-button flex items-center gap-2"
            style={{ backgroundColor: 'var(--md-primary)' }}
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 elevation-1 hover-elevation-2 transition-all">
 
 import React, { useState } from "react";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, Package } from "lucide-react";
