type MousePoint = {
  x: number;
  y: number;
  time: number;
};

export function isSuspiciousMouseTrack(track: MousePoint[], ua: string): boolean {
  if (!track || track.length < 10) return true; // 太短的行为轨迹可能是脚本

  const suspiciousUA = ["python", "curl", "bot", "scrapy"];
  if (suspiciousUA.some(s => ua.toLowerCase().includes(s))) return true;

  const deltas: number[] = [];
  for (let i = 1; i < track.length; i++) {
    const dx = track[i].x - track[i - 1].x;
    const dy = track[i].y - track[i - 1].y;
    const dt = track[i].time - track[i - 1].time;

    deltas.push(Math.abs(dx) + Math.abs(dy));

    if (dt > 1000) return true; // 操作不连续
  }

  const avgMove = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return avgMove < 1; // 基本不动的行为也可疑
}
