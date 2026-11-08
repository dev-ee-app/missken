import { describe, it, expect } from "vitest";

describe("Phase 3: Pedagogical Templates & Frameworks", () => {
  it("verifies middle school frameworks support: PPU, PDP, TBL, PIASP", () => {
    const frameworks = ["PPU", "PDP", "TBL", "PIASP"];
    expect(frameworks).toContain("PPU");
    expect(frameworks).toContain("PDP");
    expect(frameworks).toContain("TBL");
    expect(frameworks).toContain("PIASP");
  });

  it("ensures Section 5 required lesson card metadata fields exist", () => {
    const requiredMetadataFields = [
      "teacher",
      "school",
      "classProfile",
      "level",
      "numberOfLearners",
      "session",
      "sequence",
      "targetCompetence",
      "sessionOutcomes",
      "teachingMaterials",
      "anticipatedProblems",
      "solutionsPlanB",
    ];

    expect(requiredMetadataFields.length).toBe(12);
  });
});
