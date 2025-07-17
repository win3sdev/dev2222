export const locales = ["zh-CN", "zh-TW", "en"] as const;
export const defaultLocale = "zh-CN";
export type Locale = (typeof locales)[number];