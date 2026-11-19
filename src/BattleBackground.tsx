/*
 * 동화풍 판타지 숲 배경 (인라인 SVG + CSS)
 *
 * 깊이감을 위해 뒤에서 앞으로 겹쳐 쌓은 레이어 구조입니다.
 *   하늘 → 햇살/반짝임 → 무지개 → 구름/새 → 먼 산 + 성 → 가까운 언덕 + 오두막 → 풀밭(전투 공간) → 양옆 나무 → 떠다니는 빛
 * 캐릭터보다 눈에 띄지 않도록 채도를 낮춘 파스텔 색을 사용합니다.
 */

const LINE_FAR = "#b79d8e";
const LINE_TREE = "#5f9a4c";
const LINE_TRUNK = "#8a5a3c";

/* ---------- 결정적 난수 (렌더마다 같은 배치를 유지) ---------- */

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** 전투 공터(밝은 타원) 안쪽인지 검사 : 장식이 캐릭터 발밑을 어지럽히지 않도록 */
const inClearing = (x: number, y: number) => ((x - 195) / 196) ** 2 + ((y - 164) / 70) ** 2 < 1;

type Point = { x: number; y: number; v: number };

function scatter(seed: number, count: number, yMin: number, yMax: number): Point[] {
  const random = seeded(seed);
  const points: Point[] = [];
  while (points.length < count) {
    const x = 6 + random() * 378;
    const y = yMin + random() * (yMax - yMin);
    const v = random();
    if (!inClearing(x, y)) points.push({ x, y, v });
  }
  return points;
}

const GRASS_MARKS = scatter(11, 56, 60, 330);
const GRASS_TUFTS = scatter(23, 20, 70, 330);
const CLOVER_DOTS = scatter(37, 26, 70, 190);

/* ---------- 작은 재료 ---------- */

function Cloud({ className, x, y, scale = 1 }: { className: string; x: number; y: number; scale?: number }) {
  const d = "M8 34 C -2 34 -3 18 11 17 C 12 6 30 3 37 13 C 44 5 64 8 65 20 C 80 18 84 36 68 36 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={className}>
        <path d={d} transform="translate(0 4)" fill="#d3ebf3" />
        <path d={d} fill="#ffffff" />
        <path d="M18 22 C 22 17 30 15 36 18" fill="none" stroke="#e6f5fa" strokeWidth="3" strokeLinecap="round" />
        <path d="M46 20 C 52 16 60 17 63 22" fill="none" stroke="#e6f5fa" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Bird({ className, y }: { className: string; y: number }) {
  return (
    <g className={className} transform={`translate(0 ${y})`}>
      <g className="bg-bird__body">
        <path
          d="M0 0 Q 5 -6 10 0 Q 15 -6 20 0"
          fill="none"
          stroke="#8f7a8a"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

function Twinkle({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="bg-twinkle"
        style={{ animationDelay: `${delay}s` }}
        d="M0 -6 C 0.7 -2 2 -0.7 6 0 C 2 0.7 0.7 2 0 6 C -0.7 2 -2 0.7 -6 0 C -2 -0.7 -0.7 -2 0 -6 Z"
        fill="#fffbe0"
      />
    </g>
  );
}

function Tuft({ x, y, s = 1, tone = 0 }: { x: number; y: number; s?: number; tone?: 0 | 1 }) {
  const fill = tone === 0 ? "#8ccd66" : "#a6dc7c";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="1" cy="1" rx="9" ry="2.4" fill="rgba(60,110,40,0.22)" />
      <path
        d="M0 0 C -2 -7 -5 -11 -8 -13 C -3 -11 0 -8 1.5 -4 C 2 -9 5 -13 9 -14 C 6 -10 4.5 -6 4 0 Z"
        fill={fill}
        stroke="#6fb04f"
        strokeWidth="1.2"
      />
      <path d="M1.5 -3 C 1.5 -8 1 -12 0 -16 C 3 -12 4 -8 3.5 -3 Z" fill="#b6e68e" stroke="#6fb04f" strokeWidth="1" />
      <path d="M-4 -9 C -5 -10 -6 -11 -7 -12" fill="none" stroke="#d3f5ae" strokeWidth="1.2" />
    </g>
  );
}

function Mushroom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="1" cy="1" rx="9" ry="2.4" fill="rgba(60,110,40,0.25)" />
      <path d="M-3 0 C -3 -5 -2.5 -7 -2.5 -8 L 2.5 -8 C 2.5 -7 3 -5 3 0 Z" fill="#fff4e0" stroke="#b79579" strokeWidth="1.3" />
      <path d="M-9 -8 C -9 -17 9 -17 9 -8 C 5 -6.5 -5 -6.5 -9 -8 Z" fill="#ffa3b4" stroke="#c9707f" strokeWidth="1.4" />
      <path d="M2 -7 C 6 -7.5 8 -8 9 -8 C 5 -6.5 -1 -6.3 -2 -6.8Z" fill="#f08a9e" />
      <circle cx="-3.5" cy="-12" r="1.7" fill="#fff" />
      <circle cx="2.5" cy="-13.5" r="1.4" fill="#fff" />
      <circle cx="5" cy="-10" r="1.1" fill="#fff" />
    </g>
  );
}

