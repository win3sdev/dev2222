"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Inbox, CheckCircle2, XCircle, Users, Clock, FileText } from "lucide-react";

interface MenuItem {
  name: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: MenuSection[] = [
    {
      title: "内容审核",
      items: [
        {
          name: "pending",
          label: "待处理",
          href: "/review-611/dashboard/pending",
          icon: <Inbox className="h-4 w-4" />,
        },
        {
          name: "approved",
          label: "已通过",
          href: "/review-611/dashboard/approved",
          icon: <CheckCircle2 className="h-4 w-4" />,
        },
        {
          name: "rejected",
          label: "已拒绝",
          href: "/review-611/dashboard/rejected",
          icon: <XCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "暑期问卷审核",
      items: [
        {
          name: "summer-pending",
          label: "待定",
          href: "/review-611/dashboard/summer-submissions/pending",
          icon: <Clock className="h-4 w-4" />,
        },
        {
          name: "summer-approved",
          label: "通过",
          href: "/review-611/dashboard/summer-submissions/approved",
          icon: <CheckCircle2 className="h-4 w-4" />,
        },
        {
          name: "summer-rejected",
          label: "拒绝",
          href: "/review-611/dashboard/summer-submissions/rejected",
          icon: <XCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "设置管理",
      items: [
        {
          name: "users",
          label: "用户管理",
          href: "/review-611/dashboard/users",
          icon: <Users className="h-4 w-4" />,
          adminOnly: true,
        },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div
      className="flex h-full w-64 flex-col bg-gray-900 text-white shadow-xl transition-opacity duration-300"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* 站点名称区域 */}
      <div
        className="flex h-16 items-center justify-center border-b border-gray-800 bg-gray-950 px-4 cursor-pointer hover:bg-gray-900"
        onClick={() => router.push("/review-611/dashboard")}
      >
        <h1 className="text-lg font-bold tracking-wide">人工审核系统</h1>
      </div>

      {/* 用户信息 */}
      <div className="flex items-center space-x-3 border-b border-gray-800 p-4">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {session?.user?.name?.[0] || "U"}
          </span>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <p className="text-xs text-gray-400">
            {session?.user?.role === "admin" ? "管理员" : "审核员"}
          </p>
        </div>
      </div>

      {/* 菜单区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {menuItems.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <span>{section.title}</span>
              <svg
                className={`h-4 w-4 transform transition-transform duration-300 ${
                  collapsedSections[section.title] ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {!collapsedSections[section.title] && (
              <div className="mt-2 ml-2 space-y-1">
                {section.items.map((item) => {
                  if (item.adminOnly && session?.user?.role !== "admin")
                    return null;
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
