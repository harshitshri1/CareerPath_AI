import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import type { StudentProfile } from "@/lib/store";

export interface SkillGapBreakdown {
  academics: number;
  technicalSkills: number;
  projects: number;
  certifications: number;
  interviewReadiness: number;
}

export interface MissingSkillItem {
  skill: string;
  importance: "Critical" | "Important" | "Nice-to-have";
  course: string;
  platform: string;
}

export interface RecommendedCourseItem {
  name: string;
  platform: string;
  duration: string;
  url: string;
}

export interface SkillGapResponse {
  overallScore: number;
  breakdown: SkillGapBreakdown;
  existingSkills: string[];
  missingSkills: MissingSkillItem[];
  recommendedCourses: RecommendedCourseItem[];
  actionPlan: string[];
}

// Fallback generator when Gemini API is unavailable or rate-limited
function generateFallbackSkillGap(
  profile: Partial<StudentProfile>,
  targetRole: string
): SkillGapResponse {
  const role = targetRole || profile.targetRole || "Software Engineer";
  const lowerRole = role.toLowerCase();

  // 1. Academics score based on CGPA
  let academics = 75;
  if (profile.cgpa) {
    const parsed = parseFloat(profile.cgpa);
    if (!isNaN(parsed)) {
      if (parsed <= 4.0) {
        academics = Math.min(100, Math.round((parsed / 4.0) * 100));
      } else if (parsed <= 10.0) {
        academics = Math.min(100, Math.round((parsed / 10.0) * 100));
      } else if (parsed <= 100.0) {
        academics = Math.min(100, Math.round(parsed));
      }
    }
  }

  // 2. Technical Skills score based on declared skills
  const skills = profile.skills || [];
  let technicalSkills = Math.min(95, Math.max(35, 45 + skills.length * 6));

  // 3. Projects score based on project quantity & descriptions
  const projects = profile.projects || [];
  let projectsScore = 40;
  if (projects.length > 0) {
    projectsScore = Math.min(95, 50 + projects.length * 15);
    const hasDetailedDesc = projects.some(
      (p) => (typeof p === "object" ? p.description?.length : 0) > 50
    );
    if (hasDetailedDesc) projectsScore = Math.min(95, projectsScore + 8);
  }

  // 4. Certifications score
  const certs = profile.certifications || [];
  let certsScore = Math.min(92, Math.max(30, 40 + certs.length * 18));

  // 5. Interview Readiness score
  let interviewReadiness = Math.min(
    90,
    Math.round(academics * 0.25 + technicalSkills * 0.4 + projectsScore * 0.35)
  );

  // Overall Score (composite weighted average)
  const overallScore = Math.round(
    academics * 0.2 +
      technicalSkills * 0.3 +
      projectsScore * 0.25 +
      certsScore * 0.1 +
      interviewReadiness * 0.15
  );

  // Existing skills
  const existingSkills = skills.length > 0 ? skills : ["JavaScript", "Python", "Git", "Problem Solving"];

  // Missing skills bank curated by domain
  let roleMissingSkills: MissingSkillItem[] = [];
  let roleCourses: RecommendedCourseItem[] = [];

  if (lowerRole.includes("front") || lowerRole.includes("web") || lowerRole.includes("ui")) {
    roleMissingSkills = [
      {
        skill: "Next.js & Server Components",
        importance: "Critical",
        course: "Next.js 14 & React - The Complete Guide",
        platform: "Udemy",
      },
      {
        skill: "TypeScript for React",
        importance: "Critical",
        course: "Understanding TypeScript",
        platform: "Udemy",
      },
      {
        skill: "Tailwind CSS & Design Systems",
        importance: "Important",
        course: "Tailwind CSS from Scratch",
        platform: "Coursera",
      },
      {
        skill: "Frontend Unit Testing (Jest & RTL)",
        importance: "Important",
        course: "Testing React with Jest and Testing Library",
        platform: "Udemy",
      },
      {
        skill: "Web Accessibility (WCAG 2.1)",
        importance: "Nice-to-have",
        course: "Introduction to Web Accessibility",
        platform: "edX / W3C",
      },
      {
        skill: "State Management (Redux Toolkit / Zustand)",
        importance: "Important",
        course: "Modern Redux with Redux Toolkit",
        platform: "Coursera",
      },
    ];

    roleCourses = [
      {
        name: "Meta Front-End Developer Professional Certificate",
        platform: "Coursera",
        duration: "6 months (6 hrs/week)",
        url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      },
      {
        name: "React - The Complete Guide (incl. Next.js, Redux)",
        platform: "Udemy",
        duration: "8 weeks (5 hrs/week)",
        url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
      },
      {
        name: "Modern Web Development with TypeScript",
        platform: "NPTEL",
        duration: "12 weeks",
        url: "https://nptel.ac.in/courses/106105084",
      },
      {
        name: "Full Stack Open: Deep Dive Into Modern Web Development",
        platform: "University of Helsinki",
        duration: "Self-paced (60 hrs)",
        url: "https://fullstackopen.com/en/",
      },
    ];
  } else if (lowerRole.includes("data") || lowerRole.includes("ai") || lowerRole.includes("ml") || lowerRole.includes("machine")) {
    roleMissingSkills = [
      {
        skill: "PyTorch / TensorFlow Deep Learning",
        importance: "Critical",
        course: "Deep Learning Specialization by Andrew Ng",
        platform: "Coursera",
      },
      {
        skill: "Data Pipelines & SQL Optimization",
        importance: "Critical",
        course: "Advanced Relational Database Design & SQL",
        platform: "NPTEL",
      },
      {
        skill: "MLOps & Model Deployment (FastAPI, Docker)",
        importance: "Important",
        course: "Machine Learning Engineering for Production (MLOps)",
        platform: "Coursera",
      },
      {
        skill: "Feature Engineering & Scikit-Learn",
        importance: "Important",
        course: "Applied Data Science with Python",
        platform: "Coursera",
      },
      {
        skill: "Vector Databases & LLM Integration (LangChain)",
        importance: "Nice-to-have",
        course: "Building Applications with LLMs",
        platform: "DeepLearning.AI",
      },
    ];

    roleCourses = [
      {
        name: "Deep Learning Specialization (DeepLearning.AI)",
        platform: "Coursera",
        duration: "3 months (10 hrs/week)",
        url: "https://www.coursera.org/specializations/deep-learning",
      },
      {
        name: "Data Mining and Business Intelligence",
        platform: "NPTEL",
        duration: "8 weeks",
        url: "https://nptel.ac.in/courses/106105174",
      },
      {
        name: "Machine Learning A-Z: AI, Python & R",
        platform: "Udemy",
        duration: "6 weeks (6 hrs/week)",
        url: "https://www.udemy.com/course/machinelearning/",
      },
      {
        name: "Google Data Analytics Professional Certificate",
        platform: "Coursera",
        duration: "6 months (5 hrs/week)",
        url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      },
    ];
  } else if (lowerRole.includes("devops") || lowerRole.includes("cloud")) {
    roleMissingSkills = [
      {
        skill: "Docker & Container Orchestration (Kubernetes)",
        importance: "Critical",
        course: "Docker & Kubernetes: The Practical Guide",
        platform: "Udemy",
      },
      {
        skill: "Infrastructure as Code (Terraform)",
        importance: "Critical",
        course: "HashiCorp Certified: Terraform Associate",
        platform: "Udemy",
      },
      {
        skill: "CI/CD Automation (GitHub Actions / Jenkins)",
        importance: "Important",
        course: "Continuous Integration & Delivery Pipelines",
        platform: "Coursera",
      },
      {
        skill: "Cloud Architecture (AWS / GCP)",
        importance: "Important",
        course: "AWS Certified Solutions Architect - Associate",
        platform: "Coursera",
      },
      {
        skill: "Observability (Prometheus & Grafana)",
        importance: "Nice-to-have",
        course: "Monitoring and Alerting with Prometheus",
        platform: "edX",
      },
    ];

    roleCourses = [
      {
        name: "AWS Certified Cloud Practitioner & Solutions Architect",
        platform: "Coursera",
        duration: "4 months (6 hrs/week)",
        url: "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect",
      },
      {
        name: "Kubernetes for Developers (CKAD Preparation)",
        platform: "Udemy",
        duration: "5 weeks (5 hrs/week)",
        url: "https://www.udemy.com/course/certified-kubernetes-application-developer/",
      },
      {
        name: "Cloud Computing and Distributed Systems",
        platform: "NPTEL",
        duration: "8 weeks",
        url: "https://nptel.ac.in/courses/106104182",
      },
    ];
  } else {
    // General Full Stack / Software Engineer default
    roleMissingSkills = [
      {
        skill: "System Design & Scalable Architecture",
        importance: "Critical",
        course: "Grokking Modern System Design for Engineers",
        platform: "Educative / YouTube",
      },
      {
        skill: "Docker & Containerization",
        importance: "Critical",
        course: "Docker for Beginners: DevOps Essentials",
        platform: "Udemy",
      },
      {
        skill: "Relational Database Indexing (PostgreSQL)",
        importance: "Important",
        course: "Database Management System Fundamentals",
        platform: "NPTEL",
      },
      {
        skill: "RESTful API Security & OAuth 2.0",
        importance: "Important",
        course: "API Security Best Practices & Authentication",
        platform: "Coursera",
      },
      {
        skill: "Redis Caching & Message Queues",
        importance: "Nice-to-have",
        course: "Distributed Caching with Redis & BullMQ",
        platform: "Udemy",
      },
      {
        skill: "Automated Testing & CI/CD Pipelines",
        importance: "Important",
        course: "DevOps & Software Engineering Professional Certificate",
        platform: "Coursera",
      },
    ];

    roleCourses = [
      {
        name: "Meta Back-End Developer Professional Certificate",
        platform: "Coursera",
        duration: "6 months (6 hrs/week)",
        url: "https://www.coursera.org/professional-certificates/meta-back-end-developer",
      },
      {
        name: "Programming, Data Structures And Algorithms In Python",
        platform: "NPTEL",
        duration: "8 weeks",
        url: "https://nptel.ac.in/courses/106106145",
      },
      {
        name: "Docker and Kubernetes: The Complete Guide",
        platform: "Udemy",
        duration: "6 weeks (5 hrs/week)",
        url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
      },
      {
        name: "Software Engineering & Architecture",
        platform: "NPTEL",
        duration: "12 weeks",
        url: "https://nptel.ac.in/courses/106105182",
      },
    ];
  }

  // Filter out any skills the user already possesses
  const lowerExisting = existingSkills.map((s) => s.toLowerCase());
  const filteredMissing = roleMissingSkills.filter(
    (m) => !lowerExisting.some((ex) => m.skill.toLowerCase().includes(ex) || ex.includes(m.skill.toLowerCase()))
  );

  const actionPlan = [
    `Master ${roleMissingSkills[0]?.skill || "core architecture"}: Complete a targeted project utilizing this technology within the next 2-3 weeks.`,
    `Build an end-to-end full stack project incorporating ${roleMissingSkills[1]?.skill || "containerization"} and deploy it to a live cloud host.`,
    "Enroll in an industry-recognized certification or NPTEL course to reinforce credentialing on your resume.",
    "Perform 2 timed technical coding assessments and a mock technical interview focusing on data structures and system design.",
    "Refactor your GitHub repository documentation with clean architectural diagrams and comprehensive READMEs.",
  ];

  return {
    overallScore,
    breakdown: {
      academics,
      technicalSkills,
      projects: projectsScore,
      certifications: certsScore,
      interviewReadiness,
    },
    existingSkills,
    missingSkills: filteredMissing.length > 0 ? filteredMissing : roleMissingSkills.slice(0, 4),
    recommendedCourses: roleCourses,
    actionPlan,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile: Partial<StudentProfile> = body.profile || body || {};
    const targetRole =
      body.targetRole || profile.targetRole || "Software Engineer";

    const prompt = `You are a premier Technical Career Coach and Skill Assessment Engine.
Evaluate the following student profile against industry standards for the target role: "${targetRole}".

Target Role: ${targetRole}
Student Information:
- Degree & Year: ${profile.degree || "B.Tech"} (${profile.year || "3rd Year"})
- College: ${profile.college || "Engineering College"}
- CGPA: ${profile.cgpa || "7.5"}
- Declared Skills: ${profile.skills?.join(", ") || "General programming"}
- Projects: ${
      profile.projects
        ?.map((p) => (typeof p === "string" ? p : `${p.name}: ${p.description}`))
        .join("; ") || "None listed"
    }
- Certifications: ${profile.certifications?.join(", ") || "None listed"}
- Experience: ${profile.experience?.join("; ") || "None listed"}
- Resume Details: ${profile.resumeText ? profile.resumeText.slice(0, 800) : "Not provided"}

Perform an in-depth skill gap analysis and compute a rigorous Career Readiness Score (0-100).
Return ONLY a valid JSON object matching this exact TypeScript schema:
{
  "overallScore": number (0-100, composite readiness for ${targetRole}),
  "breakdown": {
    "academics": number (0-100, based on CGPA and academic baseline),
    "technicalSkills": number (0-100, based on depth and breadth of declared technical skills),
    "projects": number (0-100, based on project portfolio complexity and practical exposure),
    "certifications": number (0-100, based on industry credentials and verified courses),
    "interviewReadiness": number (0-100, based on estimated preparedness for technical and behavioral interviews)
  },
  "existingSkills": string[] (skills the student already has that align with the role),
  "missingSkills": [
    {
      "skill": string (name of missing skill required for ${targetRole}),
      "importance": "Critical" | "Important" | "Nice-to-have",
      "course": string (specific recommended course or learning resource to acquire it),
      "platform": string (e.g. Coursera, Udemy, NPTEL, edX, freeCodeCamp)
    }
  ],
  "recommendedCourses": [
    {
      "name": string (course title),
      "platform": string (e.g. Coursera, Udemy, NPTEL, edX),
      "duration": string (e.g. "6 weeks (4 hrs/wk)"),
      "url": string (valid web URL to course platform)
    }
  ],
  "actionPlan": string[] (5 prioritized, high-impact action steps for the student)
}

Ensure all numerical scores are between 0 and 100.
Do not wrap in markdown tags or include conversational commentary.`;

    try {
      const result = await generateJSON<SkillGapResponse>(prompt);

      // Validate response structure
      if (
        typeof result?.overallScore === "number" &&
        result.breakdown &&
        typeof result.breakdown.academics === "number" &&
        typeof result.breakdown.technicalSkills === "number" &&
        typeof result.breakdown.projects === "number" &&
        typeof result.breakdown.certifications === "number" &&
        typeof result.breakdown.interviewReadiness === "number" &&
        Array.isArray(result.existingSkills) &&
        Array.isArray(result.missingSkills) &&
        Array.isArray(result.recommendedCourses) &&
        Array.isArray(result.actionPlan)
      ) {
        return NextResponse.json(result);
      } else {
        console.warn("Gemini returned invalid skill gap schema. Utilizing fallback engine.");
        const fallback = generateFallbackSkillGap(profile, targetRole);
        return NextResponse.json(fallback);
      }
    } catch (aiError) {
      console.warn("Gemini API call failed, generating fallback skill gap analysis:", aiError);
      const fallback = generateFallbackSkillGap(profile, targetRole);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("Skill gap route handler error:", error);
    return NextResponse.json(
      { error: "Failed to perform skill gap analysis" },
      { status: 500 }
    );
  }
}
