import { api } from "@/api/client";
import { Calendar, Package, Shield, Zap, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    api.auth.redirectToLogin(window.location.pathname);
  };

  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description: "Browse, register, and manage all your event participation in one place",
      color: "bg-blue-500"
    },
    {
      icon: Package,
      title: "Resource Booking",
      description: "Book rooms, equipment, and facilities with real-time availability",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "Conflict Prevention",
      description: "Smart scheduling system prevents double-bookings automatically",
      color: "bg-purple-500"
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description: "Get real-time notifications about your bookings and events",
      color: "bg-orange-500"
    }
  ];

  const benefits = [
    "Streamlined event registration process",
    "Real-time resource availability tracking",
    "Automatic conflict detection and prevention",
    "Comprehensive booking management dashboard",
    "Mobile-responsive design for on-the-go access",
    "Secure and reliable platform"
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hero-pattern {
          background-image: 
            linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%),
            url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80');
          background-size: cover;
          background-position: center;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-pattern text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Smart Event & Resource Management</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Manage Events & Resources <span className="text-yellow-300">Effortlessly</span>
              </h1>
              
              <p className="text-xl text-gray-100 mb-8 leading-relaxed">
                The all-in-one platform for event registration and resource booking. 
                Schedule smarter, collaborate better, and never worry about conflicts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg elevation-3 hover-elevation-4 ripple material-button flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition-all material-button"
                >
                  Learn More
                </button>
              </div>

              <div className="flex items-center gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-gray-200 text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-gray-200 text-sm">Events Managed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-gray-200 text-sm">Uptime</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block float-animation">
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 elevation-5 backdrop-blur-lg">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80"
                    alt="Dashboard Preview"
                    className="rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 elevation-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Booking Confirmed</p>
                      <p className="text-sm text-gray-600">Conference Room A</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make event and resource management seamless and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 elevation-1 hover-elevation-3 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
 
 import React, { useState } from "react";
