'use client'

import { useThemeStore } from "@/lib/store/theme"
import { useEffect } from "react"

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, setTheme } = useThemeStore()

  // 初始化主题
  useEffect(() => {
    // 检查系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = prefersDark ? 'dark' : 'light'
    setTheme(initialTheme)
  }, [])

  // 应用主题
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return children
} 