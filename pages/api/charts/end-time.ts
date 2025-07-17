import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type EndTimeRange =
  | "17:00 前"
  | "17:00 - 19:00"
  | "19:00 - 21:00"
  | "21:00 - 22:00"
  | "22:00 - 23:00"
  | "23:00 以后";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const all = await prisma.schoolSurvey.findMany({
    select: {
      schoolEndTime: true,
    },
  });

  const ranges: Record<EndTimeRange, number> = {
    "17:00 前": 0,
    "17:00 - 19:00": 0,
    "19:00 - 21:00": 0,
    "21:00 - 22:00": 0,
    "22:00 - 23:00": 0,
    "23:00 以后": 0,
  };

  const parseMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  for (const item of all) {
    const timeStr = item.schoolEndTime ?? "00:00";
    const minutes = parseMinutes(timeStr);

    if (minutes < 1020) ranges["17:00 前"]++; // < 17:00
    else if (minutes < 1140) ranges["17:00 - 19:00"]++; // 17:00 - 19:00
    else if (minutes < 1260) ranges["19:00 - 21:00"]++; // 19:00 - 21:00
    else if (minutes < 1320) ranges["21:00 - 22:00"]++; // 21:00 - 22:00
    else if (minutes < 1380) ranges["22:00 - 23:00"]++; // 22:00 - 23:00
    else ranges["23:00 以后"]++; // ≥ 23:00
  }

  const result = Object.entries(ranges).map(([label, count]) => ({
    label,
    count,
  }));

  res.status(200).json(result);
}
