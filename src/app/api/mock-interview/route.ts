import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

// Fallback question bank for offline/fallback scenarios
const fallbackQuestions: Record<string, string[]> = {
  "Software Engineer": [
    "Can you explain the difference between synchronous and asynchronous programming, and describe a real-world scenario where non-blocking I/O is critical?",
    "How would you design a scalable caching strategy for a high-traffic web application using Redis or Memcached?",
    "Tell me about a complex bug or race condition you encountered in a recent project. How did you identify the root cause and resolve it?",
    "What are the primary architectural trade-offs between a monolithic system and microservices, and how do you decide when to transition?",
    "Describe a situation where you had a strong technical disagreement with a teammate or lead. How did you communicate your perspective and reach consensus?"
  ],
  "Frontend Developer": [
    "How does the React Virtual DOM diffing algorithm work, and what practical strategies do you use to prevent unnecessary component re-renders?",
    "Explain how you approach responsive design and web accessibility (WCAG / a11y) to ensure seamless experiences across mobile, tablet, and assistive tech.",
    "What state management pattern or library do you prefer for enterprise web applications, and what factors determine whether state should be local or global?",
    "Describe an instance where you identified and resolved significant page-load or runtime performance bottlenecks (e.g. optimizing Core Web Vitals).",
    "How do you collaborate with UI/UX designers and product managers when technical feasibility conflicts with an proposed design specification?"
  ],
  "Data Scientist": [
    "Can you contrast supervised, unsupervised, and reinforcement learning, giving a tangible industry use case where each is best suited?",
    "How do you diagnose and mitigate overfitting and high variance in machine learning models, especially when dealing with severely imbalanced classes?",
    "Walk me through your end-to-end data pipeline workflow: from data ingestion and cleaning, through feature engineering, to model evaluation and production deployment.",
    "Describe a time when an ML model produced unexpected or skewed predictions. How did you validate data drift or bias and rectify the model?",
    "How do you translate complex statistical insights or algorithmic trade-offs into actionable language that executive business stakeholders can understand?"
  ],
  "Product Manager": [
    "How do you systematically prioritize feature backlog items when engineering, marketing, and enterprise customers have competing urgent priorities?",
    "What specific quantitative and qualitative metrics would you define to measure the success of a newly released user onboarding flow?",
    "Tell me about a time a product launch or key feature fell short of user adoption targets. How did you analyze the metrics and pivot your product strategy?",
    "How do you balance direct customer requests against long-term product vision and technical debt during sprint planning?",
    "Describe how you formulate and validate hypotheses through A/B testing or rapid user prototyping before committing development resources."
  ],
  "DevOps Engineer": [
    "Explain the core stages of a secure CI/CD pipeline and how you automate testing, container image scanning, and zero-downtime canary or blue-green deployments.",
    "What are the fundamental architectural differences between Docker containers and virtual machines, and how does Kubernetes handle container orchestration?",
    "How do you structure observability, centralized logging, and alerting using tools like Prometheus, Grafana, or Datadog to ensure 99.99% system availability?",
    "Describe a production outage or critical security vulnerability you managed. What were your immediate triage steps, and what went into your post-mortem?",
    "How do you implement Infrastructure as Code (IaC) with Terraform or Ansible, and what safeguards do you enforce to prevent configuration drift?"
  ],
  "Business Analyst": [
    "How do you elicit, clarify, and document detailed business requirements when key stakeholders possess vague, conflicting, or shifting visions?",
    "What distinguishes functional requirements from non-functional requirements, and what makes a user story with acceptance criteria effective?",
    "Walk me through how you leverage SQL queries, data visualization, and process mapping to discover operational inefficiencies.",
    "Tell me about a project where scope creep threatened the delivery timeline. How did you renegotiate deliverables and manage expectations?",
    "How do you conduct gap analysis to evaluate an organization's current state against future strategic objectives?"
  ],
  default: [
    "Tell me about yourself, your background, and why you are interested in this specific role and domain.",
    "Describe a technically or logically challenging project you worked on recently. What was your personal contribution and the eventual outcome?",
    "Tell me about a time you had to master a new technology, framework, or process under a tight deadline. What was your learning strategy?",
    "How do you handle constructive feedback or critical reviews that necessitate revisiting a design or rewriting substantial portions of your work?",
    "Where do you see your career trajectory over the next 2-3 years, and how does this role serve as a stepping stone toward those ambitions?"
  ]
};

function getFallbackQuestion(role: string, questionNumber: number): string {
  const index = Math.max(0, Math.min(questionNumber - 1, 4));
  const normalizedRole = Object.keys(fallbackQuestions).find(
    (key) => key.toLowerCase() === role.trim().toLowerCase()
  );
  if (normalizedRole && fallbackQuestions[normalizedRole]) {
    return fallbackQuestions[normalizedRole][index];
  }
  return fallbackQuestions.default[index % fallbackQuestions.default.length];
}

