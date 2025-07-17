import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n.config";
import type { Locale } from "@/i18n.config";

export default getRequestConfig(async ({ locale }) => {
  // 确保语言代码有效
  const validLocale = (
    locales.includes(locale as Locale) ? locale : defaultLocale
  ) as Locale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
    timeZone: "Asia/Shanghai",
  };
});
