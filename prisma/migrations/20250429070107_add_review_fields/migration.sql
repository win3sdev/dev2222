-- CreateTable
CREATE TABLE "SchoolSurvey" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "schoolStartTime" TEXT NOT NULL,
    "schoolEndTime" TEXT NOT NULL,
    "weeklyStudyHours" INTEGER NOT NULL,
    "monthlyHolidays" INTEGER NOT NULL,
    "suicideCases" INTEGER NOT NULL,
    "studentComments" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewComment" TEXT,

    CONSTRAINT "SchoolSurvey_pkey" PRIMARY KEY ("id")
);
