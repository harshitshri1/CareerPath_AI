"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Building2,
  GraduationCap,
  Award,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Check,
  AlertCircle,
  Clock,
  Layers,
  RotateCcw,
} from "lucide-react";
import { opportunities, type Opportunity } from "@/lib/opportunities-data";
import { getProfile, type StudentProfile } from "@/lib/store";
import { cn } from "@/lib/utils";

type TabType = "all" | "internship" | "job" | "government" | "scholarship";
type SortOption = "relevance" | "salary" | "deadline";

interface SkillMatchResult {
  score: number;
  matchedCount: number;
  totalSkills: number;
  matchedSkills: string[];
  missingSkills: string[];
}

// Helper to normalize salary into an annual numeric amount for accurate sorting
function parseSalaryToAnnualNumber(salary?: string): number {
  if (!salary) return 0;
  const s = salary.toLowerCase().replace(/,/g, "");

  // Match LPA (Lakhs Per Annum), e.g. "18-25 LPA" -> 21.5 LPA -> 2,150,000
  const lpaMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*lpa/);
  if (lpaMatch) {
    const avg = (parseFloat(lpaMatch[1]) + parseFloat(lpaMatch[2])) / 2;
    return avg * 100000;
  }
  const singleLpa = s.match(/(\d+(?:\.\d+)?)\s*lpa/);
  if (singleLpa) {
    return parseFloat(singleLpa[1]) * 100000;
  }

  // Match Monthly ranges, e.g. "₹56,100–₹2,50,000/month"
  const monthlyRange = s.match(/₹?(\d+)\s*(?:-|–|to)\s*₹?(\d+)\s*\/\s*month/);
  if (monthlyRange) {
    const avg = (parseFloat(monthlyRange[1]) + parseFloat(monthlyRange[2])) / 2;
    return avg * 12;
  }
  const singleMonthly = s.match(/₹?(\d+)\s*\/\s*month/);
  if (singleMonthly) {
    return parseFloat(singleMonthly[1]) * 12;
  }

  // Match Annual ranges, e.g. "₹36,000–₹43,200/year"
  const yearlyRange = s.match(/₹?(\d+)\s*(?:-|–|to)\s*₹?(\d+)\s*\/\s*year/);
  if (yearlyRange) {
    return (parseFloat(yearlyRange[1]) + parseFloat(yearlyRange[2])) / 2;
  }
  const singleYearly = s.match(/(?:up to\s*)?₹?(\d+)\s*\/\s*year/);
  if (singleYearly) {
    return parseFloat(singleYearly[1]);
  }

  // Flat stipend/rewards or free
  const flatReward = s.match(/₹?(\d+)/);
  if (flatReward) {
    return parseFloat(flatReward[1]);
  }

  return 0;
}

