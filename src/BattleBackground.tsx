/*
 * 동화풍 판타지 숲 배경 (인라인 SVG + CSS)
 *
 * 깊이감을 위해 뒤에서 앞으로 겹쳐 쌓은 레이어 구조입니다.
 *   하늘 → 햇살 → 구름 → 먼 언덕 + 성 → 가까운 언덕 + 나무 → 풀밭(전투 공간) → 양옆 나무 → 떠다니는 빛
 * 캐릭터보다 눈에 띄지 않도록 채도를 낮춘 파스텔 색을 사용합니다.
 */

const LINE_FAR = "#b79d8e";
const LINE_TREE = "#5f9a4c";
const LINE_TRUNK = "#8a5a3c";

/* ---------- 작은 재료 ---------- */

function Cloud({ className, x, y, scale = 1 }: { className: string; x: number; y: number; scale?: number }) {
  const d =
    "M8 34 C -2 34 -3 18 11 17 C 12 6 30 3 37 13 C 44 5 64 8 65 20 C 80 18 84 36 68 36 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={className}>
        <path d={d} transform="translate(0 4)" fill="#d3ebf3" />
        <path d={d} fill="#ffffff" />
        <path d="M18 22 C 22 17 30 15 36 18" fill="none" stroke="#e6f5fa" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Tuft({ x, y, s = 1, color = "#8ccd66" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 0 C -2 -7 -5 -11 -8 -13 C -3 -11 0 -8 1.5 -4 C 2 -9 5 -13 9 -14 C 6 -10 4.5 -6 4 0 Z"
      fill={color}
      stroke="#6fb04f"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}

type FlowerColor = "pink" | "white" | "yellow";

const FLOWER_PETALS: Record<FlowerColor, { petal: string; center: string }> = {
  pink: { petal: "#ffb7c9", center: "#fff1a8" },
  white: { petal: "#ffffff", center: "#ffd36e" },
  yellow: { petal: "#ffe27a", center: "#ffb98a" },
};

function Flower({ x, y, color, delay = 0 }: { x: number; y: number; color: FlowerColor; delay?: number }) {
  const { petal, center } = FLOWER_PETALS[color];
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="bg-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C 0 -5 0 -9 0 -12" stroke="#6fb04f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M0 -5 C 5 -6 7 -9 6 -11 C 3 -11 0 -8 0 -5Z" fill="#9fdc7e" stroke="#6fb04f" strokeWidth="1" />
        <g transform="translate(0 -15)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-4.4"
              rx="3.3"
              ry="4.2"
              transform={`rotate(${angle})`}
              fill={petal}
              stroke="#d9a9a0"
              strokeWidth="0.9"
            />
          ))}
          <circle r="2.6" fill={center} stroke="#d9a35a" strokeWidth="0.9" />
        </g>
      </g>
    </g>
  );
}

