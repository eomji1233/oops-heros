import type { ReactNode } from "react";
import type { CharacterArtProps } from "./types";

/* 몬스터 일러스트 : 말랑 슬라임과 같은 그림체, 몬스터마다 다른 색과 실루엣 */

const STROKE = 3;
const BLUSH = "#ff9fb0";

type SvgProps = { className?: string; viewBox: string; children: ReactNode };

function MonsterSvg({ className, viewBox, children }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </svg>
  );
}

/* ---------- 슬라임 공통 (분홍 슬라임, 슬라임 왕) ---------- */

type SlimePalette = { main: string; shade: string; glow: string; outline: string; eye: string };

const SLIME_BODY =
  "M85 12 C 118 12 146 40 154 80 C 160 108 144 122 85 122 C 26 122 10 108 16 80 C 24 40 52 12 85 12 Z";

function SlimeBody({ palette, mood }: { palette: SlimePalette; mood: "cute" | "grumpy" }) {
  return (
    <>
      <path
        d="M80 16 C 75 4 86 -4 94 3 C 89 4 87 9 89 16 Z"
        fill={palette.main}
        stroke={palette.outline}
        strokeWidth={STROKE}
      />
      <path d={SLIME_BODY} fill={palette.main} />
      <path
        d="M16 84 C 14 106 30 122 85 122 C 140 122 156 106 154 84 C 140 104 112 109 85 109 C 58 109 30 104 16 84 Z"
        fill={palette.shade}
      />
      <path d="M26 70 C 30 46 54 24 82 18 C 60 30 40 50 34 76 Z" fill={palette.glow} opacity="0.8" />
      <path d={SLIME_BODY} fill="none" stroke={palette.outline} strokeWidth={STROKE} />
      <ellipse cx="48" cy="44" rx="10" ry="5" transform="rotate(-38 48 44)" fill="#fff" opacity="0.85" />
      <circle cx="64" cy="29" r="2.6" fill="#fff" opacity="0.8" />
      <circle cx="122" cy="98" r="4.5" fill="#fff" opacity="0.4" />
      <circle cx="134" cy="84" r="2.6" fill="#fff" opacity="0.4" />
      <g className="art-blink">
        <ellipse cx="62" cy="70" rx="7.6" ry="10" fill={palette.eye} />
        <ellipse cx="108" cy="70" rx="7.6" ry="10" fill={palette.eye} />
        <circle cx="64.8" cy="66" r="3" fill="#fff" />
        <circle cx="110.8" cy="66" r="3" fill="#fff" />
        <circle cx="60" cy="74" r="1.5" fill="#fff" />
        <circle cx="106" cy="74" r="1.5" fill="#fff" />
      </g>
      {mood === "grumpy" && (
        <>
          <path d="M50 54 L72 62" stroke={palette.eye} strokeWidth="4" fill="none" />
          <path d="M120 54 L98 62" stroke={palette.eye} strokeWidth="4" fill="none" />
        </>
      )}
      <ellipse cx="42" cy="87" rx="8.5" ry="5" fill={BLUSH} opacity="0.7" />
      <ellipse cx="128" cy="87" rx="8.5" ry="5" fill={BLUSH} opacity="0.7" />
      <path
        d="M76 86 Q85 102 94 86 Q85 91 76 86 Z"
        fill="#ff8fa0"
        stroke={palette.eye}
        strokeWidth="2.2"
      />
    </>
  );
}

const PINK: SlimePalette = { main: "#ffc0dc", shade: "#f59cc3", glow: "#ffe3f0", outline: "#b45a85", eye: "#5a2f45" };

export function PinkSlimeArt({ className }: CharacterArtProps) {
  return (
    <MonsterSvg className={className} viewBox="0 -8 170 138">
      <SlimeBody palette={PINK} mood="cute" />
      {/* 리본 */}
      <path d="M96 14 C 108 0 126 4 120 18 C 114 22 104 20 96 14 Z" fill="#fff3b8" stroke={PINK.outline} strokeWidth="2.6" />
      <path d="M96 14 C 84 2 68 6 74 20 C 80 24 90 20 96 14 Z" fill="#fff3b8" stroke={PINK.outline} strokeWidth="2.6" />
      <circle cx="96" cy="14" r="5" fill="#ffd36e" stroke={PINK.outline} strokeWidth="2.4" />
    </MonsterSvg>
  );
}

const KING: SlimePalette = { main: "#86d6a0", shade: "#5db97a", glow: "#c2f0cf", outline: "#3f7d56", eye: "#27422f" };

