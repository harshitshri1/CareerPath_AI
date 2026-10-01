export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  degree: string;
  year: string;
  cgpa: string;
  skills: string[];
  projects: { name: string; description: string }[];
  certifications: string[];
  experience: string[];
  resumeText: string;
  targetRole?: string;
  careerReadinessScore?: number;
}

const PROFILE_KEY = "careerready-profile";
const SCORE_KEY = "careerready-score";
const CAREER_KEY = "careerready-careers";

export function saveProfile(profile: StudentProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

export function getProfile(): StudentProfile | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
      try {
        return JSON.parse(data) as StudentProfile;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearProfile(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SCORE_KEY);
    localStorage.removeItem(CAREER_KEY);
  }
}

export function saveScore(score: number): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  }
}

export function getScore(): number | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(SCORE_KEY);
    if (data) return JSON.parse(data);
  }
  return null;
}

export function saveCareerPaths(paths: unknown): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CAREER_KEY, JSON.stringify(paths));
  }
}

export function getCareerPaths(): unknown | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CAREER_KEY);
    if (data) return JSON.parse(data);
  }
  return null;
}
