"use client";

import { useEffect, useState } from "react";
import { SummerSubmission } from "@/app/types/survey";
import { toast } from "sonner";
import SummerSubmissionDetailModal from "@/app/components/SummerSubmissionDetailModal";
import SummerSubmissionEditModal from "@/app/components/SummerSubmissionEditModal";

const PAGE_SIZE = 10;

export default function SummerPendingPage() {
  const [submissions, setSubmissions] = useState<SummerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SummerSubmission | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [gotoPage, setGotoPage] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/summer-submissions?status=pending&page=${page}&pageSize=${PAGE_SIZE}`
      );
      if (!response.ok) throw new Error(`获取数据失败: ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data.data)) {
        setSubmissions(data.data);
        setTotalCount(data.total ?? 0);
      } else {
        console.error("Error: Received non-array data:", data);
        setError("接收到的数据格式不正确");
      }
    } catch (err) {
      const error = err as Error;
      setError(`获取数据失败，请稍后重试: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  const handleReview = (submission: SummerSubmission) => {
    setSelectedSubmission(submission);
    setShowReviewModal(true);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch("/api/summer-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          status: "approved",
          comment: reviewComment,
        }),
      });
      if (!response.ok) throw new Error(`操作失败: ${response.status}`);
      toast.success("审核操作成功！");
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== selectedSubmission.id)
      );
      setShowReviewModal(false);
      setReviewComment("");
    } catch (err) {
      toast.error("审核操作失败！");
      const error = err as Error;
      setError(`操作失败，请稍后重试: ${error.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch("/api/summer-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          status: "rejected",
          comment: reviewComment,
        }),
      });
      if (!response.ok) throw new Error(`操作失败: ${response.status}`);
      toast.success("审核操作成功！");
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== selectedSubmission.id)
      );
      setShowReviewModal(false);
      setReviewComment("");
    } catch (err) {
      toast.error("审核操作失败！");
      const error = err as Error;
      setError(`操作失败，请稍后重试: ${error.message}`);
    }
  };

  const handleViewDetail = (submission: SummerSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleEdit = (submission: SummerSubmission) => {
    setSelectedSubmission(submission);
    setShowEditModal(true);
  };

  const handleGotoPage = () => {
    const pageNum = parseInt(gotoPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
      setGotoPage("");
    }
  };

  const handleGotoPageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGotoPage();
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchSubmissions}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">暑期问卷待定审核</h1>
        <div className="text-sm text-gray-600">
          共 {totalCount} 条记录，第 {page} / {totalPages} 页
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">暂无待审核的暑期问卷</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交时间
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学校信息
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年级
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    补课日期
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    每周天数
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    费用金额
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    知情同意书
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学校违纪
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    其他事件
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    安全词
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {new Date(submission.createdAt).toLocaleDateString(
                        "zh-CN"
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">
                          {submission.schoolName || "未填写"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {[
                            submission.province,
                            submission.city,
                            submission.district,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {submission.grade || "未填写"}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      <div className="text-xs">
                        {submission.remedialStartDate && (
                          <div>
                            开始:{" "}
                            {new Date(
                              submission.remedialStartDate
                            ).toLocaleDateString("zh-CN")}
                          </div>
                        )}
                        {submission.remedialEndDate && (
                          <div>
                            结束:{" "}
                            {new Date(
                              submission.remedialEndDate
                            ).toLocaleDateString("zh-CN")}
                          </div>
                        )}
                        {!submission.remedialStartDate &&
                          !submission.remedialEndDate &&
                          "未填写"}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      {submission.weeklyClassDays || "未填写"}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs mr-2 ${
                            submission.feeRequired === true
                              ? "bg-red-100 text-red-800"
                              : submission.feeRequired === false
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {submission.feeRequired === true
                            ? "收费"
                            : submission.feeRequired === false
                            ? "免费"
                            : "未知"}
                        </span>
                        {submission.feeAmount && (
                          <span className="text-xs text-gray-600">
                            ¥{submission.feeAmount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 max-w-[120px]">
                      <div
                        className="truncate"
                        title={submission.consentForm || "未填写"}
                      >
                        {submission.consentForm
                          ? submission.consentForm.length > 20
                            ? submission.consentForm.substring(0, 20) + "..."
                            : submission.consentForm
                          : "未填写"}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 max-w-[120px]">
                      <div
                        className="truncate"
                        title={
                          submission.schoolViolations?.join(", ") || "未填写"
                        }
                      >
                        {submission.schoolViolations &&
                        submission.schoolViolations.length > 0
                          ? submission.schoolViolations.join(", ").length > 20
                            ? submission.schoolViolations
                                .join(", ")
                                .substring(0, 20) + "..."
                            : submission.schoolViolations.join(", ")
                          : "未填写"}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 max-w-[120px]">
                      <div
                        className="truncate"
                        title={submission.otherViolations || "未填写"}
                      >
                        {submission.otherViolations
                          ? submission.otherViolations.length > 20
                            ? submission.otherViolations.substring(0, 20) +
                              "..."
                            : submission.otherViolations
                          : "未填写"}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 max-w-[100px] truncate">
                      {submission.safetyWord || "未填写"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewDetail(submission)}
                          className="rounded-md bg-gray-500 px-3 py-1 text-white text-sm hover:bg-gray-600 transition-colors"
                        >
                          查看详情
                        </button>
                        <button
                          onClick={() => handleReview(submission)}
                          className="rounded-md bg-blue-500 px-3 py-1 text-white text-sm hover:bg-blue-600 transition-colors"
                        >
                          审核
                        </button>
                        <button
                          onClick={() => handleEdit(submission)}
                          className="rounded-md bg-yellow-500 px-3 py-1 text-white text-sm hover:bg-yellow-600 transition-colors"
                        >
                          编辑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              首页
            </button>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              上一页
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">第</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium min-w-[2rem] text-center">
              {page}
            </span>
            <span className="text-sm text-gray-600">/ {totalPages} 页</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              下一页
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              末页
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">跳转到</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={gotoPage}
              onChange={(e) => setGotoPage(e.target.value)}
              onKeyDown={handleGotoPageKeyDown}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="页码"
            />
            <span className="text-sm text-gray-600">页</span>
            <button
              onClick={handleGotoPage}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              跳转
            </button>
          </div>
        </div>
      )}

      {/* 审核模态框 */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0  bg-opacity-10 backdrop-blur-lg flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">审核暑期问卷</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                学校: {selectedSubmission.schoolName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                年级: {selectedSubmission.grade}
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                审核评论:
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="请输入审核评论..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleReject}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                拒绝
              </button>
              <button
                onClick={handleApprove}
                className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      <SummerSubmissionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        submission={selectedSubmission}
        type="pending"
        onReview={handleReview}
      />

      {/* 编辑模态框 */}
      <SummerSubmissionEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        submission={selectedSubmission}
        onSave={fetchSubmissions}
      />
    </div>
  );
}
