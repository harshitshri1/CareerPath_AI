"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  TrendingUp,
  Award,
  Briefcase,
  BookOpen,
  AlertCircle,
  Download,
  Calendar,
  Building2,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  X,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Clock,
  Layers,
  Lightbulb,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Professional color palette as requested
const CHART_COLORS = [
  "#4f46e5", // Indigo
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
];

// Department Readiness Data
const departmentScoreData = [
  { dept: "CSE", score: 72, full: "Computer Science & Engineering" },
  { dept: "ECE", score: 65, full: "Electronics & Communication" },
  { dept: "ME", score: 58, full: "Mechanical Engineering" },
  { dept: "CE", score: 55, full: "Civil Engineering" },
  { dept: "IT", score: 70, full: "Information Technology" },
  { dept: "EEE", score: 61, full: "Electrical & Electronics" },
];

// Skill Distribution Data
const skillDistributionData = [
  { name: "Python", value: 30 },
  { name: "Java", value: 25 },
  { name: "SQL", value: 20 },
  { name: "JavaScript", value: 15 },
  { name: "C++", value: 10 },
];

// Placement Trends Data (over 4 years)
const placementTrendsData = [
  { year: "2022", rate: 68, label: "Actual" },
  { year: "2023", rate: 72, label: "Actual" },
  { year: "2024", rate: 78, label: "Actual" },
  { year: "2025", rate: 85, label: "Projected" },
];

// Top Skill Gaps Data
const skillGapsData = [
  { skill: "Cloud Computing", gapPercentage: 45 },
  { skill: "System Design", gapPercentage: 42 },
  { skill: "REST APIs", gapPercentage: 38 },
  { skill: "Docker", gapPercentage: 35 },
  { skill: "SQL Advanced", gapPercentage: 32 },
];

// Department Breakdown Table Data
interface DepartmentDetail {
  code: string;
  name: string;
  students: number;
  avgScore: number;
  topMissingSkill: string;
  placedPercentage: number;
  hod: string;
  topRecruiters: string[];
  recommendedAction: string;
}

const departmentTableData: DepartmentDetail[] = [
  {
    code: "CSE",
    name: "Computer Science & Engineering",
    students: 340,
    avgScore: 72,
    topMissingSkill: "Cloud Computing",
    placedPercentage: 88,
    hod: "Dr. Arvind Sharma",
    topRecruiters: ["Amazon", "Microsoft", "TCS Digital", "Infosys"],
    recommendedAction:
      "Host AWS & Azure cloud architecture bootcamps before upcoming tier-1 product campus drives.",
  },
  {
    code: "IT",
    name: "Information Technology",
    students: 210,
    avgScore: 70,
    topMissingSkill: "System Design",
    placedPercentage: 82,
    hod: "Dr. Priyamvada Rao",
    topRecruiters: ["Accenture", "Cognizant", "Wipro Turbo", "Oracle"],
    recommendedAction:
      "Organize high-scale distributed system problem-solving hackathons.",
  },
  {
    code: "ECE",
    name: "Electronics & Communication",
    students: 265,
    avgScore: 65,
    topMissingSkill: "REST APIs & Embedded Linux",
    placedPercentage: 75,
    hod: "Dr. Rajesh K. Nair",
    topRecruiters: ["Qualcomm", "Texas Instruments", "Intel", "Bosch"],
    recommendedAction:
      "Bridge hardware firmware concepts with modern cloud RESTful APIs.",
  },
  {
    code: "EEE",
    name: "Electrical & Electronics Engineering",
    students: 162,
    avgScore: 61,
    topMissingSkill: "Docker & Industrial IoT",
    placedPercentage: 68,
    hod: "Dr. Meenakshi Sundaram",
    topRecruiters: ["L&T Technology", "Siemens", "Schneider Electric", "Tata Power"],
    recommendedAction:
      "Introduce containerized power system telemetry and edge IoT pipelines.",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    students: 145,
    avgScore: 58,
    topMissingSkill: "Python / Data Analytics",
    placedPercentage: 62,
    hod: "Dr. Harish Chandra",
    topRecruiters: ["Tata Motors", "Mahindra & Mahindra", "JCB", "Thermax"],
    recommendedAction:
      "Launch Python for FEA/CFD automation and manufacturing data science modules.",
  },
  {
    code: "CE",
    name: "Civil Engineering",
    students: 125,
    avgScore: 55,
    topMissingSkill: "BIM & Project Mgmt SQL",
    placedPercentage: 57,
    hod: "Dr. Sunita Deshmukh",
    topRecruiters: ["L&T Construction", "Shapoorji Pallonji", "Afcons", "AECOM"],
    recommendedAction:
      "Integrate BIM automation with relational project management databases.",
  },
];