export function KingSlimeArt({ className }: CharacterArtProps) {
  return (
    <MonsterSvg className={className} viewBox="0 -34 170 164">
      <SlimeBody palette={KING} mood="grumpy" />
      {/* 왕관 */}
      <path d="M52 22 L56 -8 L72 8 L85 -20 L98 8 L114 -8 L118 22 Q85 30 52 22 Z" fill="#ffd36e" stroke="#7a5546" strokeWidth={STROKE} />
      <path d="M58 16 Q85 24 112 16" fill="none" stroke="#f0a93c" strokeWidth="3" />
      <circle cx="85" cy="-20" r="5" fill="#ff7b95" stroke="#7a5546" strokeWidth="2.2" />
      <circle cx="56" cy="-8" r="3.6" fill="#8ed6ff" stroke="#7a5546" strokeWidth="2" />
      <circle cx="114" cy="-8" r="3.6" fill="#8ed6ff" stroke="#7a5546" strokeWidth="2" />
      {/* 망토 느낌의 어깨 방울 */}
      <circle cx="30" cy="104" r="5" fill="#fff" opacity="0.35" />
    </MonsterSvg>
  );
}

/* ---------- 버섯 몬스터 ---------- */

export function MushroomArt({ className }: CharacterArtProps) {
  const outline = "#8a4a46";
  return (
    <MonsterSvg className={className} viewBox="0 0 170 150">
      {/* 몸통 */}
      <path d="M52 78 C 48 108 56 138 85 138 C 114 138 122 108 118 78 Z" fill="#fff4e0" stroke={outline} strokeWidth={STROKE} />
      <path d="M100 82 C 112 100 112 124 100 136 C 112 134 120 112 118 82 Z" fill="#f1dcc0" />
      {/* 작은 발 */}
      <ellipse cx="68" cy="140" rx="13" ry="7" fill="#fff4e0" stroke={outline} strokeWidth={STROKE} />
      <ellipse cx="102" cy="140" rx="13" ry="7" fill="#fff4e0" stroke={outline} strokeWidth={STROKE} />
      {/* 갓 */}
      <path d="M12 82 C 8 40 44 6 85 6 C 126 6 162 40 158 82 C 158 92 140 90 85 90 C 30 90 12 92 12 82 Z" fill="#ff8f8f" stroke={outline} strokeWidth={STROKE} />
      <path d="M20 82 C 18 90 40 90 85 90 C 130 90 152 90 150 82 C 140 86 112 86 85 86 C 58 86 30 86 20 82 Z" fill="#e86f7a" />
      <circle cx="46" cy="44" r="11" fill="#fff" stroke={outline} strokeWidth="2.4" />
      <circle cx="100" cy="30" r="9" fill="#fff" stroke={outline} strokeWidth="2.4" />
      <circle cx="132" cy="58" r="8" fill="#fff" stroke={outline} strokeWidth="2.4" />
      <circle cx="78" cy="62" r="6" fill="#fff" stroke={outline} strokeWidth="2.2" />
      <ellipse cx="38" cy="30" rx="10" ry="5" transform="rotate(-38 38 30)" fill="#fff" opacity="0.7" />
      {/* 얼굴 */}
      <g className="art-blink">
        <ellipse cx="70" cy="104" rx="6" ry="8" fill="#4a3328" />
        <ellipse cx="100" cy="104" rx="6" ry="8" fill="#4a3328" />
        <circle cx="72" cy="101" r="2.4" fill="#fff" />
        <circle cx="102" cy="101" r="2.4" fill="#fff" />
      </g>
      <ellipse cx="58" cy="116" rx="7" ry="4.2" fill={BLUSH} opacity="0.75" />
      <ellipse cx="112" cy="116" rx="7" ry="4.2" fill={BLUSH} opacity="0.75" />
      <path d="M78 118 Q85 126 92 118" fill="none" stroke="#4a3328" strokeWidth="2.6" />
    </MonsterSvg>
  );
}

