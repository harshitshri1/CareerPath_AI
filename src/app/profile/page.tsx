"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Sparkles,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  X,
  Target,
  Check,
  Eye,
  FileCheck2,
} from "lucide-react";
import { getProfile, saveProfile, clearProfile, type StudentProfile } from "@/lib/store";
import { cn } from "@/lib/utils";

const DEGREE_OPTIONS = [
  "B.Tech - Computer Science & Engineering",
  "B.Tech - Information Technology",
  "B.Tech - Electronics & Communication",
  "B.Tech - Electrical Engineering",
  "B.Tech - Mechanical Engineering",
  "BCA - Bachelor of Computer Applications",
  "MCA - Master of Computer Applications",
  "B.Sc - Computer Science",
  "B.Sc - Data Science / AI",
  "M.Tech - Computer Science",
  "MBA - Information Technology",
  "B.E. - Engineering",
  "Other Degree",
];

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgraduate Year 1",
  "Postgraduate Year 2",
  "Recent Graduate",
];

const POPULAR_SKILLS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "SQL",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "Git",
  "MongoDB",
  "Machine Learning",
  "Data Structures",
];

const SAMPLE_RESUME = `PRIYA SHARMA
Email: priya.sharma@nitk.edu.in | Phone: +91 98765 43210
Location: Bengaluru, Karnataka, India
GitHub: github.com/priyasharma | LinkedIn: linkedin.com/in/priyasharma

EDUCATION
National Institute of Technology Karnataka (NITK), Surathkal
Bachelor of Technology in Computer Science & Engineering (B.Tech)
Current Academic Year: 3rd Year | Cumulative CGPA: 8.85 / 10.0
Expected Graduation: 2026

TECHNICAL SKILLS
- Programming Languages: Python, TypeScript, JavaScript, C++, Java, SQL
- Web Development: React, Next.js, Node.js, Express, Tailwind CSS, HTML5, CSS3
- Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker
- Concepts: Data Structures & Algorithms, REST APIs, Microservices, Git, CI/CD

EXPERIENCE & INTERNSHIPS
- Full Stack Developer Intern at CloudTech Labs (Summer 2024):
  Developed responsive web microservices dashboard in Next.js 14 and PostgreSQL, boosting API throughput by 35%.
- Open Source Contributor & Technical Lead at NITK Coding Society:
  Conducted coding workshops and mentored 100+ students in web development and data structures.

PROJECTS
1. Campus Placement & Career Readiness Portal
   Built an end-to-end placement readiness platform with AI resume evaluation, mock interviews, and automated skill-gap analysis. Used Next.js 14, Tailwind CSS, and Google Gemini API.
2. Real-Time Collaborative Code Editor
   Engineered a multi-user collaborative code execution environment using WebSockets, TypeScript, Redis pub/sub, and sandboxed Docker runners.

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- Meta Front-End Developer Professional Certificate (Coursera)
- HackerRank Problem Solving Gold 5-Star Badge
`;

const INITIAL_PROFILE: StudentProfile = {
  name: "",
  email: "",
  college: "",
  degree: "B.Tech - Computer Science & Engineering",
  year: "3rd Year",
  cgpa: "",
  skills: [],
  projects: [],
  certifications: [],
  experience: [],
  resumeText: "",
  targetRole: "",
};

