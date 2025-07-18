"use client";

import { useState } from "react";
import regionData from "@/data/regionData"; // 地区数据
import { useTranslations } from "next-intl";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PHQ9_QUESTIONS = [
  "对任何事情都提不起兴趣",
  "情绪低落、沮丧或绝望",
  "入睡困难、易醒或睡得过多",
  "感到疲倦或没有精力",
  "食欲不振或吃得过多",
  "感觉自己很糟糕、失败，或让自己或家人感到失望",
  "难以集中注意力（如看电视或上课时）",
  "动作或说话变慢，或因烦躁而坐立不安",
  "有不如死掉或用某种方式伤害自己的念头",
];

const PHQ9_SCORE_LABELS = {
  0: "完全没有",
  1: "有几天",
  2: "一半以上时间",
  3: "几乎每天",
};

const isValidDate = (dateString) => {
  if (!dateString) return true;

  const dateObj = new Date(dateString);
  const isValid =
    !isNaN(dateObj.getTime()) &&
    dateObj.getFullYear() >= 1900 &&
    dateObj.getFullYear() <= 2100;
  return isValid;
};

export default function SummerCampForm() {
  const t = useTranslations("summer-camp");
  const initialFormData = () => {
    const initialPhq9 = PHQ9_QUESTIONS.map((question) => ({
      question: question,
      score: null,
    }));

    return {
      province: "",
      city: "",
      district: "",
      schoolName: "",
      grade: "",
      isRemedial: "",
      remedialStartDate: "",
      remedialEndDate: "",
      weeklyClassDays: "",
      weeklyTotalHours: "",
      monthlyHolidayDays: "",
      consentForm: "",
      feeRequired: "",
      feeAmount: "",
      coolingMeasures: "",
      schoolViolations: [] as string[],
      otherViolations: "",
      phq9: initialPhq9,
      safetyWord: "",
      remedialStartDateError: "",
      remedialEndDateError: "",
    };
  };

  const [formData, setFormData] = useState(initialFormData);

  const handlePhq9Change = (index, value) => {
    setFormData((prevData) => {
      const newPhq9 = [...prevData.phq9];
      const numericValue = parseInt(value, 10); // 获取数字值

      const scoreLabel = PHQ9_SCORE_LABELS[numericValue];

      if (!newPhq9[index]) {
        newPhq9[index] = { question: PHQ9_QUESTIONS[index], score: null };
      }

      newPhq9[index] = {
        ...newPhq9[index],
        score: scoreLabel || null, // 存储文本描述
      };
      return {
        ...prevData,
        phq9: newPhq9,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "isRemedial" && value === "否") {
        setFormData((prevData) => ({
          ...prevData,
          isRemedial: value,
          remedialStartDate: "",
          remedialEndDate: "",
          weeklyClassDays: "",
          weeklyTotalHours: "",
          monthlyHolidayDays: "",
          consentForm: "",
          feeRequired: "否",
          feeAmount: "",
          coolingMeasures: "",
        }));
      } else if (name === "feeRequired" && value === "否") {
        setFormData((prevData) => ({
          ...prevData,
          feeRequired: value,
          feeAmount: "",
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prevData) => {
        const newViolations = checked
          ? [...prevData.schoolViolations, value]
          : prevData.schoolViolations.filter((v) => v !== value);

        return {
          ...prevData,
          schoolViolations: newViolations,
        };
      });
    } else {
      setFormData((prevData) => {
        let newData = {
          ...prevData,
          [name]: value,
        };

        if (name === "remedialStartDate") {
          if (!isValidDate(value)) {
            newData.remedialStartDateError =
              "日期格式无效或超出范围 (1900-2100年)";
          } else {
            newData.remedialStartDateError = "";
          }
        } else if (name === "remedialEndDate") {
          if (!isValidDate(value)) {
            newData.remedialEndDateError =
              "日期格式无效或超出范围 (1900-2100年)";
          } else {
            newData.remedialEndDateError = "";
          }
        }

        // 结束日期不能早于开始日期
        if (newData.remedialStartDate && newData.remedialEndDate) {
          const startDate = new Date(newData.remedialStartDate);
          const endDate = new Date(newData.remedialEndDate);

          if (endDate < startDate) {
            newData.remedialEndDateError = "结束日期不能早于开始日期";
          } else {
            newData.remedialEndDateError = ""; // 清除错误信息
          }
        }

        if (name === "isRemedial" && value === "否") {
          newData = {
            ...newData,
            remedialStartDate: "",
            remedialEndDate: "",
            remedialStartDateError: "",
            remedialEndDateError: "",
          };
        }

        return newData;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.isRemedial === "") {
      toast.error("请选择是否需要补习！", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const isStartDateValid = isValidDate(formData.remedialStartDate);
    const isEndDateValid = isValidDate(formData.remedialEndDate);

    if (!isStartDateValid || !isEndDateValid) {
      setFormData((prevData) => ({
        ...prevData,
        remedialStartDateError: isStartDateValid
          ? ""
          : "日期格式无效或超出范围 (1900-2100年)",
        remedialEndDateError: isEndDateValid
          ? ""
          : "日期格式无效或超出范围 (1900-2100年)",
      }));

      toast.error("请检查并修正日期输入。", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // const result = await response.json();
        toast.success("提交成功！您的问卷已成功提交，感谢您的参与。", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFormData(initialFormData());
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            backgroundColor: "#ff4444",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "10px 20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("提交问卷时发生错误，请稍后再试。", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          backgroundColor: "#ff4444",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
          borderRadius: "8px",
          padding: "10px 20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="mb-6 p-4 rounded-lg border bg-muted/30 dark:bg-muted/10 text-sm text-muted-foreground">
        <p>{t("card")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 一、学校基本信息 */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-2 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21v-7.5M3.75 21h6m-6 0L9.75 3m0 18V3m0 18h6m-6 0L15.75 3m0 18v-7.5M15.75 21h6m-6 0L21.75 3"
              />
            </svg>
            一、{t("address.label")}
          </h2>

          <div className="space-y-6">
            {" "}
            {/* 地区选择（省/市/区县） - 独占一行 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-medium mb-4 flex items-center text-neutral-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span className="text-lg font-medium text-neutral-900 dark:text-white">
                  {t("address.desc")}
                </span>
              </h3>

              <div className="space-y-4">
                {" "}
                {/* 省份 */}
                <div>
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
                  >
                    1. {t("province.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("province.desc")}
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
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                </div>
                {/* 城市 */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
                  >
                    2. {t("city.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("city.desc")}
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
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">{t("city.placeholder")}</option>
                    {formData.province &&
                      Object.keys(regionData[formData.province] || {}).map(
                        (city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        )
                      )}
                  </select>
                </div>
                {/* 区县 */}
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
                  >
                    3. {t("district.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("district.desc")}
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
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">{t("district.placeholder")}</option>
                    {formData.province &&
                      formData.city &&
                      (
                        regionData[formData.province]?.[formData.city] || []
                      ).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            {/* 学校名称 - 独占一行 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label
                htmlFor="schoolName"
                className="block text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-purple-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 21h16.5M3.75 7.5l7.5-7.5 7.5 7.5m-16.5 0h16.5"
                  />
                </svg>
                4. {t("schoolName.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("schoolName.desc")}
              </p>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder={t("schoolName.placeholder")}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            {/* 年级 - 独占一行 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label
                htmlFor="grade"
                className="block text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-orange-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.902a48.627 48.627 0 0 1 8.232-4.408 60.426 60.426 0 0 0-.491-6.347m-15.482 0A50.573 50.573 0 0 0 12 3.472a50.573 50.573 0 0 0 7.742 6.675C19.663 10.147 16.5 10.5 12 10.5c-4.5 0-7.663-.353-7.742-.403Z"
                  />
                </svg>
                5. {t("grade.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("grade.desc")}
              </p>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">{t("grade.placeholder")}</option>
                <option>初一</option>
                <option>初二</option>
                <option>初三</option>
                <option>高一</option>
                <option>高二</option>
                <option>高三</option>
              </select>
            </div>
          </div>
        </section>

        {/* 二、暑假补课情况 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-2 text-indigo-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5m18 7.5v-7.5m-9 0h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm-2.25 4.5h4.5v-4.5h-4.5v4.5Zm0 0H9.75M12 12.75h.008v.008H12v-.008Z"
              />
            </svg>
            二、{t("remedial.label")}
          </h2>

          <div className="space-y-6">
            {" "}
            {/* 6. 是否有暑假补课 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label className="block text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-yellow-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712L12 16.125l-2.121-2.121c-1.172-1.025-1.172-2.687 0-3.712ZM15 7.5l.004-.004L18 3.75m-6.75 0L7.5 3.75M4.5 13.5l-.004.004L1 17.25m-6.75 0L7.5 3.75M20.25 13.5l.004.004L23 17.25m-6.75 0L16.5 20.25"
                  />
                </svg>
                6. {t("remedial.isRemedial.label")}
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                <label className="inline-flex items-center text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="isRemedial"
                    value="是"
                    checked={formData.isRemedial === "是"}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                  />
                  {t("remedial.isRemedial.yes")}
                </label>
                <label className="inline-flex items-center text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="isRemedial"
                    value="否"
                    checked={formData.isRemedial === "否"}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                  />
                  {t("remedial.isRemedial.no")}
                </label>
              </div>
            </div>
            {formData.isRemedial === "是" && (
              <div className="space-y-6">
                {" "}
                {/* 7. 补习开始日期 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label
                    htmlFor="remedialStartDate"
                    className=" text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-cyan-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5m18 7.5v-7.5m-9 0h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm-2.25 4.5h4.5v-4.5h-4.5v4.5Zm0 0H9.75M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    7. {t("remedial.startDate.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("remedial.startDate.placeholder")}
                  </p>
                  <input
                    type="date"
                    id="remedialStartDate"
                    name="remedialStartDate"
                    value={formData.remedialStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.isRemedial !== "是"}
                  />
                  {formData.remedialStartDateError && (
                    <p className="text-red-500 text-sm mt-1">
                      {formData.remedialStartDateError}
                    </p>
                  )}
                </div>
                {/* 8. 补习结束日期 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label
                    htmlFor="remedialEndDate"
                    className=" text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-cyan-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5m18 7.5v-7.5m-9 0h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm-2.25 4.5h4.5v-4.5h-4.5v4.5Zm0 0H9.75M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    8. {t("remedial.endDate.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("remedial.endDate.placeholder")}
                  </p>
                  <input
                    type="date"
                    id="remedialEndDate"
                    name="remedialEndDate"
                    value={formData.remedialEndDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.isRemedial !== "是"}
                  />
                  {formData.remedialEndDateError && (
                    <p className="text-red-500 text-sm mt-1">
                      {formData.remedialEndDateError}
                    </p>
                  )}
                </div>
                {/* 9. 每周上课天数 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label className="text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-lime-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5m18 7.5v-7.5m-9 0h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm-2.25 4.5h4.5v-4.5h-4.5v4.5Zm0 0H9.75M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    9. {t("remedial.weeklyClassDays.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("remedial.weeklyClassDays.desc")}
                  </p>
                  <input
                    type="number"
                    step="0.5"
                    name="weeklyClassDays"
                    value={formData.weeklyClassDays}
                    onChange={handleInputChange}
                    className="w-full sm:w-40 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="例如: 3.5"
                    min="0"
                  />
                </div>
                {/* 10. 每周上课总课时数 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label className="text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-teal-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    10. {t("remedial.weeklyTotalHours.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("remedial.weeklyTotalHours.desc")}
                  </p>
                  <input
                    type="number"
                    step="0.5"
                    name="weeklyTotalHours"
                    value={formData.weeklyTotalHours}
                    onChange={handleInputChange}
                    className="w-full sm:w-40 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="例如: 15"
                    min="0"
                  />
                </div>
                {/* 11. 每月休息天数 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label className="text-lg font-medium mb-1 flex items-center text-neutral-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-rose-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5m18 7.5v-7.5m-9 0h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm-2.25 4.5h4.5v-4.5h-4.5v4.5Zm0 0H9.75M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    11. {t("remedial.monthlyHolidayDays.label")}
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {t("remedial.monthlyHolidayDays.desc")}
                  </p>
                  <input
                    type="number"
                    name="monthlyHolidayDays"
                    value={formData.monthlyHolidayDays}
                    onChange={handleInputChange}
                    className="w-full sm:w-40 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="例如: 4"
                    min="0"
                  />
                </div>
                {/* 12. 是否签订了相关补课协议/承诺书 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label className="block text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-amber-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25m-9-6.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    12. {t("remedial.consentForm.label")}
                  </label>
                  <div className="space-y-2 text-neutral-800 dark:text-neutral-200">
                    <label className="block">
                      <input
                        type="radio"
                        name="consentForm"
                        value={t("remedial.consentForm.option1")}
                        checked={
                          formData.consentForm ===
                          t("remedial.consentForm.option1")
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.consentForm.option1")}
                    </label>
                    <label className="block">
                      <input
                        type="radio"
                        name="consentForm"
                        value={t("remedial.consentForm.option2")}
                        checked={
                          formData.consentForm ===
                          t("remedial.consentForm.option2")
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.consentForm.option2")}
                    </label>
                    <label className="block">
                      <input
                        type="radio"
                        name="consentForm"
                        value={t("remedial.consentForm.option3")}
                        checked={
                          formData.consentForm ===
                          t("remedial.consentForm.option3")
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.consentForm.option3")}
                    </label>
                  </div>
                </div>
                {/* 13. 是否收取费用 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label className="text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0 1 15.794 2.105c.207.03.409-.09.488-.283a.75.75 0 0 0 .048-.216V17.25M2.25 18.75V11.25m0 7.5H4.875A.75.75 0 0 0 5.625 18h15c.414 0 .75-.336.75-.75V4.5A2.25 2.25 0 0 0 18 2.25H6A2.25 2.25 0 0 0 3.75 4.5V18.75Z"
                      />
                    </svg>
                    13. {t("remedial.feeRequired.label")}
                  </label>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 text-neutral-800 dark:text-neutral-200">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="feeRequired"
                        value="是"
                        checked={formData.feeRequired === "是"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.feeRequired.yes")}
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="feeRequired"
                        value="否"
                        checked={formData.feeRequired === "否"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.feeRequired.no")}
                    </label>
                  </div>

                  {formData.feeRequired === "是" && (
                    <div className="mt-4">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        {t("remedial.feeRequired.desc")}
                      </p>
                      <input
                        type="number"
                        name="feeAmount"
                        placeholder={t("remedial.feeAmount.label")}
                        value={formData.feeAmount}
                        onChange={handleInputChange}
                        className="w-full sm:w-40 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="0"
                      />
                    </div>
                  )}
                </div>
                {/* 14. 暑假补课是否存在降温措施 */}
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <label className="text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.25 7.756a4.5 4.5 0 0 0 2.087 7.938 6.75 6.75 0 0 1-3.133-3.805A6.75 6.75 0 0 1 12 2.25c-1.396 0-2.735.213-3.96.606a4.5 4.5 0 0 0 2.087 7.938Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 15.75h-3.375c-.066 0-.131.01-.195.03L9 17.25V12h1.5c.538 0 1.049-.214 1.423-.596l.307-.307A4.5 4.5 0 0 0 14.25 7.756v-.75m-9.817-5.903L9.75 9.879m4.242 2.121L14.25 12m-4.242 2.121L9.75 12"
                      />
                    </svg>
                    14. {t("remedial.coolingMeasures.label")}
                  </label>
                  <div className="space-y-2 text-neutral-800 dark:text-neutral-200">
                    <label className="block">
                      <input
                        type="radio"
                        name="coolingMeasures"
                        value={t("remedial.coolingMeasures.option1")}
                        checked={
                          formData.coolingMeasures ===
                          t("remedial.coolingMeasures.option1")
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.coolingMeasures.option1")}
                    </label>
                    <label className="block">
                      <input
                        type="radio"
                        name="coolingMeasures"
                        value={t("remedial.coolingMeasures.option2")}
                        checked={
                          formData.coolingMeasures ===
                          t("remedial.coolingMeasures.option2")
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.coolingMeasures.option2")}
                    </label>
                    <label className="block">
                      <input
                        type="radio"
                        name="coolingMeasures"
                        value={t("remedial.coolingMeasures.option3")}
                        checked={
                          formData.coolingMeasures ===
                          t("remedial.coolingMeasures.option3")
                        }
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 mr-2"
                      />
                      {t("remedial.coolingMeasures.option3")}
                    </label>
                  </div>
                </div>
              </div>
            )}
            {formData.isRemedial === "否" && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                <p className="text-lg text-blue-600 dark:text-blue-400 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02A9.72 9.72 0 0 1 12 15.75c2.71 0 5.109-1.077 6.993-2.854A9.72 9.72 0 0 0 12 6.75C9.309 6.75 6.891 7.827 5.007 9.603 3.037 11.535 2.25 13.985 2.25 16.5c0 3.398 2.378 6.075 5.093 6.075h.007c.412 0 .75-.337.75-.75V20.25a.75.75 0 0 0-.75-.75h-.007c-2.454 0-4.454-1.92-4.454-4.28C2.923 12.062 6.388 8.25 12 8.25c5.612 0 9.077 3.812 9.077 8.25 0 2.36-2 4.28-4.454 4.28h-.007a.75.75 0 0 0-.75.75v1.5c0 .413.337.75.75.75h.007c3.27 0 6.423-2.677 6.423-6.075C21.75 11.472 17.588 7.5 12 7.5S2.25 11.472 2.25 16.5c0 3.398 2.378 6.075 5.093 6.075h.007c.412 0 .75-.337.75-.75V20.25a.75.75 0 0 0-.75-.75h-.007z"
                    />
                  </svg>
                  {t("redirectMessage")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 三、学校违纪与爆料 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-2 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.006c1.69 0 2.936-1.875 2.069-3.376L12.72 5.063c-.866-1.5-3.036-1.5-3.901 0L2.697 16.376ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            三、{t("violations.title")}
          </h2>

          <div className="space-y-6">
            {" "}
            {/* 13. 存在的违规行为 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label className="block text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-rose-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.006c1.69 0 2.936-1.875 2.069-3.376L12.72 5.063c-.866-1.5-3.036-1.5-3.901 0L2.697 16.376ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                13. {t("violations.label")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("violations.check")}:
              </p>
              <div className="space-y-3 text-neutral-800 dark:text-neutral-200">
                {" "}
                {[
                  t("violations.option1"),
                  t("violations.option2"),
                  t("violations.option3"),
                  t("violations.option4"),
                  t("violations.option5"),
                  t("violations.option6"),
                ].map((violation) => (
                  <label key={violation} className="flex items-start">
                    <input
                      type="checkbox"
                      name="schoolViolations"
                      value={violation}
                      checked={formData.schoolViolations.includes(violation)}
                      onChange={handleInputChange}
                      className="form-checkbox h-4 w-4 text-red-600 border-neutral-300 dark:border-neutral-700 focus:ring-red-500 mr-2 mt-1"
                    />
                    <span>{violation}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* 14. 其他违规行为 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label className="text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02A9.72 9.72 0 0 1 12 15.75c2.71 0 5.109-1.077 6.993-2.854A9.72 9.72 0 0 0 12 6.75C9.309 6.75 6.891 7.827 5.007 9.603 3.037 11.535 2.25 13.985 2.25 16.5c0 3.398 2.378 6.075 5.093 6.075h.007c.412 0 .75-.337.75-.75V20.25a.75.75 0 0 0-.75-.75h-.007c-2.454 0-4.454-1.92-4.454-4.28C2.923 12.062 6.388 8.25 12 8.25c5.612 0 9.077 3.812 9.077 8.25 0 2.36-2 4.28-4.454 4.28h-.007a.75.75 0 0 0-.75.75v1.5c0 .413.337.75.75.75h.007c3.27 0 6.423-2.677 6.423-6.075C21.75 11.472 17.588 7.5 12 7.5S2.25 11.472 2.25 16.5c0 3.398 2.378 6.075 5.093 6.075h.007c.412 0 .75-.337.75-.75V20.25a.75.75 0 0 0-.75-.75h-.007z"
                  />
                </svg>
                14. {t("violations.otherLabel")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("violations.desc")}
              </p>
              <textarea
                name="otherViolations"
                value={formData.otherViolations}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={5}
                placeholder={t("violations.placeholder")}
              ></textarea>
            </div>
          </div>
        </section>

        {/* 四、心理健康与安全词 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-2 text-fuchsia-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.835 3 8.25c0 7.219 2.912 11.241 11.063 14.115.8.21 1.614.21 2.414 0C18.088 19.491 21 15.469 21 8.25Z"
              />
            </svg>
            四、{t("phq9.title")}
          </h2>

          <div className="space-y-6">
            {/* 15. PHQ-9 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label className="text-lg font-medium mb-4 flex items-center text-neutral-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m-4.5-6a4.125 4.125 0 1 1 8.25 0V9a4.125 4.125 0 0 1-8.25 0v3Z"
                  />
                </svg>
                15. {t("phq9.qu")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("phq9.label")}
              </p>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("phq9.label1")}
                <strong className="font-bold text-red-500 text-xl bg-yellow-200 p-1 rounded">
                  {t("phq9.foues")}
                </strong>
                {t("phq9.label2")}
              </p>

              {/* Mobile-first: PHQ-9 questions as cards */}
              <div className="space-y-4">
                {" "}
                {/* Vertical spacing between question cards */}
                {PHQ9_QUESTIONS.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600"
                  >
                    <p className="font-medium text-neutral-900 dark:text-white mb-3">
                      {index + 1}. {t(`phq9.question${index + 1}`)}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                      {" "}
                      {/* Options layout */}
                      {[0, 1, 2, 3].map((val) => (
                        <label
                          key={val}
                          className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-600"
                        >
                          <input
                            type="radio"
                            name={`phq9-${index}`}
                            value={val}
                            checked={
                              formData.phq9[index].score ===
                              PHQ9_SCORE_LABELS[val]
                            }
                            onChange={(e) =>
                              handlePhq9Change(index, e.target.value)
                            }
                            className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 dark:text-blue-400 dark:focus:ring-blue-500"
                          />
                          <span className="text-neutral-700 dark:text-neutral-200 text-sm">
                            {t(`phq9.scoreLabel${val}`)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Original table for larger screens (Optional - can be removed if card approach is universal) */}
              {/* You can use responsive classes here to show/hide based on screen size, e.g., `hidden md:block` */}
              {/* <div className="hidden md:block overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm mt-6">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm text-left dark:text-white">
                  <thead className="bg-neutral-50 dark:bg-neutral-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider dark:text-neutral-300 w-1/3"
                      >
                        题目内容
                      </th>
                      {[0, 1, 2, 3].map((score) => (
                        <th
                          key={score}
                          scope="col"
                          className="px-3 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider dark:text-neutral-300"
                        >
                          {t(`phq9.scoreLabel${score}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {PHQ9_QUESTIONS.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-normal text-neutral-900 dark:text-white">
                          {t(`phq9.question${index + 1}`)}
                        </td>
                        {[0, 1, 2, 3].map((val) => (
                          <td
                            key={val}
                            className="px-3 py-4 whitespace-nowrap text-center"
                          >
                            <input
                              type="radio"
                              name={`phq9-${index}`}
                              value={val}
                              checked={
                                formData.phq9[index].score ===
                                PHQ9_SCORE_LABELS[val]
                              }
                              onChange={(e) =>
                                handlePhq9Change(index, e.target.value)
                              }
                              className="form-radio h-4 w-4 text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 dark:text-blue-400 dark:focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </div>

            {/* 16. 安全词 */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <label className=" text-lg font-medium mb-3 flex items-center text-neutral-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.018-.118 2.005-.338 2.955M12 21 3 12 12 3"
                  />
                </svg>
                16. {t("safeWork.title")}
              </label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {t("safeWork.desc")}
              </p>
              <input
                type="text"
                name="safetyWord"
                value={formData.safetyWord}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("safeWork.placeholder")}
                required
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t("submit")}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
}