export default function OpportunitiesPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Load profile and bookmarks on mount
  useEffect(() => {
    const p = getProfile();
    setProfile(p);

    try {
      const savedBookmarks = localStorage.getItem("careerready-bookmarks");
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("careerready-bookmarks", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Distinct locations from opportunities data
  const locations = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((op) => {
      if (op.location) set.add(op.location);
    });
    return Array.from(set).sort();
  }, []);

  // Compute stats for header
  const counts = useMemo(() => {
    const total = opportunities.length;
    const internships = opportunities.filter((o) => o.type === "internship").length;
    const jobs = opportunities.filter((o) => o.type === "job").length;
    const government = opportunities.filter((o) => o.type === "government").length;
    const scholarships = opportunities.filter((o) => o.type === "scholarship").length;
    return { total, internships, jobs, government, scholarships };
  }, []);

  // Calculate skill match score for an opportunity
  const getSkillMatch = useCallback((oppSkills: string[]): SkillMatchResult => {
    if (!profile || !profile.skills || profile.skills.length === 0) {
      return {
        score: 0,
        matchedCount: 0,
        totalSkills: oppSkills.length,
        matchedSkills: [],
        missingSkills: oppSkills,
      };
    }

    if (oppSkills.length === 0) {
      // Opportunities like scholarships open to all students
      return {
        score: 100,
        matchedCount: 0,
        totalSkills: 0,
        matchedSkills: [],
        missingSkills: [],
      };
    }

    const userSkillsClean = profile.skills.map((s) => s.toLowerCase().trim());
    const matched: string[] = [];
    const missing: string[] = [];

    for (const skill of oppSkills) {
      const s = skill.toLowerCase().trim();
      const isMatched = userSkillsClean.some(
        (us) => us === s || us.includes(s) || s.includes(us)
      );
      if (isMatched) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    }

    const score = Math.round((matched.length / oppSkills.length) * 100);
    return {
      score,
      matchedCount: matched.length,
      totalSkills: oppSkills.length,
      matchedSkills: matched,
      missingSkills: missing,
    };
  }, [profile]);

  // Filtered & sorted opportunities
  const filteredOpportunities = useMemo(() => {
    let list = opportunities.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.type !== activeTab) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "all" && item.location !== selectedLocation) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inOrg = item.organization.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inLoc = item.location.toLowerCase().includes(query);
        const inCategory = item.category?.toLowerCase().includes(query) ?? false;
        const inSkills = item.skills.some((s) => s.toLowerCase().includes(query));

        if (!inTitle && !inOrg && !inDesc && !inLoc && !inCategory && !inSkills) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "relevance") {
        if (profile) {
          const matchA = getSkillMatch(a.skills).score;
          const matchB = getSkillMatch(b.skills).score;
          if (matchB !== matchA) {
            return matchB - matchA;
          }
        }
        return 0;
      }

      if (sortBy === "salary") {
        const salaryA = parseSalaryToAnnualNumber(a.salary);
        const salaryB = parseSalaryToAnnualNumber(b.salary);
        return salaryB - salaryA;
      }

      if (sortBy === "deadline") {
        // Items with upcoming deadlines first, items without deadline at end
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }

      return 0;
    });

    return list;
  }, [activeTab, selectedLocation, searchQuery, sortBy, profile, getSkillMatch]);

  const hasActiveFilters =
    activeTab !== "all" || selectedLocation !== "all" || searchQuery !== "" || sortBy !== "relevance";

  const resetFilters = () => {
    setActiveTab("all");
    setSelectedLocation("all");
    setSearchQuery("");
    setSortBy("relevance");
  };

  const getTypeBadge = (type: Opportunity["type"]) => {
    switch (type) {
      case "internship":
        return {
          label: "Internship",
          classes: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "job":
        return {
          label: "Full-Time Job",
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "government":
        return {
          label: "Govt Exam / Role",
          classes: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "scholarship":
        return {
          label: "Scholarship & Scheme",
          classes: "bg-purple-50 text-purple-700 border-purple-200",
        };
      default:
        return {
          label: type,
          classes: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Verified Opportunities Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Opportunities & Match Finder
            </h1>
            <p className="text-slate-600 mt-1 text-base max-w-2xl">
              Explore curated internships, tech jobs, government openings, and national scholarships.
              Matched directly with your skills and career interests.
            </p>
          </div>

          {profile && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">Matching with profile:</span>
              <span className="font-semibold text-slate-900">{profile.name}</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {profile.skills.length} skills
              </span>
            </div>
          )}
        </div>

        {/* Profile Alert / Prompt Banner if no profile */}
        {!profile ? (
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 rounded-2xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Personalization Inactive
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Create your profile for personalized match scores
                </h3>
                <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                  Add your skills, education, and target career role to see real-time skill overlap percentages,
                  missing skills checklists, and customized job recommendations.
                </p>
              </div>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 shrink-0"
              >
                Create Profile Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-primary-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-950">
                  AI Skill Matching Active
                </p>
                <p className="text-xs text-slate-600">
                  Opportunities are automatically scored against {profile.skills.length} skills in your profile (
                  {profile.skills.slice(0, 4).join(", ")}
                  {profile.skills.length > 4 ? ` +${profile.skills.length - 4} more` : ""})
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className="text-xs font-semibold text-primary-700 hover:text-primary-800 bg-white border border-primary-200 hover:border-primary-300 px-3.5 py-2 rounded-lg self-start sm:self-center transition-colors shadow-sm"
            >
              Update Skills →
            </Link>
          </div>
        )}

        {/* Stats Header Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "text-left p-4 rounded-xl border transition-all duration-200",
              activeTab === "all"
                ? "bg-white border-primary-500 shadow-md ring-2 ring-primary-500/20"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Layers className="h-4 w-4" />
              </span>
              <span className="text-2xl font-black text-slate-900">{counts.total}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              All Listings
            </p>
          </button>

          <button
            onClick={() => setActiveTab("internship")}
            className={cn(
              "text-left p-4 rounded-xl border transition-all duration-200",
              activeTab === "internship"
                ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Briefcase className="h-4 w-4" />
              </span>
              <span className="text-2xl font-black text-blue-700">{counts.internships}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Internships
            </p>
          </button>

          <button
            onClick={() => setActiveTab("job")}
            className={cn(
              "text-left p-4 rounded-xl border transition-all duration-200",
              activeTab === "job"
                ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="text-2xl font-black text-emerald-700">{counts.jobs}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Full-Time Jobs
            </p>
          </button>

          <button
            onClick={() => setActiveTab("government")}
            className={cn(
              "text-left p-4 rounded-xl border transition-all duration-200",
              activeTab === "government"
                ? "bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Award className="h-4 w-4" />
              </span>
              <span className="text-2xl font-black text-amber-700">{counts.government}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Govt Openings
            </p>
          </button>

          <button
            onClick={() => setActiveTab("scholarship")}
            className={cn(
              "text-left p-4 rounded-xl border transition-all duration-200 col-span-2 sm:col-span-1",
              activeTab === "scholarship"
                ? "bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <GraduationCap className="h-4 w-4" />
              </span>
              <span className="text-2xl font-black text-purple-700">{counts.scholarships}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Scholarships
            </p>
          </button>
        </div>

        {/* Tab Navigation & Search/Filter Controls */}
        <div className="space-y-4">
          {/* Custom Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All Opportunities", count: counts.total },
                { id: "internship", label: "Internships", count: counts.internships },
                { id: "job", label: "Jobs", count: counts.jobs },
                { id: "government", label: "Government", count: counts.government },
                { id: "scholarship", label: "Scholarships", count: counts.scholarships },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                    isActive
                      ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter & Sort Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by role, company, skill (e.g. Python, React), or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter by Location Dropdown */}
            <div className="flex items-center gap-2 sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white cursor-pointer appearance-none transition-all"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative flex-1 sm:w-56">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white cursor-pointer appearance-none transition-all"
                >
                  <option value="relevance">
                    Sort by: {profile ? "Relevance (Match %)" : "Relevance"}
                  </option>
                  <option value="salary">Sort by: Highest Compensation</option>
                  <option value="deadline">Sort by: Deadline (Urgent First)</option>
                </select>
              </div>

              {/* Reset Filters button if active */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  title="Reset all filters"
                  className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Query Status */}
        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredOpportunities.length}
            </span>{" "}
            {filteredOpportunities.length === 1 ? "opportunity" : "opportunities"}
            {hasActiveFilters && (
              <span className="text-slate-400 ml-1.5">
                (filtered from {opportunities.length})
              </span>
            )}
          </div>
          {profile && sortBy === "relevance" && (
            <div className="flex items-center gap-1 text-xs text-primary-700 font-medium bg-primary-50 px-2.5 py-1 rounded-md">
              <Sparkles className="h-3.5 w-3.5" />
              Sorted by highest skill match score
            </div>
          )}
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No matching opportunities found
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              We couldn’t find any opportunities matching your current search criteria or filters. Try clearing some filters or searching for different terms.
            </p>
            <button onClick={resetFilters} className="btn-primary inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((item) => {
              const typeBadge = getTypeBadge(item.type);
              const match = getSkillMatch(item.skills);
              const isBookmarked = bookmarkedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-primary-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Content Top */}
                  <div className="p-6 space-y-4">
                    {/* Header Badges: Type & Government/Scholarship Category */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold border",
                            typeBadge.classes
                          )}
                        >
                          {typeBadge.label}
                        </span>

                        {item.category && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Bookmark button */}
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className="text-slate-400 hover:text-primary-600 transition-colors p-1"
                        title={isBookmarked ? "Remove from saved" : "Save opportunity"}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-5 w-5 text-primary-600 fill-primary-100" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Match Score Badge (if profile exists) */}
                    {profile && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm",
                              match.score >= 70
                                ? "bg-emerald-600 text-white"
                                : match.score >= 40
                                ? "bg-amber-500 text-white"
                                : "bg-slate-400 text-white"
                            )}
                          >
                            {match.score}%
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {match.score >= 80
                                ? "Strong Match"
                                : match.score >= 50
                                ? "Moderate Match"
                                : match.score > 0
                                ? "Skill Gap Exists"
                                : item.skills.length === 0
                                ? "Open Eligibility"
                                : "Low Match"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.skills.length === 0
                                ? "Open to all qualified applicants"
                                : `${match.matchedCount} of ${match.totalSkills} skills matched`}
                            </p>
                          </div>
                        </div>

                        {match.score >= 70 && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            <Sparkles className="h-3 w-3" />
                            Recommended
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title & Organization */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mt-1">
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{item.organization}</span>
                      </div>
                    </div>

                    {/* Meta Row: Location, Salary/Stipend, Deadline */}
                    <div className="pt-2 space-y-2 border-t border-slate-100 text-xs">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Salary / Stipend */}
                      {item.salary && (
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                          <IndianRupee className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.salary}</span>
                        </div>
                      )}

                      {/* Deadline */}
                      {item.deadline ? (
                        <div className="flex items-center gap-2 text-amber-700 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>
                            Deadline:{" "}
                            {new Date(item.deadline).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>Ongoing / Multiple Cycles</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Skills Required / Overlap */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.skills.length > 0 ? "Required Skills" : "Eligibility"}
                      </p>
                      {item.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {item.skills.map((skill) => {
                            const isUserSkill =
                              profile &&
                              profile.skills.some((us) => {
                                const norm = us.toLowerCase().trim();
                                const sk = skill.toLowerCase().trim();
                                return norm === sk || norm.includes(sk) || sk.includes(norm);
                              });

                            return (
                              <span
                                key={skill}
                                className={cn(
                                  "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors",
                                  isUserSkill
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                )}
                              >
                                {isUserSkill && <Check className="h-3 w-3 text-emerald-600" />}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          Open to eligible graduates / specific criteria listed on official notification.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Apply Now Button */}
                  <div className="p-6 pt-0 mt-auto">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
