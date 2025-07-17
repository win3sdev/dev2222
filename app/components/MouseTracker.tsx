import { useEffect, useRef } from "react";

export default function MouseTracker({ onTrackEnd }: { onTrackEnd: (track: any[]) => void }) {
  const track = useRef<{ x: number; y: number; time: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      track.current.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    const interval = setInterval(() => {
      if (track.current.length > 500) {
        track.current.shift(); // 限制记录数量
      }
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
      onTrackEnd(track.current);
    };
  }, [onTrackEnd]);

  return null; // 组件不渲染任何内容
}
