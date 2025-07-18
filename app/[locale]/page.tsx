"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  FaBullhorn,
  FaUserShield,
  FaClock,
  FaHandsHelping,
  FaBullseye,
  FaHeart,
  FaArrowRight,
  FaPen,
  FaChartBar,
  FaEnvelope,
  FaComments,
} from "react-icons/fa";
import { useLocale } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 text-base text-foreground">
      <header className="text-center space-y-8 max-w-3xl mx-auto animate-fade-in px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          {t("site.title")} | $Li
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("home.intro.part1")}
          <span className="font-semibold text-foreground">
            {t("home.intro.part3")}
          </span>
          {t("home.intro.part2")}
        </p>

        <div className="space-y-2">
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            {t("home.cta.title")}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("home.cta.desc")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 pt-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <Link
              href={`/${locale}/submit`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-offset-2 dark:focus:ring-cyan-500 dark:focus:ring-offset-gray-900 transition-all dark:from-cyan-400 dark:to-blue-400"
            >
              <FaPen className="text-lg" />
              {t("home.cta.submit")}
              <FaArrowRight className="ml-1 text-sm" />
            </Link>

            <Link
              href={`/${locale}/display`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 dark:focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-all dark:from-teal-400 dark:to-green-400"
            >
              <FaChartBar className="text-lg" />
              {t("home.cta.display")}
              <FaArrowRight className="ml-1 text-sm" />
            </Link> */}

            <Link
              href={`/${locale}/summer-camp`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-offset-2 dark:focus:ring-cyan-500 dark:focus:ring-offset-gray-900 transition-all dark:from-cyan-400 dark:to-blue-400"
            >
              <FaPen className="text-lg" />
              {t("home.cta.submit")}
              <FaArrowRight className="ml-1 text-sm" />
            </Link>

            <Link
              href={`/${locale}/submissions`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold shadow-md hover:brightness-110 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 dark:focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-all dark:from-teal-400 dark:to-green-400"
            >
              <FaChartBar className="text-lg" />
              {t("home.cta.display")}
              <FaArrowRight className="ml-1 text-sm" />
            </Link>
          </div>

          <div className="pt-6 sm:pt-8 w-full max-w-sm">
            <div className="rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-md hover:brightness-110 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-offset-2 dark:focus:ring-pink-500 dark:focus:ring-offset-gray-900 transition-all dark:from-purple-400 dark:to-pink-400"
              >
                <FaEnvelope className="text-lg" />
                {t("home.cta.contact")}
                <FaArrowRight className="ml-1 text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="核心理念卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUserShield className="text-blue-500 bg-blue-100 dark:bg-blue-900 rounded-full p-1 w-6 h-6" />
            {t("home.core.title")}
          </h2>
          <p>
            <strong>$LI</strong> {t("home.core.part1")}
            <span className="text-primary font-medium">
              {t("home.core.part2")}
            </span>
            {t("home.core.part3")} <strong>{t("home.core.part4")}</strong>
            {t("home.core.part5")}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaClock className="text-yellow-500" />
            {t("home.system.title")}
          </h2>
          <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
            {t("home.system.quote")}
          </blockquote>
          <p>
            {t("home.system.text")}
            <strong>{t("home.system.highlight")}</strong>
            {t("home.system.consequence")}
            <span className="text-destructive font-semibold">
              {t("home.system.warning")}
            </span>
            {t("home.system.ending")}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaHandsHelping className="text-green-600" />
            {t("home.actions.title")}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              {t("home.actions.list.0")}
              <strong>{t("home.actions.list.1")}</strong>
              {t("home.actions.list.2")}
              <span className="text-red-500">{t("home.actions.list.3")}</span>
            </li>
            <li>{t("home.actions.list.4")}</li>
            <li>{t("home.actions.list.5")}</li>
            <li>
              <span className="font-medium">{t("home.actions.list.6")}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer md:col-span-2 lg:col-span-1 animate-fade-in">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaBullseye className="text-pink-500" />
            {t("home.vision.title")}
          </h2>
          <p>
            {t("home.vision.content")}
            <strong>{t("home.vision.highlight")}</strong>
            {t("home.vision.ending")}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer md:col-span-2 animate-fade-in">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaHeart className="text-rose-500" />
            {t("home.inspiration.title")}
          </h2>
          <p>
            {t("home.inspiration.thanks")}
            <span className="font-semibold">
              {t("home.inspiration.reference")}
            </span>
            {t("home.inspiration.followup")}
          </p>
          <p className="text-muted-foreground text-sm">
            {t("home.inspiration.note")}
            <span className="font-medium">{t("home.inspiration.warning")}</span>
          </p>
        </div>
      </section>

      <footer className="text-center border-t pt-6 text-sm text-muted-foreground mt-24 bg-muted/30 dark:bg-muted/10 rounded-t-xl">
        <p>&copy; 2025 611Study.ICU. {t("home.footer.text")}</p>
      </footer>
    </div>
  );
}
