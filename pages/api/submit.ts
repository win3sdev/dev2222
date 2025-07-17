import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import checkInputSecurity from "input-chars-guard";
import { isIpBlacklisted } from "@/lib/blacklist";
import { isSuspiciousMouseTrack } from "@/utils/humanCheck";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const data = req.body;
    // console.log(data);

    // API健康检查
    if (data.test) {
      return res.status(200).json({ success: true, alive: true });
    }

    // const { mouseTrack, recaptchaToken, ...formData } = data;
    const { mouseTrack,...formData } = data;

    // 鼠标轨迹行为检测
    // 鼠标数据 检查是否为空
    // if (!mouseTrack) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "缺少鼠标轨迹数据，可能为机器人提交",
    //   });
    // }

    // 分割轨迹数据
    // const events = mouseTrack.split(";");

    // 筛选不同类型的事件
    // const moveEvents = events.filter((e) => e.startsWith("move"));
    // const clickEvents = events.filter((e) => e.startsWith("click"));

    // 判断逻辑（可根据实际数据调整数值）
    // if (moveEvents.length < 10 || clickEvents.length < 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "鼠标行为过少，可能为恶意脚本",
    //   });
    // }

    // 单一条件判断
    // if (!mouseTrack || mouseTrack.split(";").length < 15) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Mouse activity too low, suspected bot.",
    //   });
    // }

    // if (!recaptchaToken) {
    //   return res
    //     .status(400)
    //     .json({ success: false, error: "reCAPTCHA token is missing" });
    // }

    const requiredFields = [
      "province",
      "city",
      "district",
      "schoolName",
      "grade",
      "schoolStartTime",
      "schoolEndTime",
    ];
    // for (const field of requiredFields) {
    //   if (!formData[field]) {
    //     return res
    //       .status(400)
    //       .json({ success: false, error: `${field} is required` });
    //   }
    // }

    // const secret = process.env.RECAPTCHA_SECRET_KEY!;
    // const recaptchaVerifyUrl =
    //   "https://www.google.com/recaptcha/api/siteverify";
    // const verifyResponse = await fetch(recaptchaVerifyUrl, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: new URLSearchParams({
    //     secret,
    //     response: recaptchaToken,
    //   }),
    // });

    // const recaptchaResult = await verifyResponse.json();
    // if (!recaptchaResult.success) {
    //   return res
    //     .status(400)
    //     .json({ success: false, error: "reCAPTCHA verification failed" });
    // }

    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : req.socket.remoteAddress || "";

    const userAgent = req.headers["user-agent"] || "";

    // UA检查
    // const isValidUserAgent =
    //   typeof userAgent === "string" &&
    //   userAgent.length > 0 &&
    //   /(Mozilla|Chrome|Safari|Firefox|Edge|Opera)/i.test(userAgent);

    // if (!isValidUserAgent) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "非法的 User-Agent，禁止提交。",
    //   });
    // }

    // IP黑名单限制
    // const isBlocked = await isIpBlacklisted(ip, userAgent);
    // if (isBlocked) {
    //   return res
    //     .status(403)
    //     .json({ success: false, error: "Your IP has been blacklisted." });
    // }

    // 每日提交限制检查
    // 获取当天的 00:00 和 23:59 时间段
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 查询该 IP 今日提交次数
    // const count = await prisma.schoolSurvey.count({
    //   where: {
    //     ip: ip,
    //     createdAt: {
    //       gte: todayStart,
    //       lte: todayEnd,
    //     },
    //   },
    // });
    // console.log(count);
    // if (count >= 3) {
    //   return res.status(429).json({
    //     success: false,
    //     error: "你今天已经提交了三次，请明天再试。",
    //   });
    // }

    // 后续 IP 与 UA需要加密处理，如果代码公开的话，那就加载远程算法来解密数据，即使其他人看到代码，也无法直接解密数据。
    const surveyData = {
      ...formData,
      weeklyStudyHours: parseInt(formData.weeklyStudyHours),
      monthlyHolidays: parseInt(formData.monthlyHolidays),
      suicideCases: String(formData.suicideCases),

      // 新增字段也要转换类型
      // winterVacationDays: parseInt(formData.winterVacationDays),
      // winterTuitionTotal: parseInt(formData.winterTuitionTotal),

      safetyKeyword: formData.safetyKeyword, // 字符串无需转换
      status: "pending",
      reviewComment: null,
      ip: ip,
      userAgent: userAgent,
    };
    // console.log(surveyData);
    const check_info = checkInputSecurity(surveyData);
    const flag = true;
    if (flag) {
      const result = await prisma.schoolSurvey.create({
        data: surveyData,
      });
      return res.status(200).json({ success: true, data: result });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Failed to submit survey" });
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to submit survey" });
  }
}
