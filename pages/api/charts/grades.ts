import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const data = await prisma.schoolSurvey.groupBy({
    by: ["grade"],
    _count: {
      grade: true,
    },
  });

  const result = data.map((item) => ({
    grade: item.grade,
    count: item._count.grade,
  }));

  res.status(200).json(result);
}
