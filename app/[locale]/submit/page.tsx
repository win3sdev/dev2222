"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";
import regionData from "@/data/regionData"; // 地区数据

export default function SubmitPage() {
  const mouseDataRef = useRef<string[]>([]);
  useEffect(() => {
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 100) {
        mouseDataRef.current.push(`move:${e.clientX},${e.clientY},${now}`);
        lastTime = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
      mouseDataRef.current.push(
        `click:${e.clientX},${e.clientY},${Date.now()}`
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const t = useTranslations("form");

  const [formData, setFormData] = useState({
    province: "",
    city: "",
    district: "",
    schoolName: "",
    grade: "",
    schoolStartTime: "",
    schoolEndTime: "",
    weeklyStudyHours: "",
    monthlyHolidays: "",
    suicideCases: "",
    studentComments: "",
    mouseTrack: "",
    safetyKeyword: "", // 新增字段
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitStatus("idle");

    setIsSubmitting(true);
    const trackData = mouseDataRef.current.join(";");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          mouseTrack: trackData,
          // recaptchaToken,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        toast.success(t("success"), { duration: 3000, position: "top-center" });
        setFormData({
          province: "",
          city: "",
          district: "",
          schoolName: "",
          grade: "",
          schoolStartTime: "",
          schoolEndTime: "",
          weeklyStudyHours: "",
          monthlyHolidays: "",
          suicideCases: "",
          studentComments: "",
          mouseTrack: "",
          safetyKeyword: "", // 新增字段
        });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        setSubmitStatus("error");
        toast.error(t("error"), { duration: 3000, position: "top-center" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      toast.error(t("error"), { duration: 3000, position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // success
  const SuccessAnimation = () => (
    <div className="flex justify-center py-6">
      <svg
        className="w-16 h-16 text-green-500 animate-scaleIn"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  );

  // failed
  const ErrorAnimation = () => (
    <div className="flex justify-center py-6">
      <svg
        className="w-16 h-16 text-red-500 animate-scaleIn"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    </div>
  );
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="mb-6 p-4 rounded-lg border bg-muted/30 dark:bg-muted/10 text-sm text-muted-foreground">
        <p>{t("card")}</p>
      </div>
      <div className="">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* 地区选择（省/市/区县） */}
          <div>
            {/* 省份 */}
            <label className="block text-sm font-medium mb-1">
              {t("province.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("province.description")}
            </p>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={(e) => {
                const selectedProvince = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  province: selectedProvince,
                  city: "",
                  district: "",
                }));
              }}
              className="mb-2 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="" disabled hidden>
                {t("province.placeholder")}
              </option>
              {Object.keys(regionData).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>

            {/* 城市 */}
            <label className="block text-sm font-medium mb-1">
              {t("city.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("city.description")}
            </p>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={(e) => {
                const selectedCity = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  city: selectedCity,
                  district: "",
                }));
              }}
              disabled={!formData.province}
              className="text-neutral-800 dark:text-white mb-2 w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t("city.placeholder")}</option>
              {formData.province &&
                Object.keys(regionData[formData.province] || {}).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>

            {/* 区县 */}
            <label className="block text-sm font-medium mb-1">
              {t("district.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("district.description")}
            </p>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  district: e.target.value,
                }))
              }
              disabled={!formData.city}
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t("district.placeholder")}</option>
              {formData.province &&
                formData.city &&
                (regionData[formData.province]?.[formData.city] || []).map(
                  (district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  )
                )}
            </select>
          </div>

          {/* 学校名称 */}
          <div>
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium mb-1"
            >
              {t("schoolName.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("schoolName.description")}
            </p>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder={t("schoolName.placeholder")}
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 年级 */}

          <div>
            <label htmlFor="grade" className="block text-sm font-medium mb-1">
              {t("grade.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("grade.description")}
            </p>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                {t("grade.placeholder")}
              </option>
              <option value={t("grade.options.grade1")}>
                {t("grade.options.grade1")}
              </option>
              <option value={t("grade.options.grade2")}>
                {t("grade.options.grade2")}
              </option>
              <option value={t("grade.options.grade3")}>
                {t("grade.options.grade3")}
              </option>
              <option value={t("grade.options.grade4")}>
                {t("grade.options.grade4")}
              </option>
              <option value={t("grade.options.grade5")}>
                {t("grade.options.grade5")}
              </option>
              <option value={t("grade.options.grade6")}>
                {t("grade.options.grade6")}
              </option>
              <option value={t("grade.options.grade7")}>
                {t("grade.options.grade7")}
              </option>
              <option value={t("grade.options.grade8")}>
                {t("grade.options.grade8")}
              </option>
              <option value={t("grade.options.grade9")}>
                {t("grade.options.grade9")}
              </option>
              <option value={t("grade.options.grade10")}>
                {t("grade.options.grade10")}
              </option>
              <option value={t("grade.options.grade11")}>
                {t("grade.options.grade11")}
              </option>
              <option value={t("grade.options.grade12")}>
                {t("grade.options.grade12")}
              </option>
            </select>
          </div>

          {/* 上学时间 */}
          <div>
            <label
              htmlFor="schoolStartTime"
              className="block text-sm font-medium mb-1"
            >
              {t("schoolStartTime.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("schoolStartTime.description")}
            </p>
            <input
              type="time"
              id="schoolStartTime"
              name="schoolStartTime"
              value={formData.schoolStartTime}
              onChange={handleChange}
              min="01:00"
              max="11:59"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 放学时间 */}
          <div>
            <label
              htmlFor="schoolEndTime"
              className="block text-sm font-medium mb-1"
            >
              {t("schoolEndTime.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("schoolEndTime.description")}
            </p>
            <input
              type="time"
              id="schoolEndTime"
              name="schoolEndTime"
              value={formData.schoolEndTime}
              onChange={handleChange}
              min="12:00"
              max="23:59"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 每周在校学习小时数 */}
          <div>
            <label
              htmlFor="weeklyStudyHours"
              className="block text-sm font-medium mb-1"
            >
              {t("weeklyStudyHours.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("weeklyStudyHours.description")}
            </p>
            <input
              type="number"
              id="weeklyStudyHours"
              name="weeklyStudyHours"
              value={formData.weeklyStudyHours}
              onChange={handleChange}
              placeholder={t("weeklyStudyHours.placeholder")}
              min="0"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 每月假期天数 */}
          <div>
            <label
              htmlFor="monthlyHolidays"
              className="block text-sm font-medium mb-1"
            >
              {t("monthlyHolidays.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("monthlyHolidays.description")}
            </p>
            <input
              type="number"
              id="monthlyHolidays"
              name="monthlyHolidays"
              value={formData.monthlyHolidays}
              onChange={handleChange}
              placeholder={t("monthlyHolidays.placeholder")}
              min="0"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 寒假放假天数 */}
          {/* <div>
            <label
              htmlFor="winterVacationDays"
              className="block text-sm font-medium mb-1"
            >
              寒假放假天数
            </label>
            <input
              type="number"
              id="winterVacationDays"
              name="winterVacationDays"
              value={formData.winterVacationDays}
              onChange={handleChange}
              placeholder="请输入寒假放假天数"
              min="0"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          {/* 寒假补课收费总价 */}
          {/* <div>
            <label
              htmlFor="winterTuitionTotal"
              className="block text-sm font-medium mb-1"
            >
              寒假补课收费总价（元）
            </label>
            <input
              type="number"
              step="0.01"
              id="winterTuitionTotal"
              name="winterTuitionTotal"
              value={formData.winterTuitionTotal}
              onChange={handleChange}
              placeholder="请输入补课总费用"
              min="0"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          {/* 安全词 */}
          <div>
            <label
              htmlFor="safetyKeyword"
              className="block text-sm font-medium mb-1"
            >
              {t("safaKeyword.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("safaKeyword.description")}
            </p>
            <input
              type="text"
              id="safetyKeyword"
              name="safetyKeyword"
              value={formData.safetyKeyword}
              onChange={handleChange}
              placeholder={t("safaKeyword.placeholder")}
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 24年学生自杀数 */}
          <div>
            <label
              htmlFor="suicideCases"
              className="block text-sm font-medium mb-1"
            >
              {t("suicideCases.label")}
            </label>
            {/* <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("suicideCases.description")}
            </p> */}
            <input
              type="text"
              id="suicideCases"
              name="suicideCases"
              value={formData.suicideCases}
              onChange={handleChange}
              placeholder={t("suicideCases.placeholder")}
              min="0"
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 学生的评论 */}
          <div>
            <label
              htmlFor="studentComments"
              className="block text-sm font-medium mb-1"
            >
              {t("studentComments.label")}
            </label>
            {/* <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("studentComments.description")}
            </p> */}
            <textarea
              id="studentComments"
              name="studentComments"
              value={formData.studentComments}
              onChange={handleChange}
              placeholder={t("studentComments.placeholder")}
              rows={4}
              className="text-neutral-800 dark:text-white w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* reCAPTCHA 不做隐式状态 */}
          {/* <div className="pt-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={onRecaptchaChange}
            />
          </div> */}

          {/* 提交按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </div>

          {/* 提交状态提示 */}
          {/* {submitStatus === "success" && (
            <p className="text-green-500 text-center">{t("success")}</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500 text-center">{t("error")}</p>
          )} */}
          {/* 动画提示 */}
          {submitStatus === "success" && <SuccessAnimation />}
          {submitStatus === "error" && <ErrorAnimation />}
        </form>
      </div>
    </div>
  );
}
