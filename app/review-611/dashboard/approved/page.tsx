"use client";

import { useEffect, useState } from "react";
import { SchoolSurvey } from "@/app/types/survey";
import DetailModal from "@/app/components/DetailModal";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ApprovedPage() {
  const [surveys, setSurveys] = useState<SchoolSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SchoolSurvey | null>(
    null
  );
  const [reviewComment, setReviewComment] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [gotoPage, setGotoPage] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/surveys?status=approved&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("获取数据失败");
        const result = await response.json();
        setSurveys(result.data);
        setTotal(result.total);
      } catch (err) {
        console.error("Error fetching surveys:", err);
        setError("获取数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [page]);

  const handleReview = (survey: SchoolSurvey) => {
    setSelectedSurvey(survey);
    setShowReviewModal(true);
  };

  const handleReReview = async () => {
    if (!selectedSurvey) return;
    try {
      const response = await fetch("/api/surveys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: selectedSurvey.id,
          status: "pending",
          comment: reviewComment,
        }),
      });

      if (!response.ok) throw new Error("操作失败");
      toast.success("审核操作成功！");
      setSurveys((prev) =>
        prev.filter((survey) => survey.id !== selectedSurvey.id)
      );
      setShowReviewModal(false);
      setReviewComment("");
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">审核通过列表</h1>

      {loading ? (
        <div className="text-center text-lg">加载中...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    学校名称
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    省份
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    城市
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    区县
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    年级
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    上学时间
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    放学时间
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    每周学习时间
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    每月放假天数
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    24年自杀人数
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    学生评论
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    安全词
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    通过原因
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    审核时间
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    审核人
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {surveys.map((survey) => (
                  <tr
                    key={survey.id}
                    className="transition-colors duration-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {survey.schoolName}
                    </td>
                    <td className="px-4 py-3">{survey.province}</td>
                    <td className="px-4 py-3">{survey.city}</td>
                    <td className="px-4 py-3">{survey.district}</td>
                    <td className="px-4 py-3">{survey.grade}</td>
                    <td className="px-4 py-3">{survey.schoolStartTime}</td>
                    <td className="px-4 py-3">{survey.schoolEndTime}</td>
                    <td className="px-4 py-3">{survey.weeklyStudyHours}</td>
                    <td className="px-4 py-3">{survey.monthlyHolidays}</td>
                    <td className="px-4 py-3">{survey.suicideCases}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {survey.studentComments}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {survey.safetyKeyword}
                    </td>
                    <td className="px-4 py-3">{survey.reviewComment}</td>
                    <td className="px-4 py-3">
                      {/* {format(
                        new Date(survey.updatedAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )} */}
                      {new Date(survey.updatedAt).toLocaleString("zh-CN", {
                        timeZone: "Asia/Shanghai",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">{survey.approvedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(survey)}
                          className="rounded-md bg-gray-500 px-3 py-1 text-white hover:bg-gray-600 transition-colors"
                        >
                          查看详情
                        </button>
                        <button
                          onClick={() => handleReview(survey)}
                          className="rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 transition-colors"
                        >
                          重新审核
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页器 */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>

            <span className="text-gray-600">
              第 <strong>{page}</strong> 页 / 共 <strong>{totalPages}</strong>{" "}
              页
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
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
        </>
      )}

      {/* 重新审核模态框 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">重新审核</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                审核备注
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={4}
                placeholder="请输入审核备注（可选）"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewComment("");
                }}
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleReReview}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      {/* <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
      /> */}

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        survey={selectedSurvey}
        type="approved"
        onReview={(survey) => handleReview(survey)}
      />
    </div>
  );
}
