"use client";

import React, { useState } from "react";
import { Bell, Check, Trash2, Info, Sparkles } from "lucide-react";

export default function NotificationsPage() {
  const [items, setItems] = useState([
    {
      id: "n-1",
      title: "مرحباً بك في منصة «مُذكَّرتي»",
      message: "تم تجهيز حسابك بالهيكل التربوي المعتمد للطور المتوسط الجزائري (1AM-4AM).",
      time: "منذ قليل",
      read: false,
    },
  ]);

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, read: true })));
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Bell className="text-brand-primary" size={26} />
            <span>مركز الإشعارات والتنبيهات</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            إشعارات عمليات التصدير، وتحديثات المساعد الذكي
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <Check size={14} />
            <span>تحديد الكل كمقروء</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`glass-panel p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              !item.read ? "border-brand-primary/40 bg-brand-primary/[0.02]" : "border-border"
            }`}
          >
            <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-foreground">{item.title}</h4>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