export function KingMushroomArt({ className }: CharacterArtProps) {
  const outline = "#5a3f78";
  return (
    <MonsterSvg className={className} viewBox="0 -30 170 180">
      <path d="M52 78 C 48 108 56 138 85 138 C 114 138 122 108 118 78 Z" fill="#f3e6ff" stroke={outline} strokeWidth={STROKE} />
      <path d="M100 82 C 112 100 112 124 100 136 C 112 134 120 112 118 82 Z" fill="#dcc8f0" />
      <ellipse cx="68" cy="140" rx="13" ry="7" fill="#f3e6ff" stroke={outline} strokeWidth={STROKE} />
      <ellipse cx="102" cy="140" rx="13" ry="7" fill="#f3e6ff" stroke={outline} strokeWidth={STROKE} />
      <path d="M6 82 C 0 36 40 2 85 2 C 130 2 170 36 164 82 C 164 94 142 92 85 92 C 28 92 6 94 6 82 Z" fill="#a98bea" stroke={outline} strokeWidth={STROKE} />
      <path d="M14 82 C 12 92 36 92 85 92 C 134 92 158 92 156 82 C 144 87 112 87 85 87 C 58 87 26 87 14 82 Z" fill="#8c6cd4" />
      <circle cx="44" cy="44" r="12" fill="#ffe27a" stroke={outline} strokeWidth="2.4" />
      <circle cx="104" cy="28" r="10" fill="#ffe27a" stroke={outline} strokeWidth="2.4" />
      <circle cx="136" cy="58" r="9" fill="#ffe27a" stroke={outline} strokeWidth="2.4" />
      <circle cx="78" cy="58" r="6" fill="#ffe27a" stroke={outline} strokeWidth="2.2" />
      {/* 왕관 */}
      <path d="M58 6 L62 -22 L74 -8 L85 -28 L96 -8 L108 -22 L112 6 Q85 14 58 6 Z" fill="#ffd36e" stroke="#7a5546" strokeWidth={STROKE} />
      <circle cx="85" cy="-28" r="4.6" fill="#ff7b95" stroke="#7a5546" strokeWidth="2" />
      {/* 화난 얼굴 */}
      <path d="M58 98 L78 104" stroke="#3b2b45" strokeWidth="4" fill="none" />
      <path d="M112 98 L92 104" stroke="#3b2b45" strokeWidth="4" fill="none" />
      <g className="art-blink">
        <ellipse cx="70" cy="110" rx="6" ry="8" fill="#3b2b45" />
        <ellipse cx="100" cy="110" rx="6" ry="8" fill="#3b2b45" />
        <circle cx="72" cy="107" r="2.4" fill="#fff" />
        <circle cx="102" cy="107" r="2.4" fill="#fff" />
      </g>
      <ellipse cx="58" cy="121" rx="7" ry="4.2" fill={BLUSH} opacity="0.75" />
      <ellipse cx="112" cy="121" rx="7" ry="4.2" fill={BLUSH} opacity="0.75" />
      <path d="M76 124 Q85 118 94 124" fill="none" stroke="#3b2b45" strokeWidth="2.6" />
    </MonsterSvg>
  );
}

/* ---------- 꿀벌 몬스터 ---------- */

export function BeeArt({ className }: CharacterArtProps) {
  const outline = "#8a6a2e";
  return (
    <MonsterSvg className={className} viewBox="0 0 160 140">
      {/* 날개 */}
      <g className="art-ear art-ear--left">
        <ellipse cx="54" cy="30" rx="22" ry="30" transform="rotate(-24 54 30)" fill="#e6f7ff" fillOpacity="0.85" stroke="#7fb4d2" strokeWidth="2.8" />
      </g>
      <g className="art-ear art-ear--right">
        <ellipse cx="106" cy="30" rx="22" ry="30" transform="rotate(24 106 30)" fill="#e6f7ff" fillOpacity="0.85" stroke="#7fb4d2" strokeWidth="2.8" />
      </g>
      {/* 침 */}
      <path d="M80 128 L72 142 L88 142 Z" fill="#4a3328" stroke={outline} strokeWidth="2.4" />
      {/* 몸 */}
      <ellipse cx="80" cy="84" rx="56" ry="46" fill="#ffd95c" stroke={outline} strokeWidth={STROKE} />
      <path d="M30 96 C 40 126 120 126 130 96 C 112 112 48 112 30 96 Z" fill="#f0b83a" />
      <path d="M44 56 C 40 74 40 94 44 110 L58 112 C 54 94 54 74 58 54 Z" fill="#4a3328" />
      <path d="M102 54 C 106 74 106 94 102 112 L116 110 C 120 94 120 74 116 56 Z" fill="#4a3328" />
      <ellipse cx="60" cy="52" rx="14" ry="6" transform="rotate(-24 60 52)" fill="#fff" opacity="0.75" />
      {/* 더듬이 */}
      <path d="M66 40 C 62 26 54 20 50 20" fill="none" stroke={outline} strokeWidth="3" />
      <path d="M94 40 C 98 26 106 20 110 20" fill="none" stroke={outline} strokeWidth="3" />
      <circle cx="50" cy="20" r="4.4" fill="#ffd95c" stroke={outline} strokeWidth="2.4" />
      <circle cx="110" cy="20" r="4.4" fill="#ffd95c" stroke={outline} strokeWidth="2.4" />
      {/* 얼굴 */}
      <path d="M62 66 L76 72" stroke="#4a3328" strokeWidth="3.4" fill="none" />
      <path d="M98 66 L84 72" stroke="#4a3328" strokeWidth="3.4" fill="none" />
      <g className="art-blink">
        <ellipse cx="68" cy="80" rx="6.6" ry="8.6" fill="#4a3328" />
        <ellipse cx="92" cy="80" rx="6.6" ry="8.6" fill="#4a3328" />
        <circle cx="70" cy="77" r="2.6" fill="#fff" />
        <circle cx="94" cy="77" r="2.6" fill="#fff" />
      </g>
      <ellipse cx="52" cy="94" rx="7" ry="4.4" fill={BLUSH} opacity="0.75" />
      <ellipse cx="108" cy="94" rx="7" ry="4.4" fill={BLUSH} opacity="0.75" />
      <path d="M74 96 Q80 104 86 96 Q80 100 74 96 Z" fill="#ff8fa0" stroke="#4a3328" strokeWidth="2" />
    </MonsterSvg>
  );
}
