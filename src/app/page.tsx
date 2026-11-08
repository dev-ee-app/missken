"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FilePlus,
  BookOpen,
  Sparkles,
  PenTool,
  DownloadCloud,
  Layers,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LessonDAL } from "@/lib/dal/lessons";
import { LessonPlanDocument } from "@/lib/types";

export default function HomePage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonPlanDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        setLoading(true);
        try {
          const res = await fetch(`/api/lessons?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setLessons(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [user]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Background Video with Gradient Overlay (autoplay muted loop playsInline + poster fallback) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/video/hero-poster.jpg"
          className="w-full h-full object-cover opacity-25 dark:opacity-20 transition-opacity duration-700"
        >
          <source src="/assets/video/hero.mp4" type="video/mp4" />
        </video>
        {/* Soft readable gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background backdrop-blur-[2px]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col justify-between">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary dark:text-brand-lavender border border-brand-primary/20">
              <Sparkles size={14} className="text-brand-gold" />
              <span>منصة خاصة بأساتذة اللغة الإنجليزية — الطور المتوسط الجزائري</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-foreground">
              صمّم مذكرتك التربوية{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-primary via-brand-secondary to-brand-gold">
                بدقة واحترافية متناهية
              </span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
              أول منصة متخصصة تدعم معايير وزارة التربية الوطنية (1AM - 4AM). أنشئ مذكراتك بنظام كتل ذكي، جداول مراحل مرنة، وتصدير PDF فائق الجودة يطابق المعاينة بكسلاً ببكسل.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/lessons/new"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-95 shadow-lg shadow-brand-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FilePlus size={18} />
                <span>ابدأ مذكرة جديدة</span>
                <ArrowLeft size={16} />
              </Link>

              <Link
                href="/ai-assistant"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-card hover:bg-muted/80 text-foreground border border-border shadow-sm transition-all"
              >
                <Sparkles size={16} className="text-brand-gold" />
                <span>المساعد الذكي</span>
              </Link>
            </div>

            {/* Key Value Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <span>مناهج 1AM حتى 4AM</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 size={16} className="text-brand-secondary shrink-0" />
                <span>تصدير PDF مطابق 100%</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 size={16} className="text-brand-gold shrink-0" />
                <span>عزل كامل وآمن للبيانات</span>
              </div>
            </div>
          </div>

          {/* Right Mascot Banner */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-64 sm:w-80 h-72 sm:h-96 flex items-center justify-center">
              {/* Decorative aura circles */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/30 blur-2xl -z-10" />
              <img
                src="/assets/mascot/mascot-reading-clean.png"
                alt="شخصية مذكرتي الترحيبية"
                className="max-h-full max-w-full object-contain filter drop-shadow-xl animate-float transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Status / Empty State Section */}
        <div className="mt-12 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BookOpen size={20} className="text-brand-primary dark:text-brand-lavender" />
                <span>مذكراتي الأخيرة ({user?.full_name})</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                سجل المذكرات المسندة إلى حسابك النشط في النظام
              </p>
            </div>
            <Link
              href="/lessons"
              className="text-xs text-brand-primary dark:text-brand-lavender font-semibold hover:underline"
            >
              عرض كافة المذكرات
            </Link>
          </div>

          {lessons.length === 0 ? (
            /* Clean Empty State as mandated by Section 1 */
            <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-dashed border-brand-lavender/40 shadow-sm">
              <div className="w-20 h-20 mb-4 rounded-2xl bg-brand-primary/5 flex items-center justify-center">
                <img
                  src="/assets/mascot/mascot-waving-clean.png"
                  alt="مرحباً بك"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">
                لا توجد مذكرات مسجلة بعد في حسابك
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
                المنصة مُسلَّمة فارغة تماماً وجاهزة لعملك. اضغط على الزر أدناه لبدء إعداد أول مذكرة وفق الهيكل الرسمي للطور المتوسط.
              </p>
              <Link
                href="/lessons/new"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md transition-transform active:scale-95"
              >
                <FilePlus size={16} />
                <span>ابدأ مذكرة</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="glass-panel p-5 rounded-xl border border-border hover:border-brand-primary/40 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-primary/10 text-brand-primary">
                      {lesson.level}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(lesson.updatedAt).toLocaleDateString("ar-DZ")}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-2 text-foreground group-hover:text-brand-primary transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {lesson.sequenceTitle}
                  </p>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <Link
                      href={`/editor?id=${lesson.id}`}
                      className="text-brand-secondary font-semibold hover:underline"
                    >
                      تعديل في المحرر
                    </Link>
                    <Link
                      href={`/export?id=${lesson.id}`}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <DownloadCloud size={14} /> تصدير
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pb-4">
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary w-fit">
              <PenTool size={18} />
            </div>
            <h3 className="font-bold text-xs">محرر كتل وحفظ دائم</h3>
            <p className="text-[11px] text-muted-foreground">
              حفظ فوري على القرص، استعادة التعديلات، وجدول مراحل دراسية متقدم.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
            <div className="p-2 rounded-lg bg-brand-secondary/10 text-brand-secondary w-fit">
              <Sparkles size={18} />
            </div>
            <h3 className="font-bold text-xs">مساعد ذكي للمناهج</h3>
            <p className="text-[11px] text-muted-foreground">
              يبحث في وثائق المنهاج الجزائري الرسمي، ويقترح تسلسل الأنشطة بدقة.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
              <DownloadCloud size={18} />
            </div>
            <h3 className="font-bold text-xs">تصدير PDF وWord عالي الدقة</h3>
            <p className="text-[11px] text-muted-foreground">
              محرك طباعة موجه بدقة 300 DPI يطابق المعاينة بكسلاً ببكسل، وتصدير Word منسق.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
