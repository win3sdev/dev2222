"use client";

import { useState, useEffect } from "react";
import { SummerSubmission } from "@/app/types/survey";
import { toast } from "sonner";
import {
  X,
  School,
  MapPin,
  Landmark,
  Calendar,
  DollarSign,
  FileText,
  Shield,
} from "lucide-react";

interface SummerSubmissionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SummerSubmission | null;
  onSave: () => void;
}

export default function SummerSubmissionEditModal({
  isOpen,
  onClose,
  submission,
  onSave,
}: SummerSubmissionEditModalProps) {
  const [formData, setFormData] = useState<Partial<SummerSubmission>>({});

  useEffect(() => {
    if (submission) {
      setFormData({
        id: submission.id,
        province: submission.province || "",
        city: submission.city || "",
        district: submission.district || "",
        schoolName: submission.schoolName || "",
        grade: submission.grade || "",
        isRemedial: submission.isRemedial,
        remedialStartDate: submission.remedialStartDate,
        remedialEndDate: submission.remedialEndDate,
        weeklyClassDays: submission.weeklyClassDays,
        monthlyHolidayDays: submission.monthlyHolidayDays,
        consentForm: submission.consentForm || "",
        feeRequired: submission.feeRequired,
        feeAmount: submission.feeAmount,
        coolingMeasures: submission.coolingMeasures || "",
        schoolViolations: submission.schoolViolations || [],
        otherViolations: submission.otherViolations || "",
        safetyWord: submission.safetyWord || "",
      });
    }
  }, [submission]);

  const handleSave = async () => {
    if (!formData.id) return;

    try {
      const response = await fetch("/api/summer-submissions/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("保存失败");
      }

      toast.success("保存成功");
      onSave();
      onClose();
    } catch (error) {
      toast.error("保存失败，请稍后重试");
      console.error("Error saving submission:", error);
    }
  };

  const updateField = (field: keyof SummerSubmission, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (field: keyof SummerSubmission, value: string) => {
    updateField(field, value ? new Date(value) : null);
  };

  const handleViolationsChange = (value: string) => {
    const violations = value.split(",").map((v) => v.trim()).filter(Boolean);
    updateField("schoolViolations", violations);
  };

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">编辑暑期问卷</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                基本信息
              </h3>
              
              <Input
                label="省份"
                value={formData.province || ""}
                onChange={(value) => updateField("province", value)}
                icon={MapPin}
              />
              
              <Input
                label="城市"
                value={formData.city || ""}
                onChange={(value) => updateField("city", value)}
                icon={MapPin}
              />
              
              <Input
                label="区县"
                value={formData.district || ""}
                onChange={(value) => updateField("district", value)}
                icon={MapPin}
              />
              
              <Input
                label="学校名称"
                value={formData.schoolName || ""}
                onChange={(value) => updateField("schoolName", value)}
                icon={School}
              />
              
              <Input
                label="年级"
                value={formData.grade || ""}
                onChange={(value) => updateField("grade", value)}
                icon={Landmark}
              />
            </div>

            {/* 补课信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                补课信息
              </h3>
              
              <Select
                label="是否补课"
                value={formData.isRemedial === null ? "" : formData.isRemedial ? "true" : "false"}
                onChange={(value) => updateField("isRemedial", value === "" ? null : value === "true")}
                options={[
                  { value: "", label: "未填写" },
                  { value: "true", label: "是" },
                  { value: "false", label: "否" },
                ]}
              />
              
              <Input
                label="补课开始日期"
                type="date"
                value={formatDateForInput(formData.remedialStartDate || null)}
                onChange={(value) => handleDateChange("remedialStartDate", value)}
                icon={Calendar}
              />
              
              <Input
                label="补课结束日期"
                type="date"
                value={formatDateForInput(formData.remedialEndDate || null)}
                onChange={(value) => handleDateChange("remedialEndDate", value)}
                icon={Calendar}
              />
              
              <Input
                label="每周上课天数"
                type="number"
                value={formData.weeklyClassDays?.toString() || ""}
                onChange={(value) => updateField("weeklyClassDays", value ? parseFloat(value) : null)}
              />
              
              <Input
                label="每月休息天数"
                type="number"
                value={formData.monthlyHolidayDays?.toString() || ""}
                onChange={(value) => updateField("monthlyHolidayDays", value ? parseInt(value) : null)}
              />
            </div>

            {/* 费用信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                费用信息
              </h3>
              
              <Select
                label="是否收费"
                value={formData.feeRequired === null ? "" : formData.feeRequired ? "true" : "false"}
                onChange={(value) => updateField("feeRequired", value === "" ? null : value === "true")}
                options={[
                  { value: "", label: "未填写" },
                  { value: "true", label: "是" },
                  { value: "false", label: "否" },
                ]}
              />
              
              <Input
                label="费用金额"
                type="number"
                value={formData.feeAmount?.toString() || ""}
                onChange={(value) => updateField("feeAmount", value ? parseFloat(value) : null)}
                icon={DollarSign}
              />
            </div>

            {/* 其他信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                其他信息
              </h3>
              
              <Input
                label="安全词"
                value={formData.safetyWord || ""}
                onChange={(value) => updateField("safetyWord", value)}
                icon={Shield}
              />
            </div>

            {/* 详细描述 */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                详细描述
              </h3>
              
              <Textarea
                label="家长同意书"
                value={formData.consentForm || ""}
                onChange={(value) => updateField("consentForm", value)}
                icon={FileText}
              />
              
              <Textarea
                label="降温措施"
                value={formData.coolingMeasures || ""}
                onChange={(value) => updateField("coolingMeasures", value)}
                icon={FileText}
              />
              
              <Textarea
                label="学校违规行为 (用逗号分隔)"
                value={formData.schoolViolations?.join(", ") || ""}
                onChange={handleViolationsChange}
                icon={FileText}
              />
              
              <Textarea
                label="其他违规行为"
                value={formData.otherViolations || ""}
                onChange={(value) => updateField("otherViolations", value)}
                icon={FileText}
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 输入框组件
function Input({
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}

// 选择框组件
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// 文本域组件
function Textarea({
  label,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />} {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}
