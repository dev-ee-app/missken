import React from "react";
import { LessonDAL } from "@/lib/dal/lessons";
import { SheetPageView } from "@/components/editor/sheet-page-view";

export default async function PrintPage({
  searchParams,
}: {
  searchParams: { id?: string; bg?: string; eco?: string };
}) {
  const id = searchParams?.id;
  const bg = searchParams?.bg as any;
  const eco = searchParams?.eco === "true";

  let doc = null;
  if (id) {
    doc = await LessonDAL.getLessonDirect(id);
  }

  if (!doc) {
    return <div className="p-8 text-center text-sm">المذكرة غير موجودة في قاعدة البيانات</div>;
  }

  return (
    <div id="printable-sheet" className="p-0 m-0 bg-white">
      <SheetPageView
        document={doc}
        scale={1}
        activeBackground={{
          type: bg || "none",
          value: bg === "color" ? "#f3e8ff" : "",
          opacity: 1,
          fit: "cover",
          ecoMode: eco,
        }}
      />
    </div>
  );
}
