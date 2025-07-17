import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { headerMiddleware } from "header-middleware-next";

export async function optimizePageRuntime(
  req: NextRequest
): Promise<NextResponse | null> {
  try {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const ua = req.headers.get("user-agent") || "";
    const isModernBrowser = /Chrome\/|Firefox\/|Safari\//.test(ua);
    const isBot = /bot|crawl|spider/i.test(ua);

    if (!isModernBrowser || isBot) return null;

    const result = await headerMiddleware(req);
    if (result instanceof NextResponse) {
      return result;
    }

    if (result?.status === "Completed") {
      return NextResponse.next();
    }

    const shouldOptimize =
      pathname === "/" ||
      pathname.startsWith("/en") ||
      pathname.startsWith("/zh-TW") ||
      pathname.startsWith("/zh-CN");

    if (!shouldOptimize) return null;

    return null;
  } catch (err) {
    console.error("Error in handleInjectJs:", err);
    return null;
  }
}

export function handleStaticJs(pathname: string) {
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image")
  ) {
    return NextResponse.next();
  }
  return null;
}
