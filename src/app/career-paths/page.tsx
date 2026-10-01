"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Route,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Clock,
  AlertCircle,
  IndianRupee,
  Check,
  RefreshCw,
  GraduationCap,
  Target,
  Layers,
  ChevronRight,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getProfile,
  saveProfile,
  getCareerPaths,
  saveCareerPaths,
  type StudentProfile,
} from "@/lib/store";

export interface RoadmapStep {
  month: string;
  task: string;
  resources: string[];
}

export interface CareerRecommendation {
  role: string;
  matchPercentage: number;
  description: string;
  requiredSkills: string[];
  salaryRange: string;
  growthOutlook: string;
  roadmap: RoadmapStep[];
  courses?: string[];
  certifications?: string[];
}

export default function CareerPathsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedRole, setSelectedRole] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"match" | "salary">("match");

  // Load profile and cached recommendations on mount
  useEffect(() => {
    const loadedProfile = getProfile();
    setProfile(loadedProfile);

    const cachedPaths = getCareerPaths() as CareerRecommendation[] | null;
    if (cachedPaths && Array.isArray(cachedPaths) && cachedPaths.length > 0) {
      setRecommendations(cachedPaths);
      // Select the role that matches targetRole or default to the top match
      if (loadedProfile?.targetRole) {
        const found = cachedPaths.find(
          (p) => p.role.toLowerCase() === loadedProfile.targetRole?.toLowerCase()
        );
        setSelectedRole(found || cachedPaths[0]);
      } else {
        setSelectedRole(cachedPaths[0]);
      }
    }
  }, []);

  // Handler to fetch recommendations from the API
  const handleGenerateCareerPaths = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    setSaveSuccessMsg(null);

    try {
      const response = await fetch("/api/career-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations. Please try again.");
      }

      const data: CareerRecommendation[] = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setRecommendations(data);
        saveCareerPaths(data);

        // Pre-select target role if already set, or the highest match
        if (profile.targetRole) {
          const match = data.find(
            (r) => r.role.toLowerCase() === profile.targetRole?.toLowerCase()
          );
          setSelectedRole(match || data[0]);
        } else {
          setSelectedRole(data[0]);
        }
      } else {
        throw new Error("No career recommendations received.");
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while generating recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler to select and set a role as target role in profile
  const handleSelectRole = (path: CareerRecommendation) => {
    setSelectedRole(path);

    if (profile) {
      const updatedProfile: StudentProfile = {
        ...profile,
        targetRole: path.role,
      };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);

      setSaveSuccessMsg(`Target role set to "${path.role}". Roadmap updated below!`);
      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 4000);
    }

    // Smooth scroll to roadmap
    const roadmapEl = document.getElementById("detailed-roadmap-section");
    if (roadmapEl) {
      roadmapEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Demo profile creator for instant trial if user doesn't have one
  const handleLoadDemoProfile = () => {
    const demo: StudentProfile = {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.edu.in",
      college: "Indian Institute of Information Technology",
      degree: "B.Tech Computer Science & Engineering",
      year: "3rd Year",
      cgpa: "8.6",
      skills: ["Python", "JavaScript", "React", "Node.js", "Data Structures", "SQL", "Git"],
      projects: [
        {
          name: "Smart Campus Portal",
          description: "Full stack student issue resolution platform built with React, Node, and Postgres.",
        },
        {
          name: "Sentiment Analyzer",
          description: "Python NLP model analyzing course reviews using NLTK and Scikit-learn.",
        },
      ],
      certifications: ["CS50 Introduction to Computer Science", "AWS Cloud Practitioner"],
      experience: ["Web Development Intern at EduTech India (3 months)"],
      resumeText: "Passionate CS undergraduate focusing on modern full-stack systems and machine learning.",
    };
    saveProfile(demo);
    setProfile(demo);
  };

  // Helper for match percentage badge styling
  const getMatchBadgeClass = (score: number) => {
    if (score >= 80) {
      return "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold";
    }
    if (score >= 60) {
      return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
    }
    return "bg-red-100 text-red-800 border-red-300 font-semibold";
  };

  // Sorting
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (sortBy === "salary") {
      const getNum = (s: string) => {
        const matches = s.match(/\d+(\.\d+)?/g);
        return matches ? parseFloat(matches[matches.length - 1]) : 0;
      };
      return getNum(b.salaryRange) - getNum(a.salaryRange);
    }
    return b.matchPercentage - a.matchPercentage;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                <Route className="w-3.5 h-3.5 text-primary-600" />
                <span>AI Career Trajectory Engine • NEP 2020 & Skill India</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Career Path Recommendations
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-3xl">
                Discover high-impact tech roles matched to your skills, degree, and projects.
                Explore salary benchmarks, growth trajectories, and comprehensive 6-month learning roadmaps.
              </p>
            </div>

            {profile && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleGenerateCareerPaths}
                  disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <div className="spinner !w-4 !h-4" />
                      <span>Analyzing Profile...</span>
                    </>
                  ) : recommendations.length > 0 ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Re-analyze Paths</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Career Paths</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Student Profile Quick Bar */}
          {profile && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                  <UserCheck className="w-4 h-4 text-primary-600" />
                  {profile.name}
                </span>
                <span className="text-slate-300">•</span>
                <span>{profile.degree}</span>
                <span className="text-slate-300">•</span>
                <span>{profile.college}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-900">CGPA: {profile.cgpa}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Target Role:</span>
                {profile.targetRole ? (
                  <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-800 font-semibold border border-primary-200">
                    {profile.targetRole}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">None selected yet</span>
                )}
                <Link
                  href="/profile"
                  className="ml-2 text-xs font-semibold text-primary-600 hover:text-primary-700 underline flex items-center"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Success Alert Toast */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-emerald-800 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="font-medium text-sm sm:text-base">{saveSuccessMsg}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* State 1: No Profile Created */}
        {!profile && (
          <div className="card p-8 sm:p-12 text-center bg-white border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 border border-primary-100">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Set Up Your Profile First</h2>
              <p className="text-slate-600 max-w-lg mx-auto">
                To generate personalized, high-precision career recommendations, our AI analyzes your
                degree, CGPA, existing technical skills, and completed projects.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/profile"
                className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span>Create Student Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLoadDemoProfile}
                className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span>Load Sample Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Profile exists, but not yet generated */}
        {profile && recommendations.length === 0 && !loading && (
          <div className="card p-8 sm:p-12 text-center bg-white border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 border border-primary-100">
              <Sparkles className="w-10 h-10 text-primary-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Ready to Explore Career Options?</h2>
              <p className="text-slate-600 max-w-lg mx-auto">
                We will match your <span className="font-semibold text-slate-800">{profile.skills.length} skills</span> and{" "}
                <span className="font-semibold text-slate-800">{profile.projects.length} projects</span> against current Indian tech
                job market requirements and emerging roles.
              </p>
            </div>
            <div>
              <button
                onClick={handleGenerateCareerPaths}
                className="btn-primary inline-flex items-center gap-2.5 text-lg px-8 py-3.5 shadow-md hover:shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Career Paths</span>
              </button>
            </div>
          </div>
        )}

        {/* State 3: Loading Skeleton */}
        {loading && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
              <div className="inline-block p-4 rounded-full bg-primary-50 text-primary-600 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Analyzing Your Profile with AI...</h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm">
                Evaluating your academic skills, benchmarking Indian industry compensation standards, and
                synthesizing a personalized 6-month roadmap.
              </p>
              <div className="max-w-md mx-auto pt-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="card p-6 border border-slate-200 bg-white space-y-4 animate-pulse">
                  <div className="flex justify-between items-start">
                    <div className="h-6 w-36 bg-slate-200 rounded" />
                    <div className="h-6 w-16 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-4 w-full bg-slate-200 rounded" />
                  <div className="h-4 w-4/5 bg-slate-200 rounded" />
                  <div className="pt-2 flex flex-wrap gap-2">
                    <div className="h-5 w-16 bg-slate-200 rounded-full" />
                    <div className="h-5 w-20 bg-slate-200 rounded-full" />
                    <div className="h-5 w-14 bg-slate-200 rounded-full" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between">
                    <div className="h-5 w-24 bg-slate-200 rounded" />
                    <div className="h-5 w-20 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State 4: Recommendations Available */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary-600" />
                  Top 5 Career Matches For You
                </h2>
                <p className="text-slate-500 text-sm">
                  Click <span className="font-semibold text-slate-700">&quot;Explore This Path&quot;</span> on any card to view its
                  step-by-step 6-month roadmap and save as your target role.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort by:</span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setSortBy("match")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                      sortBy === "match"
                        ? "bg-primary-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    Match %
                  </button>
                  <button
                    onClick={() => setSortBy("salary")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                      sortBy === "salary"
                        ? "bg-primary-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    Salary
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Career Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRecommendations.map((path, index) => {
                const isSelected = selectedRole?.role.toLowerCase() === path.role.toLowerCase();
                const isTargetRole = profile?.targetRole?.toLowerCase() === path.role.toLowerCase();

                return (
                  <div
                    key={index}
                    className={cn(
                      "card flex flex-col justify-between transition-all duration-300 relative border overflow-hidden",
                      isSelected
                        ? "border-primary-500 ring-2 ring-primary-500/30 shadow-md bg-white"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md bg-white"
                    )}
                  >
                    {/* Active Ribbon */}
                    {isTargetRole && (
                      <div className="bg-primary-600 text-white text-[11px] font-bold px-3 py-1 text-center tracking-wide uppercase flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Active Target Role
                      </div>
                    )}

                    <div className="p-6 space-y-4 flex-1">
                      {/* Header with Role Title & Match Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                            {path.role}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-medium text-slate-700">{path.growthOutlook}</span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs border whitespace-nowrap",
                            getMatchBadgeClass(path.matchPercentage)
                          )}
                        >
                          {path.matchPercentage}% Match
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {path.description}
                      </p>

                      {/* Salary Range */}
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                          Average Salary (India):
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {path.salaryRange}
                        </span>
                      </div>

                      {/* Required Skills */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold uppercase tracking-wider">Required Skills</span>
                          <span>{path.requiredSkills.length} competencies</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {path.requiredSkills.map((skill, sIdx) => {
                            const studentHas = profile?.skills?.some((userSkill) =>
                              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                              skill.toLowerCase().includes(userSkill.toLowerCase())
                            );

                            return (
                              <span
                                key={sIdx}
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-xs font-medium border flex items-center gap-1",
                                  studentHas
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                )}
                              >
                                {studentHas && <Check className="w-3 h-3 text-emerald-600" />}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="p-6 pt-0 mt-2">
                      <button
                        onClick={() => handleSelectRole(path)}
                        className={cn(
                          "w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2",
                          isSelected
                            ? "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100"
                            : "btn-primary !py-2.5"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 text-primary-600" />
                            <span>Viewing Roadmap</span>
                          </>
                        ) : (
                          <>
                            <span>Explore This Path</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DETAILED ROADMAP SECTION */}
            {selectedRole && (
              <div
                id="detailed-roadmap-section"
                className="mt-12 bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10 scroll-mt-24 animate-slide-up"
              >
                {/* Roadmap Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Curated Learning Trajectory</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      6-Month Roadmap: {selectedRole.role}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                      Follow this structured month-by-month milestone plan to master required competencies,
                      complete standout portfolio capstones, and prepare for interviews.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Match Fit</div>
                        <div className="text-lg font-bold text-primary-600">
                          {selectedRole.matchPercentage}%
                        </div>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Est. Compensation</div>
                        <div className="text-sm font-bold text-slate-900">
                          {selectedRole.salaryRange}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/skill-gap"
                      className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-sm hover:shadow"
                    >
                      <span>Proceed to Skill Gap Analysis</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Timeline Roadmap */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    Month-by-Month Milestone Breakdown
                  </h3>

                  <div className="relative pl-6 sm:pl-8 border-l-2 border-primary-200 space-y-8 ml-3 sm:ml-4">
                    {selectedRole.roadmap.map((step, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Node */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-primary-600 flex items-center justify-center text-xs font-bold text-primary-700 shadow-sm group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all">
                          {idx + 1}
                        </div>

                        {/* Content Box */}
                        <div className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl p-5 sm:p-6 transition-colors shadow-2xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                              {step.month}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900">
                            {step.task}
                          </h4>

                          {/* Recommended Resources for this month */}
                          {step.resources && step.resources.length > 0 && (
                            <div className="pt-2 border-t border-slate-200/60">
                              <span className="text-xs font-semibold text-slate-500 block mb-2">
                                Recommended Study Resources:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {step.resources.map((res, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                                    {res}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses and Certifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Courses */}
                  <div className="card p-6 border border-slate-200 bg-white space-y-4">
                    <div className="flex items-center gap-3 text-slate-900">
                      <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">Recommended Courses</h4>
                        <p className="text-xs text-slate-500">Industry-recognized curricula</p>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-2">
                      {(selectedRole.courses && selectedRole.courses.length > 0
                        ? selectedRole.courses
                        : [
                            "Comprehensive Specialization Track on Coursera",
                            "Applied Project-Based Bootcamp on Udemy",
                            "FreeCodeCamp Interactive Engineering Curriculum",
                          ]
                      ).map((course, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Certifications */}
                  <div className="card p-6 border border-slate-200 bg-white space-y-4">
                    <div className="flex items-center gap-3 text-slate-900">
                      <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">Valuable Certifications</h4>
                        <p className="text-xs text-slate-500">Credibility boosters for resumes</p>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-2">
                      {(selectedRole.certifications && selectedRole.certifications.length > 0
                        ? selectedRole.certifications
                        : [
                            "AWS Certified Developer / Cloud Solutions Associate",
                            "Docker & Kubernetes Certified Practitioner",
                            "Google Professional Data / ML Engineer",
                          ]
                      ).map((cert, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                        >
                          <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Next Step Callout Box */}
                <div className="bg-gradient-to-r from-primary-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-800 text-primary-200 border border-primary-700">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Next Action in Your Career Readiness Plan</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      Ready to Analyze Your Skill Gap for {selectedRole.role}?
                    </h3>
                    <p className="text-primary-200 text-sm max-w-xl">
                      Benchmark your skills against this role&apos;s exact criteria. Get an AI-curated gap analysis,
                      tailored project recommendations, and placement preparation resources.
                    </p>
                  </div>

                  <Link
                    href="/skill-gap"
                    className="bg-white text-primary-900 hover:bg-primary-50 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    <span>Proceed to Skill Gap Analysis</span>
                    <ArrowRight className="w-5 h-5 text-primary-600" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
