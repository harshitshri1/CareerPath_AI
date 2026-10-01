"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Send,
  ChevronRight,
  RotateCcw,
  MessageSquare,
  Brain,
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  Zap,
  HelpCircle,
  Volume2,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getProfile, saveScore } from "@/lib/store";
import { cn } from "@/lib/utils";

// Web Speech API Types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface QuestionFeedback {
  contentScore: number;
  clarityScore: number;
  confidenceScore: number;
  feedback: string;
  idealAnswer: string;
}

interface InterviewItem {
  questionNumber: number;
  question: string;
  answer: string;
  feedback?: QuestionFeedback;
}

const COMMON_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "Business Analyst",
];

const INTERVIEW_TYPES = [
  {
    id: "Technical",
    title: "Technical",
    icon: Brain,
    description: "Core concepts, architecture, system design, and practical coding logic.",
  },
  {
    id: "Behavioral",
    title: "Behavioral",
    icon: MessageSquare,
    description: "STAR-method scenarios, teamwork, leadership, and conflict resolution.",
  },
  {
    id: "HR",
    title: "HR & Culture",
    icon: Star,
    description: "Company fit, communication, adaptability, and long-term career vision.",
  },
  {
    id: "Mixed",
    title: "Mixed Simulation",
    icon: Sparkles,
    description: "A comprehensive 360° interview covering technical, behavioral, and HR questions.",
  },
];

const DIFFICULTIES = [
  { id: "Easy", label: "Easy", desc: "Foundational & Junior", badge: "badge-green" },
  { id: "Medium", label: "Medium", desc: "Industry Standard & Mid-level", badge: "badge-amber" },
  { id: "Hard", label: "Hard", desc: "Complex Architecture & Senior", badge: "badge-red" },
];

