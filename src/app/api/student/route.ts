import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Save or update student profile to database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      college,
      degree,
      year,
      cgpa,
      targetRole,
      resumeText,
      skills,
      projects,
      certifications,
      experience,
      readinessScore,
    } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Upsert student profile
    const student = await prisma.student.upsert({
      where: { email },
      update: {
        name,
        college,
        degree,
        year,
        cgpa,
        targetRole,
        resumeText,
        readinessScore,
      },
      create: {
        name,
        email,
        college,
        degree,
        year,
        cgpa,
        targetRole,
        resumeText,
        readinessScore,
      },
    });

    // Clear and re-create related data
    await prisma.skill.deleteMany({ where: { studentId: student.id } });
    await prisma.project.deleteMany({ where: { studentId: student.id } });
    await prisma.certification.deleteMany({ where: { studentId: student.id } });
    await prisma.experience.deleteMany({ where: { studentId: student.id } });

    // Create skills
    if (skills && Array.isArray(skills) && skills.length > 0) {
      await prisma.skill.createMany({
        data: skills.map((s: string) => ({
          name: s.trim(),
          studentId: student.id,
        })),
      });
    }

    // Create projects
    if (projects && Array.isArray(projects) && projects.length > 0) {
      await prisma.project.createMany({
        data: projects.map((p: { name: string; description?: string }) => ({
          name: p.name,
          description: p.description || "",
          studentId: student.id,
        })),
      });
    }

    // Create certifications
    if (certifications && Array.isArray(certifications) && certifications.length > 0) {
      await prisma.certification.createMany({
        data: certifications.map((c: string) => ({
          name: c.trim(),
          studentId: student.id,
        })),
      });
    }

    // Create experiences
    if (experience && Array.isArray(experience) && experience.length > 0) {
      await prisma.experience.createMany({
        data: experience.map((e: string) => ({
          title: e.trim(),
          studentId: student.id,
        })),
      });
    }

    // Fetch complete profile with relations
    const fullProfile = await prisma.student.findUnique({
      where: { id: student.id },
      include: {
        skills: true,
        projects: true,
        certifications: true,
        experiences: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile saved to database",
      student: fullProfile,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save profile to database" },
      { status: 500 }
    );
  }
}

// GET - Retrieve student profile from database
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        skills: true,
        projects: true,
        certifications: true,
        experiences: true,
        interviewSessions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile" },
      { status: 500 }
    );
  }
}
