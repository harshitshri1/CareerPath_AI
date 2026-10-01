"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Target,
  Briefcase,
  Layers,
  Info,
  ShieldCheck,
  ChevronRight,
  Download,
  Award,
  BookOpen,
} from "lucide-react";
import { getProfile, saveScore, type StudentProfile } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SectionFeedbackItem {
  section: string;
  status: "good" | "needs-improvement" | "missing";
  feedback: string;
  improved?: string;
}

interface BulletImprovementItem {
  original: string;
  improved: string;
}

interface ResumeAnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  keywordDensityAssessment?: string;
  sectionFeedback: SectionFeedbackItem[];
  bulletImprovements: BulletImprovementItem[];
  overallRecommendations: string[];
}

const COMMON_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Software Engineer",
  "Data Scientist",
  "AI / Machine Learning Engineer",
  "DevOps / Cloud Engineer",
  "Mobile App Developer (iOS/Android)",
  "Cybersecurity Analyst",
];

const SAMPLE_RESUME = `John Doe
Email: john.doe@example.com | Phone: +91 98765 43210
Location: Bengaluru, India | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

Summary:
Hardworking and passionate Computer Science student looking for an entry-level software engineer role where I can utilize my programming skills and learn new technologies.

Education:
B.Tech in Computer Science and Engineering
ABC Institute of Technology, 2021 - 2025
CGPA: 8.4/10.0

Technical Skills:
Languages: Java, C++, JavaScript, Python, HTML, CSS
Frameworks & Libraries: React, Node.js, Express
Tools & Databases: Git, MySQL, MongoDB, VS Code

Experience:
Web Development Intern | TechCorp Solutions (June 2024 - August 2024)
- Worked on building web applications using React and Node.js.
- Responsible for fixing bugs and improving database queries.
- Collaborated with team members to deliver project features on time.

Projects:
E-Commerce Web Application (React, Node.js, MongoDB)
- Created an e-commerce platform with product catalog and shopping cart.
- Used MongoDB for storing user and product data.
- Built authentication using JWT.

Task Management Tool (JavaScript, HTML, CSS)
- Developed a task management web app for daily to-do lists.
- Implemented drag-and-drop feature and local storage persistence.`;

