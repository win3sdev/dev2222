"use client";

import { SummerSubmission } from "@/app/types/survey";
import {
  Calendar,
  MapPin,
  School,
  GraduationCap,
  Clock,
  DollarSign,
  FileText,
  Shield,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Users,
  MessageSquare,
  Info,
  X,
} from "lucide-react";

interface SummerSubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SummerSubmission | null;
  type: "pending" | "approved" | "rejected";
  onReview?: (submission: SummerSubmission) => void;
}

export default function SummerSubmissionDetailModal({
  isOpen,
  onClose,
  submission,
  type,
  onReview,
}: SummerSubmissionDetailModalProps) {
  if (!isOpen || !submission) return null;

  const formatDate = (date: Date | null) => {
    if (!date) return "未填写";
    return new Date(date).toLocaleDateString("zh-CN");
  };

  const formatBoolean = (value: boolean | null) => {
    if (value === null) return "未填写";
    return value ? "是" : "否";
  };

  const formatPhq9Data = (phq9Data: any[] | null) => {
    if (!phq9Data || phq9Data.length === 0) return "无PHQ-9数据";
    return (
      <ul className="list-disc list-inside space-y-1">
        {phq9Data.map((item, index) => (
          <li key={index}>
            <strong className="font-medium">{item.question || `问题${index + 1}`}</strong>:{" "}
            {item.score || "未回答"}
          </li>
        ))}
      </ul>
    );
  };

  const formatViolations = (violations: string[]) => {
    if (!violations || violations.length === 0) return "无";
    return violations.join(", ");
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">暑期问卷详情</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                <Info className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-700">基本信息</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">提交时间</span>
                    <p className="font-medium text-gray-800">{formatDate(submission.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">更新时间</span>
                    <p className="font-medium text-gray-800">{formatDate(submission.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">省份</span>
                    <p className="font-medium text-gray-800">{submission.province || "未填写"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">城市</span>
                    <p className="font-medium text-gray-800">{submission.city || "未填写"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">区县</span>
                    <p className="font-medium text-gray-800">{submission.district || "未填写"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">学校名称</span>
                    <p className="font-medium text-gray-800">{submission.schoolName || "未填写"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">年级</span>
                    <p className="font-medium text-gray-800">{submission.grade || "未填写"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 补课信息 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                <BookOpen className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-700">补课信息</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {submission.isRemedial === true ? (
                    <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  ) : submission.isRemedial === false ? (
                    <XCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-sm text-gray-500">是否补课</span>
                    <p className="font-medium text-gray-800">{formatBoolean(submission.isRemedial)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">补课开始日期</span>
                    <p className="font-medium text-gray-800">{formatDate(submission.remedialStartDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">补课结束日期</span>
                    <p className="font-medium text-gray-800">{formatDate(submission.remedialEndDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">每周上课天数</span>
                    <p className="font-medium text-gray-800">{submission.weeklyClassDays || "未填写"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">每月休息天数</span>
                    <p className="font-medium text-gray-800">{submission.monthlyHolidayDays || "未填写"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 费用信息 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-700">费用信息</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {submission.feeRequired === true ? (
                    <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  ) : submission.feeRequired === false ? (
                    <XCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-sm text-gray-500">是否收费</span>
                    <p className="font-medium text-gray-800">{formatBoolean(submission.feeRequired)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">费用金额</span>
                    <p className="font-medium text-gray-800">{submission.feeAmount ? `${submission.feeAmount}元` : "未填写"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 其他信息 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                <Shield className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-700">审核信息</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">安全词</span>
                    <p className="font-medium text-gray-800">{submission.safetyWord || "未填写"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {submission.status === "approved" ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : submission.status === "rejected" ? (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-sm text-gray-500">审核状态</span>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800">
                        {submission.status === "approved" ? "已通过" :
                         submission.status === "rejected" ? "已拒绝" : "待审核"}
                      </p>
                      <span className={`px-2 py-1 rounded text-xs ${
                        submission.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : submission.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {submission.status === "approved" ? "通过" :
                         submission.status === "rejected" ? "拒绝" : "待定"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-500">审核人</span>
                    <p className="font-medium text-gray-800">{submission.approvedBy || "未审核"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 详细描述 */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                <MessageSquare className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-700">详细描述</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-700">家长同意书</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {submission.consentForm || "未填写"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-gray-700">降温措施</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {submission.coolingMeasures || "未填写"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-gray-700">学校违规行为</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {formatViolations(submission.schoolViolations)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-gray-700">其他违规行为</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {submission.otherViolations || "未填写"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-gray-700">PHQ-9数据</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPhq9Data(submission.phq9Data)}
                  </div>
                </div>

                {submission.reviewComment && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-700">审核评论</span>
                    </div>
                    <p className="text-sm text-blue-600 leading-relaxed">
                      {submission.reviewComment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
            >
              <X className="h-4 w-4" />
              <span>关闭</span>
            </button>
            {type === "pending" && onReview && (
              <button
                onClick={() => onReview(submission)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              >
                <CheckCircle className="h-4 w-4" />
                <span>审核</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
