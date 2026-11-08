import { describe, it, expect, beforeEach } from "vitest";
import { LessonDAL } from "../src/lib/dal/lessons";

describe("Phase 2: Editor, Blocks & Stage Transactions", () => {
  const userId = "usr_teacher_phase2";

  beforeEach(() => {
    LessonDAL._clear();
  });

  it("creates a lesson with initial stages and allows updating stages", async () => {
    const lesson = await LessonDAL.createLesson(userId, {
      title: "Pronunciation of Final -s",
      sequenceTitle: "Sequence 1",
      level: "1AM",
      stages: [
        {
          id: "s1",
          stageName: "Warm Up",
          procedures: "Greeting and tongue twister",
          interaction: "T-S",
          time: "5 min",
        },
      ],
    });

    expect(lesson.stages.length).toBe(1);
    expect(lesson.stages[0].stageName).toBe("Warm Up");

    // Add another stage
    const updated = await LessonDAL.updateLesson(userId, lesson.id, {
      stages: [
        ...lesson.stages,
        {
          id: "s2",
          stageName: "Presentation",
          procedures: "Categorize /s/, /z/, /ɪz/ sounds",
          interaction: "T-S",
          time: "15 min",
        },
      ],
    });

    expect(updated.stages.length).toBe(2);
    expect(updated.stages[1].stageName).toBe("Presentation");
  });

  it("updates page settings (margins, paper size, orientation)", async () => {
    const lesson = await LessonDAL.createLesson(userId, {
      title: "Writing a Letter",
      sequenceTitle: "Sequence 3",
      level: "3AM",
      pageSettings: {
        paperSize: "A4",
        orientation: "portrait",
      },
    });

    const updated = await LessonDAL.updateLesson(userId, lesson.id, {
      pageSettings: {
        paperSize: "A3",
        orientation: "landscape",
        margins: { top: 25, bottom: 25, left: 20, right: 20 },
        showPageNumbers: true,
        headerText: "Algerian Middle School English",
        footerText: "Page Footer",
      },
    });

    expect(updated.pageSettings.paperSize).toBe("A3");
    expect(updated.pageSettings.orientation).toBe("landscape");
    expect(updated.pageSettings.headerText).toBe("Algerian Middle School English");
  });
});
