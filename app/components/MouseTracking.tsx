// 鼠标移动轨迹检查
"use client"

import { useEffect, useState } from "react";

const MouseTracking = () => {
  const [mouseData, setMouseData] = useState<{ x: number; y: number }[]>([]);

  // 捕获鼠标移动事件
  const handleMouseMove = (event: MouseEvent) => {
    setMouseData((prevData) => [
      ...prevData,
      { x: event.clientX, y: event.clientY },
    ]);
  };

  // 捕获点击事件
  const handleMouseClick = (event: MouseEvent) => {
    console.log("Mouse clicked at:", event.clientX, event.clientY);
    // 可选：发送点击位置到后端
    sendMouseDataToServer({ x: event.clientX, y: event.clientY });
  };

  // 发送鼠标数据到服务器
  const sendMouseDataToServer = async (data: { x: number; y: number }) => {
    try {
      await fetch("/api/mouse-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error sending mouse data to server:", error);
    }
  };

  useEffect(() => {
    // 添加鼠标移动事件监听
    window.addEventListener("mousemove", handleMouseMove);

    // 添加鼠标点击事件监听
    window.addEventListener("click", handleMouseClick);

    // 清理事件监听器
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return <div>Tracking mouse movements and clicks...</div>;
};

export default MouseTracking;
