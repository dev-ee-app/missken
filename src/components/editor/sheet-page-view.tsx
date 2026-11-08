"use client";

import React from "react";
import { LessonPlanDocument, LessonStage } from "@/lib/types";

interface SheetPageViewProps {
  document: LessonPlanDocument;
  activeBackground?: {
    type: "none" | "color" | "image";
    value: string;
    opacity: number;
    fit: "fill" | "contain" | "cover" | "repeat";
    ecoMode?: boolean;
  };
  watermark?: {
    enabled: boolean;
    text?: string;
    opacity: number;
    rotation: number;
  };
  editable?: boolean;
  onUpdateMetadata?: (key: keyof LessonPlanDocument["metadata"], value: string) => void;
  onUpdateStage?: (index: number, key: keyof LessonStage, value: string) => void;
  onAddStage?: () => void;
  onRemoveStage?: (index: number) => void;
  scale?: number;
}

export function SheetPageView({
  document: doc,
  activeBackground,
  watermark,
  editable = false,
  onUpdateMetadata,
  onUpdateStage,
  onAddStage,
  onRemoveStage,
  scale = 1,
}: SheetPageViewProps) {
  const isEco = activeBackground?.ecoMode;
  const bgType = activeBackground?.type || doc.backgroundSettings?.type || "none";
  const bgValue = activeBackground?.value || doc.backgroundSettings?.value || "";
  const bgOpacity = activeBackground?.opacity ?? doc.backgroundSettings?.opacity ?? 1;

  // Background style computation
  const getPageBackgroundStyle = () => {
    if (isEco) return { backgroundColor: "#ffffff" };
    if (bgType === "color" && bgValue) return { backgroundColor: bgValue };
    if (bgType === "image" && bgValue) {
      return {
        backgroundImage: `url(${bgValue})`,
        backgroundSize: activeBackground?.fit === "repeat" ? "auto" : activeBackground?.fit || "cover",
        backgroundRepeat: activeBackground?.fit === "repeat" ? "repeat" : "no-repeat",
        backgroundPosition: "center",
      };
    }
    // Default reference purple marble texture simulation
    return {
      backgroundImage: `radial-gradient(circle at 10% 20%, rgba(185, 163, 240, 0.12) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(155, 53, 196, 0.08) 0%, transparent 40%),
                        linear-gradient(135deg, #faf7ff 0%, #f4edfc 50%, #fbf9ff 100%)`,
    };
  };

  return (
    <div
      className="flex flex-col items-center gap-10 select-text origin-top transition-transform duration-200"
      style={{ transform: `scale(${scale})` }}
      dir="ltr"
    >
      {/* ========================================================
          PAGE 1: SEQUENCE COVER SHEET (غلاف المقطع التعلمي)
          Section 5: شريط بنفسجي عمودي، سهم علوي، لافتة لفافة بتدرج لافندر بعنوان Sequence، واسم الأستاذ في الأسفل
          ======================================================== */}
      <div
        className="sheet-page w-[210mm] min-h-[297mm] shadow-2xl relative p-10 flex flex-col justify-between overflow-hidden text-neutral-900 border border-neutral-200"
        style={getPageBackgroundStyle()}
        id="page-1"
      >
        {/* Optional Watermark Layer */}
        {watermark?.enabled && watermark.text && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none overflow-hidden"
            style={{ opacity: watermark.opacity || 0.15 }}
          >
            <div
              className="text-7xl font-black text-brand-primary tracking-widest whitespace-nowrap transform -rotate-45"
            >
              {watermark.text}
            </div>
          </div>
        )}

        {/* Vertical Decorative Purple Band on the left */}
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-b from-[#3B2A8C] via-[#9B35C4] to-[#3B2A8C] flex flex-col items-center justify-between py-6">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-amber-300" />
          <div className="text-[9px] font-bold tracking-widest text-white transform -rotate-90 uppercase whitespace-nowrap opacity-80">
            Algerian Middle School Education
          </div>
          <div className="w-2 h-2 rounded-full bg-amber-300" />
        </div>

        {/* Top Header Information */}
        <div className="pl-6 flex justify-between items-center border-b border-purple-200 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#3B2A8C]">
              Democratic and Popular Republic of Algeria
            </div>
            <div className="text-[11px] font-semibold text-neutral-600">
              Ministry of National Education
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#3B2A8C] to-[#9B35C4] text-white shadow-sm">
              {doc.level} Level
            </span>
            <div className="text-[10px] text-neutral-500 font-semibold mt-1">
              School Year: 2023 - 2024
            </div>
          </div>
        </div>

        {/* Center Ribbon Banner: Sequence Scroll Title */}
        <div className="pl-6 my-auto text-center space-y-6">
          <div className="inline-block relative">
            <div className="px-12 py-5 rounded-2xl bg-gradient-to-r from-[#B9A3F0]/40 via-purple-100 to-[#B9A3F0]/40 border-2 border-[#9B35C4]/40 shadow-md">
              <div className="text-xs uppercase tracking-widest font-extrabold text-[#3B2A8C] mb-1">
                Pedagogical Sequence Plan
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#3B2A8C] tracking-tight">
                {doc.sequenceTitle || "Sequence Title Here"}
              </h1>
            </div>
            {/* Scroll Ribbon Ribs */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-8 bg-[#9B35C4] rounded-l-md opacity-80" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-8 bg-[#9B35C4] rounded-r-md opacity-80" />
          </div>

          <div className="text-sm font-bold text-neutral-700 max-w-lg mx-auto">
            {doc.title}
          </div>

          {/* Sequence Structure Table (Section 5: Session / Outcomes / Framework) */}
          <div className="mt-8 rounded-xl overflow-hidden border border-purple-300/80 shadow-sm max-w-2xl mx-auto bg-white/90">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#3B2A8C] to-[#9B35C4] text-white">
                  <th className="p-3 border-r border-purple-400 font-bold w-24">Session</th>
                  <th className="p-3 border-r border-purple-400 font-bold">Session Outcomes (مخرجات الحصة)</th>
                  <th className="p-3 font-bold w-32">Framework</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                <tr className="hover:bg-purple-50/50">
                  <td className="p-3 font-bold text-[#3B2A8C] border-r border-purple-200">
                    {doc.metadata.session || "Session 1"}
                  </td>
                  <td className="p-3 text-neutral-800 border-r border-purple-200">
                    {doc.metadata.sessionOutcomes || "Learners will be able to identify and produce the target language."}
                  </td>
                  <td className="p-3 font-semibold text-[#9B35C4]">
                    PPU / PDP
                  </td>
                </tr>
                <tr className="hover:bg-purple-50/50">
                  <td className="p-3 font-bold text-[#3B2A8C] border-r border-purple-200">Session 2</td>
                  <td className="p-3 text-neutral-800 border-r border-purple-200">
                    Consolidating language structures through communicative drills and peer exchange.
                  </td>
                  <td className="p-3 font-semibold text-[#9B35C4]">PIASP</td>
                </tr>
                <tr className="hover:bg-purple-50/50">
                  <td className="p-3 font-bold text-[#3B2A8C] border-r border-purple-200">Session 3</td>
                  <td className="p-3 text-neutral-800 border-r border-purple-200">
                    Integrating language skills in task-based problem solving or project checkpoint.
                  </td>
                  <td className="p-3 font-semibold text-[#9B35C4]">TBL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cover Footer with Teacher Name */}
        <div className="pl-6 border-t border-purple-200 pt-4 flex justify-between items-end text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-500">Middle School:</div>
            <div className="font-bold text-[#3B2A8C] text-sm">
              {doc.metadata.school || "Algerian Middle School"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Teacher:</div>
            <div className="font-extrabold text-[#3B2A8C] text-sm">
              {doc.metadata.teacher || "Teacher Name"}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PAGE 2: LESSON SHEET (صفحة الحصة)
          Section 5: خلفية رخامية بنفسجية، وحقول بإطارات مستديرة:
          Teacher, School, Class Profile, Level, Number of Learners, Session, Sequence,
          Target Competence, Session Outcomes, Teaching Materials, Anticipated Problems, Solutions / Plan B.
          التسمية بالأسود والقيمة بالأحمر.
          جدول المراحل برأس ذهبي: Stages / Procedures-Tasks / Interaction / Time.
          اسم المرحلة عمودياً في إطار منقّط، ومهام بعناوين حمراء مسطّرة.
          ======================================================== */}
      <div
        className="sheet-page w-[210mm] min-h-[297mm] shadow-2xl relative p-8 flex flex-col justify-between overflow-hidden text-neutral-900 border border-neutral-200"
        style={getPageBackgroundStyle()}
        id="page-2"
      >
        {/* Optional Watermark Layer */}
        {watermark?.enabled && watermark.text && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none overflow-hidden"
            style={{ opacity: watermark.opacity || 0.15 }}
          >
            <div
              className="text-7xl font-black text-brand-primary tracking-widest whitespace-nowrap transform -rotate-45"
            >
              {watermark.text}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Header Title Banner */}
          <div className="text-center pb-2 border-b-2 border-[#3B2A8C]">
            <h2 className="text-lg font-black text-[#3B2A8C] uppercase tracking-wide">
              Middle School English Lesson Plan
            </h2>
            <div className="text-xs font-bold text-[#9B35C4]">
              {doc.title} — {doc.sequenceTitle}
            </div>
          </div>

          {/* Section 5: Rounded Framed Fields Grid (التسمية بالأسود والقيمة بالأحمر) */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {/* Row 1: Teacher, School, Level, Session */}
            <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Teacher:</span>
              <span className="font-bold text-[#c92a2a] text-xs">
                {doc.metadata.teacher || "—"}
              </span>
            </div>

            <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">School:</span>
              <span className="font-bold text-[#c92a2a] text-xs truncate block">
                {doc.metadata.school || "—"}
              </span>
            </div>

            <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Level:</span>
              <span className="font-bold text-[#c92a2a] text-xs">
                {doc.level}
              </span>
            </div>

            <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Session:</span>
              <span className="font-bold text-[#c92a2a] text-xs">
                {doc.metadata.session || "Session 1"}
              </span>
            </div>

            {/* Row 2: Class Profile, Number of Learners, Sequence */}
            <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Class Profile:</span>
              <span className="font-bold text-[#c92a2a] text-xs">
                {doc.metadata.classProfile || "Heterogeneous / Active"}
              </span>
            </div>

            <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Learners:</span>
              <span className="font-bold text-[#c92a2a] text-xs">
                {doc.metadata.numberOfLearners || "38"}
              </span>
            </div>

            <div className="col-span-2 p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Sequence:</span>
              <span className="font-bold text-[#c92a2a] text-xs truncate block">
                {doc.metadata.sequence || doc.sequenceTitle}
              </span>
            </div>

            {/* Row 3: Target Competence & Session Outcomes */}
            <div className="col-span-2 p-2.5 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Target Competence:</span>
              <p className="font-bold text-[#c92a2a] text-xs mt-0.5 leading-snug">
                {doc.metadata.targetCompetence || "Interact, Interpret and Produce oral and written discourse."}
              </p>
            </div>

            <div className="col-span-2 p-2.5 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
              <span className="font-extrabold text-black block text-[10px] uppercase">Session Outcomes:</span>
              <p className="font-bold text-[#c92a2a] text-xs mt-0.5 leading-snug">
                {doc.metadata.sessionOutcomes || "Learners will be able to express ideas accurately and fluently."}
              </p>
            </div>

            {/* Row 4: Teaching Materials, Anticipated Problems, Solutions Plan B */}
            <div className="col-span-4 grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
                <span className="font-extrabold text-black block text-[10px] uppercase">Teaching Materials:</span>
                <span className="font-bold text-[#c92a2a] text-xs block truncate">
                  {doc.metadata.teachingMaterials || "Textbook, Board, Audio, Flashcards"}
                </span>
              </div>

              <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
                <span className="font-extrabold text-black block text-[10px] uppercase">Anticipated Problems:</span>
                <span className="font-bold text-[#c92a2a] text-xs block truncate">
                  {doc.metadata.anticipatedProblems || "Pronunciation of vowel contrasts"}
                </span>
              </div>

              <div className="p-2 rounded-xl border border-purple-300 bg-white/80 shadow-xs">
                <span className="font-extrabold text-black block text-[10px] uppercase">Solutions / Plan B:</span>
                <span className="font-bold text-[#c92a2a] text-xs block truncate">
                  {doc.metadata.solutionsPlanB || "Visual charts and peer repetition"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Stages Table with Gold Header (رأس ذهبي: Stages / Procedures-Tasks / Interaction / Time) */}
          <div className="rounded-xl overflow-hidden border-2 border-[#D9A900] shadow-sm bg-white/95 mt-3">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#D9A900] via-[#E5B81A] to-[#D9A900] text-black">
                  <th className="p-2.5 border-r border-amber-600 font-extrabold uppercase tracking-wide w-28 text-center">
                    Stages
                  </th>
                  <th className="p-2.5 border-r border-amber-600 font-extrabold uppercase tracking-wide">
                    Procedures / Learning Tasks
                  </th>
                  <th className="p-2.5 border-r border-amber-600 font-extrabold uppercase tracking-wide w-24 text-center">
                    Interaction
                  </th>
                  <th className="p-2.5 font-extrabold uppercase tracking-wide w-20 text-center">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-200">
                {doc.stages.map((stage, idx) => (
                  <tr key={stage.id || idx} className="hover:bg-purple-50/40">
                    {/* Stage Name in vertical dotted frame as specified in Section 5 */}
                    <td className="p-3 border-r border-purple-200 align-middle text-center">
                      <div className="border-2 border-dotted border-[#3B2A8C] rounded-lg p-1.5 font-black text-[#3B2A8C] text-xs uppercase tracking-wider bg-purple-50/50">
                        {stage.stageName}
                      </div>
                    </td>

                    {/* Procedures with red underlined task headers */}
                    <td className="p-3 border-r border-purple-200 align-top text-neutral-800 leading-relaxed">
                      <div className="font-bold text-[#c92a2a] underline decoration-2 underline-offset-4 mb-1">
                        Task {idx + 1}:
                      </div>
                      <div className="whitespace-pre-line text-xs">
                        {stage.procedures}
                      </div>

                      {/* Vocabulary highlight badge if present */}
                      {idx === 1 && (
                        <div className="mt-2 inline-block px-2 py-0.5 rounded bg-yellow-200/90 text-yellow-900 font-semibold text-[11px] border border-yellow-300">
                          Key Vocabulary: Pronunciation & Grammar Target
                        </div>
                      )}
                    </td>

                    <td className="p-3 border-r border-purple-200 align-middle text-center font-bold text-purple-900 bg-purple-50/20">
                      {stage.interaction}
                    </td>

                    <td className="p-3 align-middle text-center font-bold text-[#c92a2a] bg-purple-50/20">
                      {stage.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 5: Self-Reflection & Rubric Box */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-2 text-xs">
            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/40">
              <span className="font-extrabold text-[#3B2A8C] block mb-1">
                Teacher's Self-Reflection:
              </span>
              <p className="text-neutral-600 text-[11px] italic">
                Did learners achieve the expected communicative outcome? Which stage required additional scaffolding or time adjustment?
              </p>
            </div>

            <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/40">
              <span className="font-extrabold text-amber-900 block mb-1">
                Assessment Rubric & Success Criteria:
              </span>
              <p className="text-neutral-700 text-[11px]">
                • Accuracy of language forms (Punctuation, Pronunciation) <br />
                • Fluency and active peer interaction in communicative tasks
              </p>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="border-t border-purple-200 pt-3 flex justify-between items-center text-[11px] text-neutral-500 font-semibold">
          <span>{doc.pageSettings.headerText || `${doc.metadata.school || "Middle School"} - English Department`}</span>
          <span>Page 2 / 2</span>
          <span>Teacher: {doc.metadata.teacher || "—"}</span>
        </div>
      </div>
    </div>
  );
}
