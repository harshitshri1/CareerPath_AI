import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Dashboard analytics data
export async function GET() {
  try {
    // Get all students with their data
    const students = await prisma.student.findMany({
      include: {
        skills: true,
        certifications: true,
        interviewSessions: true,
      },
    });

    const totalStudents = students.length;

    // Calculate average readiness score
    const studentsWithScores = students.filter((s) => s.readinessScore !== null);
    const avgScore =
      studentsWithScores.length > 0
        ? Math.round(
            studentsWithScores.reduce((sum, s) => sum + (s.readinessScore || 0), 0) /
              studentsWithScores.length
          )
        : 0;

    // Count total skills learned
    const totalSkills = await prisma.skill.count();

    // Count total interview sessions
    const totalInterviews = await prisma.interviewSession.count();

    // Skill distribution
    const skillCounts: Record<string, number> = {};
    students.forEach((s) => {
      s.skills.forEach((skill) => {
        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Department distribution (from degree field)
    const deptCounts: Record<string, { count: number; totalScore: number }> = {};
    students.forEach((s) => {
      const dept = s.degree || "Other";
      if (!deptCounts[dept]) deptCounts[dept] = { count: 0, totalScore: 0 };
      deptCounts[dept].count += 1;
      deptCounts[dept].totalScore += s.readinessScore || 0;
    });

    const departments = Object.entries(deptCounts).map(([name, data]) => ({
      name,
      students: data.count,
      avgScore: data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
    }));

    return NextResponse.json({
      totalStudents,
      avgReadinessScore: avgScore,
      totalSkillsLearned: totalSkills,
      totalInterviews,
      topSkills,
      departments,
      recentStudents: students.slice(-5).map((s) => ({
        name: s.name,
        email: s.email,
        college: s.college,
        score: s.readinessScore,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    // Return demo data as fallback
    return NextResponse.json({
      totalStudents: 0,
      avgReadinessScore: 0,
      totalSkillsLearned: 0,
      totalInterviews: 0,
      topSkills: [],
      departments: [],
      recentStudents: [],
      note: "Using demo data. Database connection may not be configured.",
    });
  }
}
