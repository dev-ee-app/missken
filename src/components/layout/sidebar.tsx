"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FilePlus,
  PenTool,
  Sparkles,
  Palette,
  FolderOpen,
  DownloadCloud,
  Bell,
  Settings,
  ChevronRight,
  ChevronLeft,
  UserCheck,
} from "lucide-react";
import { Logo } from "./logo";
import { useAuth } from "@/lib/auth/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, switchUser } = useAuth();

  const navItems = [
    { name: "لوحة التحكم", href: "/", icon: LayoutDashboard },
    { name: "مذكراتي", href: "/lessons", icon: BookOpen },
    { name: "مذكرة جديدة", href: "/lessons/new", icon: FilePlus, highlight: true },
    { name: "المحرر اليدوي", href: "/editor", icon: PenTool },
    { name: "المساعد الذكي", href: "/ai-assistant", icon: Sparkles, badge: "جديد" },
    { name: "مركز التصدير", href: "/export", icon: DownloadCloud },
    { name: "الخلفيات", href: "/backgrounds", icon: Palette },
    { name: "ملفاتي", href: "/files", icon: FolderOpen },
    { name: "الإشعارات", href: "/notifications", icon: Bell },
    { name: "الإعدادات", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`no-print sticky top-0 h-screen flex flex-col transition-all duration-300 z-30 bg-card/80 backdrop-blur-xl border-l border-border select-none ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header & Brand Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/60">
        {!isCollapsed && <Logo size="md" />}
        {isCollapsed && <Logo size="sm" className="mx-auto" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                isActive
                  ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-sm shadow-brand-primary/20"
                  : item.highlight
                  ? "text-brand-secondary hover:bg-brand-secondary/10 border border-brand-secondary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : item.highlight ? "text-brand-secondary" : ""
                }`}
              />

              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-gold text-black font-bold mr-1">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Active User Switcher */}
      <div className="p-3 border-t border-border/60 bg-muted/20">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold">
                <UserCheck size={14} /> الحساب النشط:
              </span>
              <span className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[11px] font-bold">
                {user?.role === "admin" ? "مدير" : "أستاذ"}
              </span>
            </div>
            <div className="truncate text-xs font-bold text-foreground">
              {user?.full_name || "زائر"}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {user?.school || "متوسطة الجزائر"}
            </div>

            {/* Quick multi-tenant switcher button group */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              <button
                onClick={() => switchUser("teacherA")}
                className={`text-[10px] py-1 px-1 rounded transition-colors ${
                  user?.email?.includes("amine")
                    ? "bg-brand-primary text-white font-bold"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                title="أمين بن حمودة"
              >
                أمين
              </button>
              <button
                onClick={() => switchUser("teacherB")}
                className={`text-[10px] py-1 px-1 rounded transition-colors ${
                  user?.email?.includes("sarah")
                    ? "bg-brand-secondary text-white font-bold"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                title="سارة لعموري"
              >
                سارة
              </button>
              <button
                onClick={() => switchUser("admin")}
                className={`text-[10px] py-1 px-1 rounded transition-colors ${
                  user?.role === "admin"
                    ? "bg-brand-gold text-black font-bold"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                title="المشرف"
              >
                المشرف
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => switchUser(user?.email?.includes("amine") ? "teacherB" : "teacherA")}
              className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 text-xs font-bold"
              title="تبديل المستخدم"
            >
              <UserCheck size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
