"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, BookOpenCheck } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  customSrc?: string;
}

export function Logo({ className = "", size = "md", customSrc }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg gap-1.5",
    md: "text-2xl gap-2",
    lg: "text-3xl gap-3",
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  if (customSrc) {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        <img
          src={customSrc}
          alt="شعار مذكرتي"
          className={size === "sm" ? "h-6 w-auto" : size === "md" ? "h-8 w-auto" : "h-12 w-auto"}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center font-bold tracking-tight text-brand-primary dark:text-brand-lavender hover:opacity-90 transition-opacity ${sizeClasses[size]} ${className}`}
    >
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-[#3B2A8C] to-[#9B35C4] text-white shadow-md shadow-brand-primary/20">
        <BookOpenCheck size={iconSizes[size]} strokeWidth={2.2} />
        <Sparkles
          size={iconSizes[size] / 2}
          className="absolute -top-1 -right-1 text-brand-gold animate-pulse"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-[#3B2A8C] via-[#9B35C4] to-[#7C3AED] dark:from-white dark:via-brand-lavender dark:to-purple-300">
          مُذكَّرتي
        </span>
        <span className="text-[10px] text-muted-foreground font-medium tracking-normal mt-0.5">
          منهاج الطور المتوسط
        </span>
      </div>
    </Link>
  );
}
