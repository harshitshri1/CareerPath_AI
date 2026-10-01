"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScoreGauge from "@/components/ScoreGauge";
import {
  getProfile,
  saveProfile,
  saveScore,
  getScore,
  type StudentProfile,
} from "@/lib/store";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clock,
  ExternalLink,
  RefreshCw,
  Target,
  Briefcase,
  FileText,
  Mic,
  GraduationCap,
  Award,
  Layers,
  Check,
  TrendingUp,
  User,
  ChevronRight,
  Code2,
  FolderGit2,
  ShieldCheck,
  Flame,
  ArrowUpRight,
} from "lucide-react";

interface MissingSkill {
  skill: string;
  importance: "Critical" | "Important" | "Nice-to-have";
  course: string;
  platform: string;
}

interface RecommendedCourse {
  name: string;
  platform: string;
  duration: string;
  url: string;
}

interface SkillGapResult {
  overallScore: number;
  breakdown: {
    academics: number;
    technicalSkills: number;
    projects: number;
    certifications: number;
    interviewReadiness: number;
  };
  existingSkills: string[];
  missingSkills: MissingSkill[];
  recommendedCourses: RecommendedCourse[];
  actionPlan: string[];
}

const STORAGE_RESULT_KEY = "CareerPath-skillgap-data";

const SAMPLE_PROFILE: StudentProfile = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.edu.in",
  college: "National Institute of Technology, Karnataka",
  degree: "B.Tech Computer Science & Engineering",
  year: "3rd Year",
  cgpa: "8.6",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "HTML5/CSS3",
    "Git & GitHub",
    "SQL Basics",
  ],
  projects: [
    {
      name: "Campus Marketplace Platform",
      description:
        "Full-stack student barter web app with React, Express, and MongoDB featuring real-time messaging and authentication.",
    },
    {
      name: "Smart Attendance System",
      description:
        "Computer vision facial recognition attendance logger using Python and OpenCV with 94% test set accuracy.",
    },
  ],
  certifications: [
    "AWS Certified Cloud Practitioner",
    "NPTEL Programming & Data Structures in Python",
  ],
  experience: [
    "Frontend Intern at TechVanguard Solutions (2 months, Summer 2024)",
  ],
  resumeText:
    "Aarav Sharma | NIT Karnataka | CGPA 8.6 | Experienced with React, Node.js, Python, PostgreSQL, and cloud deployments...",
  targetRole: "Full Stack Software Engineer",
};

const COMMON_ROLES = [
  "Full Stack Software Engineer",
  "Frontend Web Developer",
  "Backend Systems Engineer",
  "AI & Machine Learning Engineer",
  "Cloud & DevOps Engineer",
  "Data Analyst & BI Specialist",
];

