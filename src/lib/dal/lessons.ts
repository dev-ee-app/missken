import fs from "fs";
import path from "path";
import { LessonPlanDocument, MiddleSchoolLevel } from "@/lib/types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "data")
  : path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "lessons.json");

function ensureStorage(): Map<string, LessonPlanDocument> {
  const map = new Map<string, LessonPlanDocument>();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const list: LessonPlanDocument[] = JSON.parse(raw);
      for (const item of list) {
        map.set(item.id, item);
      }
    }
  } catch (err) {
    console.error("Error reading lessons storage:", err);
  }
  return map;
}

function saveStorage(map: Map<string, LessonPlanDocument>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(map.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving lessons storage:", err);
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(message = "غير مصرح لك بالوصول إلى هذه المذكرة (IDOR Protection)") {
    super(message);
    this.name = "UnauthorizedAccessError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "المذكرة غير موجودة") {
    super(message);
    this.name = "NotFoundError";
  }
}

export const LessonDAL = {
  /**
   * Get all lessons belonging to a specific user (Isolated per user)
   */
  async listUserLessons(userId: string): Promise<LessonPlanDocument[]> {
    if (!userId) throw new UnauthorizedAccessError("يجب توفير معرف المستخدم");
    const store = ensureStorage();
    const userLessons: LessonPlanDocument[] = [];
    const all = Array.from(store.values());

    for (let i = 0; i < all.length; i++) {
      const lesson = all[i];
      if (lesson.userId === userId) {
        userLessons.push(lesson);
      }
    }

    return userLessons.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  /**
   * Get a single lesson by ID with strict ownership check
   */
  async getLessonById(userId: string, lessonId: string): Promise<LessonPlanDocument> {
    if (!userId) throw new UnauthorizedAccessError("يجب تسجيل الدخول");
    const store = ensureStorage();
    const lesson = store.get(lessonId);

    if (!lesson) {
      throw new NotFoundError();
    }
    if (lesson.userId !== userId) {
      throw new UnauthorizedAccessError();
    }
    return lesson;
  },

  /**
   * Create a new lesson assigned strictly to the authenticated user and persisted on disk
   */
  async createLesson(
    userId: string,
    data: {
      title: string;
      sequenceTitle: string;
      level: MiddleSchoolLevel;
      metadata?: Partial<LessonPlanDocument["metadata"]>;
      stages?: LessonPlanDocument["stages"];
      pageSettings?: Partial<LessonPlanDocument["pageSettings"]>;
    }
  ): Promise<LessonPlanDocument> {
    if (!userId) throw new UnauthorizedAccessError("يجب تسجيل الدخول لإنشاء مذكرة");

    const store = ensureStorage();
    const id = "lesson-" + Math.random().toString(36).substring(2, 10);
    const now = new Date().toISOString();

    const newLesson: LessonPlanDocument = {
      id,
      userId,
      title: data.title,
      sequenceTitle: data.sequenceTitle,
      level: data.level,
      metadata: {
        teacher: data.metadata?.teacher || "أ. أمين بن حمودة",
        school: data.metadata?.school || "متوسطة الشهيد أحمد زبانة",
        classProfile: data.metadata?.classProfile || "Active & Mixed-ability",
        level: data.level,
        numberOfLearners: data.metadata?.numberOfLearners || "36",
        session: data.metadata?.session || "Session 1",
        sequence: data.sequenceTitle,
        targetCompetence: data.metadata?.targetCompetence || "Interact and produce basic communicative exchanges.",
        sessionOutcomes: data.metadata?.sessionOutcomes || "Learners will be able to introduce themselves and their peers.",
        teachingMaterials: data.metadata?.teachingMaterials || "Coursebook, Flashcards, Whiteboard",
        anticipatedProblems: data.metadata?.anticipatedProblems || "Difficulty in pronunciation of vowel contrasts",
        solutionsPlanB: data.metadata?.solutionsPlanB || "Choral drills and visual charts",
      },
      stages: data.stages && data.stages.length > 0 ? data.stages : [
        {
          id: "stg-1",
          stageName: "Warm Up",
          procedures: "Teacher greets learners and reviews previous vocabulary with a rapid icebreaker.",
          interaction: "T-S",
          time: "5 min",
        },
        {
          id: "stg-2",
          stageName: "Presentation",
          procedures: "Present model dialogue with visual flashcards; clarify keyword meanings on board.",
          interaction: "T-S",
          time: "15 min",
        },
        {
          id: "stg-3",
          stageName: "Practice",
          procedures: "Learners fill in speech bubbles in pairs using target structures.",
          interaction: "S-S",
          time: "20 min",
        },
        {
          id: "stg-4",
          stageName: "Use",
          procedures: "Learners role-play introducing their partner to the class.",
          interaction: "Individual",
          time: "15 min",
        },
        {
          id: "stg-5",
          stageName: "Assessment",
          procedures: "Quick check: 2 exit questions to verify learning outcomes.",
          interaction: "T-S",
          time: "5 min",
        },
      ],
      pageSettings: {
        paperSize: data.pageSettings?.paperSize || "A4",
        orientation: data.pageSettings?.orientation || "portrait",
        margins: data.pageSettings?.margins || { top: 15, bottom: 15, left: 15, right: 15 },
        showPageNumbers: data.pageSettings?.showPageNumbers ?? true,
        headerText: data.pageSettings?.headerText || "Middle School English Department",
        footerText: data.pageSettings?.footerText || "Algerian Middle School Education",
      },
      createdAt: now,
      updatedAt: now,
    };

    store.set(id, newLesson);
    saveStorage(store);
    return newLesson;
  },

  /**
   * Update a lesson with IDOR check and persistent save
   */
  async updateLesson(
    userId: string,
    lessonId: string,
    updates: Partial<Omit<LessonPlanDocument, "id" | "userId" | "createdAt">>
  ): Promise<LessonPlanDocument> {
    const store = ensureStorage();
    const existing = store.get(lessonId);

    if (!existing) {
      throw new NotFoundError();
    }
    if (existing.userId !== userId) {
      throw new UnauthorizedAccessError();
    }

    const updated: LessonPlanDocument = {
      ...existing,
      ...updates,
      metadata: {
        ...existing.metadata,
        ...(updates.metadata || {}),
      },
      pageSettings: {
        ...existing.pageSettings,
        ...(updates.pageSettings || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    store.set(lessonId, updated);
    saveStorage(store);
    return updated;
  },

  /**
   * Delete a lesson with IDOR check and persistent save
   */
  async deleteLesson(userId: string, lessonId: string): Promise<boolean> {
    const store = ensureStorage();
    const existing = store.get(lessonId);

    if (!existing) {
      throw new NotFoundError();
    }
    if (existing.userId !== userId) {
      throw new UnauthorizedAccessError();
    }

    const deleted = store.delete(lessonId);
    saveStorage(store);
    return deleted;
  },

  /**
   * Direct fetch without auth check (for server-side PDF generator and print renderer)
   */
  async getLessonDirect(lessonId: string): Promise<LessonPlanDocument | null> {
    const store = ensureStorage();
    return store.get(lessonId) || null;
  },

  /**
   * Clear store (for unit tests)
   */
  _clear() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
      }
    } catch (e) {}
  },
};