// Activity Feed Data
const recentActivities = [
  {
    id: 1,
    title: "23 students completed mock interviews today",
    department: "CSE & IT Cohort",
    time: "2 hours ago",
    icon: Briefcase,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    badge: "AI Assessment",
  },
  {
    id: 2,
    title: "15 new resumes improved this week",
    department: "ECE Department",
    time: "5 hours ago",
    icon: Award,
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    badge: "ATS Optimized",
  },
  {
    id: 3,
    title: "CSE department readiness score increased by 5 points",
    department: "Placement Analytics",
    time: "1 day ago",
    icon: TrendingUp,
    iconColor: "text-primary-600 bg-primary-50 border-primary-200",
    badge: "Milestone",
  },
  {
    id: 4,
    title: "42 students enrolled in AWS Cloud certification prep",
    department: "Multi-Department Initiative",
    time: "2 days ago",
    icon: BookOpen,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    badge: "Skill Gap Fix",
  },
  {
    id: 5,
    title: "Placement cell scheduled 8 on-campus drives for Q4",
    department: "Career Services & TPO",
    time: "3 days ago",
    icon: Users,
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    badge: "Recruitment",
  },
];

// Institutional Recommendations Data
const recommendations = [
  {
    id: 1,
    title: "Conduct workshops on Cloud Computing and System Design",
    description:
      "45% of students in CSE and IT departments lack hands-on experience in AWS/Azure and high-availability architecture. Running a 3-week micro-bootcamp is projected to raise readiness score by +8 points.",
    impact: "+8% Projected Readiness",
    urgency: "High Priority",
    urgencyBadge: "badge-red",
    tag: "Curriculum Intervention",
  },
  {
    id: 2,
    title: "Partner with NPTEL for advanced SQL courses",
    description:
      "32% of 3rd and 4th year candidates fall below tier-1 benchmark in complex query optimization, indexing, and window functions. Subsidizing NPTEL SWAYAM certifications will close this gap quickly.",
    impact: "+14% Technical Clearance",
    urgency: "Recommended",
    urgencyBadge: "badge-amber",
    tag: "Government MoU",
  },
  {
    id: 3,
    title: "35% of students lack soft skills training — consider communication workshops",
    description:
      "Recruiter feedback from recent preliminary screenings shows hesitation in STAR-method behavioral questions and structured communication. Weekly mock round sessions recommended.",
    impact: "+18% HR Round Conversion",
    urgency: "Strategic",
    urgencyBadge: "badge-primary",
    tag: "Placement Cell Initiative",
  },
];