function RoundTree({ x, y, s = 1, tone = "#aee48e" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-14" width="6" height="16" rx="2.5" fill="#c58f66" stroke={LINE_TRUNK} strokeWidth="1.6" />
      <circle cx="0" cy="-26" r="15" fill={tone} stroke={LINE_TREE} strokeWidth="1.8" />
      <path d="M-4 -14 C 8 -12 15 -20 12 -31 C 15 -20 8 -9 -4 -14Z" fill="#8fd070" opacity="0.7" />
      <ellipse cx="-5" cy="-32" rx="5" ry="3" transform="rotate(-30 -5 -32)" fill="#fff" opacity="0.5" />
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
      {/* 줄기 */}
      <path
        d="M52 214 C 55 190 55 150 54 104 L 70 104 C 69 150 70 190 78 214 Z"
        fill="#d29a6e"
        stroke={LINE_TRUNK}
        strokeWidth="3"
      />
      <path d="M63 108 C 64 150 66 190 74 212 L 78 214 C 70 190 69 150 70 104Z" fill="#b97f56" />
      <path d="M57 170 C 60 172 62 176 60 180" fill="none" stroke={LINE_TRUNK} strokeWidth="2" />

      {/* 잎사귀 덩어리 */}
      <g className="bg-tree-sway">
        <circle cx="38" cy="92" r="32" fill="#a3dd83" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="86" cy="86" r="30" fill="#a3dd83" stroke={LINE_TREE} strokeWidth="3" />
        <circle cx="62" cy="52" r="38" fill="#b4e895" stroke={LINE_TREE} strokeWidth="3" />
        {/* 그림자 면 */}
        <path d="M22 108 C 36 124 60 124 68 108 C 56 114 36 114 22 108Z" fill="#82c764" opacity="0.8" />
        <path d="M70 100 C 82 114 102 112 112 98 C 100 104 82 104 70 100Z" fill="#82c764" opacity="0.8" />
        <path d="M44 82 C 58 92 82 90 96 70 C 92 86 70 100 44 82Z" fill="#92d474" opacity="0.8" />
        {/* 하이라이트 */}
        <ellipse cx="48" cy="34" rx="14" ry="7" transform="rotate(-28 48 34)" fill="#fff" opacity="0.5" />
        <ellipse cx="22" cy="80" rx="7" ry="4" transform="rotate(-28 22 80)" fill="#fff" opacity="0.4" />
        {/* 작은 열매 */}
        <circle cx="52" cy="70" r="3.6" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="86" cy="62" r="3.6" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="30" cy="100" r="3.6" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
        <circle cx="96" cy="92" r="3.6" fill="#ffb7c9" stroke="#d98aa0" strokeWidth="1.2" />
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

      {/* 구름 */}
      <svg className="bg__clouds" viewBox="0 0 390 160" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
        <Cloud className="bg-cloud bg-cloud--slow" x={14} y={96} scale={0.9} />
        <Cloud className="bg-cloud bg-cloud--mid" x={222} y={64} scale={0.7} />
        <Cloud className="bg-cloud bg-cloud--fast" x={120} y={128} scale={0.55} />
      </svg>

      {/* 먼 언덕 + 작은 판타지 성 */}
      <svg
        className="bg__layer bg__far"
        viewBox="0 0 390 200"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M0 118 C 40 92 90 84 140 98 C 175 108 215 96 255 84 C 300 72 350 88 390 104 L390 200 L0 200 Z"
          fill="#cdeedd"
        />
        <path
          d="M-10 142 C 50 118 120 120 180 132 C 240 144 320 112 400 128 L400 200 L-10 200 Z"
          fill="#bfe8cf"
        />

        <g transform="translate(172 106) scale(0.86)">
          {/* 양옆 탑 */}
          <rect x="-40" y="-36" width="18" height="36" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="-31" y="-36" width="9" height="36" fill="#f1dfd0" />
          <path d="M-43 -36 L-31 -58 L-19 -36 Z" fill="#ffb7c5" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="22" y="-32" width="18" height="32" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="31" y="-32" width="9" height="32" fill="#f1dfd0" />
          <path d="M19 -32 L31 -52 L43 -32 Z" fill="#ffb7c5" stroke={LINE_FAR} strokeWidth="2" />
          {/* 성벽 */}
          <rect x="-22" y="-22" width="44" height="22" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          {/* 중앙 탑 */}
          <rect x="-17" y="-54" width="34" height="54" fill="#fff7ec" stroke={LINE_FAR} strokeWidth="2" />
          <rect x="3" y="-54" width="14" height="54" fill="#f1dfd0" />
          <path d="M-22 -54 L0 -84 L22 -54 Z" fill="#ffb58c" stroke={LINE_FAR} strokeWidth="2" />
          <path d="M0 -84 L0 -98" stroke={LINE_FAR} strokeWidth="2" />
          <path className="bg-flag" d="M0 -98 L16 -93 L0 -88 Z" fill="#ff8fa6" stroke={LINE_FAR} strokeWidth="1.4" />
          {/* 창문과 문 */}
          <rect x="-4" y="-44" width="8" height="12" rx="4" fill="#ffe9a8" stroke={LINE_FAR} strokeWidth="1.6" />
          <rect x="-35" y="-26" width="6" height="9" rx="3" fill="#ffe9a8" stroke={LINE_FAR} strokeWidth="1.4" />
          <rect x="29" y="-24" width="6" height="9" rx="3" fill="#ffe9a8" stroke={LINE_FAR} strokeWidth="1.4" />
          <path d="M-7 0 L-7 -9 A7 7 0 0 1 7 -9 L7 0 Z" fill="#c58f66" stroke={LINE_FAR} strokeWidth="1.6" />
        </g>
      </svg>

      {/* 가까운 언덕, 오솔길, 작은 나무들 */}
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
        {/* 성으로 이어지는 오솔길 */}
        <path
          d="M162 90 C 178 110 152 130 176 150 C 196 168 160 186 170 200 L 218 200 C 208 184 238 168 218 150 C 198 130 216 108 182 90 Z"
          fill="#f8e5ba"
          stroke="#e8cf9c"
          strokeWidth="2"
        />
        <path d="M172 140 C 178 148 176 152 172 156" fill="none" stroke="#fff4d6" strokeWidth="2.5" />

        <RoundTree x={34} y={96} s={0.95} tone="#b3e892" />
        <RoundTree x={66} y={90} s={0.7} tone="#c0efa0" />
        <RoundTree x={336} y={84} s={0.85} tone="#b3e892" />
        <RoundTree x={366} y={90} s={0.65} tone="#c0efa0" />
        <ellipse cx="116" cy="94" rx="12" ry="7" fill="#a6dd88" stroke={LINE_TREE} strokeWidth="1.5" />
        <ellipse cx="288" cy="88" rx="11" ry="6.5" fill="#a6dd88" stroke={LINE_TREE} strokeWidth="1.5" />
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
        {/* 풀밭 결 */}
        <path d="M0 104 C 100 86 290 86 390 104 L390 126 C 290 108 100 108 0 126 Z" fill="#9dd472" opacity="0.55" />
        <path d="M0 250 C 100 232 290 232 390 250 L390 280 C 290 262 100 262 0 280 Z" fill="#9dd472" opacity="0.55" />

        {/* 전투 공터 */}
        <ellipse cx="195" cy="168" rx="184" ry="60" fill="#b5e287" />
        <ellipse cx="195" cy="166" rx="178" ry="55" fill="#cbee9b" />
        <ellipse cx="195" cy="164" rx="150" ry="44" fill="#d9f4ac" />
        <path d="M70 154 C 110 138 280 138 322 154" fill="none" stroke="#e8f8c4" strokeWidth="3" opacity="0.7" />
        {/* 작은 돌멩이 */}
        <ellipse cx="196" cy="184" rx="7" ry="4" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.4" />
        <ellipse cx="206" cy="187" rx="4" ry="2.6" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.2" />
        <ellipse cx="146" cy="192" rx="5" ry="3" fill="#f0e8d2" stroke="#d5c7a6" strokeWidth="1.2" />

        {/* 풀잎 */}
        <Tuft x={22} y={176} />
        <Tuft x={366} y={170} s={1.1} />
        <Tuft x={60} y={226} s={1.2} />
        <Tuft x={330} y={232} s={1.1} />
        <Tuft x={124} y={142} s={0.8} />
        <Tuft x={262} y={140} s={0.85} />
        <Tuft x={188} y={236} s={1} />
        <Tuft x={102} y={282} s={1.3} />
        <Tuft x={284} y={290} s={1.2} />
        <Tuft x={22} y={300} s={1.3} />
        <Tuft x={368} y={304} s={1.3} />
        <Tuft x={150} y={116} s={0.7} />
        <Tuft x={230} y={118} s={0.7} />

        {/* 꽃 */}
        <Flower x={34} y={214} color="pink" delay={0} />
        <Flower x={78} y={254} color="white" delay={0.6} />
        <Flower x={352} y={206} color="yellow" delay={0.3} />
        <Flower x={316} y={262} color="pink" delay={0.9} />
        <Flower x={150} y={254} color="yellow" delay={1.2} />
        <Flower x={250} y={246} color="white" delay={0.4} />
        <Flower x={110} y={134} color="white" delay={0.8} />
        <Flower x={286} y={128} color="pink" delay={1.4} />
        <Flower x={42} y={286} color="yellow" delay={0.2} />
        <Flower x={354} y={290} color="white" delay={1} />
      </svg>

      {/* 양옆 큰 나무 */}
      <ForestTree className="bg__tree bg__tree--left" />
      <ForestTree className="bg__tree bg__tree--right" />

      {/* 떠다니는 빛 알갱이 */}
      <span className="bg__mote bg__mote--a" />
      <span className="bg__mote bg__mote--b" />
      <span className="bg__mote bg__mote--c" />
      <span className="bg__mote bg__mote--d" />
      <span className="bg__mote bg__mote--e" />
    </div>
  );
}

export default BattleBackground;
