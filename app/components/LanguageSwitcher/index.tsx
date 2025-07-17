'use client'

import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { locales } from '@/i18n.config'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  if (!pathname) {
    throw new Error("Pathname is not available");
  }
  const currentLocale = pathname.split('/')[1]

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitch = (locale: string) => {
    // 获取当前路径中的语言代码之后的部分
    const pathWithoutLocale = pathname.split('/').slice(2).join('/')
    // 构建新的路径
    const newPathname = `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`
    router.push(newPathname)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 items-center justify-center rounded-md px-3 hover:bg-accent hover:text-accent-foreground"
        title={t('language.' + currentLocale)}
      >
        <LanguageIcon className="h-5 w-5" />
        <ChevronDownIcon className="ml-1 h-4 w-4" />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] w-40 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="py-2">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSwitch(locale)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                  ${currentLocale === locale ? 'text-blue-500 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-300'}`}
              >
                {t(`language.${locale}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 