import type { ReactNode } from "react";
import type { CharacterArtProps } from "./types";

/*
 * 용사 11명의 임시 SVG 일러스트.
 * 히잉토끼와 같은 그림체를 쓰기 위해 같은 규칙을 공유합니다.
 *  - viewBox 0 0 160 180, 머리 중심 (80, 80), 몸 y 118~166, 발 y 169
 *  - 굵기 3의 둥근 외곽선, 밝은 면 + 그림자 면 + 흰 하이라이트
 *  - 동그란 눈, 볼터치
 * 종족마다 귀/꼬리/지느러미 같은 "실루엣"과 색, 들고 있는 무기를 다르게 해
 * 작은 크기에서도 구분되도록 했습니다.
 */

const O = "#7a5546";
const S = 3;
const EYE = "#4a3328";
const BLUSH = "#ff9fab";

const BODY = "M51 126 C 48 150 56 166 80 166 C 104 166 112 150 109 126 C 100 118 60 118 51 126 Z";
const BODY_SHADE = "M93 122 C 106 130 111 150 104 162 C 100 166 93 166 88 166 C 98 152 100 136 93 122 Z";

function HeroSvg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 180"
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

/* ---------- 공용 부품 ---------- */

function Feet({ fill, shade, rx = 15 }: { fill: string; shade: string; rx?: number }) {
  return (
    <>
      <ellipse cx="62" cy="169" rx={rx} ry="8" fill={fill} stroke={O} strokeWidth={S} />
      <ellipse cx="98" cy="169" rx={rx} ry="8" fill={fill} stroke={O} strokeWidth={S} />
      <ellipse cx="62" cy="172" rx={rx - 6} ry="3.5" fill={shade} />
      <ellipse cx="98" cy="172" rx={rx - 6} ry="3.5" fill={shade} />
    </>
  );
}

function Outfit({ fill, shade, belt = "#ffd36e" }: { fill: string; shade: string; belt?: string | null }) {
  return (
    <>
      <path d={BODY} fill={fill} />
      <path d={BODY_SHADE} fill={shade} />
      <path d={BODY} fill="none" stroke={O} strokeWidth={S} />
      {belt && (
        <>
          <path d="M53 148 Q80 156 107 148" fill="none" stroke={O} strokeWidth="8" />
          <path d="M53 148 Q80 156 107 148" fill="none" stroke={belt} strokeWidth="4.5" />
          <circle cx="80" cy="153" r="4.5" fill="#fff3b8" stroke={O} strokeWidth="2" />
        </>
      )}
    </>
  );
}

function LeftArm({ fill, rx = 8.5, ry = 12 }: { fill: string; rx?: number; ry?: number }) {
  return (
    <ellipse cx="49" cy="142" rx={rx} ry={ry} transform="rotate(14 49 142)" fill={fill} stroke={O} strokeWidth={S} />
  );
}

/** 오른손으로 들고 있는 무기. `art-sword` 클래스는 공격 모션에서 휘둘러진다. */
function HeldProp({ hand, children }: { hand: string; children: ReactNode }) {
  return (
    <g transform="translate(113 142)">
      <g className="art-sword">
        <g transform="rotate(24) scale(1.18)">
          {children}
          <ellipse cx="0" cy="4" rx="6.8" ry="6" fill={hand} stroke={O} strokeWidth={S} />
        </g>
      </g>
    </g>
  );
}

function Head({
  fur,
  shade,
  rx = 50,
  ry = 42,
  cy = 80,
}: {
  fur: string;
  shade: string;
  rx?: number;
  ry?: number;
  cy?: number;
}) {
  return (
    <>
      <ellipse cx="80" cy={cy} rx={rx} ry={ry} fill={shade} />
      <ellipse cx="76" cy={cy - 3} rx={rx - 3} ry={ry - 3.5} fill={fur} />
      <ellipse cx="80" cy={cy} rx={rx} ry={ry} fill="none" stroke={O} strokeWidth={S} />
      <ellipse cx="58" cy={cy - 24} rx="14" ry="6.5" transform={`rotate(-24 58 ${cy - 24})`} fill="#fff" opacity="0.75" />
    </>
  );
}

function Blush({ y = 99, color = BLUSH }: { y?: number; color?: string }) {
  return (
    <>
      <ellipse cx="43" cy={y} rx="8" ry="5" fill={color} opacity="0.7" />
      <ellipse cx="117" cy={y} rx="8" ry="5" fill={color} opacity="0.7" />
    </>
  );
}

/** 반짝이는 동그란 눈 */
function Eyes({ y = 87, dx = 20, rx = 7.2, ry = 9, color = EYE }: { y?: number; dx?: number; rx?: number; ry?: number; color?: string }) {
  return (
    <g className="art-blink">
      <ellipse cx={80 - dx} cy={y} rx={rx} ry={ry} fill={color} />
      <ellipse cx={80 + dx} cy={y} rx={rx} ry={ry} fill={color} />
      <circle cx={82.6 - dx} cy={y - 3.4} r={rx * 0.39} fill="#fff" />
      <circle cx={82.6 + dx} cy={y - 3.4} r={rx * 0.39} fill="#fff" />
      <circle cx={78 - dx} cy={y + 4} r={rx * 0.19} fill="#fff" />
      <circle cx={78 + dx} cy={y + 4} r={rx * 0.19} fill="#fff" />
    </g>
  );
}

