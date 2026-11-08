"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  Sparkles,
  Layers,
  CheckCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LessonDAL } from "@/lib/dal/lessons";
import { MiddleSchoolLevel, FrameworkType } from "@/lib/types";

export default function NewLessonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [sequenceTitle, setSequenceTitle] = useState("");
  const [level, setLevel] = useState<MiddleSchoolLevel>("1AM");
  const [framework, setFramework] = useState<FrameworkType>("PPU");

  // Metadata Fields (Section 5)
  const [metadata, setMetadata] = useState({
    teacher: user?.full_name || "",
    school: user?.school || "",
    classProfile: "",
    numberOfLearners: "",
    session: "Session 1",
    targetCompetence: "Interact, Interpret and Produce oral and written messages.",
    sessionOutcomes: "By the end of the lesson, learners will be able to...",
    teachingMaterials: "Whiteboard, Flashcards, Coursebook, Audio Track",
    anticipatedProblems: "Difficulty in pronouncing /θ/ and /ð/ sounds.",
    solutionsPlanB: "Phonics drills, peer repetition and visual mouth charts.",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Setup initial stages based on framework
      const initialStages =
        framework === "PPU"
          ? [
              {
                id: "stage-1",
                stageName: "Warm Up",
                procedures: "Engage learners with a quick greeting game or visual cue.",
                interaction: "T-S",
                time: "5 min",
              },
              {
                id: "stage-2",
                stageName: "Presentation",
                procedures: "Contextualize target language and elicit meaning.",
                interaction: "T-S",
                time: "15 min",
              },
              {
                id: "stage-3",
                stageName: "Practice",
                procedures: "Controlled and semi-controlled language activities.",
                interaction: "S-S",
                time: "20 min",
              },
              {
                id: "stage-4",
                stageName: "Use / Produce",
                procedures: "Learners freely produce target forms in communicative tasks.",
                interaction: "Group work",
                time: "15 min",
              },
              {
                id: "stage-5",
                stageName: "Assessment / Wrap-up",
                procedures: "Quick exit ticket or peer review.",
                interaction: "Individual",
                time: "5 min",
              },
            ]
          : [
              {
                id: "stage-1",
                stageName: "Pre-Stage",
                procedures: "Activate schema and introduce keywords.",
                interaction: "T-S",
                time: "10 min",
              },
              {
                id: "stage-2",
                stageName: "During-Stage",
                procedures: "First reading/listening for gist, second for specific info.",
                interaction: "Individual",
                time: "25 min",
              },
              {
                id: "stage-3",
                stageName: "Post-Stage",
                procedures: "Discussion and personal reflection task.",
                interaction: "S-S",
                time: "20 min",
              },
              {
                id: "stage-4",
                stageName: "Review",
                procedures: "Summary and homework assignment.",
                interaction: "T-S",
                time: "5 min",
              },
            ];

      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: title || `Lesson Plan - ${metadata.session}`,
          sequenceTitle: sequenceTitle || "Sequence 1",
          level,
          metadata: {
            ...metadata,
            level,
            sequence: sequenceTitle || "Sequence 1",
          },
          stages: initialStages,
          pageSettings: {
            paperSize: "A4",
            orientation: "portrait",
            margins: { top: 15, bottom: 15, left: 15, right: 15 },
            showPageNumbers: true,
            headerText: `${metadata.school} | English Department`,
            footerText: `Teacher: ${metadata.teacher} | Algerian Middle School`,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to create lesson");
      const lesson = await res.json();
      localStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(lesson));
      router.push(`/editor?id=${lesson.id}`);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إنشاء المذكرة");
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <FilePlus className="text-brand-primary" size={26} />
            <span>إعداد مذكرة جديدة</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            املأ بطاقة الحصة والبيانات الأساسية وفق الإطار الرسمي للطور المتوسط
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        {/* Core Lesson Identification */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen size={18} className="text-brand-secondary" />
            <span>بيانات المذكرة والمستوى</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                عنوان الدرس (Lesson Title) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Describing Physical Appearance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                المقطع التعلمي (Sequence) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sequence 1: Me, My Friends and My Family"
                value={sequenceTitle}
                onChange={(e) => setSequenceTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                المستوى الدراسي (Level) *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as MiddleSchoolLevel)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground"
              >
                <option value="1AM">1AM - الأولى متوسط</option>
                <option value="2AM">2AM - الثانية متوسط</option>
                <option value="3AM">3AM - الثالثة متوسط</option>
                <option value="4AM">4AM - الرابعة متوسط (شهادة التعليم المتوسط BEM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الإطار البيداغوجي (Framework) *
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as FrameworkType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground"
              >
                <option value="PPU">PPU (Presentation - Practice - Use)</option>
                <option value="PDP">PDP (Pre - During - Post reading/listening)</option>
                <option value="TBL">TBL (Task-Based Learning)</option>
                <option value="PIASP">PIASP (Presentation - Isolation - Analysis - Rule - Practice)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5 Lesson Profile Fields */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers size={18} className="text-brand-primary" />
            <span>بطاقة الحصة الرسمية (Class Profile & Outcomes)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الأستاذ(ة) (Teacher)
              </label>
              <input
                type="text"
                value={metadata.teacher}
                onChange={(e) => setMetadata({ ...metadata, teacher: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                المتوسطة (School)
              </label>
              <input
                type="text"
                value={metadata.school}
                onChange={(e) => setMetadata({ ...metadata, school: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الحصة (Session)
              </label>
              <input
                type="text"
                value={metadata.session}
                onChange={(e) => setMetadata({ ...metadata, session: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الكفاءة المستهدفة (Target Competence)
              </label>
              <textarea
                rows={2}
                value={metadata.targetCompetence}
                onChange={(e) => setMetadata({ ...metadata, targetCompetence: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                مخرجات التعلم للحصة (Session Outcomes)
              </label>
              <textarea
                rows={2}
                value={metadata.sessionOutcomes}
                onChange={(e) => setMetadata({ ...metadata, sessionOutcomes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الوسائل التعليمية (Teaching Materials)
              </label>
              <input
                type="text"
                value={metadata.teachingMaterials}
                onChange={(e) => setMetadata({ ...metadata, teachingMaterials: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الصعوبات المتوقعة (Anticipated Problems)
              </label>
              <input
                type="text"
                value={metadata.anticipatedProblems}
                onChange={(e) => setMetadata({ ...metadata, anticipatedProblems: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                الحلول والبديل (Solutions / Plan B)
              </label>
              <input
                type="text"
                value={metadata.solutionsPlanB}
                onChange={(e) => setMetadata({ ...metadata, solutionsPlanB: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle size={16} />
            <span>{loading ? "جارٍ الإنشاء..." : "إنشاء وفتح في المحرر"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
