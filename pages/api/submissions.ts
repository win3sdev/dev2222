import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const parseAndValidateDate = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;

  const dateObj = new Date(dateString);
  const isValid =
    !isNaN(dateObj.getTime()) &&
    dateObj.getFullYear() >= 1900 &&
    dateObj.getFullYear() <= 2100;

  if (!isValid) {
    console.warn(
      `[API - Date Validation] Invalid or out-of-range date received: ${dateString}`
    );
    return null;
  }
  return dateObj;
};

const parseNumber = (
  value: string | string[] | undefined
): number | undefined => {
  if (typeof value === "string" && !isNaN(parseFloat(value))) {
    return parseFloat(value);
  }
  return undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
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
        weeklyTotalHours,
        consentForm,
        feeRequired,
        feeAmount,
        coolingMeasures,
        schoolViolations,
        otherViolations,
        phq9,
        safetyWord,
      } = req.body;

      const isRemedialBoolean = isRemedial === "是";
      const feeRequiredBoolean = feeRequired === "是";

      const userIp =
        req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"]?.toString() || null;

      const parsedRemedialStartDate = parseAndValidateDate(remedialStartDate);
      const parsedRemedialEndDate = parseAndValidateDate(remedialEndDate);

      // 结束日期不能早于开始日期
      if (
        parsedRemedialStartDate &&
        parsedRemedialEndDate &&
        parsedRemedialEndDate < parsedRemedialStartDate
      ) {
        return res.status(400).json({
          message: "结束日期不能早于开始日期",
        });
      }

      const submission = await prisma.submission.create({
        data: {
          province: province || null,
          city: city || null,
          district: district || null,
          schoolName: schoolName || null,
          grade: grade || null,
          isRemedial: isRemedialBoolean,
          remedialStartDate: parsedRemedialStartDate,
          remedialEndDate: parsedRemedialEndDate,
          weeklyClassDays: weeklyClassDays ? parseFloat(weeklyClassDays) : null,
          monthlyHolidayDays: monthlyHolidayDays
            ? parseInt(monthlyHolidayDays, 10)
            : null,
          weeklyTotalHours: weeklyTotalHours
            ? parseFloat(weeklyTotalHours)
            : null,
          consentForm: consentForm || null,
          feeRequired: feeRequiredBoolean,
          feeAmount: feeAmount ? parseFloat(feeAmount) : null,
          coolingMeasures: coolingMeasures || null,
          schoolViolations: schoolViolations || [],
          otherViolations: otherViolations || null,
          phq9Data: phq9 || [],
          safetyWord: safetyWord || null,
          status: "pending",
          ip: userIp,
          userAgent: userAgent,
          approvedBy: null,
          reviewComment: null,
        },
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error("创建提交失败:", error);
      if (error instanceof Error) {
        res.status(500).json({
          message: "创建提交失败",
          error: error.message,
        });
      } else {
        res.status(500).json({
          message: "创建提交失败",
          error: "发生了未知错误。",
        });
      }
    }
  } else if (req.method === "GET") {
    try {
      const {
        generalSearch,
        province,
        city,
        district,
        schoolName,
        grade,
        isRemedial,
        remedialStartDate,
        remedialEndDate,
        weeklyClassDaysMin,
        weeklyClassDaysMax,
        monthlyHolidayDaysMin,
        monthlyHolidayDaysMax,
        weeklyTotalHoursMin,
        weeklyTotalHoursMax,
        consentForm,
        feeRequired,
        feeAmountMin,
        feeAmountMax,
        schoolViolations,
        otherViolations,
        phq9Data,
        page = 1,
        pageSize = 10,
      } = req.query;

      // 构建查询条件
      const whereConditions: any = {};

      // 处理常规搜索 (generalSearch)
      if (typeof generalSearch === "string" && generalSearch) {
        whereConditions.OR = [
          { province: { contains: generalSearch, mode: "insensitive" } },
          { city: { contains: generalSearch, mode: "insensitive" } },
          { district: { contains: generalSearch, mode: "insensitive" } },
          { schoolName: { contains: generalSearch, mode: "insensitive" } },
          { consentForm: { contains: generalSearch, mode: "insensitive" } },
          { otherViolations: { contains: generalSearch, mode: "insensitive" } },
          { safetyWord: { contains: generalSearch, mode: "insensitive" } },
        ];
      }

      // 处理高级搜索条件
      if (province) whereConditions.province = province;
      if (city) whereConditions.city = city;
      if (district) whereConditions.district = district;
      if (schoolName)
        whereConditions.schoolName = {
          contains: schoolName,
          mode: "insensitive",
        };
      if (grade) whereConditions.grade = grade;

      if (isRemedial && isRemedial !== "all")
        whereConditions.isRemedial = isRemedial === "是";

      const feeRequiredSearch = feeRequired === "true";

      if (feeRequired !== undefined) {
        whereConditions.feeRequired = feeRequiredSearch;
      }

      // 日期过滤条件
      if (remedialStartDate || remedialEndDate) {
        whereConditions.remedialStartDate = {}; // 初始化为一个空对象

        if (remedialStartDate) {
          // 确保 remedialStartDate 是字符串类型
          const startDate =
            typeof remedialStartDate === "string"
              ? parseAndValidateDate(remedialStartDate)
              : null;
          if (startDate) whereConditions.remedialStartDate.gte = startDate;
        }

        if (remedialEndDate) {
          // 确保 remedialEndDate 是字符串类型
          const endDate =
            typeof remedialEndDate === "string"
              ? parseAndValidateDate(remedialEndDate)
              : null;
          if (endDate) whereConditions.remedialEndDate.lte = endDate;
        }
      }

      // 每周课程天数范围
      if (weeklyClassDaysMin || weeklyClassDaysMax) {
        whereConditions.weeklyClassDays = {};

        if (weeklyClassDaysMin) {
          // 确保 weeklyClassDaysMin 是字符串类型
          whereConditions.weeklyClassDays.gte =
            typeof weeklyClassDaysMin === "string"
              ? parseFloat(weeklyClassDaysMin)
              : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }

        if (weeklyClassDaysMax) {
          // 确保 weeklyClassDaysMax 是字符串类型
          whereConditions.weeklyClassDays.lte =
            typeof weeklyClassDaysMax === "string"
              ? parseFloat(weeklyClassDaysMax)
              : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }
      }

      // 每月假期天数范围
      if (monthlyHolidayDaysMin || monthlyHolidayDaysMax) {
        whereConditions.monthlyHolidayDays = {};

        if (monthlyHolidayDaysMin) {
          // 确保 monthlyHolidayDaysMin 是字符串类型
          whereConditions.monthlyHolidayDays.gte =
            typeof monthlyHolidayDaysMin === "string"
              ? parseInt(monthlyHolidayDaysMin, 10)
              : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }

        if (monthlyHolidayDaysMax) {
          // 确保 monthlyHolidayDaysMax 是字符串类型
          whereConditions.monthlyHolidayDays.lte =
            typeof monthlyHolidayDaysMax === "string"
              ? parseInt(monthlyHolidayDaysMax, 10)
              : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }
      }

      // 每周上课总课时数
      if (weeklyTotalHoursMin || weeklyTotalHoursMax) {
        whereConditions.weeklyTotalHours = {};

        if (weeklyTotalHoursMin) {
          // 确保 weeklyTotalHoursMin 是字符串类型
          whereConditions.weeklyTotalHours.gte =
            typeof weeklyTotalHoursMin === "string"
              ? parseInt(weeklyTotalHoursMin, 10)
              : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }

        if (weeklyTotalHoursMax) {
          // 确保 weeklyTotalHoursMax 是字符串类型
          whereConditions.weeklyTotalHours.lte =
            typeof weeklyTotalHoursMax === "string"
              ? parseInt(weeklyTotalHoursMax, 10)
              : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }
      }

      // 学费范围
      if (feeAmountMin || feeAmountMax) {
        whereConditions.feeAmount = {};

        if (feeAmountMin) {
          // 确保 feeAmountMin 是字符串类型
          whereConditions.feeAmount.gte =
            typeof feeAmountMin === "string" ? parseFloat(feeAmountMin) : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }

        if (feeAmountMax) {
          // 确保 feeAmountMax 是字符串类型
          whereConditions.feeAmount.lte =
            typeof feeAmountMax === "string" ? parseFloat(feeAmountMax) : NaN; // 如果是数组或其他类型，设置为 NaN 来避免错误
        }
      }

      // 学校违规与其他违规
      if (schoolViolations) {
        whereConditions.schoolViolations = {
          hasSome: Array.isArray(schoolViolations)
            ? schoolViolations // 如果是数组，直接使用
            : schoolViolations.split(","), // 如果是字符串，进行 split
        };
      }

      if (otherViolations)
        whereConditions.otherViolations = {
          contains: otherViolations,
          mode: "insensitive",
        };

      if (phq9Data) {
        whereConditions.phq9Data = {
          hasSome: Array.isArray(phq9Data)
            ? phq9Data // 如果是数组，直接使用
            : phq9Data.split(","), // 如果是字符串，进行 split
        };
      }

      // 查询总数，计算总页数
      console.log("表达式：");
      console.log(whereConditions);

      const totalCount = await prisma.submission.count({
        where: {
          ...whereConditions,
          status: "approved",
        },
      });

      const submissions = await prisma.submission.findMany({
        where: {
          ...whereConditions,
          status: "approved",
        },
        orderBy: {
          createdAt: "desc", // 按创建时间降序排列
        },
        skip:
          (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10),
        take: parseInt(pageSize as string, 10),
        select: {
          id: true,
          createdAt: true,
          status: true,
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
          feeRequired: true,
          feeAmount: true,
          consentForm: true,
          schoolViolations: true,
          otherViolations: true,
          coolingMeasures: true,
          phq9Data: true,
          weeklyTotalHours: true,
        },
      });

      // 计算总页数
      const totalPages = Math.ceil(
        totalCount / parseInt(pageSize as string, 10)
      );

      res.status(200).json({
        submissions,
        pagination: {
          totalCount,
          totalPages,
          currentPage: parseInt(page as string, 10),
          pageSize: parseInt(pageSize as string, 10),
        },
      });
    } catch (error) {
      console.error("获取提交失败:", error);
      if (error instanceof Error) {
        res.status(500).json({
          message: "获取提交失败",
          error: error.message,
        });
      } else {
        res.status(500).json({
          message: "获取提交失败",
          error: "发生了未知错误。",
        });
      }
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
