import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

type TimeRange =
  | '5:00 前'
  | '5:00 - 6:00'
  | '6:00 - 7:00'
  | '7:00 - 8:00'
  | '8:00 - 9:00'
  | '9:00 后'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const all = await prisma.schoolSurvey.findMany({
    select: {
      schoolStartTime: true,
    },
  })

  const ranges: Record<TimeRange, number> = {
    '5:00 前': 0,
    '5:00 - 6:00': 0,
    '6:00 - 7:00': 0,
    '7:00 - 8:00': 0,
    '8:00 - 9:00': 0,
    '9:00 后': 0,
  }

  const parseMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }
  // console.log(all)
  for (const item of all) {
    const timeStr = item.schoolStartTime ?? "00:00";
    const minutes = parseMinutes(timeStr)

    if (minutes < 300) ranges['5:00 前']++
    else if (minutes < 360) ranges['5:00 - 6:00']++
    else if (minutes < 420) ranges['6:00 - 7:00']++
    else if (minutes < 480) ranges['7:00 - 8:00']++
    else if (minutes < 540) ranges['8:00 - 9:00']++
    else ranges['9:00 后']++
  }

  const result = Object.entries(ranges).map(([label, count]) => ({
    label,
    count,
  }))

  res.status(200).json(result)
}