/** 졸린 눈 (반쯤 감긴 눈꺼풀) */
function SleepyEyes({ y = 88, dx = 20, lid }: { y?: number; dx?: number; lid: string }) {
  return (
    <g className="art-blink">
      <ellipse cx={80 - dx} cy={y} rx="8" ry="8.5" fill={EYE} />
      <ellipse cx={80 + dx} cy={y} rx="8" ry="8.5" fill={EYE} />
      <circle cx={82.5 - dx} cy={y + 1} r="2.6" fill="#fff" />
      <circle cx={82.5 + dx} cy={y + 1} r="2.6" fill="#fff" />
      <path d={`M${80 - dx - 9.5} ${y - 9} h19 v9.5 h-19 Z`} fill={lid} />
      <path d={`M${80 + dx - 9.5} ${y - 9} h19 v9.5 h-19 Z`} fill={lid} />
      <path d={`M${80 - dx - 9} ${y + 0.5} h18`} stroke={O} strokeWidth="2.6" fill="none" />
      <path d={`M${80 + dx - 9} ${y + 0.5} h18`} stroke={O} strokeWidth="2.6" fill="none" />
    </g>
  );
}

function SmallMouth({ y = 105 }: { y?: number }) {
  return <path d={`M74 ${y} Q80 ${y + 5} 86 ${y}`} fill="none" stroke={O} strokeWidth="2.4" />;
}

/* ---------------------------------------------------------
 * 꼬맹이기린 : 노란 몸에 갈색 점, 뿔 두 개, 기다란 잎사귀 지팡이
 * --------------------------------------------------------- */
