import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  HeadingLevel,
  Packer,
  BorderStyle,
  ShadingType,
  PageBreak,
} from "docx";
import { LessonPlanDocument } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const docData: LessonPlanDocument = await req.json();

    const thinBorder = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "B9A3F0",
    };

    const goldBorder = {
      style: BorderStyle.SINGLE,
      size: 2,
      color: "D9A900",
    };

    const doc = new Document({
      sections: [
        // ================= PAGE 1: SEQUENCE COVER SHEET =================
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 in
            },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "DEMOCRATIC AND POPULAR REPUBLIC OF ALGERIA",
                  bold: true,
                  size: 20,
                  color: "3B2A8C",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "MINISTRY OF NATIONAL EDUCATION",
                  bold: true,
                  size: 18,
                  color: "666666",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `Level: ${docData.level} | School Year: 2023 - 2024`,
                  bold: true,
                  size: 18,
                  color: "9B35C4",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),

            // Sequence Banner Box
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "F4EDFC" },
                      borders: {
                        top: thinBorder,
                        bottom: thinBorder,
                        left: thinBorder,
                        right: thinBorder,
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "PEDAGOGICAL SEQUENCE PLAN",
                              bold: true,
                              size: 18,
                              color: "3B2A8C",
                            }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: docData.sequenceTitle || "Sequence Title",
                              bold: true,
                              size: 32,
                              color: "3B2A8C",
                            }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: docData.title,
                              bold: true,
                              size: 22,
                              color: "9B35C4",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Sequence Sessions & Framework Overview",
              heading: HeadingLevel.HEADING_2,
            }),

            // Sequence Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "3B2A8C" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Session", bold: true, color: "FFFFFF" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "3B2A8C" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Session Outcomes (مخرجات الحصة)", bold: true, color: "FFFFFF" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "3B2A8C" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Framework", bold: true, color: "FFFFFF" })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: docData.metadata.session || "Session 1", bold: true, color: "3B2A8C" })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: docData.metadata.sessionOutcomes || "Learners will be able to produce the target forms." })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "PPU / PDP", bold: true, color: "9B35C4" })] })],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: "" }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Middle School: ", bold: true }),
                new TextRun({ text: `${docData.metadata.school}   |   `, color: "3B2A8C", bold: true }),
                new TextRun({ text: "Teacher: ", bold: true }),
                new TextRun({ text: docData.metadata.teacher, color: "3B2A8C", bold: true }),
              ],
            }),

            // PAGE BREAK TO PAGE 2 (LESSON SHEET)
            new Paragraph({
              children: [new PageBreak()],
            }),

            // ================= PAGE 2: LESSON SHEET =================
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "MIDDLE SCHOOL ENGLISH LESSON PLAN",
                  bold: true,
                  size: 26,
                  color: "3B2A8C",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${docData.title} — ${docData.sequenceTitle}`,
                  bold: true,
                  size: 20,
                  color: "9B35C4",
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Rounded Profile Table with Red Values
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "TEACHER:\n", bold: true, size: 16 }), new TextRun({ text: docData.metadata.teacher || "—", bold: true, color: "C92A2A" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "SCHOOL:\n", bold: true, size: 16 }), new TextRun({ text: docData.metadata.school || "—", bold: true, color: "C92A2A" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "LEVEL:\n", bold: true, size: 16 }), new TextRun({ text: docData.level || "1AM", bold: true, color: "C92A2A" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "SESSION:\n", bold: true, size: 16 }), new TextRun({ text: docData.metadata.session || "Session 1", bold: true, color: "C92A2A" })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "CLASS PROFILE:\n", bold: true, size: 16 }), new TextRun({ text: docData.metadata.classProfile || "Active", bold: true, color: "C92A2A" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "LEARNERS:\n", bold: true, size: 16 }), new TextRun({ text: docData.metadata.numberOfLearners || "36", bold: true, color: "C92A2A" })] })],
                    }),
                    new TableCell({
                      columnSpan: 2,
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [new Paragraph({ children: [new TextRun({ text: "SEQUENCE:\n", bold: true, size: 16 }), new TextRun({ text: docData.sequenceTitle, bold: true, color: "C92A2A" })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 4,
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "TARGET COMPETENCE:\n", bold: true, size: 16 }),
                            new TextRun({ text: docData.metadata.targetCompetence, bold: true, color: "C92A2A" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 4,
                      shading: { type: ShadingType.CLEAR, fill: "FBF9FF" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "SESSION OUTCOMES:\n", bold: true, size: 16 }),
                            new TextRun({ text: docData.metadata.sessionOutcomes, bold: true, color: "C92A2A" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Pedagogical Stages & Procedures",
              heading: HeadingLevel.HEADING_2,
            }),

            // Stages Table with Golden Header
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "D9A900" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "STAGES", bold: true, color: "000000" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "D9A900" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PROCEDURES / LEARNING TASKS", bold: true, color: "000000" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "D9A900" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "INTERACTION", bold: true, color: "000000" })] })],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "D9A900" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TIME", bold: true, color: "000000" })] })],
                    }),
                  ],
                }),
                ...docData.stages.map(
                  (stg, idx) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          shading: { type: ShadingType.CLEAR, fill: "F4EDFC" },
                          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: stg.stageName, bold: true, color: "3B2A8C" })] })],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: `Task ${idx + 1}: `, bold: true, color: "C92A2A" }),
                                new TextRun({ text: stg.procedures }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: stg.interaction, bold: true, color: "3B2A8C" })] })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: stg.time, bold: true, color: "C92A2A" })] })],
                        }),
                      ],
                    })
                ),
              ],
            }),

            new Paragraph({ text: "" }),
            // Reflection & Rubric Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "F4EDFC" },
                      borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Teacher's Self-Reflection:\n", bold: true, color: "3B2A8C" }),
                            new TextRun({ text: "Did learners achieve the expected communicative outcome? Which stage needed additional scaffolding?", italics: true }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: "FFF9E6" },
                      borders: { top: goldBorder, bottom: goldBorder, left: goldBorder, right: goldBorder },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Assessment Rubric & Criteria:\n", bold: true, color: "8A6800" }),
                            new TextRun({ text: "• Accuracy of language forms & pronunciation\n• Active peer engagement in communicative tasks" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(docData.title || "lesson-plan")}.docx"`,
      },
    });
  } catch (error: any) {
    console.error("DOCX export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
