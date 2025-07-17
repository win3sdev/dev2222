"use client";
import { useState, useEffect } from "react";
import {
  X,
  Clock,
  Calendar,
  MapPin,
  Landmark,
  MessageCircle,
  School,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function EditModal({
  survey,
  onClose,
  onSave,
}: {
  survey: any;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({ ...survey });

  const update = (key: keyof typeof survey, val: string) => {
    setForm((prev: typeof survey) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        toast.error("保存失败，请稍后重试");
        return;
      }

      toast.success("保存成功");
      onSave();
      onClose();
    } catch (err) {
      toast.error("请求出错");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">编辑内容</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Input
            label="学校名称"
            value={form.schoolName}
            onChange={(v) => update("schoolName", v)}
            icon={School}
          />
          <Input
            label="省份"
            value={form.province}
            onChange={(v) => update("province", v)}
            icon={MapPin}
          />
          <Input
            label="城市"
            value={form.city}
            onChange={(v) => update("city", v)}
            icon={MapPin}
          />
          <Input
            label="区县"
            value={form.district}
            onChange={(v) => update("district", v)}
            icon={MapPin}
          />
          <Input
            label="年级"
            value={form.grade}
            onChange={(v) => update("grade", v)}
            icon={Landmark}
          />
          <Input
            label="上学时间"
            value={form.schoolStartTime}
            onChange={(v) => update("schoolStartTime", v)}
            icon={Clock}
          />
          <Input
            label="放学时间"
            value={form.schoolEndTime}
            onChange={(v) => update("schoolEndTime", v)}
            icon={Clock}
          />
          <Input
            label="每周学习时间"
            value={form.weeklyStudyHours}
            onChange={(v) => update("weeklyStudyHours", v)}
            icon={Clock}
          />
          <Input
            label="每月放假天数"
            value={form.monthlyHolidays}
            onChange={(v) => update("monthlyHolidays", v)}
            icon={Calendar}
          />
          <Input
            label="24年自杀人数"
            value={form.suicideCases}
            onChange={(v) => update("suicideCases", v)}
            icon={ShieldAlert}
          />
          <Textarea
            label="学生评论"
            value={form.studentComments}
            onChange={(v) => update("studentComments", v)}
            icon={MessageCircle}
          />
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleSave}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />} {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="md:col-span-2">
      <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />} {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full resize-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}
