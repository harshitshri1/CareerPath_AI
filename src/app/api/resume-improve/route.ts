import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export interface SectionFeedbackItem {
  section: string;
  status: "good" | "needs-improvement" | "missing";
  feedback: string;
  improved?: string;
}

export interface BulletImprovementItem {
  original: string;
  improved: string;
}

export interface ResumeImprovementResponse {
  atsScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  keywordDensityAssessment: string;
  sectionFeedback: SectionFeedbackItem[];
  bulletImprovements: BulletImprovementItem[];
  overallRecommendations: string[];
}

// Fallback generator when Gemini API key is unavailable or rate-limited
function generateFallbackAnalysis(
  resumeText: string,
  targetRole: string
): ResumeImprovementResponse {
  const lower = resumeText.toLowerCase();
  const role = targetRole || "Software Engineer";

  // Role keyword dictionaries
  const roleKeywords: Record<string, string[]> = {
    frontend: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Redux",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Responsive Design",
      "REST APIs",
      "GraphQL",
      "Jest",
      "Webpack",
      "Performance Optimization",
      "Web Accessibility (WCAG)",
    ],
    backend: [
      "Node.js",
      "Express",
      "Python",
      "Django",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
      "Microservices",
      "RESTful APIs",
      "GraphQL",
      "AWS",
      "CI/CD",
      "System Design",
      "Database Indexing",
    ],
    "full stack": [
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "REST APIs",
      "Docker",
      "Git",
      "Tailwind CSS",
      "AWS",
      "Unit Testing",
      "CI/CD Pipelines",
      "Agile/Scrum",
      "Cloud Deployment",
    ],
    data: [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Tableau",
      "Power BI",
      "Machine Learning",
      "Data Modeling",
      "Statistical Analysis",
      "TensorFlow",
      "PyTorch",
      "Data Cleaning",
      "BigQuery",
      "ETL Pipelines",
    ],
    ai: [
      "PyTorch",
      "TensorFlow",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Large Language Models (LLMs)",
      "Hugging Face",
      "LangChain",
      "Vector Databases",
      "Python",
      "Model Evaluation",
      "Prompt Engineering",
      "MLOps",
    ],
    devops: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Terraform",
      "CI/CD",
      "GitHub Actions",
      "Linux",
      "Bash",
      "Prometheus",
      "Grafana",
      "Ansible",
      "CloudWatch",
      "Helm",
      "Networking",
    ],
  };

  // Find relevant keyword bank based on role
  let chosenBank = roleKeywords["full stack"];
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("front")) chosenBank = roleKeywords.frontend;
  else if (lowerRole.includes("back")) chosenBank = roleKeywords.backend;
  else if (lowerRole.includes("data") || lowerRole.includes("analyst"))
    chosenBank = roleKeywords.data;
  else if (
    lowerRole.includes("ai") ||
    lowerRole.includes("ml") ||
    lowerRole.includes("machine learning")
  )
    chosenBank = roleKeywords.ai;
  else if (lowerRole.includes("devops") || lowerRole.includes("cloud"))
    chosenBank = roleKeywords.devops;

  const presentKeywords: string[] = [];
  const missingKeywords: string[] = [];

  chosenBank.forEach((kw) => {
    if (lower.includes(kw.toLowerCase())) {
      presentKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate ATS Score based on sections & keywords
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
    resumeText
  );
  const hasPhone =
    /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/.test(resumeText) ||
    /\b\d{10}\b/.test(resumeText);
  const hasLinkedIn =
    lower.includes("linkedin.com") || lower.includes("linkedin");
  const hasGitHub = lower.includes("github.com") || lower.includes("github");
  const hasSummary =
    lower.includes("summary") ||
    lower.includes("objective") ||
    lower.includes("about me");
  const hasExperience =
    lower.includes("experience") ||
    lower.includes("employment") ||
    lower.includes("work history") ||
    lower.includes("internship");
  const hasProjects = lower.includes("project");
  const hasEducation =
    lower.includes("education") ||
    lower.includes("bachelor") ||
    lower.includes("b.tech") ||
    lower.includes("degree") ||
    lower.includes("university") ||
    lower.includes("college");
  const hasMetrics = /\d+%|\$\d+|\b\d+\s*(users|clients|ms|sec|x|times)\b/i.test(
    resumeText
  );

  let score = 55;
  if (hasEmail) score += 5;
  if (hasPhone) score += 4;
  if (hasLinkedIn) score += 4;
  if (hasGitHub) score += 4;
  if (hasSummary) score += 5;
  if (hasExperience) score += 7;
  if (hasProjects) score += 6;
  if (hasEducation) score += 5;
  if (hasMetrics) score += 7;
  score += Math.min(12, presentKeywords.length * 2);
  score = Math.min(95, Math.max(35, score));

  // Extract candidate bullet lines or provide defaults
  const lines = resumeText
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        (l.startsWith("-") ||
          l.startsWith("•") ||
          l.startsWith("*") ||
          l.length > 30) &&
        !l.toLowerCase().includes("university") &&
        !l.toLowerCase().includes("cgpa")
    );

  const bulletImprovements: BulletImprovementItem[] = [];

  if (lines.length > 0) {
    const b1 = lines[0].replace(/^[-•*]\s*/, "");
    bulletImprovements.push({
      original: b1,
      improved: `Spearheaded development of scalable modules for ${b1.slice(0, 45)}..., resulting in 32% faster execution and reducing system latency for 1,200+ active users.`,
    });
  } else {
    bulletImprovements.push({
      original: "Worked on building web applications using React and Node.js.",
      improved:
        "Architected and deployed 3 high-throughput web applications using React and Node.js, cutting page load times by 40% and serving 5,000+ monthly active users.",
    });
  }

  if (lines.length > 1) {
    const b2 = lines[1].replace(/^[-•*]\s*/, "");
    bulletImprovements.push({
      original: b2,
      improved: `Engineered end-to-end integration for ${b2.slice(0, 45)}..., enhancing data throughput by 28% and ensuring 99.9% uptime across production environments.`,
    });
  } else {
    bulletImprovements.push({
      original: "Responsible for fixing bugs and improving database queries.",
      improved:
        "Optimized 25+ critical PostgreSQL database queries and resolved high-priority bottlenecks, reducing average API response time from 420ms to 110ms (74% improvement).",
    });
  }

  if (lines.length > 2) {
    const b3 = lines[2].replace(/^[-•*]\s*/, "");
    bulletImprovements.push({
      original: b3,
      improved: `Designed and implemented automated testing and CI/CD pipelines for ${b3.slice(0, 40)}..., decreasing deployment rollbacks by 45%.`,
    });
  } else {
    bulletImprovements.push({
      original: "Collaborated with team members to deliver project features on time.",
      improved:
        "Partnered with cross-functional team of 5 engineers in Agile sprints to deliver 4 major product milestones 2 weeks ahead of schedule.",
    });
  }

  const sectionFeedback: SectionFeedbackItem[] = [
    {
      section: "Contact Info",
      status:
        hasEmail && hasPhone && (hasLinkedIn || hasGitHub)
          ? "good"
          : "needs-improvement",
      feedback:
        hasEmail && hasPhone
          ? "Contact information is clear. Ensure LinkedIn and GitHub profiles are formatted as clickable hyperlinks without long query parameters."
          : "Missing direct contact channels. Ensure your email, phone number, location (City, State), and active GitHub/LinkedIn links appear at the top.",
      improved: "Full Name | City, State | email@domain.com | +91 98765 43210 | linkedin.com/in/username | github.com/username",
    },
    {
      section: "Summary/Objective",
      status: hasSummary ? "good" : "needs-improvement",
      feedback: hasSummary
        ? "Professional summary is present. Align it closer to quantified milestones rather than generic claims of being a 'hardworking quick learner'."
        : "Missing a targeted Professional Summary. Add a 2-3 sentence overview specifying your target role, top technical proficiencies, and key project outcomes.",
      improved: `Results-driven ${role} with hands-on experience designing scalable applications, architecting responsive frontend interfaces, and optimizing backend data pipelines. Eager to leverage expertise in ${presentKeywords.slice(0, 3).join(", ") || "modern tech stacks"} to build resilient software products.`,
    },
    {
      section: "Experience",
      status: hasExperience
        ? hasMetrics
          ? "good"
          : "needs-improvement"
        : "needs-improvement",
      feedback: hasMetrics
        ? "Experience bullets utilize numerical impact well. Maintain consistent Google XYZ formulation (Accomplished [X] measured by [Y] by doing [Z])."
        : "Experience entries lack quantifiable impact metrics. Avoid passive duties ('Responsible for...', 'Helped with...'). Quantify results with %, numbers, or time saved.",
      improved: "Led migration of legacy service to containerized microservices architecture using Docker and Node.js, slashing infrastructure server overhead by 25% and scaling to handle 10,000+ daily requests.",
    },
    {
      section: "Skills",
      status: presentKeywords.length >= 5 ? "good" : "needs-improvement",
      feedback:
        missingKeywords.length > 0
          ? `Missing key skills for ${role}: ${missingKeywords.slice(0, 5).join(", ")}. Categorize skills into Languages, Frameworks, Developer Tools, and Databases for easier ATS parsing.`
          : "Good coverage of core technologies. Group them by category (Frontend, Backend, Databases, Cloud/DevOps) rather than an unformatted list.",
      improved: `Languages: JavaScript, TypeScript, Python, SQL\nFrameworks & Libraries: ${presentKeywords.slice(0, 4).join(", ") || "React, Next.js, Node.js, Tailwind CSS"}\nDatabases & Cloud: PostgreSQL, MongoDB, Redis, AWS, Docker\nDeveloper Tools: Git, GitHub Actions, Postman, Jest, Linux`,
    },
    {
      section: "Projects",
      status: hasProjects ? "good" : "needs-improvement",
      feedback: hasProjects
        ? "Projects are prominently featured. Ensure each project lists the exact technical stack, problem solved, live demo URL, and GitHub repository link."
        : "Projects section needs expansion. For students and early career developers, 2-3 deep, end-to-end full stack projects with live demos carry significant weight.",
      improved: "Interactive Cloud Collaboration Platform (Next.js, TypeScript, PostgreSQL, WebSockets, Docker)\n• Architected real-time multi-user document synchronization engine handling up to 50 concurrent editors.\n• Implemented role-based access control (RBAC) and OAuth 2.0 authentication with 99.9% security compliance.",
    },
    {
      section: "Education",
      status: hasEducation ? "good" : "needs-improvement",
      feedback: hasEducation
        ? "Education section is formatted well. Keep degree, university name, location, graduation month/year, and CGPA cleanly aligned on 2-3 lines."
        : "Ensure degree title, college name, graduation year, and CGPA are prominent. Mention relevant coursework like Data Structures, DBMS, and OS.",
      improved: "Bachelor of Technology in Computer Science & Engineering | ABC Institute of Technology\nGraduation: May 2025 | CGPA: 8.7/10.0\nRelevant Coursework: Data Structures & Algorithms, Database Management Systems, Computer Networks, Software Engineering",
    },
  ];

  return {
    atsScore: score,
    missingKeywords: missingKeywords.slice(0, 8),
    presentKeywords: presentKeywords.slice(0, 10),
    keywordDensityAssessment: `Resume matches ${presentKeywords.length} of ${chosenBank.length} standard keywords for ${role}. Incorporating the recommended missing tools into project bullets will elevate your ATS ranking to top percentiles.`,
    sectionFeedback,
    bulletImprovements,
    overallRecommendations: [
      `Integrate missing high-demand keywords (${missingKeywords.slice(0, 4).join(", ")}) into your Skills and Project descriptions.`,
      "Quantify bullet points with tangible metrics: percentage gains, performance speedups, user volumes, or database query optimizations.",
      "Adopt standard ATS typography and single-column layout without tables, graphics, or nested multi-column text boxes.",
      "Ensure GitHub and LinkedIn links are up to date and include verifiable repository links for all listed projects.",
      `Tailor your professional summary to explicitly match the target title: '${role}'.`,
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText, targetRole } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    const cleanedRole =
      typeof targetRole === "string" && targetRole.trim().length > 0
        ? targetRole.trim()
        : "Software Engineer";

    const prompt = `You are a world-class Applicant Tracking System (ATS) algorithm engineer and senior technical recruiter.
Analyze the following candidate resume for the target role: "${cleanedRole}".

Target Role: ${cleanedRole}
Resume Content:
"""
${resumeText.trim()}
"""

Perform a comprehensive, highly realistic ATS audit and content evaluation.
Return a JSON object conforming strictly to this format:
{
  "atsScore": <number between 0 and 100 representing overall ATS compatibility, keyword match rate, and formatting quality>,
  "missingKeywords": [<array of 6 to 10 crucial industry skills, frameworks, tools, or concepts expected for ${cleanedRole} that are MISSING or weak in the resume>],
  "presentKeywords": [<array of 6 to 12 matching skills, frameworks, or technical terms FOUND in the resume relevant to ${cleanedRole}>],
  "keywordDensityAssessment": "<2-3 sentences evaluating the resume's keyword distribution, whether keywords are organically backed by project accomplishments, and how to improve ATS parsing without keyword stuffing>",
  "sectionFeedback": [
    {
      "section": "Contact Info",
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "<actionable advice regarding presence of email, phone, location, LinkedIn, GitHub/Portfolio, and avoidance of ATS-unfriendly icons or graphics>",
      "improved": "<clean 1-line ATS-compliant contact header template>"
    },
    {
      "section": "Summary/Objective",
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "<actionable critique of the summary or objective>",
      "improved": "<compelling 2-3 sentence role-tailored professional summary>"
    },
    {
      "section": "Experience",
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "<actionable feedback regarding action verbs, quantifiable metrics, and STAR/XYZ format>",
      "improved": "<example of a strong, metric-driven experience bullet>"
    },
    {
      "section": "Skills",
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "<critique on grouping, modern industry terminology, and missing essentials for ${cleanedRole}>",
      "improved": "<categorized skills layout: Languages, Frameworks, Cloud/Databases, Tools>"
    },
    {
      "section": "Projects",
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "<critique on architectural depth, technical stack listing, demo links, and business value>",
      "improved": "<improved project entry showcasing tech stack, problem solved, and measurable impact>"
    },
    {
      "section": "Education",
      "status": "good" | "needs-improvement" | "missing",
      "feedback": "<critique on degree title, university, graduation year, CGPA, and relevant coursework formatting>",
      "improved": "<clean ATS-formatted education snippet>"
    }
  ],
  "bulletImprovements": [
    {
      "original": "<a weak, vague, or passive bullet point identified from the candidate's actual resume>",
      "improved": "<high-impact rewrite using Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]' with strong active verbs and metrics>"
    }
  ],
  "overallRecommendations": [
    "<prioritized recommendation 1>",
    "<prioritized recommendation 2>",
    "<prioritized recommendation 3>",
    "<prioritized recommendation 4>",
    "<prioritized recommendation 5>"
  ]
}

Instructions:
- Provide 3 to 5 realistic bulletImprovements derived from or heavily inspired by the candidate's actual resume text.
- Provide all 6 standard sections in sectionFeedback: "Contact Info", "Summary/Objective", "Experience", "Skills", "Projects", "Education".
- Return ONLY valid JSON with no markdown wrapping or preamble.`;

    try {
      const aiResponse = await generateJSON<ResumeImprovementResponse>(prompt);

      // Validate required properties
      if (
        typeof aiResponse?.atsScore === "number" &&
        Array.isArray(aiResponse.missingKeywords) &&
        Array.isArray(aiResponse.presentKeywords) &&
        Array.isArray(aiResponse.sectionFeedback) &&
        Array.isArray(aiResponse.bulletImprovements) &&
        Array.isArray(aiResponse.overallRecommendations)
      ) {
        return NextResponse.json(aiResponse);
      } else {
        console.warn("Gemini response missing expected schema, falling back to heuristic analysis.");
        const fallback = generateFallbackAnalysis(resumeText, cleanedRole);
        return NextResponse.json(fallback);
      }
    } catch (aiError) {
      console.warn("Gemini API call failed, generating heuristic fallback:", aiError);
      const fallback = generateFallbackAnalysis(resumeText, cleanedRole);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("Resume improvement API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while analyzing the resume." },
      { status: 500 }
    );
  }
}
