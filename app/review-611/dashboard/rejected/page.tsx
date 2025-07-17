"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SchoolSurvey } from "@/app/types/survey";
import DetailModal from "@/app/components/DetailModal";

export default function RejectedPage() {
  const [surveys, setSurveys] = useState<SchoolSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SchoolSurvey | null>(
    null
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [gotoPage, setGotoPage] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/surveys?status=rejected&page=${page}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("获取数据失败");
      }
      const data = await response.json();
      setSurveys(data.data);
      setTotalCount(data.total);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError("获取数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [page]);

  const handleReview = async (surveyId: number) => {
    try {
      const response = await fetch("/api/surveys", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId,
          status: "pending",
          comment: "",
        }),
      });

      if (!response.ok) {
        throw new Error("操作失败");
      }
      toast.success("审核操作成功！");

      setSurveys((prev) => {
        const updated = prev.filter((survey) => survey.id !== surveyId);
        if (updated.length === 0 && page > 1) {
          setPage((p) => p - 1);
        }
        return updated;
      });
    } catch (error) {
      toast.error("审核操作失败！");

      console.error("Error updating survey:", error);
      setError("操作失败，请稍后重试");
    }
  };

  const handleViewDetail = (survey: SchoolSurvey) => {
    setSelectedSurvey(survey);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">审核拒绝列表</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {[
                "学校名称",
                "省份",
                "城市",
                "区县",
                "年级",
                "上学时间",
                "放学时间",
                "每周学习时间",
                "每月放假天数",
                "24年自杀人数",
                "学生评论",
                "安全词",
                "拒绝原因",
                "审核时间",
                "审核人",
                "操作",
              ].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 text-left font-semibold tracking-wide"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {surveys.length === 0 ? (
              <tr>
                <td
                  colSpan={14}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              surveys.map((survey) => (
                <tr
                  key={survey.id}
                  className="transition-colors duration-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.schoolName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.province}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{survey.city}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.district}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.grade}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.schoolStartTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.schoolEndTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.weeklyStudyHours}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.monthlyHolidays}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {survey.suicideCases}
                  </td>

                  <td
                    className="px-4 py-3 max-w-[200px] truncate"
                    title={survey.studentComments}
                  >
                    {survey.studentComments}
                  </td>

                  <td
                    className="px-4 py-3 max-w-[200px] truncate"
                    // title={survey.safetyKeyword}
                  >
                    {survey.safetyKeyword}
                  </td>

                  <td
                    className="max-w-[180px] px-5 py-3 whitespace-nowrap overflow-hidden text-ellipsis"
                    // title={survey.reviewComment}
                  >
                    {survey.reviewComment}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3">
                    {/* {new Date(survey.updatedAt).toLocaleString()} */}
                    {new Date(survey.updatedAt).toLocaleString("zh-CN", {
                      timeZone: "Asia/Shanghai",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    {survey.approvedBy}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetail(survey)}
                        className="rounded-md bg-gray-500 px-3 py-1 text-white text-sm hover:bg-gray-600 transition-colors"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleReview(survey.id)}
                        className="rounded-md bg-blue-500 px-3 py-1 text-white text-sm hover:bg-blue-600 transition-colors"
                      >
                        重新审核
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <span className="text-gray-600">
          第 <strong>{page}</strong> 页 / 共{" "}
          <strong>{Math.ceil(totalCount / pageSize)}</strong> 页
        </span>
        <button
          disabled={page >= Math.ceil(totalCount / pageSize)}
          onClick={() => setPage((p) => p + 1)}
          className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>

        {/* 跳转页数 */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const pageNum = Number(gotoPage);
                if (pageNum >= 1 && pageNum <= totalPages) {
                  setPage(pageNum);
                  setGotoPage("");
                }
              }
            }}
            placeholder="页"
            className="w-16 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={() => {
              const pageNum = Number(gotoPage);
              if (pageNum >= 1 && pageNum <= totalPages) {
                setPage(pageNum);
                setGotoPage("");
              }
            }}
            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
          >
            跳转
          </button>
        </div>
      </div>

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
        type="rejected"
        onReview={(survey) => handleReview(survey.id)}
      />
    </div>
  );
}
