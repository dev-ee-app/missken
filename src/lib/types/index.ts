export type MiddleSchoolLevel = "1AM" | "2AM" | "3AM" | "4AM";

export type Role = "teacher" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  school?: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export type FrameworkType = "PPU" | "PDP" | "TBL" | "PIASP" | "Custom";

export interface LessonStage {
  id: string;
  stageName: string; // e.g. Warm up, Presentation, Practice, Use
  procedures: string; // Procedures and learning tasks
  interaction: "T-S" | "S-T" | "S-S" | "Individual" | "Group work" | string;
  time: string; // e.g. 5 min, 15 min
}

export interface LessonPlanMetadata {
  teacher: string;
  school: string;
  classProfile: string;
  level: MiddleSchoolLevel;
  numberOfLearners: string;
  session: string;
  sequence: string;
  targetCompetence: string;
  sessionOutcomes: string;
  teachingMaterials: string;
  anticipatedProblems: string;
  solutionsPlanB: string;
}

export interface LessonPlanDocument {
  id: string;
  userId: string;
  title: string;
  sequenceTitle: string;
  level: MiddleSchoolLevel;
  metadata: LessonPlanMetadata;
  stages: LessonStage[];
  notes?: string;
  selfReflection?: string;
  rubricCriteria?: { criterion: string; weight: string; description: string }[];
  contentTree?: any; // TipTap Delta / Block JSON
  pageSettings: {
    paperSize: "A4" | "A3" | "Letter" | "Legal" | "Custom";
    orientation: "portrait" | "landscape";
    margins: { top: number; bottom: number; left: number; right: number };
    showPageNumbers: boolean;
    headerText: string;
    footerText: string;
  };
  backgroundSettings?: {
    type: "none" | "color" | "image";
    value: string;
    opacity: number;
    fit: "fill" | "contain" | "cover" | "repeat";
    targetPages: "all" | number[];
    ecoMode: boolean;
  };
  watermarkSettings?: {
    enabled: boolean;
    text?: string;
    imageUrl?: string;
    opacity: number;
    rotation: number;
    repeat: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  level: MiddleSchoolLevel | "All";
  framework: FrameworkType;
  structure: Partial<LessonPlanDocument>;
  isSystem: boolean;
  userId?: string;
  createdAt: string;
}