export function KkomaengGiraffeArt({ className }: CharacterArtProps) {
  const fur = "#ffe08a";
  const shade = "#f3c25c";
  const spot = "#c98b4e";
  return (
    <HeroSvg className={className}>
      {/* 뿔 */}
      <g>
        <path d="M60 46 L58 22" stroke={O} strokeWidth="9" />
        <path d="M60 46 L58 22" stroke="#d6a36a" strokeWidth="4.5" />
        <circle cx="58" cy="20" r="6" fill="#a8744a" stroke={O} strokeWidth={S} />
        <path d="M100 46 L102 22" stroke={O} strokeWidth="9" />
        <path d="M100 46 L102 22" stroke="#d6a36a" strokeWidth="4.5" />
        <circle cx="102" cy="20" r="6" fill="#a8744a" stroke={O} strokeWidth={S} />
      </g>
      {/* 옆으로 뻗은 귀 */}
      <g className="art-ear art-ear--left">
        <ellipse cx="30" cy="62" rx="16" ry="9" transform="rotate(-24 30 62)" fill={fur} stroke={O} strokeWidth={S} />
        <ellipse cx="31" cy="62" rx="8" ry="4.5" transform="rotate(-24 31 62)" fill="#ffbfca" />
      </g>
      <g className="art-ear art-ear--right">
        <ellipse cx="130" cy="62" rx="16" ry="9" transform="rotate(24 130 62)" fill={fur} stroke={O} strokeWidth={S} />
        <ellipse cx="129" cy="62" rx="8" ry="4.5" transform="rotate(24 129 62)" fill="#ffbfca" />
      </g>
      <Feet fill={fur} shade={shade} />
      <Outfit fill="#f6a69c" shade="#e98a80" belt="#8ed6a0" />
      <path d="M62 132 l6 4 l-3 7 l-7 -3 Z" fill="#fff" opacity="0.5" />
      <LeftArm fill={fur} />
      <Head fur={fur} shade={shade} />
      {/* 갈색 점무늬 */}
      <ellipse cx="104" cy="52" rx="7" ry="5" fill={spot} opacity="0.85" />
      <ellipse cx="116" cy="70" rx="4.5" ry="3.5" fill={spot} opacity="0.85" />
      <ellipse cx="50" cy="52" rx="5" ry="3.8" fill={spot} opacity="0.85" />
      {/* 입가 주둥이 */}
      <ellipse cx="80" cy="99" rx="21" ry="13" fill="#fff3c8" stroke={O} strokeWidth="2.4" />
      <ellipse cx="73" cy="97" rx="2.2" ry="3" fill={O} />
      <ellipse cx="87" cy="97" rx="2.2" ry="3" fill={O} />
      <SmallMouth y={105} />
      <Eyes y={84} dx={21} rx={6.6} ry={8.4} />
      <Blush y={96} />
      {/* 어깨 점 */}
      <circle cx="96" cy="132" r="3.4" fill={spot} opacity="0.85" />
      <circle cx="68" cy="156" r="3" fill={spot} opacity="0.85" />
      {/* 잎사귀 지팡이 */}
      <HeldProp hand={fur}>
        <rect x="-2.6" y="-34" width="5.2" height="46" rx="2.6" fill="#c58f66" stroke={O} strokeWidth="2.4" />
        <path d="M0 -62 C 14 -54 14 -38 0 -32 C -14 -38 -14 -54 0 -62 Z" fill="#8ed67a" stroke={O} strokeWidth="2.6" />
        <path d="M0 -58 L0 -38" stroke="#5fb257" strokeWidth="2" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 꾸벅부엉이 : 졸린 눈, 귀깃, 날개, 달 지팡이
 * --------------------------------------------------------- */
export function KkubeokOwlArt({ className }: CharacterArtProps) {
  const fur = "#d1a577";
  const shade = "#b48555";
  return (
    <HeroSvg className={className}>
      {/* 날개 */}
      <path d="M46 124 C 22 128 18 158 34 164 C 44 160 48 146 52 134 Z" fill={shade} stroke={O} strokeWidth={S} />
      <path d="M114 124 C 138 128 142 158 126 164 C 116 160 112 146 108 134 Z" fill={shade} stroke={O} strokeWidth={S} />
      {/* 귀깃 */}
      <path d="M38 52 L30 20 L62 42 Z" fill={fur} stroke={O} strokeWidth={S} />
      <path d="M122 52 L130 20 L98 42 Z" fill={fur} stroke={O} strokeWidth={S} />
      <path d="M38 46 L34 30 L50 42 Z" fill={shade} />
      <path d="M122 46 L126 30 L110 42 Z" fill={shade} />
      <Feet fill="#ffb347" shade="#f09a2a" rx={13} />
      <Outfit fill="#9aa5e8" shade="#7c88d6" belt="#ffe27a" />
      {/* 배 깃털 */}
      <ellipse cx="80" cy="140" rx="17" ry="18" fill="#f9eedb" opacity="0.9" />
      <path d="M70 134 q4 4 8 0 M82 134 q4 4 8 0 M76 146 q4 4 8 0" fill="none" stroke={shade} strokeWidth="2" />
      <LeftArm fill={fur} />
      <Head fur={fur} shade={shade} />
      {/* 얼굴 원반 */}
      <path d="M80 62 C 62 52 38 62 40 88 C 42 108 62 112 80 104 C 98 112 118 108 120 88 C 122 62 98 52 80 62 Z" fill="#fbf1de" stroke={O} strokeWidth="2.4" />
      <SleepyEyes y={86} dx={19} lid="#fbf1de" />
      <path d="M72 94 L88 94 L80 106 Z" fill="#ffb347" stroke={O} strokeWidth="2.2" />
      <Blush y={100} />
      <path d="M96 40 q6 -4 8 2" fill="none" stroke={O} strokeWidth="2.6" />
      {/* 꾸벅 졸음 표시 */}
      <text x="116" y="42" fontSize="15" fontWeight="900" fill="#7c88d6" stroke="#fff" strokeWidth="2.4" paintOrder="stroke" fontFamily="inherit">
        z
      </text>
      {/* 초승달 지팡이 */}
      <HeldProp hand={fur}>
        <rect x="-2.6" y="-30" width="5.2" height="42" rx="2.6" fill="#c58f66" stroke={O} strokeWidth="2.4" />
        <path d="M6 -56 C -8 -56 -14 -40 -2 -32 C -10 -42 -4 -52 8 -52 Z" fill="#ffe27a" stroke={O} strokeWidth="2.6" />
        <circle cx="10" cy="-44" r="2.4" fill="#fff3b8" stroke={O} strokeWidth="1.6" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 찌부펭귄 : 납작하게 눌린 몸, 하얀 배, 얼음 망치
 * --------------------------------------------------------- */
export function JjibuPenguinArt({ className }: CharacterArtProps) {
  const fur = "#6377a3";
  const shade = "#4d5f88";
  return (
    <HeroSvg className={className}>
      <Feet fill="#ffb347" shade="#f09a2a" rx={17} />
      {/* 몸 : 하얀 배 */}
      <path d={BODY} fill={fur} />
      <ellipse cx="80" cy="146" rx="26" ry="21" fill="#fff" />
      <path d="M60 156 C 66 164 94 164 100 156 C 94 168 66 168 60 156 Z" fill="#e5ecf6" />
      <path d={BODY} fill="none" stroke={O} strokeWidth={S} />
      {/* 플리퍼 */}
      <ellipse cx="46" cy="140" rx="9" ry="17" transform="rotate(18 46 140)" fill={fur} stroke={O} strokeWidth={S} />
      {/* 머리 : 납작한 둥근 모양 */}
      <Head fur={fur} shade={shade} rx={52} ry={37} cy={84} />
      {/* 하트 모양 하얀 얼굴 */}
      <path d="M80 78 C 66 60 36 68 42 94 C 46 108 66 112 80 106 C 94 112 114 108 118 94 C 124 68 94 60 80 78 Z" fill="#fff" stroke={O} strokeWidth="2.2" />
      <Eyes y={88} dx={21} rx={6.6} ry={8.6} />
      <path d="M68 97 Q80 90 92 97 Q80 108 68 97 Z" fill="#ffb347" stroke={O} strokeWidth="2.4" />
      <Blush y={101} />
      <path d="M42 77 L56 82" stroke={O} strokeWidth="2.6" fill="none" />
      <path d="M118 77 L104 82" stroke={O} strokeWidth="2.6" fill="none" />
      {/* 목도리 */}
      <path d="M52 124 C 64 134 96 134 108 124 C 108 117 98 116 80 116 C 62 116 52 117 52 124 Z" fill="#ff8f9f" stroke={O} strokeWidth={S} />
      <path d="M94 130 L106 146 L96 150 L88 134 Z" fill="#ff8f9f" stroke={O} strokeWidth="2.6" />
      {/* 얼음 망치 */}
      <HeldProp hand={fur}>
        <rect x="-2.8" y="-30" width="5.6" height="42" rx="2.8" fill="#c58f66" stroke={O} strokeWidth="2.4" />
        <rect x="-15" y="-54" width="30" height="24" rx="6" fill="#bfeaff" stroke={O} strokeWidth="2.8" />
        <path d="M-9 -48 L-3 -48 M-9 -42 L-6 -42" stroke="#fff" strokeWidth="2.6" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 뽀짝고래 : 하늘색 큰 머리, 물줄기, 꼬리지느러미, 금빛 왕관과 삼지창
 * --------------------------------------------------------- */
export function PpojjakWhaleArt({ className }: CharacterArtProps) {
  const fur = "#93d6f7";
  const shade = "#5db6e8";
  return (
    <HeroSvg className={className}>
      {/* 꼬리지느러미 */}
      <g className="art-ear art-ear--right">
        <path d="M104 150 C 124 150 140 138 140 120 C 130 126 120 124 114 132 C 122 120 128 106 126 96 C 116 106 108 122 104 136 Z" fill={shade} stroke={O} strokeWidth={S} />
      </g>
      {/* 물줄기 */}
      <g fill="#d9f4ff" stroke="#5db6e8" strokeWidth="2.2">
        <path d="M80 40 C 76 28 66 24 62 14 C 70 16 78 22 80 30 C 82 22 90 16 98 14 C 94 24 84 28 80 40 Z" />
        <circle cx="58" cy="26" r="3" />
        <circle cx="104" cy="24" r="3.4" />
      </g>
      <Feet fill={fur} shade={shade} />
      <Outfit fill="#fff6d8" shade="#f2dfa0" belt="#59b6e8" />
      <LeftArm fill={shade} rx={8} ry={13} />
      {/* 큰 머리 */}
      <Head fur={fur} shade={shade} rx={52} ry={44} cy={82} />
      <path d="M32 100 C 50 116 110 116 128 100 C 118 118 98 124 80 124 C 62 124 42 118 32 100 Z" fill="#e9f8ff" opacity="0.9" />
      {/* 금빛 왕관 */}
      <path d="M58 44 L62 28 L72 38 L80 24 L88 38 L98 28 L102 44 Z" fill="#ffd36e" stroke={O} strokeWidth={S} />
      <circle cx="80" cy="24" r="3" fill="#ff8fa0" stroke={O} strokeWidth="1.6" />
      <Eyes y={88} dx={22} rx={8} ry={10} />
      <circle cx="102.6" cy="82" r="1.6" fill="#fff" />
      <Blush y={102} />
      <path d="M72 104 Q80 112 88 104" fill="none" stroke={O} strokeWidth="2.6" />
      {/* 삼지창 */}
      <HeldProp hand={shade}>
        <rect x="-2.6" y="-40" width="5.2" height="52" rx="2.6" fill="#ffd36e" stroke={O} strokeWidth="2.4" />
        <path d="M-12 -62 L-12 -46 Q0 -40 12 -46 L12 -62 M0 -68 L0 -46" fill="none" stroke={O} strokeWidth="6" />
        <path d="M-12 -62 L-12 -46 Q0 -40 12 -46 L12 -62 M0 -68 L0 -46" fill="none" stroke="#ffe9a0" strokeWidth="3" />
      </HeldProp>
      <path d="M126 58 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#fff3b8" stroke={O} strokeWidth="1.6" />
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 꾸물치타 : 점박이 무늬, 눈물 자국, 빨간 조끼, 단검과 속도선
 * --------------------------------------------------------- */
export function KkumulCheetahArt({ className }: CharacterArtProps) {
  const fur = "#ffd98a";
  const shade = "#efb558";
  const spot = "#8a5a43";
  return (
    <HeroSvg className={className}>
      {/* 꼬리 */}
      <g className="art-ear art-ear--right">
        <path d="M104 156 C 136 160 146 130 134 112 C 140 134 126 148 104 146 Z" fill={fur} stroke={O} strokeWidth={S} />
        <circle cx="136" cy="128" r="2.8" fill={spot} />
        <circle cx="130" cy="144" r="2.4" fill={spot} />
      </g>
      {/* 속도선 */}
      <g stroke="#fff" strokeWidth="3" opacity="0.9">
        <path d="M6 112 H22" />
        <path d="M2 128 H20" />
        <path d="M8 144 H24" />
      </g>
      {/* 둥근 귀 */}
      <g className="art-ear art-ear--left">
        <circle cx="42" cy="48" r="15" fill={fur} stroke={O} strokeWidth={S} />
        <circle cx="42" cy="49" r="7.5" fill={spot} />
      </g>
      <g className="art-ear art-ear--right">
        <circle cx="118" cy="48" r="15" fill={fur} stroke={O} strokeWidth={S} />
        <circle cx="118" cy="49" r="7.5" fill={spot} />
      </g>
      <Feet fill={fur} shade={shade} />
      <Outfit fill="#ff8f6b" shade="#ef7048" belt="#fff3b8" />
      <path d="M72 124 L80 140 L88 124" fill="none" stroke={O} strokeWidth="2.6" />
      <LeftArm fill={fur} />
      <Head fur={fur} shade={shade} />
      {/* 점무늬 */}
      <g fill={spot}>
        <circle cx="44" cy="70" r="2.6" />
        <circle cx="52" cy="62" r="2.2" />
        <circle cx="116" cy="70" r="2.6" />
        <circle cx="108" cy="62" r="2.2" />
        <circle cx="80" cy="50" r="2.4" />
        <circle cx="70" cy="54" r="1.8" />
        <circle cx="90" cy="54" r="1.8" />
      </g>
      <ellipse cx="80" cy="99" rx="19" ry="12" fill="#fff3d2" stroke={O} strokeWidth="2.2" />
      <path d="M74 94 Q80 90 86 94 Q80 100 74 94 Z" fill={spot} />
      <SmallMouth y={104} />
      <Eyes y={85} dx={21} rx={6.8} ry={8.6} />
      {/* 눈물 자국 */}
      <path d="M59 94 C 56 100 55 104 52 108" fill="none" stroke={spot} strokeWidth="3.6" />
      <path d="M101 94 C 104 100 105 104 108 108" fill="none" stroke={spot} strokeWidth="3.6" />
      <Blush y={98} />
      {/* 단검 */}
      <HeldProp hand={fur}>
        <path d="M0 -34 C 6 -28 6 -18 5 -6 L-5 -6 C -6 -18 -6 -28 0 -34 Z" fill="#f6fbff" stroke={O} strokeWidth="2.6" />
        <rect x="-9" y="-7" width="18" height="5.5" rx="2.7" fill="#ff8f6b" stroke={O} strokeWidth="2.4" />
        <rect x="-2.8" y="-1.5" width="5.6" height="11" rx="2.8" fill="#8a5a43" stroke={O} strokeWidth="2.2" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 천재금붕어 : 주황 비늘, 풍성한 지느러미, 동그란 안경, 별 지팡이
 * --------------------------------------------------------- */
export function GeniusGoldfishArt({ className }: CharacterArtProps) {
  const fur = "#ffab5c";
  const shade = "#f28a34";
  return (
    <HeroSvg className={className}>
      {/* 하늘거리는 꼬리지느러미 */}
      <g className="art-ear art-ear--left">
        <path d="M80 146 C 40 150 20 176 30 178 C 44 176 56 170 80 164 Z" fill="#ffc893" stroke={O} strokeWidth={S} opacity="0.95" />
        <path d="M80 146 C 120 150 140 176 130 178 C 116 176 104 170 80 164 Z" fill="#ffc893" stroke={O} strokeWidth={S} opacity="0.95" />
      </g>
      {/* 등지느러미 */}
      <path d="M52 50 C 56 24 80 14 80 40 C 80 14 104 24 108 50 C 96 44 64 44 52 50 Z" fill="#ffc893" stroke={O} strokeWidth={S} />
      <Feet fill={shade} shade="#d9701f" rx={13} />
      <Outfit fill="#86cdea" shade="#66b5d8" belt="#fff3b8" />
      <path d="M64 124 L80 138 L96 124" fill="#fff" stroke={O} strokeWidth="2.4" />
      {/* 옆 지느러미 */}
      <path d="M46 138 C 30 136 26 152 36 156 C 42 152 44 148 48 146 Z" fill="#ffc893" stroke={O} strokeWidth={S} />
      <Head fur={fur} shade={shade} />
      {/* 비늘 */}
      <g fill="none" stroke="#f9d1a4" strokeWidth="2" opacity="0.9">
        <path d="M48 60 q4 -4 8 0" />
        <path d="M104 60 q4 -4 8 0" />
        <path d="M60 50 q4 -4 8 0" />
        <path d="M92 50 q4 -4 8 0" />
      </g>
      {/* 안경 */}
      <circle cx="58" cy="87" r="14" fill="#fff" fillOpacity="0.55" stroke={O} strokeWidth="3" />
      <circle cx="102" cy="87" r="14" fill="#fff" fillOpacity="0.55" stroke={O} strokeWidth="3" />
      <path d="M72 86 Q80 82 88 86" fill="none" stroke={O} strokeWidth="3" />
      <Eyes y={88} dx={21} rx={6.6} ry={8.4} />
      <ellipse cx="80" cy="102" rx="5" ry="4" fill="#ff93a3" stroke={O} strokeWidth="2" />
      <Blush y={104} />
      {/* 방울 */}
      <circle cx="132" cy="64" r="6" fill="#d9f4ff" fillOpacity="0.7" stroke="#5db6e8" strokeWidth="2" />
      <circle cx="142" cy="46" r="3.6" fill="#d9f4ff" fillOpacity="0.7" stroke="#5db6e8" strokeWidth="2" />
      {/* 별 지팡이 */}
      <HeldProp hand={fur}>
        <rect x="-2.6" y="-30" width="5.2" height="42" rx="2.6" fill="#c58f66" stroke={O} strokeWidth="2.4" />
        <path d="M0 -62 L5 -50 L18 -50 L8 -42 L12 -30 L0 -37 L-12 -30 L-8 -42 L-18 -50 L-5 -50 Z" fill="#ffe27a" stroke={O} strokeWidth="2.6" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 덜덜고릴라 : 넓은 어깨, 큰 주먹, 식은땀, 울퉁불퉁 몽둥이
 * --------------------------------------------------------- */
export function DeoldeolGorillaArt({ className }: CharacterArtProps) {
  const fur = "#7a7f92";
  const shade = "#5f6477";
  return (
    <HeroSvg className={className}>
      {/* 둥근 귀 */}
      <circle cx="30" cy="80" r="11" fill={fur} stroke={O} strokeWidth={S} />
      <circle cx="30" cy="80" r="5" fill="#e7cdb7" />
      <circle cx="130" cy="80" r="11" fill={fur} stroke={O} strokeWidth={S} />
      <circle cx="130" cy="80" r="5" fill="#e7cdb7" />
      <Feet fill={shade} shade="#4a4e5e" rx={17} />
      {/* 넓은 몸 */}
      <path d="M44 126 C 38 152 52 166 80 166 C 108 166 122 152 116 126 C 104 116 56 116 44 126 Z" fill={fur} stroke={O} strokeWidth={S} />
      <path d="M62 128 C 68 122 92 122 98 128 C 100 148 92 158 80 158 C 68 158 60 148 62 128 Z" fill="#9ca1b3" />
      <path d="M80 130 V 154" stroke={shade} strokeWidth="2" />
      {/* 잎사귀 조끼 */}
      <path d="M54 124 L66 150 L58 156 L46 132 Z" fill="#9bd47a" stroke={O} strokeWidth="2.6" />
      <path d="M106 124 L94 150 L102 156 L114 132 Z" fill="#9bd47a" stroke={O} strokeWidth="2.6" />
      {/* 큰 팔 */}
      <ellipse cx="40" cy="144" rx="13" ry="17" transform="rotate(12 40 144)" fill={fur} stroke={O} strokeWidth={S} />
      <Head fur={fur} shade={shade} rx={49} ry={40} />
      {/* 밝은 얼굴 */}
      <path d="M80 76 C 64 64 42 74 46 94 C 50 112 66 114 80 108 C 94 114 110 112 114 94 C 118 74 96 64 80 76 Z" fill="#ecd5bf" stroke={O} strokeWidth="2.2" />
      {/* 이마 주름 */}
      <path d="M64 50 Q80 42 96 50" fill="none" stroke={shade} strokeWidth="3" />
      <path d="M52 80 L70 86" stroke={O} strokeWidth="3" fill="none" />
      <path d="M108 80 L90 86" stroke={O} strokeWidth="3" fill="none" />
      <Eyes y={90} dx={19} rx={6} ry={7.8} />
      <ellipse cx="72" cy="101" rx="2.4" ry="2.8" fill={O} />
      <ellipse cx="88" cy="101" rx="2.4" ry="2.8" fill={O} />
      <path d="M70 108 Q75 104 80 108 Q85 104 90 108" fill="none" stroke={O} strokeWidth="2.6" />
      <Blush y={102} />
      {/* 식은땀 + 떨림선 */}
      <path d="M126 46 C 122 52 122 56 126 56 C 130 56 130 52 126 46 Z" fill="#a9ddf3" stroke="#5aa8cc" strokeWidth="1.8" />
      <g stroke={O} strokeWidth="2.4" opacity="0.65" fill="none">
        <path d="M18 112 q-4 4 0 8 q4 4 0 8" />
        <path d="M142 112 q4 4 0 8 q-4 4 0 8" />
      </g>
      {/* 몽둥이 */}
      <HeldProp hand={fur}>
        <path d="M-5 -6 C -12 -24 -14 -46 -8 -58 C 0 -64 12 -62 12 -50 C 12 -34 8 -20 4 -6 Z" fill="#c58f66" stroke={O} strokeWidth="2.8" />
        <circle cx="-3" cy="-40" r="2.4" fill="#a66f45" />
        <circle cx="6" cy="-52" r="2.2" fill="#a66f45" />
        <circle cx="2" cy="-24" r="2" fill="#a66f45" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 꼬질백조 : 하얀 깃털에 꼬질한 얼룩, 주황 부리, 깃털 검
 * --------------------------------------------------------- */
export function KkojilSwanArt({ className }: CharacterArtProps) {
  const fur = "#fffdf8";
  const shade = "#e1e5f0";
  return (
    <HeroSvg className={className}>
      {/* 날개 */}
      <g className="art-ear art-ear--left">
        <path d="M48 122 C 20 118 10 144 26 160 C 36 156 44 146 50 134 Z" fill={fur} stroke={O} strokeWidth={S} />
        <path d="M26 160 C 16 146 20 134 30 130" fill="none" stroke="#b9bfd0" strokeWidth="3" />
      </g>
      <g className="art-ear art-ear--right">
        <path d="M112 122 C 140 118 150 144 134 160 C 124 156 116 146 110 134 Z" fill={fur} stroke={O} strokeWidth={S} />
        <path d="M134 160 C 144 146 140 134 130 130" fill="none" stroke="#b9bfd0" strokeWidth="3" />
      </g>
      <Feet fill="#ffb066" shade="#f09340" rx={14} />
      <Outfit fill="#cfe7f7" shade="#a9d0ea" belt="#ffd36e" />
      {/* 꼬질한 얼룩 */}
      <g fill="#a98a6a" opacity="0.55">
        <ellipse cx="66" cy="140" rx="7" ry="4" />
        <ellipse cx="94" cy="156" rx="6" ry="3.4" />
        <circle cx="72" cy="158" r="2.4" />
      </g>
      <LeftArm fill={fur} />
      <Head fur={fur} shade={shade} />
      {/* 머리 위 깃털 장식 */}
      <path d="M78 40 C 66 22 82 10 94 20 C 86 22 86 30 90 38" fill={fur} stroke={O} strokeWidth="2.8" />
      <path d="M92 40 C 94 30 104 28 108 34" fill="none" stroke={O} strokeWidth="2.6" />
      {/* 꼬질 자국 */}
      <g fill="#a98a6a" opacity="0.5">
        <ellipse cx="54" cy="62" rx="6" ry="3.4" />
        <ellipse cx="108" cy="58" rx="4" ry="2.6" />
      </g>
      <Eyes y={84} dx={21} rx={6.8} ry={8.6} />
      {/* 부리 */}
      <path d="M64 96 C 66 90 94 90 96 96 C 94 108 66 108 64 96 Z" fill="#ffa94d" stroke={O} strokeWidth="2.6" />
      <path d="M66 96 C 70 93 90 93 94 96" fill="none" stroke="#3b2b25" strokeWidth="2.6" />
      <circle cx="75" cy="97" r="1.6" fill={O} />
      <circle cx="85" cy="97" r="1.6" fill={O} />
      <Blush y={100} />
      {/* 깃털 검 */}
      <HeldProp hand={fur}>
        <path d="M0 -50 C 14 -40 14 -16 2 -6 L-2 -6 C -12 -16 -14 -40 0 -50 Z" fill="#fff" stroke={O} strokeWidth="2.6" />
        <path d="M0 -48 L0 -6" stroke="#b9bfd0" strokeWidth="2" />
        <rect x="-8" y="-7" width="16" height="5" rx="2.5" fill="#ffd36e" stroke={O} strokeWidth="2.2" />
        <rect x="-2.6" y="-2" width="5.2" height="10" rx="2.6" fill="#c58f66" stroke={O} strokeWidth="2.2" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 뻣뻣문어 : 보라색 둥근 머리, 쭉 뻗은 뻣뻣한 다리, 굳은 표정
 * --------------------------------------------------------- */
export function PpeotppeotOctopusArt({ className }: CharacterArtProps) {
  const fur = "#cba5f0";
  const shade = "#a981dc";
  return (
    <HeroSvg className={className}>
      {/* 뻣뻣한 다리 */}
      <g fill={fur} stroke={O} strokeWidth={S}>
        <path d="M46 130 L28 164 L22 174 L36 176 L54 148 Z" />
        <path d="M60 140 L52 168 L50 178 L64 178 L70 150 Z" />
        <path d="M100 140 L108 168 L110 178 L96 178 L90 150 Z" />
        <path d="M114 130 L132 164 L138 174 L124 176 L106 148 Z" />
      </g>
      <g fill={shade}>
        <circle cx="38" cy="162" r="2.4" />
        <circle cx="57" cy="162" r="2.4" />
        <circle cx="103" cy="162" r="2.4" />
        <circle cx="122" cy="162" r="2.4" />
      </g>
      <path d={BODY} fill={fur} />
      <path d={BODY_SHADE} fill={shade} />
      <path d={BODY} fill="none" stroke={O} strokeWidth={S} />
      <path d="M60 144 H100" stroke={shade} strokeWidth="3" />
      <ellipse cx="46" cy="140" rx="8" ry="14" transform="rotate(14 46 140)" fill={fur} stroke={O} strokeWidth={S} />
      {/* 길쭉한 머리 */}
      <Head fur={fur} shade={shade} rx={47} ry={46} cy={74} />
      <path d="M40 44 C 40 36 52 30 60 32" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
      {/* 굳은 표정 */}
      <path d="M48 74 L70 74" stroke={O} strokeWidth="3.2" fill="none" />
      <path d="M112 74 L90 74" stroke={O} strokeWidth="3.2" fill="none" />
      <Eyes y={86} dx={20} rx={6.4} ry={8.2} />
      <Blush y={98} />
      <path d="M70 105 H90" stroke={O} strokeWidth="3" fill="none" />
      <g stroke="#fff" strokeWidth="2.4" opacity="0.8" fill="none">
        <path d="M104 40 q6 6 10 16" />
      </g>
      {/* 굳은 다리로 든 검 */}
      <HeldProp hand={fur}>
        <path d="M0 -38 C 5 -33 6 -22 6 -6 L-6 -6 C -6 -22 -5 -33 0 -38 Z" fill="#f6fbff" stroke={O} strokeWidth="2.6" />
        <rect x="-10.5" y="-7" width="21" height="6" rx="3" fill="#c59bf2" stroke={O} strokeWidth="2.6" />
        <rect x="-3" y="-1" width="6" height="11" rx="3" fill="#c58f66" stroke={O} strokeWidth="2.4" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 수속성냥이 : 연하늘 털, 물방울 이마, 뾰족한 귀, 물방울 지팡이
 * --------------------------------------------------------- */
export function WaterKittyArt({ className }: CharacterArtProps) {
  const fur = "#e4f6ff";
  const shade = "#b3dbf2";
  return (
    <HeroSvg className={className}>
      {/* 꼬리 (물방울 끝) */}
      <g className="art-ear art-ear--right">
        <path d="M104 158 C 136 160 150 134 136 114 C 128 122 138 138 120 146 C 114 148 108 148 104 148 Z" fill={fur} stroke={O} strokeWidth={S} />
        <path d="M137 106 C 131 114 131 120 137 120 C 143 120 143 114 137 106 Z" fill="#7ccdf5" stroke={O} strokeWidth="2" />
      </g>
      {/* 뾰족한 귀 */}
      <g className="art-ear art-ear--left">
        <path d="M36 62 L30 20 L72 42 Z" fill={fur} stroke={O} strokeWidth={S} />
        <path d="M40 54 L38 32 L58 44 Z" fill="#8fd0f0" />
      </g>
      <g className="art-ear art-ear--right">
        <path d="M124 62 L130 20 L88 42 Z" fill={fur} stroke={O} strokeWidth={S} />
        <path d="M120 54 L122 32 L102 44 Z" fill="#8fd0f0" />
      </g>
      <Feet fill={fur} shade={shade} />
      <Outfit fill="#7ec9ee" shade="#5db3df" belt="#fff3b8" />
      <LeftArm fill={fur} />
      <Head fur={fur} shade={shade} />
      {/* 이마 물방울 무늬 */}
      <path d="M80 44 C 74 52 74 58 80 58 C 86 58 86 52 80 44 Z" fill="#7ccdf5" stroke={O} strokeWidth="2" />
      <Eyes y={86} dx={21} rx={7} ry={9} color="#35516b" />
      <path d="M76 95 L84 95 L80 100 Z" fill="#ff93a3" stroke={O} strokeWidth="1.8" />
      <path d="M72 105 Q76 101 80 104 Q84 101 88 105" fill="none" stroke={O} strokeWidth="2.4" />
      {/* 수염 */}
      <g stroke={O} strokeWidth="2" opacity="0.8" fill="none">
        <path d="M38 94 L16 90" />
        <path d="M38 100 L16 104" />
        <path d="M122 94 L144 90" />
        <path d="M122 100 L144 104" />
      </g>
      <Blush y={100} />
      {/* 목도리 */}
      <path d="M52 127 C 64 138 96 138 108 127 C 110 119 100 117 80 117 C 60 117 50 119 52 127 Z" fill="#59b6e8" stroke={O} strokeWidth={S} />
      {/* 물방울 지팡이 */}
      <HeldProp hand={fur}>
        <rect x="-2.6" y="-30" width="5.2" height="42" rx="2.6" fill="#c58f66" stroke={O} strokeWidth="2.4" />
        <path d="M0 -66 C -12 -50 -14 -42 0 -34 C 14 -42 12 -50 0 -66 Z" fill="#7ccdf5" stroke={O} strokeWidth="2.8" />
        <ellipse cx="-4" cy="-48" rx="2.6" ry="4.4" fill="#fff" opacity="0.8" />
      </HeldProp>
    </HeroSvg>
  );
}

/* ---------------------------------------------------------
 * 방콕강쥐 : 축 처진 귀, 한쪽 눈 얼룩, 졸린 눈, 뼈다귀 몽둥이
 * --------------------------------------------------------- */
export function BangkokPupArt({ className }: CharacterArtProps) {
  const fur = "#e0b07c";
  const shade = "#c48d57";
  const patch = "#8a5a33";
  return (
    <HeroSvg className={className}>
      {/* 꼬리 */}
      <g className="art-ear art-ear--right">
        <path d="M106 156 C 128 156 136 140 130 128 C 126 138 118 146 104 148 Z" fill={fur} stroke={O} strokeWidth={S} />
      </g>
      {/* 축 처진 귀 */}
      <g className="art-ear art-ear--left">
        <path d="M44 48 C 22 44 10 70 16 96 C 20 108 36 106 40 92 C 44 78 46 62 44 48 Z" fill="#a8703f" stroke={O} strokeWidth={S} />
      </g>
      <g className="art-ear art-ear--right">
        <path d="M116 48 C 138 44 150 70 144 96 C 140 108 124 106 120 92 C 116 78 114 62 116 48 Z" fill="#a8703f" stroke={O} strokeWidth={S} />
      </g>
      <Feet fill={fur} shade={shade} />
      <Outfit fill="#ffd0e4" shade="#f5aecb" belt="#a9d8ff" />
      <path d="M62 136 q4 -4 8 0 M86 150 q4 -4 8 0" fill="none" stroke="#fff" strokeWidth="2.6" opacity="0.9" />
      <LeftArm fill={fur} />
      <Head fur={fur} shade={shade} />
      {/* 눈 얼룩 */}
      <path d="M96 62 C 118 56 124 84 108 96 C 98 100 88 92 90 78 C 90 70 92 66 96 62 Z" fill={patch} opacity="0.9" />
      {/* 주둥이 */}
      <ellipse cx="80" cy="100" rx="22" ry="14" fill="#fbe8cc" stroke={O} strokeWidth="2.4" />
      <ellipse cx="80" cy="94" rx="6" ry="4.2" fill="#4a3328" />
      <circle cx="82" cy="92.6" r="1.4" fill="#fff" />
      <path d="M80 98 V 104 M72 106 Q76 111 80 104 Q84 111 88 106" fill="none" stroke={O} strokeWidth="2.4" />
      <path d="M78 107 C 78 116 88 116 88 107 Z" fill="#ff8fa0" stroke={O} strokeWidth="2" />
      <SleepyEyes y={80} dx={21} lid={fur} />
      <Blush y={98} />
      <text x="120" y="38" fontSize="15" fontWeight="900" fill="#c48d57" stroke="#fff" strokeWidth="2.4" paintOrder="stroke" fontFamily="inherit">
        z
      </text>
      {/* 뼈다귀 몽둥이 */}
      <HeldProp hand={fur}>
        <rect x="-4" y="-46" width="8" height="52" rx="4" fill="#fff6e4" stroke={O} strokeWidth="2.6" />
        <circle cx="-6" cy="-50" r="6.4" fill="#fff6e4" stroke={O} strokeWidth="2.6" />
        <circle cx="6" cy="-50" r="6.4" fill="#fff6e4" stroke={O} strokeWidth="2.6" />
        <rect x="-4" y="-48" width="8" height="8" fill="#fff6e4" />
      </HeldProp>
    </HeroSvg>
  );
}
