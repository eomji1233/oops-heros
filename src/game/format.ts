/** 쉼표가 들어간 정수 표기 (12,345) */
export function formatNumber(value: number): string {
  return Math.floor(value).toLocaleString("ko-KR");
}

/** 좁은 곳에 쓰는 짧은 표기: 12,345 / 12.3만 / 1.2억 */
export function formatCompact(value: number): string {
  const v = Math.floor(value);
  if (v >= 1e8) return `${trim(v / 1e8)}억`;
  if (v >= 1e5) return `${trim(v / 1e4)}만`;
  return v.toLocaleString("ko-KR");
}

function trim(n: number): string {
  return n >= 100 ? Math.floor(n).toString() : n.toFixed(1).replace(/\.0$/, "");
}

/** 소수 한 자리까지 (공격력 12.4) */
export function formatStat(value: number): string {
  return value >= 100 ? formatNumber(value) : value.toFixed(1).replace(/\.0$/, "");
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/** 초를 "3시간 20분" 처럼 읽기 쉽게 */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  if (m > 0) return `${m}분`;
  return `${seconds}초`;
}
