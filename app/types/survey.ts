export type SurveyStatus = "pending" | "approved" | "rejected";

export interface SchoolSurvey {
  id: number;
  createdAt: Date;
  updatedAt: Date;
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
  status: SurveyStatus;
  reviewComment: string | null;
  safetyKeyword: string | null;
  approvedBy: string | null;

}

export interface ReviewAction {
  surveyId: number;
  status: SurveyStatus;
  comment: string;
}

// 暑期问卷相关类型定义
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface SummerSubmission {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  province: string | null;
  city: string | null;
  district: string | null;
  schoolName: string | null;
  grade: string | null;
  isRemedial: boolean | null;
  remedialStartDate: Date | null;
  remedialEndDate: Date | null;
  weeklyClassDays: number | null;
  monthlyHolidayDays: number | null;
  consentForm: string | null;
  feeRequired: boolean | null;
  feeAmount: number | null;
  coolingMeasures: string | null;
  schoolViolations: string[];
  otherViolations: string | null;
  phq9Data: any[] | null;
  safetyWord: string | null;
  status: SubmissionStatus;
  ip: string | null;
  userAgent: string | null;
  approvedBy: string | null;
  reviewComment: string | null;
}

export interface SubmissionReviewAction {
  submissionId: string;
  status: SubmissionStatus;
  comment: string;
}
