# 🎓 CareerReady AI — AI-Powered Career Readiness & Employability Platform

> **Connecting the entire journey from Campus to Corporate in one integrated platform.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

---

## 🚀 What Is This?

CareerReady AI is an **AI-powered career readiness platform** that provides students with personalized career guidance, skill-gap analysis, mock interviews, resume improvement, and opportunity matching — all in one place.

Unlike existing platforms that offer isolated features (a job board OR a resume checker OR a course catalogue), **CareerReady AI connects the entire journey**:

```
Profile → Career Path → Skill Gap → Learning → Opportunities → Interview Ready
```

## ✨ Key Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Student Profile & AI Resume Parsing** | Create your profile or let AI extract data from your resume automatically |
| 2 | **AI Career Path Recommendations** | Personalized career paths with match percentages based on your skills and goals |
| 3 | **Skill Gap Analysis & Readiness Score** | A unified 0-100 Career Readiness Score with specific skill gaps and learning roadmap |
| 4 | **Opportunities (Private + Government)** | Jobs, internships, government exams (SSC, UPSC, IBPS), and scholarships in one place |
| 5 | **AI Resume Improvement Assistant** | ATS scoring, keyword analysis, and bullet-point rewrites for your target role |
| 6 | **AI Mock Interview with Feedback** | Adaptive, role-specific interview questions with scoring on content, clarity & confidence |
| 7 | **Institution Analytics Dashboard** | College-level cohort analytics, skill trends, and placement readiness data |

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (via Next.js 14 App Router), Tailwind CSS, shadcn/ui, Recharts |
| **Backend** | Node.js (Next.js API Routes), TypeScript |
| **Database** | SQLite with Prisma ORM (easily switchable to PostgreSQL/MongoDB) |
| **AI/LLM** | Google Gemini API (gemini-1.5-flash) |
| **Speech** | Web Speech API (browser-native) |
| **Icons** | Lucide React |

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│         React.js + Tailwind CSS + shadcn/ui             │
├─────────────────────────────────────────────────────────┤
│                    API Layer                             │
│         Next.js API Routes (Node.js + TypeScript)       │
│         Authentication • Role-based Access              │
├─────────────────────────────────────────────────────────┤
│                    AI Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Profile  │ │ Career   │ │ Skill    │ │ Resume     │ │
│  │ Analyzer │ │Recommender│ │Gap Engine│ │ Assistant  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
│  ┌──────────────┐ ┌────────────────────┐               │
│  │ Mock Interview│ │Opportunity Matcher │               │
│  │   Engine      │ │                    │               │
│  └──────────────┘ └────────────────────┘               │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│  SQLite + Prisma ORM │ Student Profiles │ Analytics     │
│  Curated Opportunities DB │ Government Schemes          │
└─────────────────────────────────────────────────────────┘
```

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **Gemini API Key** (free at [aistudio.google.com](https://aistudio.google.com))

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/careerready-ai.git
cd careerready-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Set up the database
npx prisma db push
npx prisma generate

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials (Demo)
No login required — the prototype uses localStorage for session management.

## 🎬 Demo Flow (3 minutes)

1. **Landing Page** → See platform overview and features
2. **Create Profile** → Fill in your details or paste your resume for AI parsing
3. **Career Paths** → View personalized role recommendations with match %
4. **Skill Gap Analysis** → See your Career Readiness Score and specific skill gaps
5. **Opportunities** → Browse jobs, internships, and government opportunities
6. **Resume Assistant** → Get AI-powered resume improvements and ATS scoring
7. **Mock Interview** → Take an AI interview with real-time feedback
8. **Dashboard** → View institution-level analytics and cohort insights

## 🇮🇳 Policy Alignment

| Initiative | How We Align |
|-----------|-------------|
| **NEP 2020** | Skill-based, multidisciplinary, personalized learning pathways |
| **Skill India** | Maps skill gaps to courses and certifications |
| **Digital India** | Digital, accessible, scalable career guidance |
| **Viksit Bharat 2047** | Builds a skilled, employable workforce |

## 🎯 What Makes Us Different?

| Existing Platforms | CareerReady AI |
|-------------------|----------------|
| Generic recommendations | Personalized to each student's profile and goals |
| Separate tools for jobs, courses, resumes | One integrated journey |
| Mostly private-sector focus | Private AND government opportunities |
| No view for institutions | College-level analytics dashboard |
| Static advice | Continuously updated roadmap and readiness score |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with navbar
│   ├── globals.css                 # Global styles
│   ├── profile/page.tsx            # Student profile & resume upload
│   ├── career-paths/page.tsx       # AI career recommendations
│   ├── skill-gap/page.tsx          # Skill gap analysis & readiness score
│   ├── opportunities/page.tsx      # Jobs, internships, govt opportunities
│   ├── resume-assistant/page.tsx   # AI resume improvement
│   ├── mock-interview/page.tsx     # AI mock interview
│   ├── dashboard/page.tsx          # Institution analytics
│   └── api/
│       ├── parse-resume/route.ts   # Resume parsing API
│       ├── career-recommend/route.ts # Career recommendation API
│       ├── skill-gap/route.ts      # Skill gap analysis API
│       ├── resume-improve/route.ts # Resume improvement API
│       ├── mock-interview/route.ts # Mock interview API
│       ├── student/route.ts        # Student CRUD (Prisma)
│       └── dashboard/route.ts      # Dashboard analytics API
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   └── ScoreGauge.tsx             # Animated score gauge
├── lib/
│   ├── gemini.ts                   # Gemini API client
│   ├── store.ts                    # localStorage state management
│   ├── prisma.ts                   # Prisma client singleton
│   ├── utils.ts                    # Utility functions
│   └── opportunities-data.ts      # Curated opportunities dataset
└── prisma/
    └── schema.prisma               # Database schema
```

## 📊 Measurable Success Indicators

- ↑ Student placement and internship conversion rate
- ↑ Average Career Readiness Score over a semester
- ↑ Skill gaps closed through completed courses
- ↑ Student engagement (mock interviews taken, resumes improved)

## 🛡️ Security & Ethics

- Encrypted data in transit (HTTPS)
- User consent-based data collection
- No sharing of personal data with employers without permission
- Transparent explanations for all AI recommendations
- DPDP Act 2023 compliance ready

## 📝 License

Built for hackathon demonstration purposes.

---

**Built with ❤️ for Smart India Hackathon**
# CareerPath_AI
