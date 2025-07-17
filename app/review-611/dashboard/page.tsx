"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Inbox, CheckCircle2 } from "lucide-react";
interface DashboardStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 获取待审核数量
      const pendingResponse = await fetch("/api/dashboard/status?status=pending");
      if (!pendingResponse.ok) throw new Error("获取待审核数据失败");
      const pendingData = await pendingResponse.json();

      // 获取已通过数量
      const approvedResponse = await fetch("/api/dashboard/status?status=approved");
      if (!approvedResponse.ok) throw new Error("获取已通过数据失败");
      const approvedData = await approvedResponse.json();

      // 获取已拒绝数量
      const rejectedResponse = await fetch("/api/dashboard/status?status=rejected");
      if (!rejectedResponse.ok) throw new Error("获取已拒绝数据失败");
      const rejectedData = await rejectedResponse.json();
      setStats({
        pendingCount: pendingData.data.length,
        approvedCount: approvedData.data.length,
        rejectedCount: rejectedData.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("获取数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mb-8">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          欢迎使用人工审核系统
        </h1>
        <p className="mt-2 text-gray-600">
          您当前的身份是:{" "}
          {session?.user?.role === "admin" ? "管理员" : "普通用户"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 待处理 */}
        <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-800">
                <Inbox className="h-5 w-5" />
                待处理
              </h2>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {stats.pendingCount}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Inbox className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/review-611/dashboard/pending")}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            查看详情 →
          </button>
        </div>

        {/* 已通过 */}
        <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                已通过
              </h2>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats.approvedCount}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/review-611/dashboard/approved")}
            className="mt-4 text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            查看详情 →
          </button>
        </div>

        {/* 已拒绝 */}
        <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-red-800">
                <XCircle className="h-5 w-5" />
                已拒绝
              </h2>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats.rejectedCount}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <button
            onClick={() => router.push("/review-611/dashboard/rejected")}
            className="mt-4 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            查看详情 →
          </button>
        </div>
      </div>
    </div>
  );
}
