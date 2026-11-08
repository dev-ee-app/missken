"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  DownloadCloud,
  FileText,
  Printer,
  Palette,
  Droplet,
  Layers,
  ArrowRight,
  Check,
  Eye,
  FileCode,
  Sparkles,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LessonPlanDocument } from "@/lib/types";
import { SheetPageView } from "@/components/editor/sheet-page-view";

function ExportContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id");
  const { user } = useAuth();

  const [document, setDocument] = useState<LessonPlanDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Background Customization
  const [bgType, setBgType] = useState<"none" | "color" | "image">("none");
  const [bgValue, setBgValue] = useState("");
  const [bgOpacity, setBgOpacity] = useState(1);
  const [ecoMode, setEcoMode] = useState(false);

  // Watermark
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState("SAMPLE");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.12);
  const [watermarkRotation, setWatermarkRotation] = useState(-45);

  const [previewScale, setPreviewScale] = useState(0.68);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);

      // Check localStorage first for instant draft recovery
      if (lessonId) {
        const localDraft = localStorage.getItem(`lesson_${lessonId}`);
        if (localDraft) {
          try {
            setDocument(JSON.parse(localDraft));
          } catch (e) {}
        }

        try {
          const res = await fetch(`/api/lessons/${lessonId}?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setDocument(data);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const res = await fetch(`/api/lessons?userId=${user.id}`);
          if (res.ok) {
            const list = await res.json();
            if (list.length > 0) setDocument(list[0]);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
    load();
  }, [user, lessonId]);

  // High Precision Headless Playwright PDF Export
  const handleDownloadPdf = async () => {
    if (!document) return;
    setDownloadingPdf(true);
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: document.id,
          title: document.title,
          bgType,
          ecoMode,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        if (errJson?.fallback) {
          // Graceful fallback on free serverless platforms
          window.print();
          return;
        }
        throw new Error("Failed to generate PDF via server engine");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document.title || "lesson-plan"}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("تعذر تصدير PDF عبر المحرك الموجه. سيتم استخدام نافذة الطباعة المباشرة كبديل.");
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Direct Word (.docx) Download
  const handleDownloadDocx = async () => {
    if (!document) return;
    setDownloadingDocx(true);
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
      });
      if (!res.ok) throw new Error("Failed to export docx");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document.title || "lesson-plan"}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء تصدير ملف Word");
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold">لم يتم تحديد مذكرة للتصدير</h2>
        <p className="text-xs text-muted-foreground">
          يرجى اختيار مذكرة من قائمة مذكراتك أو إنشاء مذكرة جديدة للبدء.
        </p>
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          <ArrowRight size={14} /> العودة إلى مذكراتي
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Top Header Bar */}
      <div className="no-print flex items-center justify-between px-6 py-2.5 bg-card border-b border-border z-20">
        <div className="flex items-center gap-3">
          <Link
            href={`/editor?id=${document.id}`}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="العودة للمحرر"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-black text-foreground flex items-center gap-2">
              <DownloadCloud className="text-brand-primary" size={18} />
              <span>مركز التصدير والطباعة: {document.title}</span>
            </h1>
            <p className="text-[11px] text-muted-foreground">
              تصدير عالي الدقة (300 DPI) يطابق المعاينة بكسلاً ببكسل
            </p>
          </div>
        </div>

        {/* Primary Export Actions */}
        <div className="flex items-center gap-2">
          {/* Word Export Button */}
          <button
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all active:scale-95 disabled:opacity-50"
          >
            {downloadingDocx ? <Loader2 size={15} className="animate-spin" /> : <FileCode size={15} />}
            <span>{downloadingDocx ? "جارٍ إعداد Word..." : "تحميل Word (.docx) منسق"}</span>
          </button>

          {/* Browser Print Fallback */}
          <button
            onClick={handleBrowserPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all active:scale-95"
            title="طباعة مباشرة للورق"
          >
            <Printer size={15} />
            <span>طباعة المتصفح</span>
          </button>

          {/* Professional High Precision Vector PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {downloadingPdf ? <Loader2 size={15} className="animate-spin" /> : <DownloadCloud size={15} />}
            <span>{downloadingPdf ? "جارٍ توليد PDF عالي الدقة..." : "تحميل PDF عالي الدقة"}</span>
          </button>
        </div>
      </div>

      {/* Main Export View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Live Preview Canvas Wrapped in #printable-sheet for zero-chrome clean printing */}
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-neutral-200/70 dark:bg-neutral-900/90">
          <div id="printable-sheet">
            <SheetPageView
              document={document}
              scale={previewScale}
              activeBackground={{
                type: bgType,
                value: bgValue,
                opacity: bgOpacity,
                fit: "cover",
                ecoMode,
              }}
              watermark={{
                enabled: watermarkEnabled,
                text: watermarkText,
                opacity: watermarkOpacity,
                rotation: watermarkRotation,
              }}
            />
          </div>
        </div>

        {/* Right Settings Drawer */}
        <div className="no-print w-80 border-r border-border bg-card p-5 overflow-y-auto space-y-6 text-xs">
          {/* Print Mode Preset */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase">
              نمط الطباعة (Print Profile)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEcoMode(false)}
                className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                  !ecoMode
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                ألوان كاملة
              </button>
              <button
                type="button"
                onClick={() => setEcoMode(true)}
                className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                  ecoMode
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                اقتصادي (Eco B&W)
              </button>
            </div>
            {ecoMode && (
              <p className="text-[10px] text-green-600 dark:text-green-400 mt-1">
                الوضع الاقتصادي يفرغ الخلفيات تماماً لتوفير 100% من حبر الطابعة.
              </p>
            )}
          </div>

          {/* Background Selection */}
          {!ecoMode && (
            <div className="space-y-3 pt-3 border-t border-border">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                خلفية ملف الـ PDF (بدون تعديل المذكرة)
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setBgType("none");
                    setBgValue("");
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                    bgType === "none"
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  الرخامي الافتراضي
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBgType("color");
                    setBgValue("#f3e8ff");
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                    bgType === "color"
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  لون لافندر هادئ
                </button>
              </div>

              {bgType === "color" && (
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">
                    اختر اللون
                  </label>
                  <input
                    type="color"
                    value={bgValue || "#f3e8ff"}
                    onChange={(e) => setBgValue(e.target.value)}
                    className="w-full h-8 rounded border border-border cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Watermark Controls */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-muted-foreground uppercase">
                العلامة المائية (Watermark)
              </label>
              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
              />
            </div>

            {watermarkEnabled && (
              <div className="space-y-2.5 bg-muted/40 p-3 rounded-xl border border-border">
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">
                    نص العلامة المائية
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded bg-card border border-border font-bold"
                    placeholder="مثال: مسودة / CONFIDENTIAL"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>الشفافية:</span>
                    <span>{Math.round(watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.4"
                    step="0.01"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Zoom Preview Scale Slider */}
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
              <span>حجم المعاينة:</span>
              <span>{Math.round(previewScale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.2"
              step="0.05"
              value={previewScale}
              onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      }
    >
      <ExportContent />
    </Suspense>
  );
}
