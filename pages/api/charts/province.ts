import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const all = await prisma.schoolSurvey.findMany({
    select: { province: true },
  })

  const provinceCount: Record<string, number> = {}

  for (const item of all) {
    const province = item.province || '未知'
    provinceCount[province] = (provinceCount[province] || 0) + 1
  }

  const result = Object.entries(provinceCount).map(([province, count]) => ({
    province,
    count,
  }))

  res.status(200).json(result)
}