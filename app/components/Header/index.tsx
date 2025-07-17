"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  TableCellsIcon,
  ChartBarIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { GithubIcon } from "@/app/components/Icons";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  if (!pathname) {
    throw new Error("Pathname is not available");
  }
  const locale = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const normalizedPath = pathname.replace(`/${locale}`, "") || "/";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navigationLinks = [
    {
      href: `/${locale}/submit`,
      label: t("navigation.submit"),
      icon: PlusCircleIcon,
    },
    {
      href: `/${locale}/display`,
      label: t("navigation.display"),
      icon: TableCellsIcon,
    },
    {
      href: `/${locale}/charts`,
      label: t("navigation.charts"),
      icon: ChartBarIcon,
    },
    { href: `/${locale}/map`, label: t("navigation.map"), icon: MapIcon },
    {
      href: `/${locale}/contact`,
      label: t("navigation.contact"),
      icon: EnvelopeIcon,
    },
    {
      href: `/${locale}/summer-camp`,
      label: t("navigation.summerCamp"),
      icon: ClipboardDocumentListIcon,
    },
    {
      href: `/${locale}/submissions`, // 链接到 /submissions 页面
      label: t("navigation.summerList"), // 标签文本
      icon: UserGroupIcon, // 使用 ClipboardDocumentListIcon 作为图标
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow hover:shadow-md">
      <div className="max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href={`/${locale}`}
            className="mr-6 flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shadow-md transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3 bg-white dark:bg-neutral-900">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 transition-all duration-300 ease-in-out group-hover:tracking-widest truncate max-w-[120px] md:max-w-none mr-0">
              {t("site.title")}
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;

              const baseClass =
                "group flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 " +
                "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white dark:text-white";

              const activeClass = isActive
                ? " bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                : "";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={baseClass + activeClass}
                >
                  <link.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                  <span className="transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2 ">
          <Link
            href="https://github.com/Li-DAO-Dev"
            target="_blank"
            rel="noreferrer"
            className="flex w-9 h-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-105"
          >
            <GithubIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="sr-only">GitHub</span>
          </Link>
          <LanguageSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-105"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-[4.5rem] w-64 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="py-3 px-2 flex flex-col space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <link.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <span className="transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
