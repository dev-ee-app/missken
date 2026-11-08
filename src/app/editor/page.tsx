"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Download,
  Settings2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ArrowRight,
  Check,
  Eye,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LessonPlanDocument, LessonStage } from "@/lib/types";
import { SheetPageView } from "@/components/editor/sheet-page-view";

function EditorContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id");
  const router = useRouter();
  const { user } = useAuth();

  const [document, setDocument] = useState<LessonPlanDocument | null>(null);
  const [history, setHistory] = useState<LessonPlanDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [zoom, setZoom] = useState(0.85);
  const [activeTab, setActiveTab] = useState<"fields" | "stages" | "pageSettings">("fields");

  // Load document from persistent API and localStorage fallback
  useEffect(() => {
    async function load() {
      if (!user) return;

      if (lessonId) {
        // Try localStorage first for instant rendering
        const cached = localStorage.getItem(`lesson_${lessonId}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setDocument(parsed);
            setHistory([parsed]);
            setHistoryIndex(0);
          } catch (e) {}
        }

        try {
          const res = await fetch(`/api/lessons/${lessonId}?userId=${user.id}`);
          if (res.ok) {
            const doc = await res.json();
            setDocument(doc);
            setHistory([doc]);
            setHistoryIndex(0);
            localStorage.setItem(`lesson_${doc.id}`, JSON.stringify(doc));
            setLastSavedTime(new Date(doc.updatedAt).toLocaleTimeString("ar-DZ"));
          }
        } catch (e) {
          console.error("Error loading lesson:", e);
        }
      } else {
        // Create initial draft persisted on server
        try {
          const res = await fetch("/api/lessons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              title: "English Lesson Plan Draft",
              sequenceTitle: "Sequence 1: Me, My Friends and My Family",
              level: "1AM",
              metadata: {
                teacher: user.full_name || "أ. أمين بن حمودة",
                school: user.school || "متوسطة الشهيد أحمد زبانة",
                classProfile: "Active & Mixed-ability",
                session: "Session 1",
                numberOfLearners: "36",
                targetCompetence: "Interact and produce basic communicative exchanges.",
                sessionOutcomes: "Learners will be able to introduce themselves and their peers.",
                teachingMaterials: "Coursebook, Flashcards, Audio Player",
                anticipatedProblems: "Difficulty in pronunciation of vowel contrasts",
                solutionsPlanB: "Repetitive choral drills and mouth charts",
              },
            }),
          });
          if (res.ok) {
            const newDoc = await res.json();
            setDocument(newDoc);
            setHistory([newDoc]);
            setHistoryIndex(0);
            localStorage.setItem(`lesson_${newDoc.id}`, JSON.stringify(newDoc));
            setLastSavedTime(new Date().toLocaleTimeString("ar-DZ"));
            router.replace(`/editor?id=${newDoc.id}`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    load();
  }, [user, lessonId, router]);

  // Persist mutations to disk and localStorage with debounce
  const pushState = useCallback(
    (newDoc: LessonPlanDocument) => {
      setDocument(newDoc);
      setSaveStatus("saving");

      // Save to localStorage immediately
      localStorage.setItem(`lesson_${newDoc.id}`, JSON.stringify(newDoc));

      // Update undo stack
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newDoc);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Persist to server disk storage via PUT /api/lessons/:id
      if (user && newDoc.id) {
        fetch(`/api/lessons/${newDoc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDoc),
        })
          .then((res) => {
            if (res.ok) {
              setSaveStatus("saved");
              setLastSavedTime(new Date().toLocaleTimeString("ar-DZ"));
            }
          })
          .catch((err) => {
            console.error("Auto-save error:", err);
            setSaveStatus("unsaved");
          });
      }
    },
    [history, historyIndex, user]
  );

  // Manual Save Action
  const handleManualSave = async () => {
    if (!document || !user) return;
    setSaveStatus("saving");
    localStorage.setItem(`lesson_${document.id}`, JSON.stringify(document));
    try {
      const res = await fetch(`/api/lessons/${document.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setLastSavedTime(new Date().toLocaleTimeString("ar-DZ"));
      }
    } catch (e) {
      alert("تعذر الحفظ إلى الخادم");
      setSaveStatus("unsaved");
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setDocument(prev);
      setHistoryIndex(historyIndex - 1);
      localStorage.setItem(`lesson_${prev.id}`, JSON.stringify(prev));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setDocument(next);
      setHistoryIndex(historyIndex + 1);
      localStorage.setItem(`lesson_${next.id}`, JSON.stringify(next));
    }
  };

  // Field updates
  const updateField = (key: keyof LessonPlanDocument["metadata"], val: string) => {
    if (!document) return;
    const updated: LessonPlanDocument = {
      ...document,
      metadata: {
        ...document.metadata,
        [key]: val,
      },
    };
    pushState(updated);
  };

  // Stage updates
  const updateStage = (idx: number, field: keyof LessonStage, val: string) => {
    if (!document) return;
    const newStages = [...document.stages];
    newStages[idx] = { ...newStages[idx], [field]: val };
    const updated: LessonPlanDocument = {
      ...document,
      stages: newStages,
    };
    pushState(updated);
  };

  const addStage = () => {
    if (!document) return;
    const newStage: LessonStage = {
      id: "stg-" + Date.now(),
      stageName: "New Stage",
      procedures: "Describe teacher and learner actions here...",
      interaction: "T-S",
      time: "10 min",
    };
    const updated: LessonPlanDocument = {
      ...document,
      stages: [...document.stages, newStage],
    };
    pushState(updated);
  };

  const removeStage = (idx: number) => {
    if (!document || document.stages.length <= 1) return;
    const newStages = document.stages.filter((_, i) => i !== idx);
    const updated: LessonPlanDocument = {
      ...document,
      stages: newStages,
    };
    pushState(updated);
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">جارٍ فتح المذكرة من قاعدة البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Editor Main Control Bar */}
      <div className="no-print flex items-center justify-between px-6 py-2.5 bg-card/95 border-b border-border shadow-xs z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/lessons"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="العودة لقائمة المذكرات"
          >
            <ArrowRight size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={document.title}
                onChange={(e) => {
                  pushState({ ...document, title: e.target.value });
                }}
                className="text-sm font-black bg-transparent hover:bg-muted/50 px-2 py-0.5 rounded border border-transparent focus:border-border text-foreground"
              />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-primary/10 text-brand-primary">
                {document.level}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground px-2">
              {document.sequenceTitle}
            </div>
          </div>

          {/* Autosave status indicator & Manual Save Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 transition-all active:scale-95"
              title="حفظ دائم على القرص"
            >
              <Save size={14} />
              <span>حفظ التعديلات</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground">
              {saveStatus === "saved" ? (
                <>
                  <Check size={13} className="text-green-600" />
                  <span>محفوظ ({lastSavedTime || "الآن"})</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>جارٍ الحفظ...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Undo/Redo & Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
            title="تراجع (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
            title="إعادة (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          <button
            onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="تصغير"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-semibold text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="تكبير"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Right Action: Export Center CTA */}
        <div className="flex items-center gap-2">
          <Link
            href={`/export?id=${document.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-sm hover:opacity-95 active:scale-95 transition-all"
          >
            <Download size={15} />
            <span>تصدير PDF / Word</span>
          </Link>
        </div>
      </div>

      {/* Editor Body: Left Canvas (Live Sheet View) + Right Tooling Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Interactive Canvas Area with serene quiet background */}
        <div className="flex-1 overflow-auto p-10 flex justify-center bg-neutral-200/60 dark:bg-neutral-900/80">
          <SheetPageView
            document={document}
            scale={zoom}
            editable={true}
            onUpdateMetadata={updateField}
            onUpdateStage={updateStage}
            onAddStage={addStage}
            onRemoveStage={removeStage}
          />
        </div>

        {/* Right Inspector & Form Editing Drawer */}
        <div className="no-print w-96 border-r border-border bg-card/95 flex flex-col h-full shadow-lg z-10 overflow-hidden">
          {/* Tab Selection */}
          <div className="grid grid-cols-3 border-b border-border text-xs font-bold text-center">
            <button
              onClick={() => setActiveTab("fields")}
              className={`py-3 transition-colors ${
                activeTab === "fields"
                  ? "border-b-2 border-brand-primary text-brand-primary bg-brand-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              بطاقة الحصة
            </button>
            <button
              onClick={() => setActiveTab("stages")}
              className={`py-3 transition-colors ${
                activeTab === "stages"
                  ? "border-b-2 border-brand-primary text-brand-primary bg-brand-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              المراحل ({document.stages.length})
            </button>
            <button
              onClick={() => setActiveTab("pageSettings")}
              className={`py-3 transition-colors ${
                activeTab === "pageSettings"
                  ? "border-b-2 border-brand-primary text-brand-primary bg-brand-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              إعداد الورقة
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {activeTab === "fields" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    اسم الأستاذ (Teacher)
                  </label>
                  <input
                    type="text"
                    value={document.metadata.teacher}
                    onChange={(e) => updateField("teacher", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    المتوسطة (School)
                  </label>
                  <input
                    type="text"
                    value={document.metadata.school}
                    onChange={(e) => updateField("school", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                      الحصة (Session)
                    </label>
                    <input
                      type="text"
                      value={document.metadata.session}
                      onChange={(e) => updateField("session", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                      عدد التلاميذ
                    </label>
                    <input
                      type="text"
                      value={document.metadata.numberOfLearners}
                      onChange={(e) => updateField("numberOfLearners", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    الكفاءة المستهدفة (Target Competence)
                  </label>
                  <textarea
                    rows={2}
                    value={document.metadata.targetCompetence}
                    onChange={(e) => updateField("targetCompetence", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    مخرجات الحصة (Session Outcomes)
                  </label>
                  <textarea
                    rows={2}
                    value={document.metadata.sessionOutcomes}
                    onChange={(e) => updateField("sessionOutcomes", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    الوسائل (Teaching Materials)
                  </label>
                  <input
                    type="text"
                    value={document.metadata.teachingMaterials}
                    onChange={(e) => updateField("teachingMaterials", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    الصعوبات المتوقعة (Anticipated Problems)
                  </label>
                  <input
                    type="text"
                    value={document.metadata.anticipatedProblems}
                    onChange={(e) => updateField("anticipatedProblems", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    الحلول والبديل (Solutions / Plan B)
                  </label>
                  <input
                    type="text"
                    value={document.metadata.solutionsPlanB}
                    onChange={(e) => updateField("solutionsPlanB", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>
              </div>
            )}

            {activeTab === "stages" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="font-bold text-muted-foreground">جدول المراحل الدراسية</span>
                  <button
                    onClick={addStage}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline"
                  >
                    <Plus size={14} /> إضافة مرحلة
                  </button>
                </div>

                {document.stages.map((stage, idx) => (
                  <div
                    key={stage.id || idx}
                    className="p-3 rounded-xl border border-border bg-muted/30 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={stage.stageName}
                        onChange={(e) => updateStage(idx, "stageName", e.target.value)}
                        className="font-bold text-brand-primary bg-transparent text-xs w-28 border-b border-dashed border-border focus:border-brand-primary"
                        placeholder="Stage Name"
                      />
                      <button
                        onClick={() => removeStage(idx)}
                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="حذف المرحلة"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] text-muted-foreground">
                        المهام والأنشطة (Procedures)
                      </label>
                      <textarea
                        rows={3}
                        value={stage.procedures}
                        onChange={(e) => updateStage(idx, "procedures", e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded bg-card border border-border mt-0.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="block text-[10px] text-muted-foreground">التفاعل</label>
                        <select
                          value={stage.interaction}
                          onChange={(e) => updateStage(idx, "interaction", e.target.value)}
                          className="w-full px-1.5 py-1 text-xs rounded bg-card border border-border"
                        >
                          <option value="T-S">T-S (Teacher-Student)</option>
                          <option value="S-T">S-T (Student-Teacher)</option>
                          <option value="S-S">S-S (Student-Student)</option>
                          <option value="Individual">Individual Work</option>
                          <option value="Group work">Group Work</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-muted-foreground">المدة</label>
                        <input
                          type="text"
                          value={stage.time}
                          onChange={(e) => updateStage(idx, "time", e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded bg-card border border-border"
                          placeholder="e.g. 15 min"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pageSettings" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    مقاس الورق (Paper Size)
                  </label>
                  <select
                    value={document.pageSettings.paperSize}
                    onChange={(e) => {
                      pushState({
                        ...document,
                        pageSettings: {
                          ...document.pageSettings,
                          paperSize: e.target.value as any,
                        },
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="A3">A3 (297 × 420 mm)</option>
                    <option value="Letter">Letter (8.5 × 11 in)</option>
                    <option value="Legal">Legal (8.5 × 14 in)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    الاتجاه (Orientation)
                  </label>
                  <select
                    value={document.pageSettings.orientation}
                    onChange={(e) => {
                      pushState({
                        ...document,
                        pageSettings: {
                          ...document.pageSettings,
                          orientation: e.target.value as any,
                        },
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  >
                    <option value="portrait">عمودي (Portrait)</option>
                    <option value="landscape">أفقي (Landscape)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    رأس الصفحة (Header Text)
                  </label>
                  <input
                    type="text"
                    value={document.pageSettings.headerText}
                    onChange={(e) => {
                      pushState({
                        ...document,
                        pageSettings: {
                          ...document.pageSettings,
                          headerText: e.target.value,
                        },
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    تذييل الصفحة (Footer Text)
                  </label>
                  <input
                    type="text"
                    value={document.pageSettings.footerText}
                    onChange={(e) => {
                      pushState({
                        ...document,
                        pageSettings: {
                          ...document.pageSettings,
                          footerText: e.target.value,
                        },
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-muted border border-border"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
