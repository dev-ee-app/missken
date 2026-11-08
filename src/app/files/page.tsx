"use client";

import React from "react";
import { FolderOpen, FileText, Download, Trash2, HardDrive } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function FilesPage() {
  const { user } = useAuth();

  return (
    <div className="container max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <FolderOpen className="text-brand-primary" size={26} />
            <span>ملفاتي ومخرجات الطباعة</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            سجل ملفات PDF وملفات Word (.docx) المصدرة ومرفقات الدروس المحفوظة
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-dashed border-brand-lavender/40 shadow-sm">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
          <HardDrive size={32} />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          لا توجد ملفات مصدرة محفوظة بعد
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
          عند تصدير أي مذكرة كملف PDF أو Word، ستظهر نسخها المؤرشفة هنا تلقائياً لسرعة التحميل.
        </p>
      </div>
    </div>
  );
}
