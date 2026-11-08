"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Bell, PlusCircle, Search } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export function Header() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="no-print sticky top-0 z-20 flex items-center justify-between h-16 px-6 border-b border-border/70 bg-card/70 backdrop-blur-md">
      {/* Search Bar / Quick Finder */}
      <div className="relative w-72 max-w-sm hidden sm:block">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="بحث في المذكرات والقوالب..."
          className="w-full pr-9 pl-4 py-1.5 text-xs rounded-full bg-muted/60 border border-border/80 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Create new lesson quick CTA */}
        <Link
          href="/lessons/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary hover:bg-brand-primary/90 text-white shadow-sm transition-transform active:scale-95"
        >
          <PlusCircle size={15} />
          <span>مذكرة جديدة</span>
        </Link>

        {/* Notifications Icon */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title="الإشعارات"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-secondary" />
        </Link>

        {/* Theme Toggle (Strictly Lucide Icons: Sun / Moon) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
          aria-label="تبديل مظهر الواجهة"
        >
          {isDark ? <Sun size={18} className="text-brand-gold" /> : <Moon size={18} />}
        </button>

        {/* User Mini Avatar / Initial */}
        <div className="flex items-center gap-2 pr-2 border-r border-border/70 mr-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-bold text-xs flex items-center justify-center shadow-inner">
            {user?.full_name?.charAt(0) || "م"}
          </div>
        </div>
      </div>
    </header>
  );
}
