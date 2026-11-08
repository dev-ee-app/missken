"use client";

import React, { useState } from "react";
import { Settings, User, School, Image as ImageIcon, Save, Check } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [school, setSchool] = useState(user?.school || "");
  const [defaultPaper, setDefaultPaper] = useState("A4");
  const [defaultFont, setDefaultFont] = useState("Times New Roman");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Settings className="text-brand-primary" size={26} />
          <span>إعدادات المنصة والحساب</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          تخصيص بيانات الأستاذ، المؤسسة، وتفضيلات الخط والطباعة الافتراضية
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <User size={18} className="text-brand-primary" />
            <span>البيانات الشخصية والمهنية</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                اسم الأستاذ(ة) الكامل
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                المتوسطة / المؤسسة التربوية
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
          </div>
        </div>

        {/* Printing & Layout Defaults */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <School size={18} className="text-brand-secondary" />
            <span>التفضيلات الافتراضية للطباعة والخطوط</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                المقاس الافتراضي للورق
              </label>
              <select
                value={defaultPaper}
                onChange={(e) => setDefaultPaper(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              >
                <option value="A4">A4 (210 × 297 mm) — المعيار الرسمي</option>
                <option value="A3">A3 (297 × 420 mm)</option>
                <option value="Letter">Letter (8.5 × 11 in)</option>
                <option value="Legal">Legal (8.5 × 14 in)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الخط الأساسي للمذكرة (Primary Document Font)
              </label>
              <select
                value={defaultFont}
                onChange={(e) => setDefaultFont(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              >
                <option value="Times New Roman">Times New Roman (أو بديله Tinos)</option>
                <option value="Calibri">Calibri (أو بديله Carlito)</option>
                <option value="Cairo">Cairo (للغة العربية والتوجيهات)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <Check size={14} /> تم حفظ التغييرات بنجاح
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md transition-all active:scale-95"
          >
            <Save size={16} />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </form>
    </div>
  );
}
