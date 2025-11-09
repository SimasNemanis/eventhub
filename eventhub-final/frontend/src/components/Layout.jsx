import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils/navigation";
import { Calendar, Package, LayoutDashboard, BookMarked, Menu, X, LogOut, User, CalendarDays, BarChart3, Settings, Moon, Sun, Database } from "lucide-react";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: isAuthenticated } = useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: () => api.auth.isAuthenticated(),
    retry: false,
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
    enabled: isAuthenticated === true,
    retry: false,
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (user?.theme_preference) {
      const prefersDark = user.theme_preference === 'dark' || 
        (user.theme_preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
 