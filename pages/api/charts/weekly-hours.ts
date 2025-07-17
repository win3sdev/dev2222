import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

type RangeKey =
  | '0-10 小时'
  | '10-20 小时'
  | '20-40 小时'
  | '40-60 小时'
  | '60-100 小时'
  | '100+ 小时'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const all = await prisma.schoolSurvey.findMany({
    select: {
      weeklyStudyHours: true,
    },
  })

  const ranges: Record<RangeKey, number> = {
    '0-10 小时': 0,
    '10-20 小时': 0,
    '20-40 小时': 0,
    '40-60 小时': 0,
    '60-100 小时': 0,
    '100+ 小时': 0,
  }

  for (const item of all) {
    const h = item.weeklyStudyHours ?? 0  // null 变 0
    // const h = item.weeklyStudyHours
    if (h < 10) ranges['0-10 小时']++
    else if (h < 20) ranges['10-20 小时']++
    else if (h < 40) ranges['20-40 小时']++
    else if (h < 60) ranges['40-60 小时']++
    else if (h < 100) ranges['60-100 小时']++
    else ranges['100+ 小时']++
  }

  const result = Object.entries(ranges).map(([label, count]) => ({
    label,
    count,
  }))

  res.status(200).json(result)
}