export default function ResumeAssistantPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [customRole, setCustomRole] = useState("");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  // Copy states
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedBulletIndex, setCopiedBulletIndex] = useState<number | null>(null);
  const [copiedSectionIndex, setCopiedSectionIndex] = useState<number | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Load initial profile data if present
  useEffect(() => {
    try {
      const profile = getProfile();
      if (profile) {
        if (profile.resumeText && profile.resumeText.trim().length > 0) {
          setResumeText(profile.resumeText);
        }
        if (profile.targetRole && profile.targetRole.trim().length > 0) {
          if (COMMON_ROLES.includes(profile.targetRole)) {
            setTargetRole(profile.targetRole);
            setIsCustomRole(false);
          } else {
            setTargetRole("custom");
            setCustomRole(profile.targetRole);
            setIsCustomRole(true);
          }
        }
        setProfileLoaded(true);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }, []);

  const handleRoleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomRole(true);
      setTargetRole("custom");
    } else {
      setIsCustomRole(false);
      setTargetRole(val);
    }
  };

  const activeRole = isCustomRole ? customRole || "Software Engineer" : targetRole;

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste or write your resume text first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resume-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole: activeRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze resume.");
      }

      const data: ResumeAnalysisResult = await response.json();
      setResult(data);

      // Save score to local store for ecosystem integration
      if (typeof data.atsScore === "number") {
        saveScore(data.atsScore);
      }

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("analysis-results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err: unknown) {
      console.error("Resume analysis error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while analyzing your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setTargetRole("Full Stack Developer");
    setIsCustomRole(false);
    setError(null);
  };

  const handleLoadFromProfile = () => {
    const profile = getProfile();
    if (profile && profile.resumeText) {
      setResumeText(profile.resumeText);
      if (profile.targetRole) {
        if (COMMON_ROLES.includes(profile.targetRole)) {
          setTargetRole(profile.targetRole);
          setIsCustomRole(false);
        } else {
          setTargetRole("custom");
          setCustomRole(profile.targetRole);
          setIsCustomRole(true);
        }
      }
      setError(null);
    } else {
      setError("No resume text found in your saved profile. You can paste it directly below.");
    }
  };

  const handleCopyAllSuggestions = async () => {
    if (!result) return;

    const sectionsText = result.sectionFeedback
      .map(
        (s) =>
          `[${s.section.toUpperCase()}] (${s.status.toUpperCase()})\nFeedback: ${s.feedback}${
            s.improved ? `\nExample:\n${s.improved}` : ""
          }\n`
      )
      .join("\n");

    const bulletsText = result.bulletImprovements
      .map(
        (b, i) =>
          `${i + 1}. ORIGINAL: ${b.original}\n   IMPROVED: ${b.improved}\n`
      )
      .join("\n");

    const recsText = result.overallRecommendations
      .map((r, i) => `${i + 1}. ${r}`)
      .join("\n");

    const fullReport = `=== CareerPath AI: RESUME ATS AUDIT & IMPROVEMENT REPORT ===
Target Role: ${activeRole}
ATS Readiness Score: ${result.atsScore}/100

MISSING KEYWORDS TO ADD:
${result.missingKeywords.join(", ")}

PRESENT MATCHING KEYWORDS:
${result.presentKeywords.join(", ")}

KEYWORD DENSITY ASSESSMENT:
${result.keywordDensityAssessment || "Ensure keywords are woven naturally into quantified project impact bullets."}

SECTION-BY-SECTION FEEDBACK:
${sectionsText}

IMPROVED BULLET POINTS (XYZ / STAR FORMULA):
${bulletsText}

TOP RECOMMENDATIONS:
${recsText}
`;

    try {
      await navigator.clipboard.writeText(fullReport);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      console.warn("Failed to copy using navigator.clipboard");
    }
  };

  const handleCopyText = async (text: string, type: "bullet" | "section", index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "bullet") {
        setCopiedBulletIndex(index);
        setTimeout(() => setCopiedBulletIndex(null), 2000);
      } else {
        setCopiedSectionIndex(index);
        setTimeout(() => setCopiedSectionIndex(null), 2000);
      }
    } catch {
      console.warn("Failed to copy");
    }
  };

  // Color coding helper for ATS score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: "#10b981", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Excellent Match" };
    if (score >= 65) return { stroke: "#6366f1", text: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200", label: "Competitive" };
    if (score >= 45) return { stroke: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Needs Improvement" };
    return { stroke: "#ef4444", text: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "High Risk of Rejection" };
  };

  const scoreInfo = result ? getScoreColor(result.atsScore) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered ATS Resume Optimizer
        </div>
        <h1 className="section-title text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Smart Resume Assistant
        </h1>
        <p className="section-subtitle mt-3 text-slate-600 text-base sm:text-lg">
          Audit your resume against real-world Applicant Tracking Systems (ATS).
          Uncover missing industry keywords, get quantified bullet rewrites, and boost interview call-back rates.
        </p>
      </div>

      {/* Input Section */}
      <div className="card border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Resume & Target Role Input
              </h2>
              <p className="text-xs text-slate-500">
                Paste your current resume and specify your desired job position
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Load Sample Resume
            </button>
            {profileLoaded && (
              <button
                type="button"
                onClick={handleLoadFromProfile}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload from Profile
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Target Role Selector */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary-600" />
              Target Role / Desired Position
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={cn("sm:col-span-3", isCustomRole ? "sm:col-span-1" : "")}>
                <select
                  value={targetRole}
                  onChange={handleRoleSelectChange}
                  className="input-field cursor-pointer"
                >
                  {COMMON_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                  <option value="custom">Other / Custom Role...</option>
                </select>
              </div>

              {isCustomRole && (
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Enter custom role (e.g., Cloud Architect, Blockchain Developer)"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              The ATS optimizer compares your resume keywords and accomplishments against modern industry standards for this exact job title.
            </p>
          </div>

          {/* Resume Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label mb-0 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary-600" />
                Paste Resume Text
              </label>
              <div className="text-xs text-slate-400 font-mono">
                {resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : "0 words"} • {resumeText.length} characters
              </div>
            </div>
            <textarea
              rows={11}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume here (including Contact Info, Summary, Education, Skills, Experience, and Projects)..."
              className="input-field font-mono text-sm leading-relaxed resize-y focus:ring-primary-500"
            />
            <div className="flex justify-between items-center mt-1.5 text-xs text-slate-500">
              <span>Tip: Include your full project descriptions and experience bullet points for the most accurate keyword score.</span>
              {resumeText && (
                <button
                  type="button"
                  onClick={() => setResumeText("")}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Evaluated against Fortune 500 ATS parsing algorithms & modern hiring criteria</span>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2 text-base shadow-lg shadow-primary-500/20"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Auditing Resume with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div id="analysis-results" className="space-y-8 pt-4">
          {/* Top Banner with Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                Audit Complete
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Optimization Results for: <span className="text-primary-700">{activeRole}</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyAllSuggestions}
                className={cn(
                  "px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-sm border",
                  copiedAll
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                )}
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Suggestions Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-primary-600" />
                    <span>Copy Improved Resume Suggestions</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2a: ATS Score & Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Circular Gauge Card */}
            <div className="lg:col-span-4 card flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-white to-slate-50/50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                ATS Compatibility Rating
              </span>

              {/* Circular SVG Gauge */}
              <div className="relative inline-flex items-center justify-center">
                <svg width={210} height={210} className="transform -rotate-90">
                  <circle
                    cx={105}
                    cy={105}
                    r={84}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={14}
                  />
                  <circle
                    cx={105}
                    cy={105}
                    r={84}
                    fill="none"
                    stroke={scoreInfo?.stroke || "#6366f1"}
                    strokeWidth={14}
                    strokeDasharray={`${(result.atsScore / 100) * (2 * Math.PI * 84)} ${2 * Math.PI * 84}`}
                    strokeLinecap="round"
                    className="score-circle transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={cn(
                      "text-5xl font-extrabold tracking-tight",
                      scoreInfo?.text
                    )}
                  >
                    {result.atsScore}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mt-0.5">
                    OUT OF 100
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={cn(
                    "inline-block px-3.5 py-1 rounded-full text-sm font-bold border",
                    scoreInfo?.bg,
                    scoreInfo?.text,
                    scoreInfo?.border
                  )}
                >
                  {scoreInfo?.label}
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Target threshold for top applicant rankings: <span className="font-semibold text-slate-700">75+</span>
                </p>
              </div>
            </div>

            {/* ATS Explanation & Breakdown */}
            <div className="lg:col-span-8 card flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 text-primary-700 font-bold text-lg mb-2">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <h3>What is an ATS and Why Does This Score Matter?</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  An <strong className="text-slate-800">Applicant Tracking System (ATS)</strong> is automated recruiting software used by over <strong className="text-slate-800">98% of Fortune 500 companies</strong> and thousands of tech startups. Before any human recruiter or hiring manager reviews your application, the ATS parses your resume, matches your technical credentials against the job description, and filters out candidates who lack key terminology or clear impact quantification.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Present Keywords
                    </div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">
                      {result.presentKeywords.length}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Matched to {activeRole}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Missing Keywords
                    </div>
                    <div className="text-2xl font-bold text-red-600 mt-1">
                      {result.missingKeywords.length}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      High-priority additions
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Section Health
                    </div>
                    <div className="text-2xl font-bold text-primary-600 mt-1">
                      {
                        result.sectionFeedback.filter(
                          (s) => s.status === "good"
                        ).length
                      }
                      /{result.sectionFeedback.length}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Sections marked good
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  Resumes scoring above 80 receive up to <strong>3.5x more interview requests</strong> than average applicant submissions.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2b: Keyword Analysis */}
          <div className="card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Keyword & Industry Terminology Analysis
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Target Role: <strong className="text-slate-800">{activeRole}</strong>
              </span>
            </div>

            {/* Keyword Density Assessment */}
            {result.keywordDensityAssessment && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                    Keyword Density Assessment
                  </div>
                  <p className="text-sm text-indigo-950 mt-1 leading-relaxed">
                    {result.keywordDensityAssessment}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missing Keywords (Red Badges) */}
              <div className="space-y-3 p-4 rounded-xl border border-red-100 bg-red-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <h4>Missing Keywords (Add to Resume)</h4>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                    {result.missingKeywords.length} Missing
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  ATS algorithms look for these role-critical technologies and tools. Weave them into your Skills, Experience, or Project descriptions:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.missingKeywords.length > 0 ? (
                    result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="badge-red inline-flex items-center gap-1.5 py-1 px-3 text-xs font-semibold shadow-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      None! Your resume covers all core role keywords.
                    </span>
                  )}
                </div>
              </div>

              {/* Present Keywords (Green Badges) */}
              <div className="space-y-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <h4>Present Keywords (Found in Resume)</h4>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                    {result.presentKeywords.length} Detected
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  These verified technologies in your resume match recruiter search filters for this role:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.presentKeywords.length > 0 ? (
                    result.presentKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="badge-green inline-flex items-center gap-1.5 py-1 px-3 text-xs font-semibold shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      No matching keywords identified. Add core technologies to increase parseability.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2c: Section-by-Section Feedback */}
          <div className="card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Section-by-Section Audit & Recommendations
                </h3>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Evaluation of 6 Core Resume Sections
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sectionFeedback.map((section, idx) => {
                const isGood = section.status === "good";
                const isWarning = section.status === "needs-improvement";

                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex flex-col justify-between",
                      isGood
                        ? "border-emerald-200 bg-white"
                        : isWarning
                        ? "border-amber-200 bg-amber-50/20"
                        : "border-red-200 bg-red-50/20"
                    )}
                  >
                    <div>
                      {/* Section Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isGood ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                          <h4 className="font-bold text-slate-900 text-sm">
                            {section.section}
                          </h4>
                        </div>

                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full capitalize",
                            isGood
                              ? "bg-emerald-100 text-emerald-700"
                              : isWarning
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {section.status.replace("-", " ")}
                        </span>
                      </div>

                      {/* Feedback Body */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {section.feedback}
                      </p>

                      {/* Improved snippet / suggested formatting */}
                      {section.improved && (
                        <div className="mt-2 p-2.5 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono relative group">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans mb-1 pb-1 border-b border-slate-800">
                            <span>Recommended ATS Snippet:</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(section.improved!, "section", idx)
                              }
                              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                              title="Copy snippet"
                            >
                              {copiedSectionIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-[10px] text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span className="text-[10px]">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                            {section.improved}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2d: Improved Bullet Points (Before / After side-by-side) */}
          <div className="card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Bullet Point Rewrites: Before & After
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Rewritten using Google&apos;s XYZ / STAR Impact Formula
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Weak bullet points describe passive day-to-day duties. Strong bullet points state:
              <strong className="text-slate-800"> &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo;</strong>.
              Replace your resume bullets with these high-converting alternatives:
            </p>

            <div className="space-y-4">
              {result.bulletImprovements.map((bullet, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs"
                >
                  <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Before (Original) */}
                    <div className="lg:col-span-5 bg-red-50/40 p-3.5 rounded-lg border border-red-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          Original (Weak / Passive)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        &ldquo;{bullet.original}&rdquo;
                      </p>
                    </div>

                    {/* Arrow Divider */}
                    <div className="lg:col-span-1 flex justify-center text-slate-400">
                      <ArrowRight className="w-5 h-5 hidden lg:block text-primary-500" />
                      <div className="lg:hidden text-center py-1">
                        <ArrowRight className="w-4 h-4 transform rotate-90 text-primary-500" />
                      </div>
                    </div>

                    {/* After (Improved) */}
                    <div className="lg:col-span-6 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          ATS-Optimized (STAR / Quantified)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(bullet.improved, "bullet", idx)
                          }
                          className="text-xs font-semibold px-2 py-1 rounded bg-white text-slate-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          {copiedBulletIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy Bullet</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {bullet.improved}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2e: Overall Recommendations */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                Top Priority Action Plan
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Complete these critical improvements before submitting your resume to applicant portals:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {result.overallRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="card bg-gradient-to-r from-primary-600 to-indigo-700 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold">Ready to apply with confidence?</h4>
              <p className="text-xs text-primary-100 mt-1">
                Copy all ATS recommendations and update your resume document before your next job application.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyAllSuggestions}
              className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 flex-shrink-0"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-primary-600" />
                  <span>Copy All Improvement Suggestions</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