type FlowerColor = "pink" | "white" | "yellow";

const FLOWER_COLORS: Record<FlowerColor, { petal: string; crease: string; edge: string; center: string }> = {
  pink: { petal: "#ffb7c9", crease: "#f48fab", edge: "#d98aa0", center: "#fff1a8" },
  white: { petal: "#ffffff", crease: "#e6dccb", edge: "#cdbfae", center: "#ffd36e" },
  yellow: { petal: "#ffe27a", crease: "#f2c24e", edge: "#d9a35a", center: "#ffb98a" },
};

function Flower({
  x,
  y,
  color,
  delay = 0,
  s = 1,
}: {
  x: number;
  y: number;
  color: FlowerColor;
  delay?: number;
  s?: number;
}) {
  const c = FLOWER_COLORS[color];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="1" cy="1" rx="7" ry="2" fill="rgba(60,110,40,0.28)" />
      <g className="bg-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C 0 -5 0 -9 0 -12" stroke="#5fa045" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M0 -5 C 5 -6 7.5 -9 6.5 -11.5 C 3 -11.5 0 -8 0 -5Z" fill="#9fdc7e" stroke="#5fa045" strokeWidth="1" />
        <path d="M0 -4 C -4 -5 -6 -7 -5.5 -9 C -3 -9 -0.5 -7 0 -4Z" fill="#8ccd66" stroke="#5fa045" strokeWidth="0.9" />
        <g transform="translate(0 -15)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <ellipse cx="0" cy="-4.6" rx="3.5" ry="4.4" fill={c.petal} stroke={c.edge} strokeWidth="0.9" />
              <path d="M0 -2.4 L0 -6.4" stroke={c.crease} strokeWidth="0.9" strokeLinecap="round" />
            </g>
          ))}
          <circle r="2.8" fill={c.center} stroke="#d9a35a" strokeWidth="0.9" />
          <circle cx="-0.8" cy="-0.9" r="0.9" fill="#fff" opacity="0.8" />
        </g>
      </g>
    </g>
  );
}

function RoundTree({ x, y, s = 1, tone = "#aee48e" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="3" cy="2" rx="16" ry="4" fill="rgba(60,110,40,0.22)" />
      <rect x="-3" y="-14" width="6" height="16" rx="2.5" fill="#c58f66" stroke={LINE_TRUNK} strokeWidth="1.6" />
      <rect x="0.5" y="-13" width="2.5" height="14" rx="1" fill="#a9724d" />
      <circle cx="0" cy="-26" r="15" fill={tone} stroke={LINE_TREE} strokeWidth="1.8" />
      <path d="M-4 -14 C 8 -12 15 -20 12 -31 C 15 -20 8 -9 -4 -14Z" fill="#8fd070" opacity="0.7" />
      <path d="M-13 -22 C -8 -14 2 -12 8 -14 C 0 -10 -10 -12 -13 -22Z" fill="#86c968" opacity="0.7" />
      <ellipse cx="-5" cy="-32" rx="5" ry="3" transform="rotate(-30 -5 -32)" fill="#fff" opacity="0.5" />
    </g>
  );
}

function FarTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.5" y="-6" width="3" height="7" fill="#c9ab94" />
      <circle cx="0" cy="-12" r="8" fill="#b4e0c6" stroke="#9fcfb4" strokeWidth="1.2" />
      <ellipse cx="-2.5" cy="-14.5" rx="3" ry="1.8" transform="rotate(-30 -2.5 -14.5)" fill="#fff" opacity="0.45" />
    </g>
  );
}

function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="1" rx="16" ry="3.4" fill="rgba(60,110,40,0.22)" />
      <circle cx="-8" cy="-5" r="7" fill="#a6dd88" stroke={LINE_TREE} strokeWidth="1.5" />
      <circle cx="7" cy="-5" r="7.5" fill="#a6dd88" stroke={LINE_TREE} strokeWidth="1.5" />
      <circle cx="0" cy="-9" r="8.5" fill="#b3e594" stroke={LINE_TREE} strokeWidth="1.5" />
      <ellipse cx="-3" cy="-12" rx="3.5" ry="2" transform="rotate(-25 -3 -12)" fill="#fff" opacity="0.5" />
      <circle cx="5" cy="-8" r="1.5" fill="#ffb7c9" />
      <circle cx="-7" cy="-4" r="1.4" fill="#ffb7c9" />
    </g>
  );
}

function Cottage({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="2" cy="1" rx="22" ry="4" fill="rgba(60,110,40,0.22)" />
      {/* 굴뚝 */}
      <rect x="8" y="-34" width="6" height="12" fill="#f3dccb" stroke="#b79d8e" strokeWidth="1.4" />
      {/* 벽 */}
      <rect x="-16" y="-18" width="32" height="18" rx="2" fill="#fff6ec" stroke="#b79d8e" strokeWidth="1.6" />
      <rect x="6" y="-18" width="10" height="18" fill="#f1dfd0" />
      {/* 지붕 */}
      <path d="M-21 -17 L0 -36 L21 -17 Z" fill="#ff9fb0" stroke="#c9707f" strokeWidth="1.6" />
      <path d="M0 -36 L21 -17 L10 -17 Z" fill="#f08a9e" />
      {/* 문과 창문 */}
      <path d="M-9 0 L-9 -8 A4.5 4.5 0 0 1 0 -8 L0 0 Z" fill="#c58f66" stroke="#8a5a3c" strokeWidth="1.3" />
      <rect x="5" y="-14" width="7" height="7" rx="2" fill="#ffe9a8" stroke="#b79d8e" strokeWidth="1.3" />
      <path d="M8.5 -14 L8.5 -7 M5 -10.5 L12 -10.5" stroke="#b79d8e" strokeWidth="1" />
    </g>
  );
}

/* ---------- 양옆 큰 나무 ---------- */

