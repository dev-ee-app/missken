"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
  switchUser: (role: "teacherA" | "teacherB" | "admin") => void;
}

const mockUsers: Record<string, UserProfile> = {
  teacherA: {
    id: "usr_teacher_a_123",
    email: "amine.teacher@mothakarati.dz",
    full_name: "أ. أمين بن حمودة",
    school: "متوسطة الشهيد أحمد زبانة",
    role: "teacher",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  teacherB: {
    id: "usr_teacher_b_456",
    email: "sarah.teacher@mothakarati.dz",
    full_name: "أ. سارة لعموري",
    school: "متوسطة مفدي زكرياء",
    role: "teacher",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  admin: {
    id: "usr_admin_999",
    email: "admin@mothakarati.dz",
    full_name: "المشرف التربوي العام",
    school: "مديرية التربية الوطنية",
    role: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(mockUsers.teacherA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for persisted user profile
    const saved = localStorage.getItem("mothakarati_current_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(mockUsers.teacherA);
      }
    }
  }, []);

  const signIn = async (email: string) => {
    setIsLoading(true);
    // Find or create profile
    let target = Object.values(mockUsers).find((u) => u.email === email);
    if (!target) {
      target = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        full_name: email.split("@")[0],
        school: "متوسطة نموذجية",
        role: "teacher",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    setUser(target);
    localStorage.setItem("mothakarati_current_user", JSON.stringify(target));
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("mothakarati_current_user");
  };

  const switchUser = (type: "teacherA" | "teacherB" | "admin") => {
    const selected = mockUsers[type];
    setUser(selected);
    localStorage.setItem("mothakarati_current_user", JSON.stringify(selected));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
