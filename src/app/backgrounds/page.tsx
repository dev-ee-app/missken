"use client";

import React, { useState } from "react";
import { Palette, Upload, Check, Sparkles } from "lucide-react";

export default function BackgroundsPage() {
  const [selectedBg, setSelectedBg] = useState("marble-purple");

  const backgrounds = [
    {
      id: "marble-purple",
      name: "خلفية رخامية بنفسجية (Official Purple Marble)",
      category: "رخامي تربوي",
      previewStyle: "bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-200 border-purple-300",
      description: "المعتمدة في النموذج المرجعي الأصلي، تمنح المذكرة طابعاً أنيقاً ومميزاً.",
    },
    {
      id: "soft-lavender",
      name: "تدرج لافندر ناعم (Soft Lavender Gradient)",
      category: "تدرجات ألوان",
      previewStyle: "bg-gradient-to-b from-[#B9A3F0]/20 to-purple-50 border-purple-200",
      description: "خلفية هادئة تعزز راحة القراءة والوضوح العالي عند الطباعة بالألوان.",
    },
    {
      id: "gold-scroll",
      name: "لفافة ملكية ذهبية (Royal Gold Parchment)",
      category: "كلاسيكي",
      previewStyle: "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-amber-300",
      description: "مناسبة لأغلفة المقاطع التعلمية وجداول التقييم المنهجية.",
    },
    {
      id: "eco-clean",
      name: "الوضع الاقتصادي الأبيض (Eco-Friendly White)",
      category: "طباعة اقتصادية",
      previewStyle: "bg-white border-dashed border-gray-300",
      description: "خلفية بيضاء نظيفة تماماً موفرة للحبر بنسبة 100% مناسبة لطباعة المكاتب والمؤسسات.",
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Palette className="text-brand-primary" size={26} />
            <span>مكتبة الخلفيات وخيارات الطباعة</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            خلفيات عالية الجودة لصفحات المذكرة وأغلفتها، قابلة للتطبيق دون التأثير على محتوى النصوص
          </p>
        </div>

        <button
          onClick={() => alert("يمكنك رفع خلفية خاصة بك بصيغة PNG أو JPG من داخل نافذة التصدير أو المحرر")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-muted hover:bg-muted/80 text-foreground border border-border shadow-sm transition-all"
        >
          <Upload size={16} />
          <span>رفع خلفية مخصصة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {backgrounds.map((bg) => (
          <div
            key={bg.id}
            onClick={() => setSelectedBg(bg.id)}
            className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
              selectedBg === bg.id
                ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-md"
                : "border-border hover:border-brand-primary/40"
            }`}
          >
            <div>
              <div
                className={`h-32 rounded-xl mb-3 border flex items-center justify-center relative overflow-hidden ${bg.previewStyle}`}
              >
                {selectedBg === bg.id && (
                  <div className="absolute top-2 left-2 p-1 rounded-full bg-brand-primary text-white">
                    <Check size={14} />
                  </div>
                )}
                <span className="text-xs font-bold text-gray-700 bg-white/80 px-2 py-1 rounded shadow-sm">
                  معاينة A4
                </span>
              </div>

              <span className="text-[10px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                {bg.category}
              </span>
              <h3 className="font-bold text-xs text-foreground mt-2">{bg.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                {bg.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
              دقة 300 DPI للطباعة
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
