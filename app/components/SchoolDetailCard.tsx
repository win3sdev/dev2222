"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  MapPin,
  GraduationCap,
  Clock,
  BarChart2,
  MessageCircle,
} from "lucide-react";

interface SchoolDetailCardProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    province: string;
    city: string;
    district: string;
    schoolName: string;
    grade: string;
    schoolStartTime: string;
    schoolEndTime: string;
    weeklyStudyHours: number;
    monthlyHolidays: number;
    suicideCases: number;
    studentComments: string;
  };
}

export function SchoolDetailCard({
  isOpen,
  onClose,
  data,
}: SchoolDetailCardProps) {
  const t = useTranslations("display");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-xl shadow-xl ">
        {/* <DialogClose className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
          <X className="h-5 w-5" />
        </DialogClose> */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {data.schoolName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* 地区 & 年级 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                <MapPin className="w-4 h-4" />
                {t("location")}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {data.province} {data.city} {data.district}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                <GraduationCap className="w-4 h-4" />
                {t("grade")}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {data.grade}
              </div>
            </div>
          </div>

          {/* 上课时间 */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-2">
            <div className="flex items-center gap-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              <Clock className="w-4 h-4" />
              {t("schoolSchedule")}
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t("schoolStartTime")}: {data.schoolStartTime}
              <br />
              {t("schoolEndTime")}: {data.schoolEndTime}
              <br />
              {t("weeklyStudyHours")}: {data.weeklyStudyHours}
            </div>
          </div>

          {/* 统计数据 */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-2">
            <div className="flex items-center gap-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              <BarChart2 className="w-4 h-4" />
              {t("statistics")}
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t("monthlyHolidays")}: {data.monthlyHolidays}
              <br />
              {t("suicideCases")}: {data.suicideCases}
            </div>
          </div>

          {/* 学生留言 */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-2">
            <div className="flex items-center gap-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              <MessageCircle className="w-4 h-4" />
              {t("studentComments")}
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
              {data.studentComments}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
