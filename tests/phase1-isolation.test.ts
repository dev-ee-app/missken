import { describe, it, expect, beforeEach } from "vitest";
import { LessonDAL, UnauthorizedAccessError, NotFoundError } from "../src/lib/dal/lessons";

describe("Phase 1: User Isolation & IDOR Protection", () => {
  const teacherA = "teacher-uuid-a";
  const teacherB = "teacher-uuid-b";

  beforeEach(() => {
    LessonDAL._clear();
  });

  it("ensures empty state initially returns zero lessons for both users", async () => {
    const lessonsA = await LessonDAL.listUserLessons(teacherA);
    const lessonsB = await LessonDAL.listUserLessons(teacherB);

    expect(lessonsA).toEqual([]);
    expect(lessonsB).toEqual([]);
  });

  it("allows Teacher A to create a lesson and Teacher B cannot see it", async () => {
    const lessonA = await LessonDAL.createLesson(teacherA, {
      title: "My Family & Relatives",
      sequenceTitle: "Sequence 1: Me, My Friends and My Family",
      level: "1AM",
    });

    expect(lessonA.id).toBeDefined();
    expect(lessonA.userId).toBe(teacherA);

    const lessonsA = await LessonDAL.listUserLessons(teacherA);
    expect(lessonsA.length).toBe(1);
    expect(lessonsA[0].id).toBe(lessonA.id);

    // Teacher B's view MUST be isolated and empty
    const lessonsB = await LessonDAL.listUserLessons(teacherB);
    expect(lessonsB.length).toBe(0);
  });

  it("prevents Teacher B from reading Teacher A's lesson directly by ID (IDOR Attack)", async () => {
    const lessonA = await LessonDAL.createLesson(teacherA, {
      title: "Daily Activities",
      sequenceTitle: "Sequence 2: Me and My Lifestyles",
      level: "2AM",
    });

    // Teacher A can read it
    const fetchedA = await LessonDAL.getLessonById(teacherA, lessonA.id);
    expect(fetchedA.id).toBe(lessonA.id);

    // Teacher B attempting to read Teacher A's lesson must throw UnauthorizedAccessError
    await expect(LessonDAL.getLessonById(teacherB, lessonA.id)).rejects.toThrow(
      UnauthorizedAccessError
    );
  });

  it("prevents Teacher B from updating Teacher A's lesson (IDOR Attack)", async () => {
    const lessonA = await LessonDAL.createLesson(teacherA, {
      title: "Ancient Civilizations",
      sequenceTitle: "Sequence 3: History & Heritage",
      level: "3AM",
    });

    await expect(
      LessonDAL.updateLesson(teacherB, lessonA.id, {
        title: "Hacked Title",
      })
    ).rejects.toThrow(UnauthorizedAccessError);

    // Verify it wasn't modified
    const verified = await LessonDAL.getLessonById(teacherA, lessonA.id);
    expect(verified.title).toBe("Ancient Civilizations");
  });

  it("prevents Teacher B from deleting Teacher A's lesson", async () => {
    const lessonA = await LessonDAL.createLesson(teacherA, {
      title: "BEM Preparation Session",
      sequenceTitle: "Sequence 4: Life Experiences",
      level: "4AM",
    });

    await expect(LessonDAL.deleteLesson(teacherB, lessonA.id)).rejects.toThrow(
      UnauthorizedAccessError
    );

    // Verify it still exists
    const verified = await LessonDAL.getLessonById(teacherA, lessonA.id);
    expect(verified.id).toBe(lessonA.id);
  });
});
