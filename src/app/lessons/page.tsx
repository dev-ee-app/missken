"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FilePlus,
  BookOpen,
  Search,
  Filter,
  Trash2,
  Edit3,
  Download,
  Calendar,
  Layers,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LessonPlanDocument } from "@/lib/types";

export default function LessonsPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonPlanDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const loadLessons = async () => {
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
  };

  useEffect(() => {
    loadLessons();
  }, [user]);

  const handleDelete = async (id: string, title: string) => {
    if (!user) return;
    if (confirm(`هل أنت متأكد من حذف مذكرة: "${title}"؟`)) {
      try {
        await fetch(`/api/lessons/${id}?userId=${user.id}`, { method: "DELETE" });
        localStorage.removeItem(`lesson_${id}`);
        await loadLessons();
      } catch (e) {
        alert("تعذر حذف المذكرة");
      }
    }
  };

  const filtered = lessons.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.sequenceTitle.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || l.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="container max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="text-brand-primary" size={26} />
            <span>مذكراتي التعليمية المحفوظة</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            إدارة كافة مذكرات حصص اللغة الإنجليزية المحفوظة بشكل دائم على الخادم
          </p>
        </div>

        <Link
          href="/lessons/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md transition-transform active:scale-95"
        >
          <FilePlus size={16} />
          <span>ابدأ مذكرة جديدة</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث بالعنوان أو المقطع التعلمي (Sequence)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2 text-xs rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-muted-foreground shrink-0" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-card border border-border focus:outline-none text-foreground"
          >
            <option value="all">كافة المستويات</option>
            <option value="1AM">1AM (الأولى متوسط)</option>
            <option value="2AM">2AM (الثانية متوسط)</option>
            <option value="3AM">3AM (الثالثة متوسط)</option>
            <option value="4AM">4AM (الرابعة متوسط)</option>
          </select>
        </div>
      </div>

      {/* Lesson List / Empty State */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-dashed border-brand-lavender/40 shadow-sm mt-8">
          <div className="w-20 h-20 mb-4 rounded-2xl bg-brand-primary/5 flex items-center justify-center">
            <img
              src="/assets/mascot/mascot-waving-clean.png"
              alt="ترحيب"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">
            {search || levelFilter !== "all"
              ? "لا توجد نتائج مطابقة لبحثك"
              : "لا توجد مذكرات مسجلة بعد"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
            {search || levelFilter !== "all"
              ? "جرّب تغيير كلمات البحث أو اختيار مستوى دراسي آخر."
              : "ابدأ بتصميم مذكرتك الأولى الآن لتظهر هنا وتتمكن من حفظها وتصديرها."}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((lesson) => (
            <div
              key={lesson.id}
              className="glass-panel p-5 rounded-2xl border border-border hover:border-brand-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    {lesson.level}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(lesson.updatedAt).toLocaleDateString("ar-DZ")}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {lesson.sequenceTitle}
                </p>

                <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/30 p-2.5 rounded-lg border border-border/50">
                  <div className="flex justify-between">
                    <span>عدد المراحل:</span>
                    <span className="font-semibold text-foreground">
                      {lesson.stages.length} مراحل
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحصة:</span>
                    <span className="font-semibold text-foreground">
                      {lesson.metadata.session || "Session 1"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor?id=${lesson.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary text-xs font-semibold transition-colors"
                  >
                    <Edit3 size={13} />
                    <span>تعديل</span>
                  </Link>
                  <Link
                    href={`/export?id=${lesson.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors"
                  >
                    <Download size={13} />
                    <span>تصدير</span>
                  </Link>
                </div>

                <button
                  onClick={() => handleDelete(lesson.id, lesson.title)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
                  title="حذف المذكرة"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