export default function SkillGapPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [targetRole, setTargetRole] = useState<string>("Full Stack Software Engineer");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SkillGapResult | null>(null);

  const [filterImportance, setFilterImportance] = useState<"All" | "Critical" | "Important" | "Nice-to-have">("All");
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  // 1. On mount, load profile and cached results
  useEffect(() => {
    setIsMounted(true);
    const loadedProfile = getProfile();

    if (loadedProfile) {
      setProfile(loadedProfile);
      const role = loadedProfile.targetRole || "Full Stack Software Engineer";
      setTargetRole(role);

      // Check if role is in preset or custom
      if (!COMMON_ROLES.includes(role)) {
        setIsCustomRole(true);
        setCustomRoleInput(role);
      }

      // Check for cached skill gap analysis
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_RESULT_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as SkillGapResult;
            setResults(parsed);
          } catch {
            // ignore JSON parse error
          }
        }
      }
    }
  }, []);

  // Handler: Run skill gap analysis
  const handleAnalyze = async (overrideProfile?: StudentProfile, overrideRole?: string) => {
    const currentProfile = overrideProfile || profile;
    if (!currentProfile) {
      setError("Please complete your profile before running skill gap analysis.");
      return;
    }

    const effectiveRole =
      overrideRole ||
      (isCustomRole && customRoleInput.trim() ? customRoleInput.trim() : targetRole);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: currentProfile,
          targetRole: effectiveRole,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to analyze skills`);
      }

      const data: SkillGapResult = await response.json();
      setResults(data);

      // Save overall score to store
      saveScore(data.overallScore);

      // Update student profile with latest score and targetRole
      const updatedProfile: StudentProfile = {
        ...currentProfile,
        targetRole: effectiveRole,
        careerReadinessScore: data.overallScore,
      };
      saveProfile(updatedProfile);
      setProfile(updatedProfile);

      // Cache result for quick page switches
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(data));
      }
    } catch (err: unknown) {
      console.error("Skill gap analysis error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while analyzing skills. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Load demo sample profile
  const handleLoadSample = () => {
    saveProfile(SAMPLE_PROFILE);
    setProfile(SAMPLE_PROFILE);
    setTargetRole(SAMPLE_PROFILE.targetRole || "Full Stack Software Engineer");
    setIsCustomRole(false);
    handleAnalyze(SAMPLE_PROFILE, SAMPLE_PROFILE.targetRole);
  };

  // Toggle action plan step completion
  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Format Radar data
  const radarData = results
    ? [
        {
          subject: "Academics",
          score: results.breakdown.academics,
          fullMark: 100,
        },
        {
          subject: "Technical Skills",
          score: results.breakdown.technicalSkills,
          fullMark: 100,
        },
        {
          subject: "Projects & Exp",
          score: results.breakdown.projects,
          fullMark: 100,
        },
        {
          subject: "Certifications",
          score: results.breakdown.certifications,
          fullMark: 100,
        },
        {
          subject: "Interview Ready",
          score: results.breakdown.interviewReadiness,
          fullMark: 100,
        },
      ]
    : [];

  // Filter missing skills
  const filteredMissingSkills = results
    ? results.missingSkills.filter((item) => {
        if (filterImportance === "All") return true;
        return item.importance === filterImportance;
      })
    : [];

  const criticalCount = results?.missingSkills.filter((s) => s.importance === "Critical").length || 0;
  const importantCount = results?.missingSkills.filter((s) => s.importance === "Important").length || 0;
  const niceCount = results?.missingSkills.filter((s) => s.importance === "Nice-to-have").length || 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
              <span>AI Skill Intelligence & Employability Metric</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Skill Gap Analysis & Readiness
            </h1>
            <p className="mt-1 text-slate-600 text-sm sm:text-base max-w-3xl">
              Evaluate your coursework, projects, and technical competencies against
              rigorous industry standards. Uncover blind spots and follow personalized roadmaps.
            </p>
          </div>

          {/* Quick Stats or CTA buttons */}
          {profile && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 shadow-sm text-sm py-2.5 px-5"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    <span>Analyzing Benchmarks...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>{results ? "Refresh Analysis" : "Analyze My Skills"}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Target Role & Profile Bar */}
        {profile && (
          <div className="card bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-base flex-shrink-0">
                  {profile.name ? profile.name.slice(0, 2).toUpperCase() : "ME"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{profile.name || "Student"}</span>
                    <span className="badge-primary text-xs py-0.5 px-2">
                      CGPA {profile.cgpa || "N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {profile.degree || "B.Tech"} • {profile.college || "University"} • {profile.skills?.length || 0} Listed Skills
                  </p>
                </div>
              </div>

              {/* Target Role Selector */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                    Target Role:
                  </span>
                </div>

                {!isCustomRole ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={targetRole}
                      onChange={(e) => {
                        if (e.target.value === "__custom__") {
                          setIsCustomRole(true);
                          setCustomRoleInput("");
                        } else {
                          setTargetRole(e.target.value);
                        }
                      }}
                      className="text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                      {COMMON_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                      <option value="__custom__">+ Custom Role...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Cloud Security Specialist"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none w-56"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomRole(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
                    >
                      Presets
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleAnalyze()}
                  disabled={isLoading}
                  className="btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Update Target</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="text-sm">
              <p className="font-bold">Analysis Warning</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* 1. NO PROFILE STATE */}
        {!profile && (
          <div className="card bg-white border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 mx-auto mb-4">
              <User className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Student Profile Detected
            </h2>
            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              To calculate your multidimensional Career Readiness Score and generate a custom
              skill gap report, we need your academic record, declared skills, and projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/profile"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
              >
                <span>Create Your Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={handleLoadSample}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span>Try With Demo Student</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. INITIAL UNANALYZED STATE (Profile exists, but results not yet generated) */}
        {profile && !results && !isLoading && (
          <div className="card bg-gradient-to-br from-white via-primary-50/20 to-slate-50 border border-slate-200 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/30">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Ready to Analyze Your Career Readiness?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              We will compare your current profile against {targetRole} job requisitions from top tech employers.
              You will receive a unified 0-100 score, 5-dimension radar breakdown, and curated learning recommendations.
            </p>
            <button
              onClick={() => handleAnalyze()}
              className="btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2 mx-auto shadow-lg shadow-primary-500/25 group"
            >
              <Sparkles className="h-5 w-5 text-primary-200 group-hover:scale-110 transition-transform" />
              <span>Analyze My Skills Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* 3. LOADING STATE */}
        {isLoading && (
          <div className="card bg-white border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-6">
              <span className="spinner w-8 h-8 border-3 border-primary-600 border-t-transparent" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Auditing Profile Against Industry Standards
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Gemini AI is assessing your CGPA, technical skills, projects, and certifications against
              competencies for <span className="font-semibold text-slate-800">{targetRole}</span>...
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full max-w-md mx-auto overflow-hidden">
              <div className="bg-primary-600 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* 4. RESULTS DISPLAY */}
        {results && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            {/* a & b: Score Gauge + Radar Breakdown Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Prominent Career Readiness Score */}
              <div className="lg:col-span-5 card bg-white border border-slate-200 flex flex-col items-center justify-between p-6 sm:p-8 text-center relative overflow-hidden shadow-sm">
                <div className="w-full flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Composite Metric
                    </span>
                    <h3 className="text-base font-bold text-slate-900">Career Readiness Score</h3>
                  </div>
                  <span className="badge-primary text-xs py-1 px-2.5">
                    {targetRole.slice(0, 20)}
                  </span>
                </div>

                {/* ScoreGauge Component */}
                <div className="my-2 flex flex-col items-center justify-center">
                  <ScoreGauge score={results.overallScore} size={210} label="Readiness Index" />
                </div>

                {/* Contextual Status callout */}
                <div className="w-full mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Market Placement Status:</span>
                    <span
                      className={`font-bold ${
                        results.overallScore >= 80
                          ? "text-emerald-600"
                          : results.overallScore >= 60
                          ? "text-indigo-600"
                          : results.overallScore >= 40
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {results.overallScore >= 80
                        ? "Tier-1 Competitive"
                        : results.overallScore >= 60
                        ? "Placement Eligible"
                        : results.overallScore >= 40
                        ? "Foundation Stage"
                        : "Action Required"}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {results.overallScore >= 75
                      ? "Your profile demonstrates balanced academic rigor and foundational project work. Closing 2-3 specific technical gaps will unlock top-tier roles."
                      : "Strengthening practical project implementations and acquiring role-critical tools will rapidly elevate your hiring readiness."}
                  </p>
                </div>

                <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Target: {targetRole}</span>
                  <button
                    onClick={() => handleAnalyze()}
                    className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Re-evaluate</span>
                  </button>
                </div>
              </div>

              {/* Right Column: 5-Dimension Radar Chart & Detailed Sliders */}
              <div className="lg:col-span-7 card bg-white border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Diagnostic Evaluation
                    </span>
                    <h3 className="text-base font-bold text-slate-900">5-Dimensional Breakdown</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Layers className="h-4 w-4 text-primary-600" />
                    <span>Benchmark: 100 Max</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Radar Chart */}
                  <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: "#94a3b8", fontSize: 10 }}
                          />
                          <Radar
                            name="Candidate Score"
                            dataKey="score"
                            stroke="#6366f1"
                            fill="#6366f1"
                            fillOpacity={0.35}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg">
                                    <span className="font-semibold">{data.subject}: </span>
                                    <span className="font-bold text-primary-300">
                                      {data.score} / 100
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-slate-400">Loading chart view...</div>
                    )}
                  </div>

                  {/* Dimension score bars */}
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                          <span>Academics (CGPA)</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {results.breakdown.academics}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${results.breakdown.academics}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-blue-500" />
                          <span>Technical Skills</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {results.breakdown.technicalSkills}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${results.breakdown.technicalSkills}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <FolderGit2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Projects & Experience</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {results.breakdown.projects}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${results.breakdown.projects}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          <span>Certifications</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {results.breakdown.certifications}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${results.breakdown.certifications}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <Mic className="h-3.5 w-3.5 text-rose-500" />
                          <span>Interview Readiness</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {results.breakdown.interviewReadiness}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${results.breakdown.interviewReadiness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* c: Skills You Have */}
            <div className="card bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Skills You Have</h3>
                    <p className="text-xs text-slate-500">
                      Validated proficiencies that match expectations for {targetRole}
                    </p>
                  </div>
                </div>
                <span className="badge-green text-xs font-bold py-1 px-3 self-start sm:self-auto">
                  {results.existingSkills.length} Verified
                </span>
              </div>

              {results.existingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {results.existingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No overlapping skills identified. Complete your profile to list your proficiencies.
                </p>
              )}
            </div>

            {/* d: Skills You're Missing */}
            <div className="card bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Skills You&apos;re Missing</h3>
                    <p className="text-xs text-slate-500">
                      Priority gaps to bridge for competitive readiness in {targetRole}
                    </p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {(["All", "Critical", "Important", "Nice-to-have"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterImportance(tab)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                        filterImportance === tab
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab}{" "}
                      <span className="text-[10px] text-slate-400">
                        (
                        {tab === "All"
                          ? results.missingSkills.length
                          : tab === "Critical"
                          ? criticalCount
                          : tab === "Important"
                          ? importantCount
                          : niceCount}
                        )
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMissingSkills.map((item, idx) => {
                  const isCrit = item.importance === "Critical";
                  const isImp = item.importance === "Important";

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                        isCrit
                          ? "bg-red-50/40 border-red-200/80 hover:border-red-300"
                          : isImp
                          ? "bg-amber-50/40 border-amber-200/80 hover:border-amber-300"
                          : "bg-blue-50/30 border-blue-200/80 hover:border-blue-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              isCrit
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : isImp
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {item.importance}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase">
                            {item.platform}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">
                          {item.skill}
                        </h4>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/60">
                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1 font-medium">
                          <BookOpen className="h-3.5 w-3.5 text-primary-600" />
                          <span>Recommended Learning:</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                          {item.course}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* e: Recommended Courses */}
            <div className="card bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Recommended Courses</h3>
                    <p className="text-xs text-slate-500">
                      Curated courses from Coursera, NPTEL, Udemy, and top universities to bridge gaps
                    </p>
                  </div>
                </div>
                <span className="badge-primary text-xs font-bold py-1 px-3">
                  {results.recommendedCourses.length} Curated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {results.recommendedCourses.map((course, idx) => {
                  const isCoursera = course.platform.toLowerCase().includes("coursera");
                  const isUdemy = course.platform.toLowerCase().includes("udemy");
                  const isNptel = course.platform.toLowerCase().includes("nptel");

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md hover:border-primary-300 transition-all bg-white group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              isCoursera
                                ? "bg-blue-100 text-blue-800"
                                : isUdemy
                                ? "bg-purple-100 text-purple-800"
                                : isNptel
                                ? "bg-orange-100 text-orange-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {course.platform}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-3 mb-2">
                          {course.name}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 group-hover:translate-x-0.5 transition-all"
                        >
                          <span>Explore on {course.platform}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* f: Prioritized Action Plan */}
            <div className="card bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Prioritized Action Plan</h3>
                    <p className="text-xs text-slate-500">
                      Sequential roadmap to advance your score from {results.overallScore} to 90+
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {Object.values(completedSteps).filter(Boolean).length} /{" "}
                  {results.actionPlan.length} Completed
                </div>
              </div>

              <div className="space-y-3.5">
                {results.actionPlan.map((step, idx) => {
                  const isDone = completedSteps[idx] || false;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isDone
                          ? "bg-slate-50/80 border-slate-200 opacity-70"
                          : "bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm"
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : "border-2 border-slate-300 hover:border-primary-500 text-transparent"
                        }`}
                      >
                        <Check className="h-4 w-4 stroke-[3]" />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                            Step {idx + 1}
                          </span>
                          {idx === 0 && (
                            <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              Immediate Priority
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            isDone ? "line-through text-slate-400" : "text-slate-800 font-medium"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Related Navigation Cards */}
            <div className="pt-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Next Steps in Your Journey</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Leverage your skill gap findings across the CareerPath AI ecosystem
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Browse Opportunities */}
                <Link
                  href="/opportunities"
                  className="card group hover:border-primary-300 hover:shadow-md transition-all p-6 flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                      Browse Opportunities →
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Match your verified skills with current corporate drives, startups, and PSU/government openings.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore 1000+ drives</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>

                {/* 2. Improve Resume */}
                <Link
                  href="/resume-assistant"
                  className="card group hover:border-primary-300 hover:shadow-md transition-all p-6 flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                      Improve Resume →
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Scan your resume against ATS filters and automatically add the missing keywords uncovered here.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                    <span>Audit ATS compatibility</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>

                {/* 3. Practice Interview */}
                <Link
                  href="/mock-interview"
                  className="card group hover:border-primary-300 hover:shadow-md transition-all p-6 flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Mic className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                      Practice Interview →
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Simulate live technical and behavioral interviews tailored specifically to {targetRole}.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                    <span>Start AI interview</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
