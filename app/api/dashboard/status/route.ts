import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { SurveyStatus } from "@/app/types/survey";


export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as SurveyStatus;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      prisma.schoolSurvey.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        // skip: (page - 1) * pageSize,
        // take: pageSize,
        select: {
          id: true,
          schoolName: true,
          province: true,
          city: true,
          district: true,
          schoolStartTime: true,
          schoolEndTime: true,
          weeklyStudyHours: true,
          monthlyHolidays: true,
          suicideCases: true,
          studentComments: true,
          grade: true,
          reviewComment: true,
          updatedAt: true,
          status: true,
          approvedBy: true,
          safetyKeyword: true
        },
      }),
      prisma.schoolSurvey.count({ where }),
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}