function InstitutionDashboardView() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentDetail | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<string>("All Cohorts (2024-2025)");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner / Header Container */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200">
                  <Building2 className="h-3.5 w-3.5" />
                  Institutional Analytics Portal
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  NIRF Tier-1 Partner Campus
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Institution Dashboard — Demo College of Engineering
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal mt-1">
                Cohort Analytics & Placement Readiness
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={selectedCohort}
                  onChange={(e) => {
                    setSelectedCohort(e.target.value);
                    triggerToast(`Filtered dashboard to ${e.target.value}`);
                  }}
                  className="bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer shadow-sm hover:border-slate-400"
                >
                  <option>All Cohorts (2024-2025)</option>
                  <option>Batch 2025 — Final Year</option>
                  <option>Batch 2026 — Pre-Final Year</option>
                  <option>Core Branches (CE/ME/EEE)</option>
                  <option>Circuit Branches (CSE/IT/ECE)</option>
                </select>
                <Filter className="h-4 w-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>

              <button
                onClick={() =>
                  triggerToast(
                    "Institution Comprehensive Dossier (PDF) export queued. Check downloads."
                  )
                }
                className="btn-primary flex items-center gap-2 text-sm shadow-sm py-2.5 px-4"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* SUMMARY CARDS ROW (4 cards) */}
        <section aria-label="Key Performance Indicators">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Students */}
            <div className="card hover:border-primary-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">
                  Total Students
                </span>
                <div className="p-2.5 rounded-lg bg-indigo-50 text-primary-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  1,247
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Enrolled Candidates
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold text-emerald-600 inline-flex items-center">
                  +12.4%
                </span>
                <span>vs last academic year</span>
              </div>
            </div>

            {/* Card 2: Average Readiness Score */}
            <div className="card hover:border-primary-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">
                  Average Readiness Score
                </span>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  64
                </span>
                <span className="text-lg font-semibold text-slate-400">/100</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 ml-auto">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +4.8 pts
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-medium text-emerald-600">
                  Upward trajectory
                </span>
                <span>since semester baseline</span>
              </div>
            </div>

            {/* Card 3: Skills Gaps Closed */}
            <div className="card hover:border-primary-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">
                  Skills Gaps Closed
                </span>
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  3,892
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Micro-credentials
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold text-emerald-600 inline-flex items-center">
                  +18.2%
                </span>
                <span>month-over-month mastery</span>
              </div>
            </div>

            {/* Card 4: Placement Rate */}
            <div className="card hover:border-primary-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">
                  Placement Rate
                </span>
                <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-600">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  78%
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 ml-auto">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +6% YoY
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-medium text-slate-700">972 of 1,247</span>
                <span>offers secured & accepted</span>
              </div>
            </div>
          </div>
        </section>

        {/* CHARTS SECTION (2x2 grid on desktop) */}
        <section aria-label="Analytical Visualizations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart A: Average Readiness Score by Department (BarChart) */}
            <div className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Average Readiness Score by Department
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Max: 100 pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Benchmarked against industry job role requirements (2024-25)
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentScoreData}
                      margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="dept"
                        tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700">
                                <p className="font-semibold text-slate-200">
                                  {data.full} ({data.dept})
                                </p>
                                <p className="text-primary-300 font-bold mt-1">
                                  Score: {data.score} / 100
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="score"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      >
                        {departmentScoreData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-100/60 rounded-lg animate-pulse" />
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Top Performer: CSE (72)</span>
                <span>Focus Area: CE (55)</span>
              </div>
            </div>

            {/* Chart B: Skill Distribution (PieChart) */}
            <div className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Skill Distribution
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Top 5 Competencies
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  Share of primary verified student skill profiles across college
                </p>
              </div>

              <div className="h-72 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {skillDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700">
                                <p className="font-semibold text-slate-200">
                                  {data.name}
                                </p>
                                <p className="text-primary-300 font-bold mt-1">
                                  {data.value}% of student profiles
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                        formatter={(val: string, entry: any) => (
                          <span className="text-slate-700 font-medium">
                            {val} ({entry.payload.value}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-100/60 rounded-lg animate-pulse" />
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Dominant Tech: Python (30%)</span>
                <span>Core Foundation: C++ (10%)</span>
              </div>
            </div>

            {/* Chart C: Placement Trends (LineChart) */}
            <div className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Placement Trends
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                    4-Year Track
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Historical placement rates and AI projected outcome for 2025
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={placementTrendsData}
                      margin={{ top: 15, right: 20, left: -15, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[50, 100]}
                        unit="%"
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700">
                                <p className="font-semibold text-slate-200">
                                  Year: {data.year}
                                </p>
                                <p className="text-primary-300 font-bold mt-1">
                                  Placement Rate: {data.rate}%
                                </p>
                                <p className="text-slate-400 text-[10px] mt-0.5">
                                  Status: {data.label}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#4f46e5", strokeWidth: 2, stroke: "#ffffff" }}
                        activeDot={{ r: 8, stroke: "#6366f1", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-100/60 rounded-lg animate-pulse" />
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-emerald-600 font-medium">
                  +17% overall growth since 2022
                </span>
                <span className="font-semibold text-primary-600">
                  Target 2025: 85%
                </span>
              </div>
            </div>

            {/* Chart D: Top Skill Gaps (Horizontal BarChart) */}
            <div className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Top Skill Gaps
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Percentage of unverified students missing critical core prerequisites
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={skillGapsData}
                      margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        type="number"
                        domain={[0, 50]}
                        unit="%"
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="skill"
                        tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={false}
                        width={95}
                      />
                      <Tooltip
                        cursor={{ fill: "#fef2f2" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700">
                                <p className="font-semibold text-slate-200">
                                  {data.skill}
                                </p>
                                <p className="text-red-400 font-bold mt-1">
                                  {data.gapPercentage}% Students Missing
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="gapPercentage"
                        fill="#ef4444"
                        radius={[0, 6, 6, 0]}
                        barSize={20}
                      >
                        {skillGapsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? "#ef4444" : index === 1 ? "#f97316" : index === 2 ? "#f59e0b" : index === 3 ? "#6366f1" : "#8b5cf6"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-100/60 rounded-lg animate-pulse" />
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-red-600 font-medium">
                  Severe: Cloud Computing (45%)
                </span>
                <span>Threshold: &lt; 20% target</span>
              </div>
            </div>
          </div>
        </section>

        {/* DEPARTMENT-WISE BREAKDOWN TABLE */}
        <section aria-label="Department Breakdown">
          <div className="card overflow-hidden p-0">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Department-wise Breakdown
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Detailed readiness scores, enrolled strengths, and primary skill bottlenecks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                  Showing 6 Engineering Departments (1,247 Total)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Department</th>
                    <th className="py-3.5 px-6">Students</th>
                    <th className="py-3.5 px-6">Avg Score</th>
                    <th className="py-3.5 px-6">Top Missing Skill</th>
                    <th className="py-3.5 px-6">Placed %</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {departmentTableData.map((dept) => {
                    const isHigh = dept.avgScore >= 70;
                    const isMedium = dept.avgScore >= 60 && dept.avgScore < 70;

                    return (
                      <tr
                        key={dept.code}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="py-4 px-6 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0 border border-primary-100">
                              {dept.code}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {dept.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                HOD: {dept.hod}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium">
                          {dept.students.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-bold text-sm",
                                isHigh
                                  ? "text-emerald-600"
                                  : isMedium
                                  ? "text-primary-600"
                                  : "text-amber-600"
                              )}
                            >
                              {dept.avgScore}/100
                            </span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  isHigh
                                    ? "bg-emerald-500"
                                    : isMedium
                                    ? "bg-primary-500"
                                    : "bg-amber-500"
                                )}
                                style={{ width: `${dept.avgScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            {dept.topMissingSkill}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {dept.placedPercentage}%
                            </span>
                            <span className="text-xs text-slate-400">
                              ({Math.round((dept.students * dept.placedPercentage) / 100)} placed)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedDept(dept)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors border border-primary-200"
                          >
                            <span>View Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: 2 COLUMNS (Recent Activity Feed & Recommendations) */}
        <section aria-label="Activity and Recommendations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RECENT ACTIVITY FEED (Timeline style) */}
            <div className="card">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary-600" />
                    Recent Activity Feed
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live events, mock interviews, and student skill advancements
                  </p>
                </div>
                <span className="badge-primary text-xs">Live Updates</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="relative group">
                      {/* Timeline dot with icon */}
                      <div
                        className={cn(
                          "absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs border bg-white shadow-sm ring-4 ring-white",
                          activity.iconColor
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      </div>

                      <div className="pl-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                            {activity.title}
                          </h3>
                          <span className="text-[11px] font-medium text-slate-400 shrink-0">
                            {activity.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {activity.department}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {activity.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() =>
                    triggerToast("Audit log for all 1,247 students opened in new tab.")
                  }
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                >
                  View full institutional audit log
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* RECOMMENDATIONS FOR INSTITUTION */}
            <div className="card">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Recommendations for Institution
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prescriptive AI interventions based on placement feedback and gap metrics
                  </p>
                </div>
                <span className="badge-amber text-xs">AI Insights</span>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                        <h3 className="text-sm font-bold text-slate-900">
                          {rec.title}
                        </h3>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", rec.urgencyBadge)}>
                        {rec.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      {rec.description}
                    </p>

                    <div className="mt-3 pl-6 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Expected Impact: {rec.impact}
                      </span>
                      <button
                        onClick={() =>
                          triggerToast(
                            `Action initiated: "${rec.title}" added to Academic Dean Task Queue.`
                          )
                        }
                        className="text-xs font-semibold text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 group"
                      >
                        <span>Take Action</span>
                        <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-medium">
                  <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Custom curriculum redesign simulator ready</span>
                </div>
                <button
                  onClick={() =>
                    triggerToast("Curriculum simulation module opened.")
                  }
                  className="px-2.5 py-1 bg-white text-indigo-700 font-semibold rounded-lg shadow-sm border border-indigo-200 hover:bg-indigo-50"
                >
                  Simulate
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DEPARTMENT DETAILS MODAL */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-primary-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                  {selectedDept.code}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedDept.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Department Head: {selectedDept.hod}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Department Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-xs text-slate-500 font-medium">Cohort Size</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {selectedDept.students}
                </div>
                <div className="text-[10px] text-slate-400">Total Enrolled</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-xs text-slate-500 font-medium">Readiness</div>
                <div className="text-xl font-bold text-primary-600 mt-1">
                  {selectedDept.avgScore}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  Tier-1 Target: 75+
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-xs text-slate-500 font-medium">Placed %</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">
                  {selectedDept.placedPercentage}%
                </div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((selectedDept.students * selectedDept.placedPercentage) / 100)} Offers
                </div>
              </div>
            </div>

            {/* Deep Dive Sections */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Key Recruiter Partners:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDept.topRecruiters.map((r, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-200"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Critical Skill Bottleneck:
                </span>
                <div className="p-2.5 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center justify-between">
                  <span className="font-medium">{selectedDept.topMissingSkill}</span>
                  <span className="text-[11px] font-semibold bg-red-100 px-2 py-0.5 rounded text-red-700">
                    High Placement Impact
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Recommended Action Plan:
                </span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedDept.recommendedAction}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDept(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
              <button
                onClick={() => {
                  triggerToast(`Alert sent to ${selectedDept.hod} with diagnostic report.`);
                  setSelectedDept(null);
                }}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <span>Notify Faculty Lead</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentDashboardView() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Banner / Header Container */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Student Analytics Portal
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back, Student!
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal mt-1">
                Your personalized career readiness insights
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <button className="btn-primary flex items-center gap-2 text-sm shadow-sm py-2.5 px-4">
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
           {/* Card 1: Readiness Score */}
           <div className="card hover:border-primary-200 transition-all">
             <div className="flex items-center justify-between">
               <span className="text-sm font-semibold text-slate-500">Readiness Score</span>
               <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                 <Award className="h-5 w-5" />
               </div>
             </div>
             <div className="mt-3 flex items-baseline gap-2">
               <span className="text-3xl font-bold text-slate-900 tracking-tight">84</span>
               <span className="text-lg font-semibold text-slate-400">/100</span>
             </div>
             <div className="mt-3 text-xs text-slate-600">
               Top 15% in your cohort
             </div>
           </div>

           {/* Card 2: Applications */}
           <div className="card hover:border-primary-200 transition-all">
             <div className="flex items-center justify-between">
               <span className="text-sm font-semibold text-slate-500">Applications</span>
               <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                 <Briefcase className="h-5 w-5" />
               </div>
             </div>
             <div className="mt-3 flex items-baseline gap-2">
               <span className="text-3xl font-bold text-slate-900 tracking-tight">12</span>
             </div>
             <div className="mt-3 text-xs text-slate-600">
               3 interviews scheduled
             </div>
           </div>

           {/* Card 3: Skill Gaps */}
           <div className="card hover:border-primary-200 transition-all">
             <div className="flex items-center justify-between">
               <span className="text-sm font-semibold text-slate-500">Skill Gaps to Close</span>
               <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                 <Target className="h-5 w-5" />
               </div>
             </div>
             <div className="mt-3 flex items-baseline gap-2">
               <span className="text-3xl font-bold text-slate-900 tracking-tight">4</span>
             </div>
             <div className="mt-3 text-xs text-slate-600">
               Focus: Cloud Computing
             </div>
           </div>

           {/* Card 4: Mock Interviews */}
           <div className="card hover:border-primary-200 transition-all">
             <div className="flex items-center justify-between">
               <span className="text-sm font-semibold text-slate-500">Mock Interviews</span>
               <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-600">
                 <Users className="h-5 w-5" />
               </div>
             </div>
             <div className="mt-3 flex items-baseline gap-2">
               <span className="text-3xl font-bold text-slate-900 tracking-tight">7</span>
             </div>
             <div className="mt-3 text-xs text-slate-600">
               Avg score: 8.5/10
             </div>
           </div>
        </div>

        <section aria-label="Action Items">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Recommended Actions
                </h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-sm transition-all">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Complete AWS Cloud Practitioner cert</h3>
                  <p className="text-xs text-slate-600 mb-3">Boost your readiness score by 5 points for Cloud Engineer roles.</p>
                  <button className="text-xs font-semibold text-primary-600 hover:text-primary-800">Start Learning &rarr;</button>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-sm transition-all">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Take a Mock Interview: System Design</h3>
                  <p className="text-xs text-slate-600 mb-3">Your system design mock scores are slightly below target.</p>
                  <button className="text-xs font-semibold text-primary-600 hover:text-primary-800">Schedule Mock &rarr;</button>
                </div>
              </div>
            </div>

            <div className="card">
               <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  Your Top Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                 {['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium border border-slate-200">
                       {skill}
                    </span>
                 ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<'student' | 'institution'>('student');

  return (
    <div>
      {/* Role Toggle Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 flex justify-center items-center gap-4 text-sm font-medium z-50 relative">
        <span>View Dashboard As:</span>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setRole('student')}
            className={cn(
              "px-4 py-1.5 rounded-md transition-all",
              role === 'student' ? "bg-primary-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            Student
          </button>
          <button
            onClick={() => setRole('institution')}
            className={cn(
              "px-4 py-1.5 rounded-md transition-all",
              role === 'institution' ? "bg-primary-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            Institution
          </button>
        </div>
      </div>

      {role === 'institution' ? <InstitutionDashboardView /> : <StudentDashboardView />}
    </div>
  );
}
