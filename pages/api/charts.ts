import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 获取所有数据
    const data = await prisma.schoolSurvey.findMany();

    // 处理年级占比数据
    const gradeData = data.reduce((acc, curr) => {
      const gradeKey = curr.grade ?? "未知"; // 如果为 null 或 undefined，用“未知”代替
      acc[gradeKey] = (acc[gradeKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 处理每月假期天数数据
    const holidaysData = data.reduce((acc, curr) => {
      const days = curr.monthlyHolidays?.toString() ?? "未知";
      acc[days] = (acc[days] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 处理上学时间数据
    const startTimeData = data.reduce((acc, curr) => {
      const start = curr.schoolStartTime ?? "未知";
      acc[start] = (acc[start] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 处理放学时间数据
    const endTimeData = data.reduce((acc, curr) => {
      const end = curr.schoolEndTime ?? "未知";
      acc[end] = (acc[end] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return res.status(200).json({
      gradeData: {
        labels: Object.keys(gradeData),
        data: Object.values(gradeData),
      },
      holidaysData: {
        labels: Object.keys(holidaysData),
        data: Object.values(holidaysData),
      },
      startTimeData: {
        labels: Object.keys(startTimeData),
        data: Object.values(startTimeData),
      },
      endTimeData: {
        labels: Object.keys(endTimeData),
        data: Object.values(endTimeData),
      },
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return res.status(500).json({ error: "Failed to fetch chart data" });
  }
}
