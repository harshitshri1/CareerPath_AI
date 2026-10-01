"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Mic,
  FileText,
  Building2,
  LayoutDashboard,
  UserCheck,
  Compass,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react";

export default function HomePage() {
  const steps = [
    {
      num: "01",
      title: "Profile",
      desc: "Input your education, skills, and career goals",
      icon: UserCheck,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      num: "02",
      title: "Career Path",
      desc: "Discover matching modern tech and domain roles",
      icon: Compass,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      num: "03",
      title: "Skill Gap",
      desc: "Pinpoint missing technical and soft skills",
      icon: Target,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      num: "04",
      title: "Learning",
      desc: "Follow curated, milestone-based roadmaps",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      num: "05",
      title: "Opportunities",
      desc: "Access verified private, PSU, and govt drives",
      icon: Briefcase,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      num: "06",
      title: "Interview Ready",
      desc: "Ace AI mock interviews and ATS resume scans",
      icon: Award,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
  ];

  const features = [
    {
      title: "Unified Career Readiness Score",
      description:
        "Get a dynamic 0-100 composite score evaluating your academic performance, practical projects, technical proficiencies, and interview readiness.",
      icon: BarChart3,
      tag: "Dynamic Metric",
      href: "/dashboard",
      accent: "from-blue-500 to-indigo-600",
      lightBg: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "AI Skill-Gap Engine",
      description:
        "Deep diagnostic engine that compares your current skillset against actual industry benchmark requirements to generate precise learning roadmaps.",
      icon: Target,
      tag: "Gemini Powered",
      href: "/skill-gap",
      accent: "from-purple-500 to-indigo-600",
      lightBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "AI Mock Interviewer",
      description:
        "Practice realistic role-specific technical and behavioral interviews with real-time feedback on your responses, confidence, and subject accuracy.",
      icon: Mic,
      tag: "Interactive AI",
      href: "/mock-interview",
      accent: "from-rose-500 to-pink-600",
      lightBg: "bg-rose-50 text-rose-600",
    },
    {
      title: "Resume Improvement Assistant",
      description:
        "Instantly parse your resume against ATS filters, detect formatting flaws, and receive generative AI suggestions tailored to your target job role.",
      icon: FileText,
      tag: "ATS Optimization",
      href: "/resume-assistant",
      accent: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Government & PSU Opportunities",
      description:
        "Discover curated government exams, public sector undertakings, national hackathons, and state-sponsored apprenticeship openings in one place.",
      icon: Building2,
      tag: "Verified Portals",
      href: "/opportunities",
      accent: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Institution Dashboard",
      description:
        "Empower colleges and placement directors with aggregate cohort analytics, skill trends, and NAAC/NIRF accreditation-ready employability metrics.",
      icon: LayoutDashboard,
      tag: "Educator Analytics",
      href: "/dashboard",
      accent: "from-cyan-500 to-blue-600",
      lightBg: "bg-cyan-50 text-cyan-600",
    },
  ];

  const policies = [
    {
      name: "NEP 2020",
      subtitle: "National Education Policy",
      highlight: "Multidisciplinary & Vocational Integration",
      desc: "Promotes outcome-based learning, practical credits, and holistic vocational skill development starting from early college semesters.",
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-900",
      badgeColor: "bg-indigo-100 text-indigo-800",
    },
    {
      name: "Skill India",
      subtitle: "National Skill Mission",
      highlight: "NSQF-Aligned Competencies",
      desc: "Aligns youth capabilities with National Skills Qualifications Framework to ensure industry-standard employability and certification.",
      color: "border-amber-200 bg-amber-50/50 text-amber-900",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Digital India",
      subtitle: "Digital Empowerment",
      highlight: "AI for Tier-2 & Tier-3 Colleges",
      desc: "Democratizes world-class AI mentoring and recruitment intelligence for students in rural and non-metro institutions.",
      color: "border-blue-200 bg-blue-50/50 text-blue-900",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      name: "Viksit Bharat 2047",
      subtitle: "Developed Nation Vision",
      highlight: "Future-Ready Talent Pipeline",
      desc: "Empowers the demographic dividend with deep-tech, AI literacy, and indigenous innovation capabilities to drive India's global tech leadership.",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
  ];



  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-primary-50/70 via-white to-slate-50 border-b border-slate-200/80">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-2xl -z-10 pointer-events-none" />
        <div className="absolute top-36 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl">
              Your AI-Powered <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600">
                Career Readiness Partner
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              Bridging the divide between campus education and corporate expectations.
              Get tailored skill-gap analyses, AI mock interviews, ATS resume auditing,
              and curated government opportunities in one intelligent platform.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/profile"
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 text-base px-8 py-3.5 group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/career-paths"
                className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <Compass className="h-4 w-4" />
                <span>View Demo</span>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero Subscription Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Powered by Gemini 1.5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary-600" />
                <span>Aligned with NEP 2020</span>
              </div>
            </div>

            {/* Interactive Preview Card Mockup */}
            <div className="mt-12 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-left transition-all hover:shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    CR
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      Live Student Profile Benchmark
                      <span className="badge-green text-xs py-0.5 px-2">AI Analyzed</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      B.Tech Computer Science • Target: Full-Stack Cloud Architect
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      Readiness Score
                    </div>
                    <div className="text-2xl font-black text-primary-600">84 / 100</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-emerald-400 flex items-center justify-center text-xs font-bold text-slate-700 bg-slate-50">
                    84%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                    <span>Skill Match Ratio</span>
                    <span className="text-emerald-600 font-bold">78%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[78%] rounded-full" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Strong in React & Python; Docker needed
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                    <span>ATS Resume Score</span>
                    <span className="text-primary-600 font-bold">88 / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary-600 h-full w-[88%] rounded-full" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Action verbs verified, 3 metric improvements
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                    <span>Mock Interview Avg</span>
                    <span className="text-amber-600 font-bold">8.5 / 10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[85%] rounded-full" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    System design high, refine distributed caching
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="bg-white border-b border-slate-200 py-10 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col items-center sm:items-start p-4 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-100 sm:border-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-600 tracking-tight">
                6
              </span>
              <span className="text-base font-bold text-slate-900 mt-1">
                AI Features
              </span>
              <span className="text-xs sm:text-sm text-slate-500 mt-0.5 text-center sm:text-left">
                Integrated career assistance tools
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start p-4 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-100 sm:border-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">
                500+
              </span>
              <span className="text-base font-bold text-slate-900 mt-1">
                Career Paths
              </span>
              <span className="text-xs sm:text-sm text-slate-500 mt-0.5 text-center sm:text-left">
                Mapped to evolving industry standards
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start p-4 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-100 sm:border-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 tracking-tight">
                1000+
              </span>
              <span className="text-base font-bold text-slate-900 mt-1">
                Opportunities
              </span>
              <span className="text-xs sm:text-sm text-slate-500 mt-0.5 text-center sm:text-left">
                PSU drives, internships & corporate jobs
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start p-4 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-100 sm:border-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
                95%
              </span>
              <span className="text-base font-bold text-slate-900 mt-1">
                Accuracy
              </span>
              <span className="text-xs sm:text-sm text-slate-500 mt-0.5 text-center sm:text-left">
                Generative AI skill & gap precision
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (6-step journey with connecting arrows) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="badge-primary mb-3">Structured Workflow</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              A continuous, 6-stage lifecycle taking you from initial self-assessment to interview excellence and placement.
            </p>
          </div>

          {/* Steps container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative group flex flex-col h-full">
                  <div className="card h-full flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 border-slate-200">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-slate-400 tracking-wider">
                          {step.num}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-primary-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-primary-600">
                      <span>Stage {idx + 1}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Connecting Arrow for Desktop (between items) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Key Features (3x2 Grid) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="badge-primary mb-3">Comprehensive Suite</div>
            <h2 className="section-title">Key AI Capabilities</h2>
            <p className="section-subtitle">
              Engineered to replace fragmented counseling tools with an all-in-one AI career intelligence powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card group hover:border-primary-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.lightBg}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2.5">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group-hover:translate-x-0.5 transition-all pt-4 border-t border-slate-100"
                  >
                    <span>Explore module</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Policy Alignment Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="badge-green mb-3">National Imperative</div>
            <h2 className="section-title">Aligned with National Priorities</h2>
            <p className="section-subtitle">
              CareerPath AI directly operationalizes flagship Indian educational and workforce initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {policies.map((p) => (
              <div
                key={p.name}
                className={`card border-2 ${p.color} transition-all duration-200 hover:-translate-y-1 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${p.badgeColor}`}>
                    {p.name}
                  </span>
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  {p.subtitle}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {p.highlight}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative background flare */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-primary-200 border border-white/10 text-xs font-semibold mb-6">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Elevate Your Employability Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to supercharge your career?
          </h2>

          <p className="text-base sm:text-lg text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create your personalized profile in under 2 minutes. Receive instant skill-gap
            diagnostics, ATS resume suggestions, and AI mock interview simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-primary-900 hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary-800/80 hover:bg-primary-700/80 text-white border border-primary-600 transition-colors flex items-center justify-center gap-2 text-base"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Explore Dashboard</span>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-primary-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% Free for Higher Ed Students</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No Credit Card or Installation Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Exportable Placement Readiness Reports</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
