"use client";

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";
import SubmissionDetailPanel from "../../components/SubmissionDetailPanel";

import {
  FaMapMarkerAlt,
  FaSchool,
  FaGraduationCap,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFileAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
  FaSun,
  FaMoon,
  FaDollarSign,
  FaCheckCircle,
  FaHourglass,
} from "react-icons/fa";

const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function SubmissionsPage() {
  const t = useTranslations("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // 分页信息
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 核心数据获取函数，现在会根据 activeSearchParams 调用后端 API
  const fetchSubmissions = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryString = new URLSearchParams({
          ...params,
          page: currentPage, // 直接传递当前页码给后端
          pageSize: itemsPerPage, // 直接传递每页数量给后端
        }).toString();

        const url = `/api/submissions${queryString ? `?${queryString}` : ""}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch submissions");
        }

        const data = await response.json();
        console.log("从后端获取的数据:", data); // 调试用，查看完整的数据结构

        setSubmissions(data.submissions);
        setTotalCount(data.pagination.totalCount); // 设置总记录数
        setTotalPages(data.pagination.totalPages); // 设置总页数

        // 如果没有搜索参数，显示成功提示
        if (Object.keys(params).length === 0) {
          toast.success("数据加载成功！");
        }
      } catch (err) {
        console.error("获取提交数据时出错:", err);
        setError(err.message);
        toast.error(`数据加载失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    // 将 currentPage 和 itemsPerPage 加入依赖数组，确保它们变化时 fetchSubmissions 会重新生成
    [currentPage, itemsPerPage]
  );

  // useEffect 钩子，当 currentPage 变化时重新获取数据
  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, fetchSubmissions]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 基础搜索状态 (依然用于输入框的值)
  const [searchTerm, setSearchTerm] = useState("");
  // 高级搜索状态
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState({
    province: "",
    city: "",
    district: "",
    schoolName: "",
    grade: "",
    isRemedial: "all",
    remedialStartDate: "",
    remedialEndDate: "",
    weeklyClassDaysMin: "",
    weeklyClassDaysMax: "",
    monthlyHolidayDaysMin: "",
    monthlyHolidayDaysMax: "",
    weeklyTotalHoursMin: "",
    weeklyTotalHoursMax: "",
    consentForm: "",
    feeRequired: "all",
    feeAmountMin: "",
    feeAmountMax: "",
    coolingMeasures: "",
    schoolViolations: "",
    otherViolations: "",
    safetyWord: "",
    status: "all",
    phq9Data: "",
  });

  // 当前激活的搜索参数，用于发送给后端
  const [activeSearchParams, setActiveSearchParams] = useState({});

  // 页面初次加载时或 activeSearchParams 变化时，调用后端 API
  useEffect(() => {
    fetchSubmissions(activeSearchParams);
  }, [fetchSubmissions, activeSearchParams]); // 依赖项中包含 fetchSubmissions 和 activeSearchParams

  const handleCardClick = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailPanel(true);
  };

  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedSubmission(null);
  };

  // 辅助函数：格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return "未填写";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 处理高级搜索输入变化
  const handleAdvancedSearchChange = (e) => {
    const { name, value } = e.target;
    setAdvancedSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 执行搜索
  const executeSearch = () => {
    const params = {};

    // 基础搜索词
    if (searchTerm) {
      params.generalSearch = searchTerm;
    }

    // 高级搜索条件
    for (const key in advancedSearchCriteria) {
      const value = advancedSearchCriteria[key];
      // 排除空字符串和 'all' 值
      if (value !== "" && value !== "all") {
        params[key] = value;
      }
    }
    // 更新活跃搜索参数，这将触发 useEffect 重新调用 fetchSubmissions
    setActiveSearchParams(params);
  };

  // 高亮功能现在只用于前端显示，不参与后端搜索逻辑
  const highlightMatch = (text, term) => {
    // 只有当有基础搜索词时才高亮，且没有使用高级搜索
    if (
      !term ||
      !text ||
      Object.keys(advancedSearchCriteria).some(
        (key) =>
          advancedSearchCriteria[key] !== "" &&
          advancedSearchCriteria[key] !== "all"
      )
    ) {
      return text; // 如果有高级搜索或者没有基础搜索词，返回原文，不进行高亮
    }

    // 确保 `text` 是字符串类型
    if (typeof text !== "string") {
      return text; // 如果 `text` 不是字符串，直接返回原内容
    }

    const lowerText = text.toLowerCase(); // 将文本转为小写
    const lowerTerm = term.toLowerCase(); // 将搜索词转为小写

    const parts = [];
    let lastIndex = 0;
    let match;
    const regex = new RegExp(`(${lowerTerm})`, "gi"); // 正则表达式，匹配不区分大小写的搜索词

    // 查找匹配项并构建高亮部分
    while ((match = regex.exec(text)) !== null) {
      parts.push(text.substring(lastIndex, match.index)); // 匹配前的文本
      parts.push(
        <strong
          key={match.index}
          className="bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 rounded px-0.5"
        >
          {match[0]} {/* 高亮显示匹配的文本 */}
        </strong>
      );
      lastIndex = regex.lastIndex; // 更新最后匹配的位置
    }

    parts.push(text.substring(lastIndex)); // 添加剩余的文本
    return <>{parts}</>; // 返回包含高亮的部分
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          正在加载数据...
        </p>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center text-red-600">
        <p className="text-xl font-semibold">加载数据失败:</p>
        <p>{error}</p>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-white">
        {t("title")}
      </h1>

      {/* 搜索区域 */}
      <div className="mb-8 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
        {/* 基础搜索框和按钮 */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder={t("search.placeholder")}
            className="flex-grow p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                executeSearch();
              }
            }}
          />
          <button
            onClick={executeSearch}
            className="flex-shrink-0 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {t("search.button")}
          </button>
        </div>

        {/* 高级搜索切换按钮 */}
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center mt-2 focus:outline-none"
        >
          {showAdvancedSearch ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
          {t("search.highSearch")}
        </button>

        {/* 高级搜索内容 (条件渲染) */}
        {showAdvancedSearch && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center min-h-[50px]">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("advancedSearch.title")}
              </h3>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => {
                  setAdvancedSearchCriteria({
                    province: "",
                    city: "",
                    district: "",
                    schoolName: "",
                    grade: "",
                    isRemedial: "all",
                    remedialStartDate: "",
                    remedialEndDate: "",
                    weeklyClassDaysMin: "",
                    weeklyClassDaysMax: "",
                    monthlyHolidayDaysMin: "",
                    monthlyHolidayDaysMax: "",
                    weeklyTotalHoursMin: "",
                    weeklyTotalHoursMax: "",
                    consentForm: "",
                    feeRequired: "all",
                    feeAmountMin: "",
                    feeAmountMax: "",
                    coolingMeasures: "",
                    schoolViolations: "",
                    otherViolations: "",
                    safetyWord: "",
                    status: "all",
                    phq9Data: "",
                  });
                }}
              >
                清空搜索
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 文本输入字段 */}
              <input
                type="text"
                name="province"
                placeholder={t("advancedSearch.province")}
                value={advancedSearchCriteria.province}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="city"
                placeholder={t("advancedSearch.city")}
                value={advancedSearchCriteria.city}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="district"
                placeholder={t("advancedSearch.district")}
                value={advancedSearchCriteria.district}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="schoolName"
                placeholder={t("advancedSearch.schoolName")}
                value={advancedSearchCriteria.schoolName}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="grade"
                placeholder={t("advancedSearch.grade")}
                value={advancedSearchCriteria.grade}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="consentForm"
                placeholder={t("advancedSearch.consentForm")}
                value={advancedSearchCriteria.consentForm}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="coolingMeasures"
                placeholder={t("advancedSearch.coolingMeasures")}
                value={advancedSearchCriteria.coolingMeasures}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="otherViolations"
                placeholder={t("advancedSearch.otherViolations")}
                value={advancedSearchCriteria.otherViolations}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />

              <input
                type="text"
                name="schoolViolations"
                placeholder={t("advancedSearch.schoolViolations")}
                value={advancedSearchCriteria.schoolViolations}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />
              <input
                type="text"
                name="phq9Data"
                placeholder={t("advancedSearch.phq9Data")}
                value={advancedSearchCriteria.phq9Data}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              />

              {/* 布尔值选择 */}
              <select
                name="isRemedial"
                value={advancedSearchCriteria.isRemedial}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              >
                <option value="all">
                  {t("advancedSearch.isRemedial.all")}
                </option>
                <option value="true">
                  {t("advancedSearch.isRemedial.true")}
                </option>
                <option value="false">
                  {t("advancedSearch.isRemedial.false")}
                </option>
              </select>
              <select
                name="feeRequired"
                value={advancedSearchCriteria.feeRequired}
                onChange={handleAdvancedSearchChange}
                className="p-2 border rounded dark:bg-neutral-700 dark:text-white"
              >
                <option value="all">
                  {t("advancedSearch.feeRequired.all")}
                </option>
                <option value="true">
                  {t("advancedSearch.feeRequired.true")}
                </option>
                <option value="false">
                  {t("advancedSearch.feeRequired.false")}
                </option>
              </select>

              {/* 日期范围 */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 w-24 flex-shrink-0">
                  {t("advancedSearch.remedialStartDate")}:
                </label>
                <input
                  type="date"
                  name="remedialStartDate"
                  value={advancedSearchCriteria.remedialStartDate}
                  onChange={handleAdvancedSearchChange}
                  className="flex-grow p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 w-24 flex-shrink-0">
                  {t("advancedSearch.remedialEndDate")}:
                </label>
                <input
                  type="date"
                  name="remedialEndDate"
                  value={advancedSearchCriteria.remedialEndDate}
                  onChange={handleAdvancedSearchChange}
                  className="flex-grow p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
              </div>

              {/* 数字范围 */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 w-24 flex-shrink-0">
                  {t("advancedSearch.weeklyClassDays")}:
                </label>
                <input
                  type="number"
                  name="weeklyClassDaysMin"
                  placeholder={t("advancedSearch.min")}
                  value={advancedSearchCriteria.weeklyClassDaysMin}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="number"
                  name="weeklyClassDaysMax"
                  placeholder={t("advancedSearch.max")}
                  value={advancedSearchCriteria.weeklyClassDaysMax}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 w-24 flex-shrink-0">
                  {t("advancedSearch.monthFunDays")}:
                </label>
                <input
                  type="number"
                  name="monthlyHolidayDaysMin"
                  placeholder={t("advancedSearch.min")}
                  value={advancedSearchCriteria.monthlyHolidayDaysMin}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="number"
                  name="monthlyHolidayDaysMax"
                  placeholder={t("advancedSearch.max")}
                  value={advancedSearchCriteria.monthlyHolidayDaysMax}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 w-24 flex-shrink-0">
                  {t("advancedSearch.weeklyTotalHours")}:
                </label>
                <input
                  type="number"
                  name="weeklyTotalHoursMin"
                  placeholder="最小"
                  value={advancedSearchCriteria.weeklyTotalHoursMin}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="number"
                  name="weeklyTotalHoursMax"
                  placeholder="最大"
                  value={advancedSearchCriteria.weeklyTotalHoursMax}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 w-24 flex-shrink-0">
                  {t("advancedSearch.feeAmount")}:
                </label>
                <input
                  type="number"
                  name="feeAmountMin"
                  placeholder={t("advancedSearch.min")}
                  value={advancedSearchCriteria.feeAmountMin}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="number"
                  name="feeAmountMax"
                  placeholder={t("advancedSearch.max")}
                  value={advancedSearchCriteria.feeAmountMax}
                  onChange={handleAdvancedSearchChange}
                  className="w-1/2 p-2 border rounded dark:bg-neutral-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 搜索结果显示 */}
      {submissions.length === 0 && !loading && !error && (
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-400">
          {t("noSubmissions")}
        </p>
      )}
      {submissions.length === 0 &&
      !loading &&
      !error &&
      Object.keys(activeSearchParams).length > 0 ? (
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-400">
          {t("noMatchingResults")}
        </p>
      ) : loading ? (
        <div className="flex justify-center items-center space-x-2">
          <svg
            className="animate-spin h-6 w-6 text-neutral-500 dark:text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8-7a7 7 0 0 0-7 7h2a5 5 0 1 1 10 0h2a7 7 0 0 0-7-7z"
            ></path>
          </svg>
          <span className="text-neutral-500 dark:text-neutral-400">
            {t("loading")}
          </span>
        </div>
      ) : error ? (
        <p className="text-center text-lg text-red-500 dark:text-red-400">
          {t("loadingError")}
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => handleCardClick(submission)}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-700">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                      <FaCalendarAlt className="mr-2 text-base" />{" "}
                      {t("submittedAt")}:{" "}
                      {new Date(submission.createdAt).toLocaleString("zh-CN", {
                        hour12: false,
                      })}
                    </p>
                    <span
                      className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full w-fit ${
                        submission.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          : submission.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      }`}
                    >
                      {submission.status === "pending" && (
                        <span className="flex items-center">
                          <FaInfoCircle className="mr-1" /> {t("pending")}
                        </span>
                      )}
                      {submission.status === "approved" && (
                        <span className="flex items-center">
                          <FaCheckCircle className="mr-1" /> {t("approved")}
                        </span>
                      )}
                      {submission.status !== "pending" &&
                        submission.status !== "approved" && (
                          <span className="flex items-center">
                            <FaTimesCircle className="mr-1" />{" "}
                            {submission.status}
                          </span>
                        )}
                    </span>
                  </div>

                  {/* 主要信息区 - 使用 Grid 布局实现横向排列 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {/* 地区信息 - 应用高亮函数 */}
                    <div>
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-base text-blue-500" />
                        <strong>{t("province")}:</strong>{" "}
                        {highlightMatch(submission.province || "", searchTerm)}
                      </p>
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-base text-blue-500" />
                        <strong>{t("city")}:</strong>{" "}
                        {highlightMatch(submission.city || "", searchTerm)}
                      </p>
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-base text-blue-500" />
                        <strong>{t("district")}:</strong>{" "}
                        {highlightMatch(submission.district || "", searchTerm)}
                      </p>
                    </div>

                    {/* 学校信息 - 应用高亮函数 */}
                    <div>
                      <p className="flex items-center">
                        <FaSchool className="mr-2 text-base text-green-500" />
                        <strong>{t("schoolName")}:</strong>{" "}
                        {highlightMatch(
                          submission.schoolName || "",
                          searchTerm
                        )}
                      </p>
                      <p className="flex items-center">
                        <FaGraduationCap className="mr-2 text-base text-purple-500" />
                        <strong>{t("grade")}:</strong>{" "}
                        {highlightMatch(submission.grade || "", searchTerm)}
                      </p>
                      <p className="flex items-center">
                        <FaQuestionCircle className="mr-2 text-base text-yellow-500" />
                        <strong>{t("isRemedial")}:</strong>{" "}
                        {submission.isRemedial ? "是" : "否"}
                      </p>
                    </div>

                    {/* 补习信息 */}
                    <div>
                      <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-base text-indigo-500" />
                        <strong>{t("startDate")}:</strong>{" "}
                        {formatDate(submission.remedialStartDate)}
                      </p>
                      <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-base text-indigo-500" />
                        <strong>{t("endDate")}:</strong>{" "}
                        {formatDate(submission.remedialEndDate)}
                      </p>
                    </div>

                    {/* 补习天数 */}
                    <div>
                      <p className="flex items-center">
                        <FaSun className="mr-2 text-base text-orange-500" />
                        <strong>{t("weeklyClassDays")}:</strong>{" "}
                        {submission.weeklyClassDays !== null
                          ? `${submission.weeklyClassDays} ${t("days")}`
                          : t("notAvailable")}
                      </p>
                      <p className="flex items-center">
                        <FaMoon className="mr-2 text-base text-gray-500" />
                        <strong>{t("monthlyHolidayDays")}:</strong>{" "}
                        {submission.monthlyHolidayDays !== null
                          ? `${submission.monthlyHolidayDays} ${t("days")}`
                          : t("notAvailable")}
                      </p>
                      <p className="flex items-center">
                        <FaHourglass className="mr-2 text-base text-blue-500" />
                        <strong>{t("weeklyTotalHours")}:</strong>{" "}
                        {submission.weeklyTotalHours !== null
                          ? `${submission.weeklyTotalHours}小时`
                          : "未填写"}
                      </p>
                    </div>

                    {/* 费用信息 */}
                    <div>
                      <p className="flex items-center">
                        <FaDollarSign className="mr-2 text-base text-teal-500" />
                        <strong>{t("feeRequired")}:</strong>{" "}
                        {submission.feeRequired ? t("yes") : t("no")}
                      </p>
                      <p className="flex items-center">
                        <FaMoneyBillWave className="mr-2 text-base text-teal-500" />
                        <strong>{t("feeAmount")}:</strong>{" "}
                        {submission.feeRequired
                          ? `¥${
                              submission.feeAmount !== null
                                ? submission.feeAmount
                                : "0"
                            }`
                          : t("notAvailable")}
                      </p>
                    </div>

                    {/* 知情同意书 */}
                    <div className="lg:col-span-1">
                      <p className="flex items-center">
                        <FaFileAlt className="mr-2 text-base text-pink-500" />
                        <strong>{t("consentForm")}:</strong>{" "}
                        {highlightMatch(
                          truncateText(submission.consentForm || "", 15),
                          searchTerm
                        )}
                      </p>
                    </div>

                    {/* 学校违纪与爆料 */}
                    <div>
                      <p className="flex items-center">
                        <FaExclamationTriangle className="mr-2 text-base text-red-500" />
                        <strong>{t("schoolViolations")}:</strong>{" "}
                        {highlightMatch(
                          truncateText(
                            submission.schoolViolations &&
                              submission.schoolViolations.length > 0
                              ? submission.schoolViolations.join(", ")
                              : "未填写",
                            15
                          ),
                          searchTerm
                        )}
                      </p>
                    </div>

                    {/* 其他事件 */}
                    <div>
                      <p className="flex items-center">
                        <FaInfoCircle className="mr-2 text-base text-gray-500" />
                        <strong>{t("otherViolations")}:</strong>{" "}
                        {highlightMatch(
                          truncateText(submission.otherViolations || "", 15),
                          searchTerm
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 分页控制按钮 */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {t("previousPage")}
            </button>
            <span className="text-neutral-700 dark:text-neutral-300">
              {t("page")} {currentPage} {t("of")} {totalPages} ({t("total")}{" "}
              {totalCount} {t("items")})
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {t("nextPage")}
            </button>
            {/* 页面跳转输入框 (可选) */}
            {/* <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              className="ml-4 w-20 p-2 border border-gray-300 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            /> */}
          </div>
        </>
      )}

      {showDetailPanel && selectedSubmission && (
        <SubmissionDetailPanel
          submission={selectedSubmission}
          onClose={handleCloseDetailPanel}
        />
      )}
      <Toaster />
    </div>
  );
}
