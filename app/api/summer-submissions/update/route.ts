import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authConfig";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      province,
      city,
      district,
      schoolName,
      grade,
      isRemedial,
      remedialStartDate,
      remedialEndDate,
      weeklyClassDays,
      monthlyHolidayDays,
      consentForm,
      feeRequired,
      feeAmount,
      coolingMeasures,
      schoolViolations,
      otherViolations,
      safetyWord,
    } = body;

    // 处理日期字段
    const parsedRemedialStartDate = remedialStartDate ? new Date(remedialStartDate) : null;
    const parsedRemedialEndDate = remedialEndDate ? new Date(remedialEndDate) : null;

    // 处理数值字段
    const parsedWeeklyClassDays = weeklyClassDays ? parseFloat(weeklyClassDays) : null;
    const parsedMonthlyHolidayDays = monthlyHolidayDays ? parseInt(monthlyHolidayDays) : null;
    const parsedFeeAmount = feeAmount ? parseFloat(feeAmount) : null;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        province: province || null,
        city: city || null,
        district: district || null,
        schoolName: schoolName || null,
        grade: grade || null,
        isRemedial: isRemedial,
        remedialStartDate: parsedRemedialStartDate,
        remedialEndDate: parsedRemedialEndDate,
        weeklyClassDays: parsedWeeklyClassDays,
        monthlyHolidayDays: parsedMonthlyHolidayDays,
        consentForm: consentForm || null,
        feeRequired: feeRequired,
        feeAmount: parsedFeeAmount,
        coolingMeasures: coolingMeasures || null,
        schoolViolations: schoolViolations || [],
        otherViolations: otherViolations || null,
        safetyWord: safetyWord || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("更新失败:", err);
    return NextResponse.json({ error: "内部错误" }, { status: 500 });
  }
}
