"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, UserCircle2 } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <div className="h-16 bg-white shadow-sm border-b">
      <div className="flex h-full items-center justify-between px-4">
        {/* 左侧标题 */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">后台管理系统</h1>
        </div>

        {/* 右侧用户信息 + 退出按钮 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-700">
            <UserCircle2 className="w-5 h-5 text-gray-500" />
            <span>欢迎，{session?.user?.name ?? "访客"}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/review-611/login" })}
            className="flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            退出
          </button>
        </div>
      </div>
    </div>
  );
}
