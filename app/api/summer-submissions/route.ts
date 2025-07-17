import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { SubmissionStatus } from "@/app/types/survey";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as SubmissionStatus;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          province: true,
          city: true,
          district: true,
          schoolName: true,
          grade: true,
          isRemedial: true,
          remedialStartDate: true,
          remedialEndDate: true,
          weeklyClassDays: true,
          monthlyHolidayDays: true,
          consentForm: true,
          feeRequired: true,
          feeAmount: true,
          coolingMeasures: true,
          schoolViolations: true,
          otherViolations: true,
          phq9Data: true,
          safetyWord: true,
          status: true,
          approvedBy: true,
          reviewComment: true,
        },
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("Error fetching summer submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, status, comment } = body;

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status,
        reviewComment: comment,
        approvedBy: session.user.email,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating summer submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
