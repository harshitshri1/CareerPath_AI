export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: "internship" | "job" | "government" | "scholarship";
  location: string;
  skills: string[];
  description: string;
  salary?: string;
  deadline?: string;
  link: string;
  category?: string;
}

export const opportunities: Opportunity[] = [
  // ─── Internships ───
  {
    id: "int-1",
    title: "Software Engineering Intern",
    organization: "Google India",
    type: "internship",
    location: "Bangalore",
    skills: ["Python", "Data Structures", "Algorithms", "System Design"],
    description:
      "Work on large-scale distributed systems powering Google Search and Cloud products. Mentorship from senior engineers.",
    salary: "₹80,000/month",
    deadline: "2025-01-31",
    link: "#",
  },
  {
    id: "int-2",
    title: "Data Science Intern",
    organization: "Flipkart",
    type: "internship",
    location: "Bangalore",
    skills: ["Python", "Machine Learning", "SQL", "Pandas", "Statistics"],
    description:
      "Build recommendation models and A/B testing frameworks for India's leading e-commerce platform.",
    salary: "₹60,000/month",
    deadline: "2025-02-15",
    link: "#",
  },
  {
    id: "int-3",
    title: "Frontend Developer Intern",
    organization: "Razorpay",
    type: "internship",
    location: "Bangalore (Remote)",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "REST APIs"],
    description:
      "Build merchant-facing dashboard components used by millions of businesses across India.",
    salary: "₹50,000/month",
    deadline: "2025-02-28",
    link: "#",
  },
  {
    id: "int-4",
    title: "Backend Engineering Intern",
    organization: "Zerodha",
    type: "internship",
    location: "Bangalore",
    skills: ["Go", "PostgreSQL", "Redis", "Docker", "REST APIs"],
    description:
      "Work on India's largest stock trading platform serving 10M+ users.",
    salary: "₹55,000/month",
    deadline: "2025-03-15",
    link: "#",
  },
  {
    id: "int-5",
    title: "AI/ML Research Intern",
    organization: "Microsoft Research India",
    type: "internship",
    location: "Bangalore",
    skills: ["Python", "Deep Learning", "NLP", "PyTorch", "Research"],
    description:
      "Conduct cutting-edge research in NLP and multilingual AI models for Indian languages.",
    salary: "₹90,000/month",
    deadline: "2025-01-15",
    link: "#",
  },

  // ─── Jobs ───
  {
    id: "job-1",
    title: "Associate Software Engineer",
    organization: "TCS Digital",
    type: "job",
    location: "Multiple Cities",
    skills: ["Java", "Spring Boot", "SQL", "Agile", "Cloud"],
    description:
      "Join TCS Digital unit working on enterprise transformation projects for global clients.",
    salary: "₹7-9 LPA",
    link: "#",
  },
  {
    id: "job-2",
    title: "Full Stack Developer",
    organization: "Infosys",
    type: "job",
    location: "Pune / Hyderabad",
    skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
    description:
      "Build end-to-end web applications for digital transformation initiatives.",
    salary: "₹6-8 LPA",
    link: "#",
  },
  {
    id: "job-3",
    title: "Data Analyst",
    organization: "Deloitte India",
    type: "job",
    location: "Mumbai / Bangalore",
    skills: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
    description:
      "Analyze business data and create dashboards for consulting clients across industries.",
    salary: "₹8-12 LPA",
    link: "#",
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    organization: "Walmart Global Tech India",
    type: "job",
    location: "Bangalore",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux"],
    description:
      "Build and maintain cloud infrastructure supporting Walmart's global e-commerce platform.",
    salary: "₹12-18 LPA",
    link: "#",
  },
  {
    id: "job-5",
    title: "Product Manager – Fintech",
    organization: "PhonePe",
    type: "job",
    location: "Bangalore",
    skills: ["Product Management", "SQL", "Analytics", "UPI", "Agile"],
    description:
      "Drive product strategy for one of India's fastest-growing fintech platforms.",
    salary: "₹18-25 LPA",
    link: "#",
  },

  // ─── Government Opportunities ───
  {
    id: "gov-1",
    title: "SSC CGL 2025 – Various Posts",
    organization: "Staff Selection Commission",
    type: "government",
    location: "All India",
    skills: ["Quantitative Aptitude", "English", "General Awareness", "Reasoning"],
    description:
      "Combined Graduate Level exam for Group B and C posts across central government ministries. Posts include Tax Assistant, Auditor, Inspector, and more.",
    salary: "₹25,500–₹81,100/month",
    deadline: "2025-03-31",
    link: "#",
    category: "Central Government",
  },
  {
    id: "gov-2",
    title: "IBPS PO 2025 – Probationary Officer",
    organization: "Institute of Banking Personnel Selection",
    type: "government",
    location: "All India",
    skills: ["Quantitative Aptitude", "English", "Reasoning", "Banking Awareness", "Computer Literacy"],
    description:
      "Recruitment for Probationary Officer/Management Trainee posts in 11 public sector banks.",
    salary: "₹36,000–₹63,000/month",
    deadline: "2025-04-15",
    link: "#",
    category: "Banking",
  },
  {
    id: "gov-3",
    title: "UPSC Civil Services 2025",
    organization: "Union Public Service Commission",
    type: "government",
    location: "All India",
    skills: ["General Studies", "Essay", "Ethics", "Current Affairs", "Optional Subject"],
    description:
      "India's premier civil services exam for IAS, IPS, IFS and other All India Services.",
    salary: "₹56,100–₹2,50,000/month",
    deadline: "2025-02-28",
    link: "#",
    category: "Central Government",
  },
  {
    id: "gov-4",
    title: "Indian Railway NTPC 2025",
    organization: "Railway Recruitment Board",
    type: "government",
    location: "All India",
    skills: ["General Awareness", "Mathematics", "Reasoning", "English"],
    description:
      "Non-Technical Popular Categories recruitment for commercial clerk, station master, and other posts.",
    salary: "₹19,900–₹63,200/month",
    deadline: "2025-05-15",
    link: "#",
    category: "Railways",
  },
  {
    id: "gov-5",
    title: "DRDO Scientist 'B' 2025",
    organization: "Defence Research & Development Organisation",
    type: "government",
    location: "Multiple Cities",
    skills: ["Engineering", "Computer Science", "Electronics", "Mechanical", "GATE"],
    description:
      "Entry-level scientist positions in India's premier defence research organization. GATE score required.",
    salary: "₹56,100–₹1,77,500/month",
    deadline: "2025-03-10",
    link: "#",
    category: "Defence",
  },
  {
    id: "gov-6",
    title: "State PSC – Various Posts",
    organization: "State Public Service Commission",
    type: "government",
    location: "State Level",
    skills: ["General Studies", "State GK", "Reasoning", "English/Hindi"],
    description:
      "State-level civil services recruitment for SDM, DSP, BDO and other administrative posts.",
    salary: "₹44,900–₹1,42,400/month",
    deadline: "2025-04-30",
    link: "#",
    category: "State Government",
  },

  // ─── Scholarships & Skilling Schemes ───
  {
    id: "sch-1",
    title: "Prime Minister's Scholarship Scheme (PMSS)",
    organization: "Ministry of Defence, Govt. of India",
    type: "scholarship",
    location: "All India",
    skills: [],
    description:
      "Scholarship for wards of ex-servicemen / ex-Coast Guard personnel pursuing professional degrees. ₹3,000/month for boys, ₹3,600/month for girls.",
    salary: "₹36,000–₹43,200/year",
    deadline: "2025-05-31",
    link: "#",
    category: "Central Scholarship",
  },
  {
    id: "sch-2",
    title: "AICTE Pragati & Saksham Scholarship",
    organization: "All India Council for Technical Education",
    type: "scholarship",
    location: "All India",
    skills: [],
    description:
      "Financial assistance for girl students (Pragati) and differently-abled students (Saksham) in AICTE-approved institutions. Up to ₹50,000/year.",
    salary: "Up to ₹50,000/year",
    deadline: "2025-03-31",
    link: "#",
    category: "Technical Education",
  },
  {
    id: "sch-3",
    title: "Skill India – PMKVY 4.0",
    organization: "Ministry of Skill Development",
    type: "scholarship",
    location: "All India",
    skills: ["Digital Literacy", "Communication", "Industry Skills"],
    description:
      "Free skill development training and certification under Pradhan Mantri Kaushal Vikas Yojana. Covers 300+ job roles across sectors.",
    salary: "Free training + ₹8,000 reward",
    link: "#",
    category: "Skill Development",
  },
  {
    id: "sch-4",
    title: "National Apprenticeship Promotion Scheme",
    organization: "Ministry of Skill Development",
    type: "scholarship",
    location: "All India",
    skills: ["Engineering", "Technology", "Management"],
    description:
      "Stipend support for apprentices engaged with establishments. Government shares 25% of stipend (up to ₹1,500/month).",
    salary: "₹9,000–₹15,000/month stipend",
    link: "#",
    category: "Apprenticeship",
  },
  {
    id: "sch-5",
    title: "Post Matric Scholarship for SC/ST/OBC",
    organization: "Ministry of Social Justice",
    type: "scholarship",
    location: "All India",
    skills: [],
    description:
      "Financial support for students from SC/ST/OBC communities pursuing post-matric education including professional and technical courses.",
    salary: "Full tuition + maintenance allowance",
    deadline: "2025-04-30",
    link: "#",
    category: "Social Welfare",
  },
];
