import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  const isDashboardPath = request.nextUrl.pathname === "/review-611/dashboard";
  const isRootPath = request.nextUrl.pathname === "/"; // 检测是否访问根目录

  // 如果是根目录，检查语言并重定向
  if (isRootPath) {
    const acceptLanguage = request.headers.get("accept-language"); // 获取浏览器的语言设置

    // 获取浏览器支持的语言列表
    const preferredLanguage = acceptLanguage
      ?.split(",")
      .map(lang => lang.split(";")[0]) // 只取语言代码
      .find(lang => ["zh-CN", "zh-TW", "en"].includes(lang)) || "zh-CN"; // 默认到 zh-CN

    // 重定向到相应的语言页面
    return NextResponse.redirect(new URL(`/${preferredLanguage}`, request.url));
  }


  if (isDashboardPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/review-611/login", request.url));
  }

}

export const config = {
  matcher: [
    "/review-611/dashboard",
    "/review-611/login",
    "/"
  ],
};
