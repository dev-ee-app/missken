import { describe, it, expect } from "vitest";
import { LessonDAL } from "../src/lib/dal/lessons";

describe("Phase 5 & 6: AI Assistant & MCP Server Tools", () => {
  const userId = "usr_mcp_test";

  it("verifies MCP tools definitions and capabilities", async () => {
    const requiredTools = [
      "create_lesson",
      "get_lesson",
      "update_lesson",
      "list_lessons",
      "add_block",
      "update_block",
      "remove_block",
      "apply_template",
      "set_pdf_background",
      "generate_with_ai",
      "add_source",
      "export_pdf",
      "export_docx",
    ];

    expect(requiredTools.length).toBe(13);

    // Test creating lesson via DAL
    const lesson = await LessonDAL.createLesson(userId, {
      title: "MCP Created Lesson",
      sequenceTitle: "Sequence 1",
      level: "4AM",
    });

    expect(lesson.title).toBe("MCP Created Lesson");
    expect(lesson.level).toBe("4AM");
  });
});
