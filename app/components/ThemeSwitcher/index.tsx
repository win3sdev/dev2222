"use client";

import { useThemeStore } from "@/lib/store/theme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const t = useTranslations();
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 等待客户端挂载后再渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免服务端渲染时的不匹配
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="theme-switcher"
      title={theme === "light" ? t("theme.dark") : t("theme.light")}
    >
      <SunIcon className="sun-icon w-5 h-5" />
      <MoonIcon className="moon-icon w-5 h-5" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
