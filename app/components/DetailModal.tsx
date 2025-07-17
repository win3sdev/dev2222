import React from "react";
import {
  School,
  MapPin,
  Landmark,
  Clock,
  Calendar,
  MessageCircle,
  ShieldAlert,
  UserCheck,
  X,
} from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: any;
  type?: "pending" | "approved" | "rejected";
  onReview?: (survey: any) => void; // 点击按钮触发的函数
}

const Info = ({
  label,
  value,
  icon: Icon,
  multiline = false,
  valueClass = "",
}: {
  label: string;
  value?: string | number;
  icon?: React.ElementType;
  multiline?: boolean;
  valueClass?: string;
}) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="mt-1 h-5 w-5 text-gray-400" />}
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`mt-1 break-words text-sm font-medium text-gray-800 ${valueClass}`}
      >
        {value || "--"}
      </div>
    </div>
  </div>
);

export default function DetailModal({
  isOpen,
  onClose,
  survey,
  type,
  onReview,
}: {
  isOpen: boolean;
  onClose: () => void;
  survey: any;
  type: "pending" | "approved" | "rejected";
  onReview?: (survey: any) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
        {/* 顶部标题与关闭按钮 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">详细内容</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <Info label="学校名称" value={survey?.schoolName} icon={School} />
            <Info label="省份" value={survey?.province} icon={MapPin} />
            <Info label="城市" value={survey?.city} icon={MapPin} />
            <Info label="区县" value={survey?.district} icon={MapPin} />
            <Info label="年级" value={survey?.grade} icon={Landmark} />
            <Info
              label="上学时间"
              value={survey?.schoolStartTime}
              icon={Clock}
            />
            <Info label="放学时间" value={survey?.schoolEndTime} icon={Clock} />
          </div>

          <div className="space-y-4">
            <Info
              label="每周学习时间"
              value={survey?.weeklyStudyHours}
              icon={Clock}
            />
            <Info
              label="每月放假天数"
              value={survey?.monthlyHolidays}
              icon={Calendar}
            />
            <Info
              label="24年自杀人数"
              value={survey?.suicideCases}
              icon={ShieldAlert}
            />
            <Info
              label="学生评论"
              value={survey?.studentComments}
              icon={MessageCircle}
              multiline
            />
            <Info
              label="提交时间"
              value={survey?.updatedAt
                ?.replace("T", " ")
                .replace("Z", "")
                .slice(0, 22)}
              icon={Calendar}
            />
            {type !== "pending" && (
              <>
                <Info
                  label="审核状态"
                  value={type === "approved" ? "已通过" : "已拒绝"}
                  icon={UserCheck}
                  valueClass={
                    type === "approved" ? "text-green-600" : "text-red-600"
                  }
                />
                <Info
                  label="审核人"
                  value={survey?.approvedBy}
                  icon={UserCheck}
                />
                <Info
                  label="审核意见"
                  value={survey?.reviewComment}
                  icon={MessageCircle}
                  multiline
                />
              </>
            )}
          </div>
        </div>

        {/* 审核按钮 */}
        {onReview && (
          <div className="mt-8 text-right">
            <button
              onClick={() => onReview(survey)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              {type === "pending" ? "审核" : "重新审核"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