export default function MockInterviewPage() {
  // Setup state
  const [phase, setPhase] = useState<"setup" | "interview" | "summary">("setup");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Medium");
  const [profileRoleLoaded, setProfileRoleLoaded] = useState<string | null>(null);

  // Interview state
  const [questions, setQuestions] = useState<InterviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Summary state
  const [expandedSummaryIndex, setExpandedSummaryIndex] = useState<number | null>(null);

  // Load user profile on mount
  useEffect(() => {
    const profile = getProfile();
    if (profile?.targetRole) {
      setProfileRoleLoaded(profile.targetRole);
      setSelectedRole(profile.targetRole);
    }

    // Check speech recognition support
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const effectiveRole = customRole.trim() || selectedRole;

  // Toggle Voice Recognition
  const toggleSpeech = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser. Please type your answer or use Chrome/Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setCurrentAnswer((prev) => {
          // If previous ended with non-space, add space
          const base = prev.trim();
          return base ? `${base} ${transcript.trim()}` : transcript.trim();
        });
      };

      recognition.onerror = (err) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      setErrorMessage(null);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setErrorMessage("Unable to access microphone. Please ensure microphone permissions are granted.");
    }
  };

  // Start Interview
  const handleStartInterview = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          role: effectiveRole,
          type: interviewType,
          difficulty: difficulty,
          questionNumber: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate initial question.");
      }

      const data = await response.json();
      const firstQuestion = data.question || "Can you introduce yourself and explain what makes you a great candidate for this role?";

      setQuestions([
        {
          questionNumber: 1,
          question: firstQuestion,
          answer: "",
        },
      ]);
      setCurrentIndex(0);
      setCurrentAnswer("");
      setPhase("interview");
    } catch (error) {
      console.error("Error starting interview:", error);
      setErrorMessage("Failed to start the interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer for Evaluation
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setErrorMessage("Please enter an answer before submitting.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const currentItem = questions[currentIndex];

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          role: effectiveRole,
          question: currentItem.question,
          answer: currentAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate answer.");
      }

      const feedback: QuestionFeedback = await response.json();

      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          ...updated[currentIndex],
          answer: currentAnswer,
          feedback,
        };
        return updated;
      });
    } catch (error) {
      console.error("Evaluation error:", error);
      setErrorMessage("Failed to evaluate response. Please try submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move to Next Question or Summary
  const handleNextQuestion = async () => {
    // If not last question (5 questions total)
    if (currentIndex < 4) {
      setIsLoading(true);
      setErrorMessage(null);
      const nextQuestionNum = currentIndex + 2;

      try {
        const response = await fetch("/api/mock-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate",
            role: effectiveRole,
            type: interviewType,
            difficulty: difficulty,
            questionNumber: nextQuestionNum,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate next question.");
        }

        const data = await response.json();
        const nextQuestionText =
          data.question || `Tell me about a complex project or challenge you tackled related to ${effectiveRole}.`;

        setQuestions((prev) => [
          ...prev,
          {
            questionNumber: nextQuestionNum,
            question: nextQuestionText,
            answer: "",
          },
        ]);
        setCurrentIndex((prev) => prev + 1);
        setCurrentAnswer("");
      } catch (error) {
        console.error("Next question error:", error);
        setErrorMessage("Failed to load next question. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Completed all 5 questions
      // Calculate overall score (scale to 100)
      const validFeedbacks = questions.filter((q) => q.feedback);
      if (validFeedbacks.length > 0) {
        const totalPoints = validFeedbacks.reduce((acc, curr) => {
          const f = curr.feedback!;
          const qAvg = (f.contentScore + f.clarityScore + f.confidenceScore) / 3;
          return acc + qAvg;
        }, 0);
        const overallScoreOutOfTen = totalPoints / validFeedbacks.length;
        const overallPercentage = Math.round(overallScoreOutOfTen * 10);
        saveScore(overallPercentage);
      }

      setPhase("summary");
    }
  };

  // Reset/Restart
  const handleRestart = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setCurrentAnswer("");
    setPhase("setup");
    setErrorMessage(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Helper score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 6) return "text-primary-600 bg-primary-50 border-primary-200";
    if (score >= 4) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // Helper score badge
  const getScoreBadgeClass = (score: number) => {
    if (score >= 8) return "badge-green";
    if (score >= 6) return "badge-primary";
    if (score >= 4) return "badge-amber";
    return "badge-red";
  };

  // Calculations for Summary Phase
  const evaluatedQuestions = questions.filter((q) => q.feedback);
  const avgContent = evaluatedQuestions.length
    ? +(evaluatedQuestions.reduce((acc, q) => acc + (q.feedback?.contentScore || 0), 0) / evaluatedQuestions.length).toFixed(1)
    : 0;
  const avgClarity = evaluatedQuestions.length
    ? +(evaluatedQuestions.reduce((acc, q) => acc + (q.feedback?.clarityScore || 0), 0) / evaluatedQuestions.length).toFixed(1)
    : 0;
  const avgConfidence = evaluatedQuestions.length
    ? +(evaluatedQuestions.reduce((acc, q) => acc + (q.feedback?.confidenceScore || 0), 0) / evaluatedQuestions.length).toFixed(1)
    : 0;

  const overallAvg = evaluatedQuestions.length
    ? +((avgContent + avgClarity + avgConfidence) / 3).toFixed(1)
    : 0;
  const overallPercentage = Math.round(overallAvg * 10);

  // Prepare chart data
  const chartData = questions.map((item, idx) => ({
    name: `Q${idx + 1}`,
    Content: item.feedback?.contentScore || 0,
    Clarity: item.feedback?.clarityScore || 0,
    Confidence: item.feedback?.confidenceScore || 0,
  }));

  // Strengths and Improvements dynamically
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (avgContent >= 7.5) {
    strengths.push("Deep technical understanding and relevant domain examples provided across answers.");
  } else {
    improvements.push("Incorporate more domain-specific technical terminology, architectural context, and metrics.");
  }

  if (avgClarity >= 7.5) {
    strengths.push("Well-structured, concise communication adhering to industry standard storytelling frameworks.");
  } else {
    improvements.push("Structure behavioral responses using the STAR method (Situation, Task, Action, Result) for crisper delivery.");
  }

  if (avgConfidence >= 7.5) {
    strengths.push("High conviction, authoritative tone, and thorough completeness in explanations.");
  } else {
    improvements.push("Eliminate tentative phrasing; conclude responses with definitive takeaways and measurable impact.");
  }

  if (strengths.length === 0) {
    strengths.push("Demonstrated enthusiasm, active engagement, and willingness to learn across diverse questions.");
  }
  if (improvements.length === 0) {
    improvements.push("Keep practicing timed scenarios under simulated pressure to maintain peak interview fluency.");
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ============================================================== */}
      {/* 1. SETUP PHASE                                                 */}
      {/* ============================================================== */}
      {phase === "setup" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Career Readiness Engine</span>
            </div>
            <h1 className="section-title text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              AI Mock Interview Simulator
            </h1>
            <p className="section-subtitle mt-3 text-lg text-slate-600">
              Practice real-time role-specific interview questions. Speak or type your answers,
              receive instant multi-dimensional evaluation, and benchmark your readiness.
            </p>
          </div>

          {/* Profile Pre-fill Banner */}
          {profileRoleLoaded && (
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 text-white p-2 rounded-lg">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Target Role Detected from Your Student Profile:{" "}
                    <span className="text-primary-700 font-bold">{profileRoleLoaded}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    We have tailored questions to match your profile preferences.
                  </p>
                </div>
              </div>
              <span className="badge-primary text-xs hidden sm:inline-block">Profile Linked</span>
            </div>
          )}

          {/* Configuration Grid */}
          <div className="max-w-4xl mx-auto card space-y-8 p-6 sm:p-8">
            {/* Step 1: Target Role */}
            <div>
              <label className="label text-base font-bold text-slate-800 flex items-center justify-between">
                <span>1. Select Target Job Role</span>
                <span className="text-xs font-normal text-slate-500">Choose a preset or type custom</span>
              </label>

              {/* Role Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
                {COMMON_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setCustomRole("");
                    }}
                    className={cn(
                      "py-2.5 px-3 rounded-lg text-sm font-medium border text-left transition-all duration-200 flex items-center justify-between",
                      selectedRole === role && !customRole
                        ? "bg-primary-50 border-primary-600 text-primary-700 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <span className="truncate">{role}</span>
                    {selectedRole === role && !customRole && (
                      <Check className="w-4 h-4 text-primary-600 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Role Input */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Or enter custom role (e.g. Cloud Security Architect, Full-Stack Lead)..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Step 2: Interview Type */}
            <div>
              <label className="label text-base font-bold text-slate-800 mb-3">
                2. Select Interview Focus Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTERVIEW_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = interviewType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInterviewType(type.id)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5",
                        isSelected
                          ? "bg-primary-50/70 border-primary-600 ring-2 ring-primary-500/20 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2.5 rounded-lg shrink-0 transition-colors",
                          isSelected ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-semibold text-sm",
                              isSelected ? "text-primary-900" : "text-slate-900"
                            )}
                          >
                            {type.title}
                          </span>
                          {isSelected && (
                            <span className="badge-primary text-[10px] py-0 px-1.5">Selected</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Difficulty */}
            <div>
              <label className="label text-base font-bold text-slate-800 mb-3">
                3. Choose Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={cn(
                      "py-3 px-3 rounded-xl border text-center transition-all duration-200",
                      difficulty === diff.id
                        ? "bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-500/30"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="font-bold text-sm">{diff.label}</div>
                    <div
                      className={cn(
                        "text-[11px] mt-0.5",
                        difficulty === diff.id ? "text-primary-100" : "text-slate-500"
                      )}
                    >
                      {diff.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Summary Preview / Launch */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 5 Questions
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Speech & Text
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant Rubric
                </span>
              </div>

              <button
                type="button"
                onClick={handleStartInterview}
                disabled={isLoading}
                className="btn-primary w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    <span>Preparing Interview...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Start Interview</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. INTERVIEW PHASE                                             */}
      {/* ============================================================== */}
      {phase === "interview" && questions[currentIndex] && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          {/* Top Bar with Progress */}
          <div className="card p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="badge-primary font-semibold text-xs px-2.5 py-1">
                  {effectiveRole}
                </span>
                <span className="badge bg-slate-100 text-slate-700 text-xs px-2.5 py-1">
                  {interviewType}
                </span>
                <span className={cn("text-xs px-2.5 py-1", DIFFICULTIES.find(d => d.id === difficulty)?.badge || "badge-primary")}>
                  {difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 text-sm">
                <span className="font-bold text-primary-700">
                  Question {currentIndex + 1} of 5
                </span>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Question Chat Bubble */}
          <div className="card p-6 bg-gradient-to-br from-white via-white to-primary-50/30 border-primary-100">
            <div className="flex items-start gap-3.5">
              <div className="bg-primary-600 text-white p-2.5 rounded-xl shrink-0 shadow-md shadow-primary-600/20">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">AI Interviewer</span>
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {interviewType} Focus
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-none p-4 sm:p-5 text-slate-800 text-base sm:text-lg font-medium leading-relaxed shadow-sm">
                  {questions[currentIndex].question}
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Answer Box */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="label text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Your Answer</span>
                {questions[currentIndex].feedback && (
                  <span className="badge-green text-xs py-0.5">Submitted</span>
                )}
              </label>

              {/* Voice Input Toggle Button */}
              {!questions[currentIndex].feedback && (
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all",
                    isListening
                      ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30 ring-2 ring-red-400"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                  title={speechSupported ? "Use speech-to-text" : "Speech recognition unavailable"}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-primary-600" />
                      <span>Use Voice</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Listening Indicator Alert */}
            {isListening && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-red-700 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                <span className="font-semibold">Microphone active:</span> Speak clearly into your mic.
                Your speech is transcribing directly below.
              </div>
            )}

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={6}
                value={questions[currentIndex].feedback ? questions[currentIndex].answer : currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={Boolean(questions[currentIndex].feedback) || isSubmitting}
                placeholder="Type your response here, or click 'Use Voice' to answer using your microphone. Tip: Use the STAR framework (Situation, Task, Action, Result) for comprehensive impact..."
                className="input-field text-sm leading-relaxed resize-y min-h-[140px] disabled:bg-slate-50 disabled:text-slate-700"
              />
            </div>

            {/* Word count & Submit / Next button row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                <span>
                  Words:{" "}
                  {currentAnswer.trim()
                    ? currentAnswer.trim().split(/\s+/).length
                    : 0}
                </span>
                <span className="mx-2">•</span>
                <span>
                  Characters: {currentAnswer.length}
                </span>
              </div>

              {!questions[currentIndex].feedback ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !currentAnswer.trim()}
                  className="btn-primary py-2.5 px-6 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      <span>Evaluating Response...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* IMMEDIATE FEEDBACK CARD (Appears after answer submitted)  */}
          {/* ========================================================== */}
          {questions[currentIndex].feedback && (
            <div className="card p-6 bg-gradient-to-br from-white to-slate-50/70 border-slate-300 space-y-6 shadow-md animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      AI Performance Evaluation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluated on accuracy, structure, and professional conviction.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Answer Score:</span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-bold border",
                      getScoreColor(
                        Math.round(
                          ((questions[currentIndex].feedback!.contentScore +
                            questions[currentIndex].feedback!.clarityScore +
                            questions[currentIndex].feedback!.confidenceScore) /
                            3)
                        )
                      )
                    )}
                  >
                    {(
                      (questions[currentIndex].feedback!.contentScore +
                        questions[currentIndex].feedback!.clarityScore +
                        questions[currentIndex].feedback!.confidenceScore) /
                      3
                    ).toFixed(1)}{" "}
                    / 10
                  </span>
                </div>
              </div>

              {/* 3 Metric Score Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Content & Depth</span>
                    <span
                      className={cn(
                        "font-bold",
                        getScoreColor(questions[currentIndex].feedback!.contentScore)
                      )}
                    >
                      {questions[currentIndex].feedback!.contentScore} / 10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${questions[currentIndex].feedback!.contentScore * 10}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Clarity & Structure</span>
                    <span
                      className={cn(
                        "font-bold",
                        getScoreColor(questions[currentIndex].feedback!.clarityScore)
                      )}
                    >
                      {questions[currentIndex].feedback!.clarityScore} / 10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${questions[currentIndex].feedback!.clarityScore * 10}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Tone & Conviction</span>
                    <span
                      className={cn(
                        "font-bold",
                        getScoreColor(questions[currentIndex].feedback!.confidenceScore)
                      )}
                    >
                      {questions[currentIndex].feedback!.confidenceScore} / 10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${questions[currentIndex].feedback!.confidenceScore * 10}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  <span>Constructive Feedback</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {questions[currentIndex].feedback!.feedback}
                </p>
              </div>

              {/* Suggested Ideal Answer */}
              <div className="bg-primary-50/60 border border-primary-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-800 uppercase tracking-wider mb-1.5">
                  <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
                  <span>Suggested Ideal Answer</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed italic">
                  &ldquo;{questions[currentIndex].feedback!.idealAnswer}&rdquo;
                </p>
              </div>

              {/* Next Question Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={isLoading}
                  className="btn-primary py-3 px-8 flex items-center gap-2 text-sm font-bold shadow-md"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      <span>Loading Next Question...</span>
                    </>
                  ) : currentIndex < 4 ? (
                    <>
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Complete & View Summary</span>
                      <Award className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUMMARY PHASE                                               */}
      {/* ============================================================== */}
      {phase === "summary" && (
        <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
          {/* Header Card */}
          <div className="card text-center p-8 bg-gradient-to-b from-white via-white to-primary-50/30 border-primary-100">
            <div className="inline-flex p-3 rounded-2xl bg-primary-100 text-primary-700 mb-4 shadow-sm">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mock Interview Completed!
            </h1>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto text-base">
              You answered 5 interview questions for the role of{" "}
              <span className="font-semibold text-primary-700">{effectiveRole}</span>. Here is your
              performance breakdown.
            </p>

            {/* Score Ring / Metric Banner */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-extrabold text-primary-600">
                  {overallPercentage}%
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  Overall Score
                </div>
                <div className="mt-1">
                  <span className={cn("text-[10px] px-2 py-0.5", getScoreBadgeClass(overallAvg))}>
                    {overallPercentage >= 80
                      ? "Interview Ready"
                      : overallPercentage >= 65
                      ? "Competent"
                      : "Developing"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-extrabold text-slate-800">
                  {avgContent}
                  <span className="text-sm font-normal text-slate-400">/10</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  Content & Depth
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-extrabold text-emerald-600">
                  {avgClarity}
                  <span className="text-sm font-normal text-slate-400">/10</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  Clarity & Structure
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-extrabold text-amber-600">
                  {avgConfidence}
                  <span className="text-sm font-normal text-slate-400">/10</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  Conviction & Tone
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart: Scores per Question */}
          <div className="card p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary-600" />
                  <span>Question-by-Question Score Breakdown</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Comparison of Content, Clarity, and Confidence metrics across all 5 questions.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-primary-600 inline-block" /> Content
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Clarity
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> Confidence
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Content" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Clarity" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Confidence" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="card p-6 bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Key Strengths Identified</span>
              </div>
              <ul className="space-y-3">
                {strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="card p-6 bg-gradient-to-br from-white to-amber-50/30 border-amber-100 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                <Zap className="w-5 h-5 text-amber-600" />
                <span>Areas for Targeted Improvement</span>
              </div>
              <ul className="space-y-3">
                {improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Interview Transcript / Question Review */}
          <div className="card p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              <span>Complete Interview Review (Questions 1 - 5)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click on any question to expand your submitted answer, AI scoring, and recommended model response.
            </p>

            <div className="space-y-3 pt-2">
              {questions.map((item, idx) => {
                const isExpanded = expandedSummaryIndex === idx;
                const qScore = item.feedback
                  ? (
                      (item.feedback.contentScore +
                        item.feedback.clarityScore +
                        item.feedback.confidenceScore) /
                      3
                    ).toFixed(1)
                  : "N/A";

                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedSummaryIndex(isExpanded ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          Q{idx + 1}
                        </span>
                        <span className="font-semibold text-sm text-slate-900 line-clamp-1">
                          {item.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={cn(
                            "text-xs px-2.5 py-0.5 rounded-full font-bold",
                            typeof qScore === "string" && !isNaN(Number(qScore))
                              ? getScoreColor(Number(qScore))
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {qScore} / 10
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && item.feedback && (
                      <div className="p-4 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/50">
                        {/* Candidate Answer */}
                        <div className="mt-3">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                            Your Answer:
                          </span>
                          <p className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                            {item.answer || "No response recorded."}
                          </p>
                        </div>

                        {/* Scores */}
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className="text-primary-700">
                            Content: {item.feedback.contentScore}/10
                          </span>
                          <span className="text-emerald-700">
                            Clarity: {item.feedback.clarityScore}/10
                          </span>
                          <span className="text-amber-700">
                            Confidence: {item.feedback.confidenceScore}/10
                          </span>
                        </div>

                        {/* Feedback */}
                        <div>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                            Interviewer Feedback:
                          </span>
                          <p className="text-sm text-slate-700">
                            {item.feedback.feedback}
                          </p>
                        </div>

                        {/* Ideal Answer */}
                        <div className="bg-primary-50/80 p-3 rounded-lg border border-primary-200">
                          <span className="text-xs font-bold text-primary-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                            Model Answer:
                          </span>
                          <p className="text-sm text-slate-800 italic">
                            &ldquo;{item.feedback.idealAnswer}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="card p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white">
                Ready to bridge identified skill gaps?
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Explore tailored learning roadmaps or practice another interview round.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRestart}
                className="btn-secondary bg-transparent text-white border-slate-600 hover:bg-slate-800 px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Again</span>
              </button>

              <Link
                href="/skill-gap"
                className="btn-primary bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <span>View Skill Gap Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