export default function ProfilePage() {
  const [formData, setFormData] = useState<StudentProfile>(INITIAL_PROFILE);
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [expInput, setExpInput] = useState("");

  // Project state for adding new project
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  // Status & loading flags
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string | null>(null);
  const [parseErrorMsg, setParseErrorMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Stored profile state for the Summary Card
  const [savedProfile, setSavedProfile] = useState<StudentProfile | null>(null);

  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // On mount, check if profile exists via getProfile() and pre-fill form
  useEffect(() => {
    const existing = getProfile();
    if (existing && (existing.name || existing.skills?.length > 0)) {
      setFormData(existing);
      setSavedProfile(existing);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add skill from input (handles comma-separated and Enter)
  const addSkill = (skillToAdd?: string) => {
    const raw = skillToAdd !== undefined ? skillToAdd : skillInput;
    if (!raw.trim()) return;

    const tokens = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setFormData((prev) => {
      const existingLower = new Set(prev.skills.map((s) => s.toLowerCase()));
      const uniqueNew = tokens.filter((t) => !existingLower.has(t.toLowerCase()));
      return {
        ...prev,
        skills: [...prev.skills, ...uniqueNew],
      };
    });

    if (skillToAdd === undefined) {
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Add certification
  const addCertification = () => {
    if (!certInput.trim()) return;
    const tokens = certInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    setFormData((prev) => {
      const existingLower = new Set(prev.certifications.map((c) => c.toLowerCase()));
      const uniqueNew = tokens.filter((t) => !existingLower.has(t.toLowerCase()));
      return {
        ...prev,
        certifications: [...prev.certifications, ...uniqueNew],
      };
    });
    setCertInput("");
  };

  const handleCertKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCertification();
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certToRemove),
    }));
  };

  // Add experience
  const addExperience = () => {
    if (!expInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, expInput.trim()],
    }));
    setExpInput("");
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Add Project
  const handleAddProject = () => {
    if (!projectName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: projectName.trim(),
          description: projectDesc.trim() || "Independent technical project.",
        },
      ],
    }));
    setProjectName("");
    setProjectDesc("");
    setShowAddProject(false);
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // AI Resume Parse Handler
  const handleAIParseResume = async () => {
    if (!formData.resumeText.trim()) {
      setParseErrorMsg("Please enter or paste your resume text before running AI parse.");
      setParseSuccessMsg(null);
      return;
    }

    setIsParsing(true);
    setParseErrorMsg(null);
    setParseSuccessMsg(null);

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: formData.resumeText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to parse resume text.");
      }

      const data = await response.json();

      // Normalize degree to best matching option if available
      let matchedDegree = formData.degree;
      if (data.degree) {
        const lowerDeg = data.degree.toLowerCase();
        const found = DEGREE_OPTIONS.find((opt) =>
          opt.toLowerCase().includes(lowerDeg)
        );
        matchedDegree = found || data.degree;
      }

      // Normalize year
      let matchedYear = formData.year;
      if (data.year) {
        const lowerYear = data.year.toLowerCase();
        const found = YEAR_OPTIONS.find((opt) =>
          opt.toLowerCase().includes(lowerYear)
        );
        matchedYear = found || data.year;
      }

      // Merge parsed skills with existing skills
      const combinedSkills = Array.from(
        new Set([...(formData.skills || []), ...(data.skills || [])])
      );

      // Merge certifications
      const combinedCerts = Array.from(
        new Set([...(formData.certifications || []), ...(data.certifications || [])])
      );

      // Merge experience
      const combinedExp = Array.from(
        new Set([...(formData.experience || []), ...(data.experience || [])])
      );

      // Merge projects
      const combinedProjects =
        data.projects && data.projects.length > 0
          ? [
              ...(formData.projects || []),
              ...data.projects.filter(
                (p: { name: string }) =>
                  !formData.projects.some(
                    (existingP) => existingP.name.toLowerCase() === p.name.toLowerCase()
                  )
              ),
            ]
          : formData.projects;

      setFormData((prev) => ({
        ...prev,
        name: data.name || prev.name,
        email: data.email || prev.email,
        college: data.college || prev.college,
        degree: matchedDegree || prev.degree,
        year: matchedYear || prev.year,
        cgpa: data.cgpa || prev.cgpa,
        skills: combinedSkills,
        projects: combinedProjects,
        certifications: combinedCerts,
        experience: combinedExp,
      }));

      const extractedCount =
        (data.skills?.length || 0) +
        (data.projects?.length || 0) +
        (data.certifications?.length || 0);

      setParseSuccessMsg(
        `AI Analysis complete! Successfully extracted candidate details, ${data.skills?.length || 0} skills, and ${data.projects?.length || 0} projects into the form below.`
      );
    } catch (err: any) {
      console.error("Resume parsing error:", err);
      setParseErrorMsg(
        err.message || "Failed to analyze resume. Please check your network or try again."
      );
    } finally {
      setIsParsing(false);
    }
  };

  // Load sample resume for quick testing
  const handleLoadSampleResume = () => {
    setFormData((prev) => ({
      ...prev,
      resumeText: SAMPLE_RESUME,
    }));
    setParseSuccessMsg("Sample resume loaded into the textarea. Click 'AI Parse Resume' to extract!");
    setParseErrorMsg(null);
  };

  // Save Profile to LocalStorage via saveProfile()
  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      alert("Please enter at least your Name before saving your profile.");
      return;
    }

    setIsSaving(true);
    try {
      saveProfile(formData);
      setSavedProfile({ ...formData });
      setSaveSuccessMsg("Profile saved successfully to your browser storage!");

      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 5000);

      // Scroll to summary card
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Failed to save profile to local storage.");
    } finally {
      setIsSaving(false);
    }
  };

  // Clear / Reset Form
  const handleClearProfile = () => {
    if (
      confirm(
        "Are you sure you want to clear your profile data? This will reset all form fields and erase saved local storage profile."
      )
    ) {
      clearProfile();
      setFormData(INITIAL_PROFILE);
      setSavedProfile(null);
      setSkillInput("");
      setCertInput("");
      setExpInput("");
      setProjectName("");
      setProjectDesc("");
      setParseSuccessMsg(null);
      setParseErrorMsg(null);
      setSaveSuccessMsg(null);
    }
  };

  // Populate instant demo profile
  const handleLoadFullDemo = () => {
    const demo: StudentProfile = {
      name: "Priya Sharma",
      email: "priya.sharma@nitk.edu.in",
      college: "National Institute of Technology Karnataka (NITK)",
      degree: "B.Tech - Computer Science & Engineering",
      year: "3rd Year",
      cgpa: "8.85",
      targetRole: "Full Stack AI Engineer",
      skills: [
        "Python",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "Tailwind CSS",
        "Google Gemini API",
        "Git",
        "Data Structures",
      ],
      projects: [
        {
          name: "CareerPath AI Platform",
          description:
            "AI-powered career guidance ecosystem with resume intelligence, real-time skill-gap radar, and interactive mock interview simulation.",
        },
        {
          name: "Collaborative Code Sandbox",
          description:
            "Distributed code runner with live WebSocket sync, syntax execution containers, and syntax highlighting.",
        },
      ],
      certifications: [
        "AWS Certified Cloud Practitioner",
        "Meta Front-End Developer Professional Certificate",
      ],
      experience: [
        "Full Stack Developer Intern @ CloudTech Labs (Summer 2024)",
        "Technical Lead @ NITK Coding & Robotics Society",
      ],
      resumeText: SAMPLE_RESUME,
    };

    setFormData(demo);
    saveProfile(demo);
    setSavedProfile(demo);
    setSaveSuccessMsg("Demo profile loaded and saved!");
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-primary">Student Profile Engine</span>
            {savedProfile && (
              <span className="badge-green flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile Active
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Build Your Career Profile
          </h1>
          <p className="text-slate-600 mt-1 max-w-2xl">
            Input your academic and technical background, or paste your raw resume to let Gemini
            AI auto-extract your skills, projects, and certifications in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadFullDemo}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors flex items-center gap-1.5"
            title="Load ready-made demo student profile"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            Quick Demo Profile
          </button>
          <button
            type="button"
            onClick={handleClearProfile}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors flex items-center gap-1.5"
            title="Clear all fields & reset profile"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>

      {/* Global Success / Alert Banner */}
      {saveSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{saveSuccessMsg}</span>
          </div>
          <Link
            href="/skill-gap"
            className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
          >
            Run Skill Gap Analysis <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* SECTION 1: AI Resume Parser Area */}
      <section className="mb-10">
        <div className="card border-2 border-primary-200 bg-gradient-to-br from-primary-50/60 via-white to-indigo-50/30 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  AI Resume Parser
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 uppercase tracking-wide">
                    Gemini 1.5 Powered
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Paste raw resume text below. Our AI will automatically populate your form fields.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleResume}
                className="text-xs font-medium text-primary-700 bg-white border border-primary-200 hover:bg-primary-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                Try Sample Resume
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              name="resumeText"
              rows={5}
              value={formData.resumeText}
              onChange={handleInputChange}
              placeholder="Paste complete resume content here (e.g. Education, Projects, Tech Stack, Certifications, Work Experience)..."
              className="input-field font-mono text-xs text-slate-700 leading-relaxed resize-y border-slate-300 focus:border-primary-500"
            />

            {/* Error or Success notification */}
            {parseErrorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{parseErrorMsg}</span>
              </div>
            )}

            {parseSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{parseSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">
                {formData.resumeText.length > 0
                  ? `${formData.resumeText.length} characters entered`
                  : "No resume text entered"}
              </span>

              <button
                type="button"
                onClick={handleAIParseResume}
                disabled={isParsing || !formData.resumeText.trim()}
                className="btn-primary flex items-center gap-2 py-2 px-5 text-sm font-semibold shadow-md shadow-primary-600/20 disabled:opacity-50 disabled:shadow-none"
              >
                {isParsing ? (
                  <>
                    <span className="spinner" />
                    <span>Analyzing Resume with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI Parse Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Profile Form Section */}
      <div ref={formRef} className="space-y-8">
        {/* Academic & Personal Details */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-slate-900">Personal & Academic Background</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Full Name */}
            <div>
              <label className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Priya Sharma"
                  className="input-field pl-10"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="label">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. student@college.edu"
                  className="input-field pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* College / University */}
            <div>
              <label className="label">College / University</label>
              <div className="relative">
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  placeholder="e.g. NITK Surathkal / IIT Delhi"
                  className="input-field pl-10"
                />
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Degree Dropdown */}
            <div>
              <label className="label">Degree Program</label>
              <div className="relative">
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="input-field pl-10 bg-white"
                >
                  {DEGREE_OPTIONS.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Year Dropdown */}
            <div>
              <label className="label">Current Academic Year</label>
              <div className="relative">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="input-field pl-10 bg-white"
                >
                  {YEAR_OPTIONS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* CGPA */}
            <div>
              <label className="label">CGPA / Percentage</label>
              <div className="relative">
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  placeholder="e.g. 8.75 or 85%"
                  className="input-field pl-10"
                />
                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Target Career Role (Optional) */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="label">Target Career Role (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Full Stack Developer, Data Scientist, Cloud DevOps Engineer"
                  className="input-field pl-10"
                />
                <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Specifying your dream role helps tailor skill-gap analysis and interview question generation.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Skills Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Technical & Professional Skills</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {formData.skills.length} skills listed
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Type skills separated by commas or press Enter to add. You can remove any skill by clicking
            the badge.
          </p>

          {/* Skill input bar */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. Python, React, Docker, Machine Learning (press Enter or comma)"
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={() => addSkill()}
              className="btn-primary py-2 px-5 text-sm font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Suggested Skills */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Suggested Quick-Add:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((item) => {
                const isSelected = formData.skills.some(
                  (s) => s.toLowerCase() === item.toLowerCase()
                );
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => (!isSelected ? addSkill(item) : removeSkill(item))}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-md font-medium border transition-colors flex items-center gap-1",
                      isSelected
                        ? "bg-primary-50 border-primary-300 text-primary-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                    )}
                  >
                    {isSelected ? (
                      <Check className="w-3 h-3 text-primary-600" />
                    ) : (
                      <Plus className="w-3 h-3 text-slate-400" />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Skills Badges */}
          <div className="min-h-[50px] p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-wrap gap-2 items-center">
            {formData.skills.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                No skills added yet. Type above or click suggested skills to build your stack.
              </span>
            ) : (
              formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="badge-primary inline-flex items-center gap-1.5 py-1 px-3 text-xs font-medium shadow-sm transition-transform hover:scale-105"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-primary-400 hover:text-primary-800 transition-colors ml-0.5"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* SECTION 4: Projects Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Projects & Portfolios</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProject(!showAddProject)}
              className="text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {showAddProject ? "Cancel" : "Add Project"}
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Showcase your best engineering and research projects. Key projects are weighed heavily in
            career scoring.
          </p>

          {/* Add project form */}
          {showAddProject && (
            <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 space-y-3">
              <h3 className="text-sm font-bold text-primary-900">Add New Project</h3>
              <div>
                <label className="label">Project Title</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. AI Career Readiness Platform"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Project Description & Tech Stack</label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Briefly describe what problem it solves and technologies used..."
                  className="input-field resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="btn-secondary py-1.5 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={!projectName.trim()}
                  className="btn-primary py-1.5 px-4 text-xs font-semibold disabled:opacity-50"
                >
                  Save Project
                </button>
              </div>
            </div>
          )}

          {/* Existing Projects List */}
          {formData.projects.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">No projects added yet</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Click &quot;Add Project&quot; above or let the AI Resume Parser extract them automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-slate-900">{proj.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeProject(idx)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {proj.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Project #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: Certifications & Experience Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Certifications & Badges</h2>
              </div>
              <span className="text-xs text-slate-500">{formData.certifications.length} total</span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Add verified credentials, cloud certificates, or specialized course accreditations.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={handleCertKeyDown}
                placeholder="e.g. AWS Certified Developer, Meta Frontend"
                className="input-field text-sm flex-1"
              />
              <button
                type="button"
                onClick={addCertification}
                className="btn-primary py-2 px-4 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px] p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
              {formData.certifications.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No certifications added.</span>
              ) : (
                formData.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="badge-green inline-flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium"
                  >
                    <Award className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(cert)}
                      className="text-emerald-500 hover:text-emerald-900 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Internships & Leadership */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Experience & Activities</h2>
              </div>
              <span className="text-xs text-slate-500">{formData.experience.length} entries</span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Include summer internships, open source projects, coding club leadership, etc.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={expInput}
                onChange={(e) => setExpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addExperience();
                  }
                }}
                placeholder="e.g. SDE Intern @ TechCorp, Lead @ GDSC"
                className="input-field text-sm flex-1"
              />
              <button
                type="button"
                onClick={addExperience}
                className="btn-primary py-2 px-4 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 min-h-[44px] p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
              {formData.experience.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No experience entries added.</span>
              ) : (
                formData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-white rounded-md border border-slate-200 text-xs text-slate-800"
                  >
                    <span className="truncate">{exp}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Bar (Save & Reset) */}
        <div className="card bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-6 shadow-lg">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Ready to power up your career roadmap?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Saving your profile stores it locally and unlocks AI Skill Gap Analysis, Mock
              Interviews, and Opportunity Matches.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn-primary bg-primary-500 hover:bg-primary-400 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
            >
              {isSaving ? (
                <>
                  <span className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 6: Profile Summary Card (Formatted Display) */}
      {savedProfile && (
        <div ref={summaryRef} className="mt-14 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-green flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" /> Stored in Profile Database
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Your Active Profile Summary</h2>
              <p className="text-sm text-slate-600">
                This structured profile is referenced across the CareerPath AI platform.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                formRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-white border border-primary-200 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              Edit Profile Fields
            </button>
          </div>

          {/* Structured Summary Card Layout */}
          <div className="card border-slate-200 bg-white shadow-md p-6 sm:p-8">
            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {savedProfile.name
                    ? savedProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "ST"}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {savedProfile.name || "Student Name"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                    {savedProfile.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {savedProfile.email}
                      </span>
                    )}
                    {savedProfile.college && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {savedProfile.college}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-primary text-xs py-1 px-3">
                  {savedProfile.degree || "B.Tech"}
                </span>
                <span className="badge-amber text-xs py-1 px-3">
                  {savedProfile.year || "3rd Year"}
                </span>
                {savedProfile.cgpa && (
                  <span className="badge-green text-xs py-1 px-3">
                    CGPA: {savedProfile.cgpa}
                  </span>
                )}
              </div>
            </div>

            {/* Target Role Banner if present */}
            {savedProfile.targetRole && (
              <div className="mt-4 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900 font-medium">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Target Career Aspirations: </span>
                <span className="font-bold">{savedProfile.targetRole}</span>
              </div>
            )}

            {/* Skills Showcase */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Verified Technical Competencies ({savedProfile.skills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {savedProfile.skills.length > 0 ? (
                  savedProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Projects Showcase */}
            {savedProfile.projects && savedProfile.projects.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Featured Projects ({savedProfile.projects.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {savedProfile.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <h5 className="text-sm font-bold text-slate-900">{proj.name}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications and Experience Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {/* Certifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Certifications ({savedProfile.certifications.length})
                </h4>
                {savedProfile.certifications.length > 0 ? (
                  <ul className="space-y-1">
                    {savedProfile.certifications.map((c, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-slate-400 italic">None specified</span>
                )}
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Experience / Roles ({savedProfile.experience.length})
                </h4>
                {savedProfile.experience.length > 0 ? (
                  <ul className="space-y-1">
                    {savedProfile.experience.map((e, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-slate-400 italic">None specified</span>
                )}
              </div>
            </div>

            {/* Quick Next Step Action Links */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Ready for the next step in your career journey?
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/career-paths"
                  className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
                >
                  Explore Career Paths
                </Link>
                <Link
                  href="/skill-gap"
                  className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  Analyze Skill Gap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
