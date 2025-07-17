// 接收用户鼠标移动轨迹

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { x, y } = req.body;
      console.log("Mouse tracking data:", { x, y });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing mouse tracking data:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    // 处理不支持的请求方法
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
