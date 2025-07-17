import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Serif_SC,
  Roboto,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/i18n.config";
import "@/app/globals.css";
import Link from "next/link";

// API健康检测
import ApiHealthChecker from "@/app/components/ApiHealthChecker";
// 主题切换组件
import ThemeProvider from "@/components/providers/theme-provider";
// 页面Header组件
import Header from "@/app/components/Header";
// 用户鼠标移动轨迹检查
import MouseTracking from "@/app/components/MouseTracking";


const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  preload: true,
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

const notoSc = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  preload: false,
  variable: "--font-noto-sc",
  display: "swap",
});

const notoTc = Noto_Sans_TC({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  preload: false,
  variable: "--font-noto-tc",
  display: "swap",
});

const notoSerifSc = Noto_Serif_SC({
  weight: ["400", "700", "900"],
  style: "normal",
  preload: false,
  variable: "--font-noto-serif-sc",
  display: "swap",
});

// 动态 metadata
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return {
    title: messages.metaTitle,
    description: messages.metaDescription,
    icons: {
      icon: "/logo.svg",
    },
  };
}

// 语言路径生成
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 加载翻译
async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Missing translation for locale: ${locale}`, error);
    notFound();
  }
}

type Props = {
  children: React.ReactNode;
  params: { locale: (typeof locales)[number] };
};

// LocaleLayout 组件
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 验证 locale 是否在支持列表中
  if (!locales.includes(locale)) {
    notFound();
  }

  // 加载对应语言的翻译内容
  const [messages] = await Promise.all([getMessages(locale)]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${notoSc.variable} ${notoTc.variable} ${notoSerifSc.variable}
    min-h-screen bg-background font-sans antialiased 
    text-[15px] tracking-tight
    selection:bg-blue-500/20 selection:text-blue-700 
    dark:selection:bg-blue-400/20 dark:selection:text-blue-300 overflow-x-hidden`}
      >
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative flex min-h-screen flex-col w-full overflow-x-hidden max-w-full">
              <Header />
              <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-6.5 lg:px-8 py-8">
                <main
                  className="w-full prose prose-neutral dark:prose-invert 
  max-w-none proseCustom"
                >
                  {children}
                </main>
              </div>
              <footer
                className="w-full border-t border-neutral-200 dark:border-neutral-800 
  bg-neutral-50/70 dark:bg-neutral-900/60 backdrop-blur-md shadow-inner"
              >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
                      © 2025 Li-DAO. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/${locale}`}
                        className="text-sm text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                      >
                        Home
                      </Link>
                      <Link
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                      >
                        GitHub
                      </Link>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
