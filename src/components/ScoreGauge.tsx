"use client";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreGauge({
  score,
  size = 200,
  label = "Career Readiness",
}: ScoreGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#6366f1";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Developing";
    return "Needs Work";
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          className="score-circle"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span
          className="text-5xl font-bold"
          style={{ color: getColor(score) }}
        >
          {score}
        </span>
        <span className="text-sm text-slate-500 font-medium mt-1">
          {getLabel(score)}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-3">{label}</p>
    </div>
  );
}
