"use client";

import {
  FaTimes, // For the close button
  FaInfoCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSchool,
  FaGraduationCap,
  FaLaptopHouse, // For remedial education
  FaDollarSign,
  FaFileAlt,
  FaRegLightbulb, // For cooling measures
  FaExclamationTriangle,
  FaQuestionCircle,
  FaUserShield, // For admin review
  FaCommentAlt,
  FaKey, // For safety word
  FaCheckCircle, // For approved status
  FaRegTimesCircle, // For other status
  FaMoneyBillWave,
  FaSun,
  FaMoon,
} from "react-icons/fa";

export default function SubmissionDetailPanel({ submission, onClose }) {
  if (!submission) return null;

  // 格式化 PHQ-9 数据
  const formatPhq9Data = (phq9Data) => {
    if (!phq9Data || phq9Data.length === 0) return "无PHQ-9数据";
    return (
      <ul className="list-disc list-inside space-y-1">
        {phq9Data.map((item, index) => (
          <li key={index}>
            <strong className="font-medium">{item.question}</strong>:{" "}
            {item.score || "未回答"}
          </li>
        ))}
      </ul>
    );
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return "未填写";
    const date = new Date(dateString);
    // 使用短日期格式，例如 2023/07/15
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 格式化违规行为
  const formatSchoolViolations = (violations) => {
    if (!violations || violations.length === 0) return "无";
    return violations.join(", ");
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-500 p-4 transition-opacity duration-300 overflow-auto">
      {/* 模态框内容 */}
      <div
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto p-6 relative
                 transform transition-transform duration-300 scale-95 sm:scale-100 sm:opacity-100
                 data-[state=open]:scale-100 data-[state=open]:opacity-100 z-60000"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2">
          问卷详情
        </h2>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-2xl font-bold p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="关闭"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {/* 基本信息 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white flex items-center">
              <FaInfoCircle className="mr-2 text-xl text-blue-500" />
              基本信息
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p className="flex items-center">
                <FaCalendarAlt className="mr-2 text-base text-gray-500" />
                <strong>提交时间:</strong>{" "}
                {new Date(submission.createdAt).toLocaleString("zh-CN", {
                  hour12: false,
                })}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-base text-purple-500" />
                <strong>省份:</strong> {submission.province}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-base text-purple-500" />
                <strong>城市:</strong> {submission.city}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-base text-purple-500" />
                <strong>区县:</strong> {submission.district}
              </p>
              <p className="flex items-center">
                <FaSchool className="mr-2 text-base text-green-500" />
                <strong>学校名称:</strong> {submission.schoolName}
              </p>
              <p className="flex items-center">
                <FaGraduationCap className="mr-2 text-base text-orange-500" />
                <strong>年级:</strong> {submission.grade}
              </p>
            </div>
          </div>

          {/* 补习信息 */}
          <div className="mt-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white flex items-center">
              <FaLaptopHouse className="mr-2 text-xl text-yellow-600" />
              补习情况
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p className="flex items-center">
                <FaQuestionCircle className="mr-2 text-base text-yellow-500" />
                <strong>是否参加补习:</strong>{" "}
                {submission.isRemedial ? "是" : "否"}
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="mr-2 text-base text-blue-500" />
                <strong>开始日期:</strong>{" "}
                {formatDate(submission.remedialStartDate)}
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="mr-2 text-base text-blue-500" />
                <strong>结束日期:</strong>{" "}
                {formatDate(submission.remedialEndDate)}
              </p>
              <p className="flex items-center">
                <FaSun className="mr-2 text-base text-orange-500" />
                <strong>每周上课天数:</strong>{" "}
                {submission.weeklyClassDays !== null
                  ? `${submission.weeklyClassDays}天`
                  : "未填写"}
              </p>
              <p className="flex items-center">
                <FaMoon className="mr-2 text-base text-gray-500" />
                <strong>每月请假天数:</strong>{" "}
                {submission.monthlyHolidayDays !== null
                  ? `${submission.monthlyHolidayDays}天`
                  : "未填写"}
              </p>
              <p className="flex items-center">
                <FaSun className="mr-2 text-base text-orange-500" />
                <strong>每周上课总课时数:</strong>{" "}
                {submission.weeklyTotalHours !== null
                  ? `${submission.weeklyTotalHours}小时`
                  : "未填写"}
              </p>
              <p className="sm:col-span-2 flex items-center">
                <FaFileAlt className="mr-2 text-base text-pink-500" />
                <strong>知情同意书:</strong> {submission.consentForm}
              </p>
            </div>
          </div>

          {/* 费用信息 */}
          <div className="mt-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white flex items-center">
              <FaDollarSign className="mr-2 text-xl text-green-500" />
              费用情况
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p className="flex items-center">
                <FaQuestionCircle className="mr-2 text-base text-gray-500" />
                <strong>是否涉及费用:</strong>{" "}
                {submission.feeRequired ? "是" : "否"}
              </p>
              <p className="flex items-center">
                <FaMoneyBillWave className="mr-2 text-base text-green-500" />
                <strong>费用金额:</strong>{" "}
                {submission.feeRequired
                  ? `¥${
                      submission.feeAmount !== null ? submission.feeAmount : "0"
                    }`
                  : "不适用"}
              </p>
            </div>
          </div>

          {/* 违规和冷却措施 */}
          <div className="mt-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white flex items-center">
              <FaExclamationTriangle className="mr-2 text-xl text-red-500" />
              违规和措施
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p className="sm:col-span-2 flex items-center">
                <FaRegLightbulb className="mr-2 text-base text-cyan-500" />
                <strong>冷却措施:</strong> {submission.coolingMeasures}
              </p>
              <p className="sm:col-span-2 flex items-center">
                <FaExclamationTriangle className="mr-2 text-base text-red-500" />
                <strong>学校违规行为:</strong>{" "}
                {formatSchoolViolations(submission.schoolViolations)}
              </p>
              <p className="sm:col-span-2 flex items-center">
                <FaInfoCircle className="mr-2 text-base text-gray-500" />
                <strong>其他违规说明:</strong>{" "}
                {submission.otherViolations || "无"}
              </p>
            </div>
          </div>

          {/* PHQ-9 数据 */}
          <div className="mt-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white flex items-center">
              <FaQuestionCircle className="mr-2 text-xl text-purple-500" />
              PHQ-9 量表
            </h3>
            {formatPhq9Data(submission.phq9Data)}
          </div>

          <div className="mt-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white flex items-center">
              <FaUserShield className="mr-2 text-xl text-indigo-500" />
              审核信息
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p className="flex items-center">
                <strong>状态:</strong>{" "}
                {submission.status === "approved" ? (
                  <span className="flex items-center ml-2 text-green-600">
                    <FaCheckCircle className="mr-1" /> 已审核
                  </span>
                ) : (
                  <span className="flex items-center ml-2 text-red-600">
                    <FaRegTimesCircle className="mr-1" /> {submission.status}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
