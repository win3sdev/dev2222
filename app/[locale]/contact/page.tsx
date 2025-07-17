"use client";

import { useTranslations } from "next-intl";
import {
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaTwitter,
} from "react-icons/fa";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 text-base text-foreground">
      {/* <Header /> */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 dark:text-blue-400">
        {t("title")}
      </h1>

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-blue-600 dark:border-blue-400 pl-4">
            {t("join.title")}
          </h2>
          <p className="text-lg leading-relaxed">
            {t.rich("join.content", {
              strong: (chunks) => <strong>{chunks}</strong>,
              a: (chunks) => (
                <a
                  href="https://t.me/whyyoutouzhele_memecoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-green-600 dark:border-green-400 pl-4">
            {t("committee.title")}
          </h2>
          <p className="text-lg leading-relaxed">
            {t.rich("committee.intro", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <ul className="list-disc list-inside space-y-3">
            {["visionary", "tech", "design", "rights"].map((key) => (
              <li key={key}>
                {t.rich(`committee.roles.${key}`, {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-pink-600 dark:border-pink-400 pl-4">
            {t("why.title")}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {["mission", "freedom", "future"].map((key) => (
              <li key={key}>{t(`why.${key}`)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-yellow-500 dark:border-yellow-400 pl-4">
            {t("how.title")}
          </h2>
          <p className="text-lg leading-relaxed">{t("how.intro")}</p>
          <ul className="space-y-3">
            <li>
              <strong>Telegram：</strong>{" "}
              <a
                href="https://t.me/whyyoutouzhele_memecoin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                {t("how.telegram")}
              </a>
            </li>
            <li>
              <strong>电子邮件：</strong>{" "}
              <a
                href="mailto:dev@lidao.pro"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                dev@lidao.pro
              </a>
            </li>
          </ul>
        </div>
      </section>

    </div>

  );
}