function ForestTree({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* 뿌리와 줄기 */}
      <path
        d="M44 214 C 50 210 53 204 53 196 C 55 160 55 130 54 104 L 70 104 C 69 130 70 160 72 196 C 72 204 75 210 82 214 Z"
        fill="#d29a6e"
        stroke={LINE_TRUNK}
        strokeWidth="3"
      />
      <path d="M63 108 C 64 150 66 192 73 206 L 82 214 L 66 214 C 66 200 66 150 64 108Z" fill="#b97f56" />
      <path d="M57 150 C 60 154 60 160 58 164" fill="none" stroke={LINE_TRUNK} strokeWidth="2" />
      <path d="M60 176 C 63 178 64 182 62 186" fill="none" stroke={LINE_TRUNK} strokeWidth="2" />
      <ellipse cx="58" cy="196" rx="4.5" ry="2.6" fill="#a8dc82" stroke="#6fb04f" strokeWidth="1.4" />

      {/* 잎사귀 덩어리 */}
      <g className="bg-tree-sway">
        {/* 바깥 잎 뭉치 (가장자리 굴곡) */}
        <circle cx="18" cy="100" r="13" fill="#98d778" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="104" cy="94" r="14" fill="#98d778" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="38" cy="92" r="32" fill="#a3dd83" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="86" cy="86" r="30" fill="#a3dd83" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="62" cy="108" r="22" fill="#98d778" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="62" cy="52" r="38" fill="#b4e895" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="26" cy="52" r="16" fill="#b4e895" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="98" cy="50" r="15" fill="#b4e895" stroke={LINE_TREE} strokeWidth="3" />
        {/* 덮어쓰기 : 안쪽 외곽선 정리 */}
        <circle cx="62" cy="76" r="34" fill="#a9e08a" />
        <circle cx="62" cy="52" r="35" fill="#b4e895" />

        {/* 그림자 면 */}
        <path d="M18 112 C 30 130 62 130 70 112 C 56 120 34 120 18 112Z" fill="#7cc15e" opacity="0.85" />
        <path d="M70 104 C 84 120 106 116 116 100 C 102 110 84 110 70 104Z" fill="#7cc15e" opacity="0.85" />
        <path d="M44 84 C 58 96 84 94 98 72 C 94 90 70 106 44 84Z" fill="#8ccf6e" opacity="0.85" />
        <path d="M30 76 C 36 88 50 90 56 82 C 46 84 38 82 30 76Z" fill="#8ccf6e" opacity="0.7" />
        {/* 잎 결 */}
        <path d="M40 60 C 46 66 54 66 58 60" fill="none" stroke="#8ccf6e" strokeWidth="2" />
        <path d="M72 70 C 78 76 86 74 90 68" fill="none" stroke="#8ccf6e" strokeWidth="2" />
        <path d="M22 88 C 26 94 32 94 36 90" fill="none" stroke="#7cc15e" strokeWidth="2" />
        {/* 햇빛 받는 잎 하이라이트 */}
        <ellipse cx="48" cy="30" rx="15" ry="7" transform="rotate(-28 48 30)" fill="#fff" opacity="0.55" />
        <ellipse cx="22" cy="80" rx="7" ry="4" transform="rotate(-28 22 80)" fill="#fff" opacity="0.42" />
        <ellipse cx="84" cy="52" rx="9" ry="4" transform="rotate(-24 84 52)" fill="#e6fbc7" opacity="0.6" />
        <ellipse cx="68" cy="22" rx="6" ry="3" transform="rotate(-18 68 22)" fill="#e6fbc7" opacity="0.6" />
        {/* 작은 열매와 꽃 */}
        <circle cx="52" cy="70" r="3.8" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="86" cy="62" r="3.8" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="30" cy="100" r="3.8" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="96" cy="92" r="3.8" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="64" cy="108" r="3.4" fill="#ffffff" stroke="#d9cfc0" strokeWidth="1.1" />
        <circle cx="40" cy="40" r="3.2" fill="#ffffff" stroke="#d9cfc0" strokeWidth="1.1" />
        <circle cx="76" cy="38" r="3.2" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

/* ---------- 배경 본체 ---------- */

function BattleBackground() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__sky" />

      {/* 따뜻한 햇살 */}
      <div className="bg__sun-glow" />
      <svg className="bg__sun-rays" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path key={angle} d="M0 0 L-14 -100 L14 -100 Z" transform={`rotate(${angle})`} fill="#fff6c8" />
        ))}
      </svg>
      <div className="bg__sun" />

      {/* 하늘의 반짝임 */}
      <svg className="bg__twinkles" viewBox="0 0 390 260" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
        <Twinkle x={205} y={46} s={1.1} delay={0} />
        <Twinkle x={262} y={120} s={0.8} delay={1.1} />
        <Twinkle x={156} y={92} s={0.9} delay={2} />
        <Twinkle x={330} y={140} s={0.7} delay={0.6} />
        <Twinkle x={60} y={150} s={0.8} delay={1.6} />
        <Twinkle x={120} y={36} s={0.7} delay={2.6} />
      </svg>

      {/* 은은한 무지개 (성 뒤쪽) */}
      <svg
        className="bg__rainbow"
        viewBox="0 0 390 220"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        strokeLinecap="round"
      >
        {[
          { r: 158, color: "#ffb7c5" },
          { r: 148, color: "#ffd5a8" },
          { r: 138, color: "#fff0a8" },
          { r: 128, color: "#c4efc0" },
          { r: 118, color: "#b8e0f5" },
          { r: 108, color: "#d6c8f5" },
        ].map(({ r, color }) => (
          <path key={r} d={`M${186 - r} 224 A ${r} ${r} 0 0 1 ${186 + r} 224`} stroke={color} strokeWidth="11" />
        ))}
      </svg>

      {/* 구름 */}
      <svg className="bg__clouds" viewBox="0 0 390 260" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
        <Cloud className="bg-cloud bg-cloud--slow" x={14} y={96} scale={0.9} />
        <Cloud className="bg-cloud bg-cloud--mid" x={222} y={64} scale={0.7} />
        <Cloud className="bg-cloud bg-cloud--fast" x={120} y={128} scale={0.55} />
        <Cloud className="bg-cloud bg-cloud--mid" x={262} y={148} scale={0.85} />
        <Cloud className="bg-cloud bg-cloud--slow" x={-16} y={178} scale={1.05} />
        <Cloud className="bg-cloud bg-cloud--fast" x={150} y={212} scale={0.75} />
        <Cloud className="bg-cloud bg-cloud--slow" x={308} y={214} scale={0.9} />
      </svg>

      {/* 날아가는 새 */}
      <svg className="bg__birds" viewBox="0 0 390 120" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
        <Bird className="bg-bird bg-bird--a" y={30} />
        <Bird className="bg-bird bg-bird--b" y={58} />
        <Bird className="bg-bird bg-bird--c" y={18} />
      </svg>

      {/* 먼 산 + 먼 언덕 + 작은 판타지 성 (성은 약 1.2배 확대) */}
      <svg
        className="bg__layer bg__far"
        viewBox="0 0 390 200"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* 안개 낀 먼 산 */}
        <path
          d="M-10 130 L 38 84 L 74 108 L 114 56 L 162 112 L 204 96 L 252 50 L 304 102 L 344 74 L 400 122 L 400 200 L -10 200 Z"
          fill="#d6e7f3"
          stroke="#d6e7f3"
          strokeWidth="10"
        />
        <path d="M114 56 L 96 82 L 108 90 L 124 76 Z" fill="#e8f3fa" />
        <path d="M252 50 L 232 80 L 246 90 L 262 74 Z" fill="#e8f3fa" />
        <path d="M344 74 L 330 94 L 342 98 L 354 88 Z" fill="#e8f3fa" />
        <path d="M114 56 L 124 76 L 118 100 L 134 98 L 144 90 Z" fill="#c7dcec" opacity="0.7" />
        <path d="M252 50 L 262 74 L 256 96 L 272 94 L 284 86 Z" fill="#c7dcec" opacity="0.7" />
        {/* 눈 덮인 봉우리 */}
        <path d="M114 56 L 106 70 L 111 68 L 115 74 L 119 67 L 124 70 Z" fill="#fff" />
        <path d="M252 50 L 243 66 L 249 63 L 253 70 L 258 62 L 264 66 Z" fill="#fff" />

        <path
          d="M0 118 C 40 92 90 84 140 98 C 175 108 215 96 255 84 C 300 72 350 88 390 104 L390 200 L0 200 Z"
          fill="#cdeedd"
        />
        <path d="M0 122 C 40 98 90 90 140 104 C 175 114 215 102 255 90 C 300 78 350 94 390 110 L390 200 L0 200 Z" fill="#c2e8d3" opacity="0.7" />
        <path
          d="M-10 142 C 50 118 120 120 180 132 C 240 144 320 112 400 128 L400 200 L-10 200 Z"
          fill="#bfe8cf"
        />

        {/* 먼 나무 숲 */}
        <FarTree x={22} y={110} s={1} />
        <FarTree x={38} y={104} s={0.85} />
        <FarTree x={54} y={100} s={0.95} />
        <FarTree x={72} y={98} s={0.8} />
        <FarTree x={296} y={82} s={0.9} />
        <FarTree x={314} y={80} s={1} />
        <FarTree x={332} y={86} s={0.85} />
        <FarTree x={352} y={92} s={1} />
        <FarTree x={372} y={100} s={0.9} />
        <FarTree x={104} y={118} s={0.8} />
        <FarTree x={282} y={118} s={0.75} />

        {/* 성 */}
        <g transform="translate(186 108) scale(1.03)">
          <ellipse cx="0" cy="2" rx="52" ry="6" fill="rgba(80,140,110,0.28)" />
          {/* 양옆 탑 */}
          <rect x="-40" y="-36" width="18" height="36" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="-31" y="-36" width="9" height="36" fill="#f1dfd0" />
          <path d="M-43 -36 L-31 -58 L-19 -36 Z" fill="#ffb7c5" stroke={LINE_FAR} strokeWidth="2" />
          <path d="M-31 -58 L-19 -36 L-27 -36 Z" fill="#f59db0" />
          <rect x="22" y="-32" width="18" height="32" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="31" y="-32" width="9" height="32" fill="#f1dfd0" />
          <path d="M19 -32 L31 -52 L43 -32 Z" fill="#ffb7c5" stroke={LINE_FAR} strokeWidth="2" />
          <path d="M31 -52 L43 -32 L35 -32 Z" fill="#f59db0" />
          {/* 성벽 */}
          <rect x="-22" y="-22" width="44" height="22" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <path d="M-22 -22 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4" fill="none" stroke={LINE_FAR} strokeWidth="1.4" />
          {/* 중앙 탑 */}
          <rect x="-17" y="-54" width="34" height="54" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="3" y="-54" width="14" height="54" fill="#f1dfd0" />
          <path d="M-22 -54 L0 -84 L22 -54 Z" fill="#ffb58c" stroke={LINE_FAR} strokeWidth="2" />
          <path d="M0 -84 L22 -54 L10 -54 Z" fill="#f59d70" />
          <path d="M0 -84 L0 -98" stroke={LINE_FAR} strokeWidth="2" />
          <path className="bg-flag" d="M0 -98 L16 -93 L0 -88 Z" fill="#ff8fa6" stroke={LINE_FAR} strokeWidth="1.4" />
          {/* 창문과 문 */}
          <rect x="-4" y="-44" width="8" height="12" rx="4" fill="#ffe9a8" stroke={LINE_FAR} strokeWidth="1.6" />
          <rect x="-35" y="-26" width="6" height="9" rx="3" fill="#ffe9a8" stroke={LINE_FAR} strokeWidth="1.4" />
          <rect x="29" y="-24" width="6" height="9" rx="3" fill="#ffe9a8" stroke={LINE_FAR} strokeWidth="1.4" />
          <path d="M-7 0 L-7 -9 A7 7 0 0 1 7 -9 L7 0 Z" fill="#c58f66" stroke={LINE_FAR} strokeWidth="1.6" />
        </g>
      </svg>

      {/* 가까운 언덕, 오솔길, 오두막, 나무들 */}
      <svg
        className="bg__layer bg__mid"
        viewBox="0 0 390 200"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M0 96 C 50 70 110 66 165 88 C 215 108 270 84 330 76 C 360 72 380 78 390 82 L390 200 L0 200 Z"
          fill="#b8e6a0"
          stroke="#a2d88a"
          strokeWidth="2.5"
        />
        {/* 언덕의 명암 */}
        <path
          d="M0 140 C 80 118 160 134 230 128 C 300 122 350 112 390 118 L390 200 L0 200 Z"
          fill="#a9de92"
          opacity="0.65"
        />
        <path
          d="M0 99 C 50 73 110 69 165 91 C 215 111 270 87 330 79 C 360 75 380 81 390 85"
          fill="none"
          stroke="#d6f6c0"
          strokeWidth="3"
          opacity="0.85"
        />
        {/* 성으로 이어지는 오솔길 */}
        <path
          d="M164 90 C 178 110 152 130 176 150 C 196 168 160 186 170 200 L 218 200 C 208 184 238 168 218 150 C 198 130 216 108 184 90 Z"
          fill="#f8e5ba"
          stroke="#e8cf9c"
          strokeWidth="2"
        />
        <path d="M172 140 C 178 148 176 152 172 156" fill="none" stroke="#fff4d6" strokeWidth="2.5" />
        <path d="M200 132 C 208 138 210 144 206 150" fill="none" stroke="#e8cf9c" strokeWidth="2" />
        <ellipse cx="190" cy="120" rx="4" ry="2" fill="#f0e2c0" stroke="#e0c690" strokeWidth="1" />

        {/* 오두막과 나무, 덤불 */}
        <Cottage x={97} y={78} s={0.8} />
        <RoundTree x={34} y={96} s={0.95} tone="#b3e892" />
        <RoundTree x={66} y={90} s={0.7} tone="#c0efa0" />
        <Bush x={128} y={90} s={0.7} />
        <RoundTree x={336} y={84} s={0.85} tone="#b3e892" />
        <RoundTree x={366} y={90} s={0.65} tone="#c0efa0" />
        <RoundTree x={306} y={80} s={0.6} tone="#c4f0a6" />
        <Bush x={284} y={88} s={0.65} />
        {/* 언덕 위 작은 꽃밭 */}
        {[
          [18, 112, "#ffb7c9"],
          [46, 118, "#ffffff"],
          [150, 100, "#ffe27a"],
          [234, 104, "#ffb7c9"],
          [252, 110, "#ffffff"],
          [352, 104, "#ffe27a"],
          [378, 112, "#ffb7c9"],
        ].map(([cx, cy, color]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" fill={color as string} stroke="#d9a9a0" strokeWidth="0.8" />
        ))}
      </svg>

      {/* 풀밭 : 전투 공간(밝은 공터) 포함 */}
      <svg
        className="bg__layer bg__ground"
        viewBox="0 0 390 340"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M0 58 C 50 40 110 34 175 44 C 245 54 320 36 390 50 L390 340 L0 340 Z"
          fill="#a9de7e"
          stroke="#8fcb66"
          strokeWidth="3"
        />
        {/* 윗면 림라이트 */}
        <path d="M0 62 C 50 44 110 38 175 48 C 245 58 320 40 390 54" fill="none" stroke="#cdf0a4" strokeWidth="3" opacity="0.9" />
        {/* 풀밭 결 */}
        <path d="M0 104 C 100 86 290 86 390 104 L390 126 C 290 108 100 108 0 126 Z" fill="#9dd472" opacity="0.55" />
        <path d="M0 250 C 100 232 290 232 390 250 L390 280 C 290 262 100 262 0 280 Z" fill="#9dd472" opacity="0.55" />
        <path d="M0 70 C 80 60 120 64 200 74 C 290 86 340 70 390 76 L390 100 C 300 94 260 104 190 94 C 110 84 60 90 0 96 Z" fill="#b6e68c" opacity="0.5" />

        {/* 나무 그림자 */}
        <ellipse cx="34" cy="142" rx="54" ry="10" fill="#5fa04a" opacity="0.3" />
        <ellipse cx="366" cy="146" rx="46" ry="9" fill="#5fa04a" opacity="0.3" />
        {/* 햇살이 드는 얼룩 */}
        <ellipse cx="110" cy="96" rx="34" ry="6" fill="#e6f9bd" opacity="0.45" />
        <ellipse cx="290" cy="100" rx="40" ry="6" fill="#e6f9bd" opacity="0.45" />
        <ellipse cx="60" cy="214" rx="38" ry="8" fill="#e6f9bd" opacity="0.4" />
        <ellipse cx="330" cy="222" rx="42" ry="8" fill="#e6f9bd" opacity="0.4" />

        {/* 전투 공터 */}
        <ellipse cx="195" cy="182" rx="184" ry="60" fill="#b5e287" />
        <ellipse cx="195" cy="180" rx="178" ry="55" fill="#cbee9b" />
        <ellipse cx="195" cy="178" rx="150" ry="44" fill="#d9f4ac" />
        <ellipse cx="195" cy="174" rx="110" ry="28" fill="#e4f8bc" opacity="0.7" />
        <path d="M70 168 C 110 152 280 152 322 168" fill="none" stroke="#e8f8c4" strokeWidth="3" opacity="0.7" />
        <path d="M52 192 C 100 214 290 214 338 192" fill="none" stroke="#b5e287" strokeWidth="3" opacity="0.8" />
        {/* 작은 돌멩이 */}
        <ellipse cx="196" cy="196" rx="7" ry="4" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.4" />
        <ellipse cx="206" cy="199" rx="4" ry="2.6" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.2" />
        <ellipse cx="146" cy="204" rx="5" ry="3" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.2" />
        <ellipse cx="256" cy="206" rx="5.5" ry="3" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.2" />

        {/* 풀 질감 */}
        {GRASS_MARKS.map(({ x, y, v }) => (
          <path
            key={`m-${x.toFixed(1)}-${y.toFixed(1)}`}
            d={`M${x} ${y} l ${v > 0.5 ? 2.4 : -2.4} -5.5`}
            stroke={v > 0.5 ? "#8bc864" : "#c6ee9c"}
            strokeWidth="1.7"
            fill="none"
            opacity="0.85"
          />
        ))}
        {/* 클로버 점 */}
        {CLOVER_DOTS.map(({ x, y, v }) => (
          <circle key={`c-${x.toFixed(1)}-${y.toFixed(1)}`} cx={x} cy={y} r="1.6" fill={v > 0.5 ? "#bff09a" : "#8fcf68"} />
        ))}
        {/* 풀잎 뭉치 */}
        {GRASS_TUFTS.map(({ x, y, v }) => (
          <Tuft key={`t-${x.toFixed(1)}-${y.toFixed(1)}`} x={x} y={y} s={0.7 + v * 0.7} tone={v > 0.5 ? 1 : 0} />
        ))}

        {/* 버섯 */}
        <Mushroom x={64} y={150} s={0.9} />
        <Mushroom x={72} y={154} s={0.65} />
        <Mushroom x={340} y={156} s={0.85} />

        {/* 꽃 (트레이에 가리지 않는 위쪽 풀밭 위주) */}
        <Flower x={22} y={178} color="pink" delay={0} />
        <Flower x={50} y={166} color="white" delay={0.6} s={0.9} />
        <Flower x={30} y={128} color="yellow" delay={0.3} s={0.85} />
        <Flower x={92} y={118} color="yellow" delay={1.2} s={0.8} />
        <Flower x={128} y={104} color="pink" delay={0.4} s={0.75} />
        <Flower x={160} y={126} color="white" delay={0.9} s={0.7} />
        <Flower x={238} y={120} color="white" delay={1.4} s={0.7} />
        <Flower x={266} y={108} color="yellow" delay={0.2} s={0.75} />
        <Flower x={304} y={126} color="pink" delay={1} s={0.8} />
        <Flower x={352} y={178} color="yellow" delay={0.7} />
        <Flower x={376} y={162} color="pink" delay={1.5} s={0.9} />
        <Flower x={332} y={196} color="white" delay={0.1} />
        <Flower x={44} y={206} color="pink" delay={1.1} />
        <Flower x={84} y={246} color="white" delay={0.8} />
        <Flower x={316} y={252} color="pink" delay={0.5} />
        <Flower x={150} y={254} color="yellow" delay={1.3} />
        <Flower x={250} y={246} color="white" delay={0.4} />
      </svg>

      {/* 양옆 큰 나무 */}
      <ForestTree className="bg__tree bg__tree--left" />
      <ForestTree className="bg__tree bg__tree--right" />

      {/* 떠다니는 빛 알갱이와 꽃잎 */}
      <span className="bg__mote bg__mote--a" />
      <span className="bg__mote bg__mote--b" />
      <span className="bg__mote bg__mote--c" />
      <span className="bg__mote bg__mote--d" />
      <span className="bg__mote bg__mote--e" />
      <span className="bg__petal bg__petal--a" />
      <span className="bg__petal bg__petal--b" />
      <span className="bg__petal bg__petal--c" />
    </div>
  );
}

export default BattleBackground;
