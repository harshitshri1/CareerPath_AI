import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import { StudentProfile } from "@/lib/store";

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

// Fallback recommendations generator in case Gemini API key is missing or quota is exceeded
function getFallbackRecommendations(profile?: StudentProfile): CareerRecommendation[] {
  const userSkills = profile?.skills || [];
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());

  const hasAI = normalizedUserSkills.some((s) =>
    ["python", "machine learning", "ai", "deep learning", "data science", "pytorch", "tensorflow", "nlp"].some((k) =>
      s.includes(k)
    )
  );
  const hasCloud = normalizedUserSkills.some((s) =>
    ["docker", "kubernetes", "aws", "azure", "cloud", "devops", "linux", "ci/cd"].some((k) =>
      s.includes(k)
    )
  );

  const calculateMatch = (roleSkills: string[], baseMatch = 75): number => {
    if (userSkills.length === 0) return baseMatch;
    let matches = 0;
    for (const rSkill of roleSkills) {
      if (normalizedUserSkills.some((u) => u.includes(rSkill.toLowerCase()) || rSkill.toLowerCase().includes(u))) {
        matches++;
      }
    }
    const bonus = Math.round((matches / roleSkills.length) * 20);
    return Math.min(96, Math.max(58, baseMatch + bonus));
  };

  const pool: CareerRecommendation[] = [
    {
      role: "Full Stack Developer",
      matchPercentage: calculateMatch(["React", "Node.js", "TypeScript", "SQL", "Tailwind CSS", "Git"], 76),
      description:
        "Build end-to-end web applications bridging modern responsive user interfaces with scalable server architectures, REST/GraphQL APIs, and database engines. Highly sought after across Indian startups, MNCs, and product enterprises.",
      requiredSkills: ["React / Next.js", "Node.js / Express", "TypeScript", "PostgreSQL / MongoDB", "REST APIs & GraphQL", "Git & CI/CD", "Docker"],
      salaryRange: "₹7 - ₹16 LPA",
      growthOutlook: "High (24% YoY)",
      roadmap: [
        {
          month: "Month 1",
          task: "Core Foundations & TypeScript Mastery: Deep dive into modern ES6+, TypeScript type system, and modular architecture.",
          resources: ["TypeScript Official Documentation", "ExecuteProgram TypeScript Course", "freeCodeCamp Advanced JS"],
        },
        {
          month: "Month 2",
          task: "Advanced Frontend with Next.js 14: Server Components, App Router, Client caching, and Tailwind CSS component systems.",
          resources: ["Next.js Official Learn Track", "React.dev documentation", "Tailwind CSS UI patterns"],
        },
        {
          month: "Month 3",
          task: "Backend Architecture & Databases: Design relational schemas with PostgreSQL/Prisma, auth using JWT/OAuth, and rate limiting.",
          resources: ["Prisma Dataguide", "Node.js Design Patterns", "PostgreSQL Tutorial"],
        },
        {
          month: "Month 4",
          task: "Full Stack Capstone Project: Develop and deploy an end-to-end SaaS application with Stripe billing and real-time websockets.",
          resources: ["Fullstack Open (University of Helsinki)", "Vercel & Railway Deployment Guides"],
        },
        {
          month: "Month 5",
          task: "DevOps & System Performance: Dockerize services, configure GitHub Actions CI/CD pipelines, and optimize bundle sizes.",
          resources: ["Docker for Developers on Coursera", "GitHub Actions Documentation"],
        },
        {
          month: "Month 6",
          task: "System Design & Interview Readiness: Study low-level and high-level system design patterns, mock technical rounds.",
          resources: ["NeetCode 150 System Design", "ByteByteGo Systems Primer"],
        },
      ],
      courses: [
        "Full Stack Web Development with React Specialization (Coursera)",
        "Namaste React & Namaste Node.js by Akshay Saini",
        "The Complete 2024 Web Development Bootcamp (Udemy)",
      ],
      certifications: [
        "Meta Front-End & Back-End Developer Professional Certificate",
        "AWS Certified Developer - Associate",
      ],
    },
    {
      role: "AI & Machine Learning Engineer",
      matchPercentage: calculateMatch(["Python", "Machine Learning", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"], hasAI ? 84 : 64),
      description:
        "Design, train, and deploy predictive models and Generative AI applications to solve complex business problems. Leverage LLMs, transformer models, and real-time inference pipelines in high-growth AI sectors.",
      requiredSkills: ["Python", "PyTorch / TensorFlow", "Scikit-Learn", "Prompt Engineering & RAG", "Data Modeling & Pandas", "FastAPI", "Vector DBs (Pinecone/Milvus)"],
      salaryRange: "₹9 - ₹20 LPA",
      growthOutlook: "Very High (35% YoY)",
      roadmap: [
        {
          month: "Month 1",
          task: "Mathematics & Scientific Python: Linear algebra, calculus, probability, NumPy, and Pandas data wrangling pipelines.",
          resources: ["3Blue1Brown Essence of Linear Algebra", "Python for Data Analysis by Wes McKinney"],
        },
        {
          month: "Month 2",
          task: "Classical Machine Learning Algorithms: Supervised/unsupervised algorithms, cross-validation, and Scikit-Learn workflows.",
          resources: ["Andrew Ng Machine Learning Specialization (Coursera)", "Hands-On Machine Learning with Scikit-Learn"],
        },
        {
          month: "Month 3",
          task: "Deep Learning & Neural Networks: CNNs, RNNs, Transformers, and PyTorch tensor computing.",
          resources: ["DeepLearning.AI Deep Learning Specialization", "Fast.ai Practical Deep Learning for Coders"],
        },
        {
          month: "Month 4",
          task: "Generative AI & LLM Systems: LangChain, LlamaIndex, Retrieval-Augmented Generation (RAG), and embedding pipelines.",
          resources: ["DeepLearning.AI Generative AI with LLMs", "Hugging Face NLP Course"],
        },
        {
          month: "Month 5",
          task: "Model Deployment & MLOps: Containerize models with FastAPI and Docker, track experiments using MLflow.",
          resources: ["Made With ML (Goku Mohandas)", "FastAPI Official Documentation"],
        },
        {
          month: "Month 6",
          task: "Portfolio Projects & Kaggle Competitions: Build a custom domain LLM agent, participate in Kaggle community challenges.",
          resources: ["Kaggle Competitions Hub", "Papers with Code Trending SOTA"],
        },
      ],
      courses: [
        "DeepLearning.AI Machine Learning Specialization",
        "Hugging Face NLP Course & GenAI Fundamentals",
        "CS229: Machine Learning by Stanford Online",
      ],
      certifications: [
        "TensorFlow Developer Certificate (Google)",
        "AWS Certified Machine Learning - Specialty",
      ],
    },
    {
      role: "Cloud & DevOps Engineer",
      matchPercentage: calculateMatch(["Linux", "Docker", "AWS", "Kubernetes", "CI/CD", "Terraform", "Python"], hasCloud ? 82 : 62),
      description:
        "Architect reliable cloud infrastructure, automate deployment lifecycles, and optimize cloud computing expenditures. Champion infrastructure-as-code and zero-downtime microservice orchestration.",
      requiredSkills: ["AWS / Azure", "Docker & Kubernetes", "Terraform (IaC)", "Linux Shell Scripting", "GitHub Actions / Jenkins", "Prometheus & Grafana", "Networking & Security"],
      salaryRange: "₹8 - ₹18 LPA",
      growthOutlook: "High (28% YoY)",
      roadmap: [
        {
          month: "Month 1",
          task: "Linux Administration & Bash Scripting: Deep mastery of Linux internals, file systems, permissions, and network sockets.",
          resources: ["Linux Journey", "OverTheWire Bandit Wargames", "The Linux Command Line Book"],
        },
        {
          month: "Month 2",
          task: "Cloud Infrastructure (AWS Fundamentals): EC2, S3, VPC networking, IAM security policies, and serverless lambdas.",
          resources: ["AWS Skill Builder", "Stephane Maarek AWS Solutions Architect Course"],
        },
        {
          month: "Month 3",
          task: "Containerization & Orchestration: Multi-stage Docker builds, Docker Compose, and Kubernetes cluster fundamentals.",
          resources: ["Docker Official Docs & Tutorials", "Mumshad Mannambeth CKA Course (KodeKloud)"],
        },
        {
          month: "Month 4",
          task: "Infrastructure as Code (IaC): Provision reproducible infrastructure using HashiCorp Terraform and Ansible.",
          resources: ["HashiCorp Learn Terraform", "Automating AWS with Terraform Guides"],
        },
        {
          month: "Month 5",
          task: "Continuous Integration & Deployment (CI/CD): Design automated pipeline triggers, security scanning, and deployment stages.",
          resources: ["GitHub Actions Documentation", "GitLab CI/CD Fundamentals"],
        },
        {
          month: "Month 6",
          task: "Observability & SRE Practice: Configure metrics with Prometheus, dashboards with Grafana, and write post-mortem SOPs.",
          resources: ["Google Site Reliability Engineering (SRE) Book", "Grafana Tutorials"],
        },
      ],
      courses: [
        "DevOps on AWS Specialization (Coursera)",
        "Certified Kubernetes Administrator (CKA) by KodeKloud",
        "HashiCorp Certified: Terraform Associate Bootcamp",
      ],
      certifications: [
        "AWS Certified Solutions Architect - Associate",
        "Certified Kubernetes Administrator (CKA)",
      ],
    },
    {
      role: "Data Engineer",
      matchPercentage: calculateMatch(["SQL", "Python", "ETL", "Spark", "Database", "Data Warehousing"], 70),
      description:
        "Engineer scalable big data ingestion pipelines, maintain robust data warehouses, and ensure high availability of business intelligence streams. Essential for transforming raw data into reliable analytics.",
      requiredSkills: ["Advanced SQL", "Python", "Apache Spark", "Airflow / dbt", "Snowflake / BigQuery", "Kafka Streaming", "Data Modeling"],
      salaryRange: "₹7.5 - ₹17 LPA",
      growthOutlook: "High (26% YoY)",
      roadmap: [
        {
          month: "Month 1",
          task: "Advanced Database Modeling & SQL: Window functions, CTEs, indexing strategies, and query plan optimization.",
          resources: ["Mode Analytics SQL Tutorial", "Use The Index, Luke! Guide"],
        },
        {
          month: "Month 2",
          task: "Python for Data Engineering: Object-oriented programming, data structures, and pipeline automation scripts.",
          resources: ["Real Python Data Engineering Path", "Data Engineering Cookbook by Andreas Kretz"],
        },
        {
          month: "Month 3",
          task: "Distributed Computing with Apache Spark: PySpark DataFrames, partitions, RDDs, and lazy evaluations.",
          resources: ["Databricks PySpark Learning Track", "Spark: The Definitive Guide"],
        },
        {
          month: "Month 4",
          task: "Data Warehousing & Transformations: Modern data stack with Snowflake/BigQuery and data build tool (dbt).",
          resources: ["dbt Fundamentals Free Certification", "Snowflake Hands-On Essentials"],
        },
        {
          month: "Month 5",
          task: "Workflow Orchestration with Apache Airflow: Schedule DAGs, handle backfills, and manage task dependencies.",
          resources: ["Astronomer Apache Airflow Certification Prep", "Official Airflow Documentation"],
        },
        {
          month: "Month 6",
          task: "Real-Time Streaming & End-to-End Pipeline: Implement Apache Kafka event ingestion into cloud data lake.",
          resources: ["Confluent Kafka Developer Tutorials", "Seattle Data Guy YouTube Channel"],
        },
      ],
      courses: [
        "IBM Data Engineering Professional Certificate (Coursera)",
        "Data Engineering Zoomcamp by DataTalksClub",
        "The Complete Hands-On Big Data and Spark (Udemy)",
      ],
      certifications: [
        "Google Cloud Certified Professional Data Engineer",
        "Databricks Certified Associate Developer for Apache Spark",
      ],
    },
    {
      role: "Cybersecurity Analyst",
      matchPercentage: calculateMatch(["Networking", "Linux", "Security", "Python", "Cryptography", "Ethical Hacking"], 60),
      description:
        "Safeguard enterprise networks, cloud assets, and software endpoints from modern cyber threats and intrusions. Conduct vulnerability assessments, threat intelligence analysis, and security incident response.",
      requiredSkills: ["Network Protocols (TCP/IP, DNS)", "SIEM Tools (Splunk/Sentinel)", "Vulnerability Scanning", "Penetration Testing Basics", "Linux & Shell", "Incident Response", "Identity & Access Management"],
      salaryRange: "₹6.5 - ₹15 LPA",
      growthOutlook: "High (31% YoY)",
      roadmap: [
        {
          month: "Month 1",
          task: "Networking & Protocol Foundations: Packet inspection with Wireshark, TCP/UDP handshakes, and firewall rules.",
          resources: ["Professor Messer Network+ Free Course", "Wireshark University Tutorials"],
        },
        {
          month: "Month 2",
          task: "Security Fundamentals & Threat Landscapes: CIA triad, OWASP Top 10 vulnerabilities, and malware taxonomies.",
          resources: ["TryHackMe Pre-Security & Complete Beginner Paths", "OWASP Foundation Guides"],
        },
        {
          month: "Month 3",
          task: "Security Operations & SIEM: Log analysis, incident triage, and monitoring with Splunk and ELK Stack.",
          resources: ["Splunk Free Fundamentals Training", "LetsDefend Blue Team Training Platform"],
        },
        {
          month: "Month 4",
          task: "Defensive Security & Threat Hunting: MITRE ATT&CK framework mapping, endpoint detection and response (EDR).",
          resources: ["MITRE ATT&CK Training Materials", "CyberDefenders Blue Team Labs"],
        },
        {
          month: "Month 5",
          task: "Cloud & Application Security: Auditing AWS IAM security postures, static application security testing (SAST).",
          resources: ["Cloud Security Alliance (CSA) Guides", "PortSwigger Web Security Academy"],
        },
        {
          month: "Month 6",
          task: "Certification Prep & Blue Team Labs: Complete hands-on simulation rooms and practice forensic reporting.",
          resources: ["TryHackMe SOC Level 1 Path", "Hack The Box Academy Defense Labs"],
        },
      ],
      courses: [
        "Google Cybersecurity Professional Certificate (Coursera)",
        "CompTIA Security+ Exam Prep by Jason Dion (Udemy)",
        "Practical Ethical Hacking by TCM Security",
      ],
      certifications: [
        "CompTIA Security+ (SY0-701)",
        "Certified Information Systems Security Professional Associate (ISC2)",
      ],
    },
  ];

  // Sort by matchPercentage descending
  return pool.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function POST(request: Request) {
  try {
    const profile: StudentProfile = await request.json();

    const studentSkillsText =
      Array.isArray(profile.skills) && profile.skills.length > 0
        ? profile.skills.join(", ")
        : "General Computer Science, Programming, Problem Solving";

    const projectsText =
      Array.isArray(profile.projects) && profile.projects.length > 0
        ? profile.projects.map((p) => `${p.name}: ${p.description}`).join(" | ")
        : "Academic and personal development projects";

    const prompt = `
You are an elite career counselor and senior engineering hiring manager specializing in the Indian technology ecosystem, global tech opportunities, and national initiatives (Skill India, NEP 2020).
Analyze the following student profile and recommend exactly 5 distinct, high-impact career paths tailored to their background, strengths, and market demand.

Student Profile:
- Name: ${profile.name || "Student"}
- College: ${profile.college || "Engineering College"}
- Degree: ${profile.degree || "B.Tech / Bachelor's in Computer Science"}
- Year of Study: ${profile.year || "3rd Year"}
- CGPA: ${profile.cgpa || "8.0"}
- Technical & Soft Skills: ${studentSkillsText}
- Completed Projects: ${projectsText}
- Certifications: ${profile.certifications?.join(", ") || "None"}
- Target Role Preference (if any): ${profile.targetRole || "Open to recommendations"}
- Practical Experience: ${profile.experience?.join(", ") || "None specified"}

INSTRUCTIONS:
Generate a JSON array of exactly 5 career path recommendations.
Each item in the array MUST be an object with the following properties:
1. "role": string - Job title (e.g., "Full Stack Developer", "Data Scientist", "DevOps & Cloud Engineer", "AI/ML Engineer", "Mobile App Developer", "Cybersecurity Analyst", "Site Reliability Engineer", etc.)
2. "matchPercentage": number - Integer between 55 and 96 representing how well their current profile matches this role based on skill overlap.
3. "description": string - 2 to 3 sentences explaining the role, industry importance, and why this student is well-positioned for it.
4. "requiredSkills": array of 6 to 8 strings - Core skills needed in the industry for this role (e.g., ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL", "System Design"]).
5. "salaryRange": string - Realistic fresher-to-early career salary range in India (e.g., "₹8 - ₹16 LPA" or "₹10 - ₹20 LPA").
6. "growthOutlook": string - Market growth sentiment (e.g., "High (25% YoY)", "Very High (35% YoY)", "Strong Demand").
7. "roadmap": array of exactly 6 objects detailing a 6-month progressive learning and project roadmap:
   - "month": string (e.g., "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6")
   - "task": string (A concrete, actionable learning goal or project milestone for that month)
   - "resources": array of 2 to 3 strings (Specific reputable learning platforms, official documentation, or books, e.g., ["Official Docs", "Coursera Course", "GitHub Repo"])
8. "courses": array of 2 to 3 strings - Top industry courses (e.g., ["Meta Frontend Professional Certificate", "Namaste React"])
9. "certifications": array of 2 to 3 strings - Coveted industry certifications (e.g., ["AWS Certified Developer Associate", "Docker Certified Associate"])

Sort the recommendations in descending order of match percentage.
Respond ONLY with the JSON array.
`;

    try {
      const aiResult = await generateJSON<CareerRecommendation[] | { recommendations?: CareerRecommendation[]; careerPaths?: CareerRecommendation[] }>(prompt);

      let recommendations: CareerRecommendation[] = [];
      if (Array.isArray(aiResult)) {
        recommendations = aiResult;
      } else if (aiResult && typeof aiResult === "object") {
        const candidate =
          aiResult.recommendations ||
          aiResult.careerPaths ||
          Object.values(aiResult).find(Array.isArray);
        if (candidate && Array.isArray(candidate)) {
          recommendations = candidate as CareerRecommendation[];
        }
      }

      if (recommendations && recommendations.length >= 3) {
        // Ensure each item has all required fields with fallback defaults
        const sanitized = recommendations.map((item, idx) => ({
          role: item.role || `Specialist Role ${idx + 1}`,
          matchPercentage: typeof item.matchPercentage === "number" ? Math.min(100, Math.max(40, Math.round(item.matchPercentage))) : 75,
          description: item.description || "Exciting high-growth engineering role suited for your technical trajectory.",
          requiredSkills: Array.isArray(item.requiredSkills) && item.requiredSkills.length > 0 ? item.requiredSkills : ["Problem Solving", "System Architecture", "Git", "Clean Code"],
          salaryRange: item.salaryRange || "₹8 - ₹16 LPA",
          growthOutlook: item.growthOutlook || "High (20%+ YoY)",
          roadmap: Array.isArray(item.roadmap) && item.roadmap.length > 0 ? item.roadmap : [
            { month: "Month 1", task: "Foundations & Core Frameworks", resources: ["Official Documentation", "freeCodeCamp"] },
            { month: "Month 2", task: "Applied Architecture & State Management", resources: ["Coursera Track", "System Design Primer"] },
            { month: "Month 3", task: "Database Design & API Integration", resources: ["Prisma Guides", "PostgreSQL Docs"] },
            { month: "Month 4", task: "Building Production Capstone Application", resources: ["GitHub Open Source", "Vercel Guides"] },
            { month: "Month 5", task: "DevOps, Containerization & CI/CD", resources: ["Docker Tutorials", "GitHub Actions"] },
            { month: "Month 6", task: "Technical Interview Prep & System Design", resources: ["NeetCode", "LeetCode"] },
          ],
          courses: Array.isArray(item.courses) ? item.courses : ["Comprehensive Professional Certificate", "Advanced Specialization Track"],
          certifications: Array.isArray(item.certifications) ? item.certifications : ["Cloud Associate Certification", "Domain Specialist Credential"],
        }));

        return NextResponse.json(sanitized);
      }
    } catch (aiError) {
      console.warn("Gemini generation failed or API key not available, using dynamic fallback:", aiError);
    }

    // Dynamic fallback when AI call fails or is unavailable
    const fallbackData = getFallbackRecommendations(profile);
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error("Error in career-recommend route:", error);
    // Return graceful fallback even on request parsing errors
    const fallbackData = getFallbackRecommendations();
    return NextResponse.json(fallbackData);
  }
}