function getFallbackEvaluation(question: string, answer: string, role: string) {
  const trimmed = answer.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  if (wordCount < 15) {
    return {
      contentScore: 4,
      clarityScore: 5,
      confidenceScore: 4,
      feedback:
        "Your response was quite brief. While it touches on the topic, top candidates expand on their specific experiences, explain their rationale, and use structured frameworks like the STAR method (Situation, Task, Action, Result) to provide substantive depth.",
      idealAnswer: `For the role of ${role}, a compelling response would clearly articulate your hands-on experience, concrete methodologies used, and the measurable business or technical outcomes achieved.`
    };
  }

  if (wordCount < 40) {
    return {
      contentScore: 7,
      clarityScore: 7,
      confidenceScore: 6,
      feedback:
        "Good foundational answer! You communicated your points clearly and addressed the prompt directly. To take this to the next level, incorporate specific industry tools, metric-driven outcomes, or lessons learned from real projects.",
      idealAnswer: `An exemplary answer directly addresses the core challenge of the question, cites specific frameworks or tools relevant to ${role}, and explains the trade-offs considered during execution.`
    };
  }

  return {
    contentScore: 9,
    clarityScore: 8,
    confidenceScore: 9,
    feedback:
      "Impressive, well-rounded response! You provided thorough context, articulated your thought process logically, and demonstrated strong domain competence. Ensure you maintain conciseness so key achievements stand out immediately.",
    idealAnswer: `A stellar answer begins with a concise thesis, highlights structured execution steps, references quantitative impacts (e.g. % performance gain, efficiency improvement), and concludes with key takeaways.`
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "generate") {
      const {
        role = "Software Engineer",
        type = "Technical",
        difficulty = "Medium",
        questionNumber = 1
      } = body;

      const prompt = `You are a seasoned hiring manager and expert interviewer conducting a job interview for the role of "${role}".
Generate realistic, high-impact interview question #${questionNumber} of 5.

Interview Details:
- Target Role: ${role}
- Interview Focus Type: ${type} (Options: Technical, Behavioral, HR, Mixed)
- Difficulty Level: ${difficulty} (Options: Easy, Medium, Hard)
- Question Index: ${questionNumber} out of 5

Guidelines:
- If Type is "Technical": Ask a deep, practical question regarding system design, architecture, key concepts, coding patterns, or tools for this role.
- If Type is "Behavioral": Ask a behavioral question that invites a STAR method answer (Situation, Task, Action, Result) regarding conflict, pressure, collaboration, or ownership.
- If Type is "HR": Focus on career vision, workplace culture, communication, adaptability, or work ethics.
- If Type is "Mixed":
  * Question 1: Foundational technical background & core knowledge
  * Question 2: In-depth technical problem solving or scenario
  * Question 3: Behavioral scenario (teamwork, conflict, or high-pressure deadline)
  * Question 4: Technical architecture, trade-offs, or best practices
  * Question 5: HR/Cultural fit, leadership, and long-term career ambition

Guidelines for Difficulty:
- Easy: Clear, foundational questions suitable for entry-level candidates.
- Medium: Practical, scenario-based questions with trade-offs standard for mid-level industry roles.
- Hard: Complex architectural, high-stakes ambiguity, or deep edge-case questions for senior candidates.

Return ONLY a valid JSON object matching this schema:
{
  "question": "The interview question text"
}`;

      try {
        const result = await generateJSON<{ question: string }>(prompt);
        if (result && typeof result.question === "string" && result.question.trim().length > 0) {
          return NextResponse.json({ question: result.question.trim() });
        }
      } catch (err) {
        console.warn("Gemini question generation error, using curated fallback:", err);
      }

      // Fallback
      return NextResponse.json({
        question: getFallbackQuestion(role, questionNumber)
      });
    }

    if (action === "evaluate") {
      const {
        question = "",
        answer = "",
        role = "Software Engineer"
      } = body;

      if (!answer || answer.trim().length === 0) {
        return NextResponse.json(
          {
            contentScore: 0,
            clarityScore: 0,
            confidenceScore: 0,
            feedback: "No response was provided. Please provide an answer to receive meaningful feedback.",
            idealAnswer: `For this question, an effective candidate for ${role} would address the core problem directly, illustrate their approach with practical examples, and quantify results.`
          },
          { status: 200 }
        );
      }

      const prompt = `You are a senior tech hiring director and professional career coach evaluating a candidate's answer for the role of "${role}".

Interview Question Asked:
"${question}"

Candidate's Answer:
"${answer}"

Evaluate the answer objectively and constructively:
1. contentScore: integer (0 to 10) evaluating technical accuracy, depth, domain knowledge, and relevance to the role of ${role}.
2. clarityScore: integer (0 to 10) evaluating articulation, structure, conciseness, and organization.
3. confidenceScore: integer (0 to 10) evaluating conviction, professional presence, assertiveness, and completeness.
4. feedback: 2 to 4 sentences providing specific positive reinforcement on strengths and clear actionable recommendations for improvement.
5. idealAnswer: 2 to 4 sentences illustrating an exemplary, high-scoring model answer that a top-tier candidate would provide for this question.

Return ONLY a valid JSON object matching this schema:
{
  "contentScore": 8,
  "clarityScore": 8,
  "confidenceScore": 7,
  "feedback": "Constructive evaluation...",
  "idealAnswer": "Exemplary answer..."
}`;

      try {
        const result = await generateJSON<{
          contentScore: number;
          clarityScore: number;
          confidenceScore: number;
          feedback: string;
          idealAnswer: string;
        }>(prompt);

        if (
          result &&
          typeof result.contentScore === "number" &&
          typeof result.clarityScore === "number" &&
          typeof result.confidenceScore === "number" &&
          result.feedback
        ) {
          // Clamp scores between 0 and 10
          return NextResponse.json({
            contentScore: Math.min(10, Math.max(0, Math.round(result.contentScore))),
            clarityScore: Math.min(10, Math.max(0, Math.round(result.clarityScore))),
            confidenceScore: Math.min(10, Math.max(0, Math.round(result.confidenceScore))),
            feedback: result.feedback,
            idealAnswer: result.idealAnswer || "A well-structured answer explaining the problem, method, and outcome."
          });
        }
      } catch (err) {
        console.warn("Gemini evaluation error, using fallback evaluation:", err);
      }

      // Fallback evaluation
      return NextResponse.json(getFallbackEvaluation(question, answer, role));
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: 'generate', 'evaluate'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Mock Interview API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
