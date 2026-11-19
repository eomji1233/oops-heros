import type { CharacterArtProps } from "./types";

/*
 * 임시 캐릭터 일러스트 (인라인 SVG)
 * 두 캐릭터가 같은 그림체로 보이도록 아래 규칙을 공유합니다.
 *  - 굵기 3의 둥근 외곽선(색은 채색과 어울리는 짙은 톤)
 *  - 밝은 면 + 한 단계 어두운 그림자 면 + 흰 하이라이트
 *  - 동그란 눈, 분홍 볼터치
 */

const OUTLINE = "#7a5546";
const STROKE = 3;

/* ---------------------------------------------------------
 * 히잉토끼 : 축 처진 긴 귀, 살짝 울상, 작은 목검
 * --------------------------------------------------------- */

const RABBIT = {
  fur: "#fff6ec",
  furShade: "#f1d8c6",
  innerEar: "#ffbfca",
  tunic: "#a8e6cb",
  tunicShade: "#7fcfaa",
  scarf: "#ffb98a",
  scarfShade: "#f09a68",
  blush: "#ff9fab",
  eye: "#4a3328",
};

const EAR_OUTER =
  "M62 54 C 40 34 15 44 11 74 C 8 98 17 120 32 118 C 47 116 47 94 53 78 C 56 68 60 60 62 54 Z";
const EAR_INNER =
  "M57 62 C 42 49 26 56 24 77 C 22 94 28 107 34 105 C 42 103 44 89 48 78 C 51 71 54 66 57 62 Z";

export function HeeingRabbitArt({ className }: CharacterArtProps) {
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
      {/* 축 처진 귀 (머리 뒤) */}
      <g>
        <g className="art-ear art-ear--left">
          <path d={EAR_OUTER} fill={RABBIT.fur} />
          <path d={EAR_INNER} fill={RABBIT.innerEar} />
          <path d="M14 96 C 16 110 24 118 32 117 C 26 110 22 104 21 96Z" fill={RABBIT.furShade} />
          <path d={EAR_OUTER} fill="none" stroke={OUTLINE} strokeWidth={STROKE} />
        </g>
        <g transform="translate(160 0) scale(-1 1)">
          <g className="art-ear art-ear--right">
            <path d={EAR_OUTER} fill={RABBIT.fur} />
            <path d={EAR_INNER} fill={RABBIT.innerEar} />
            <path d="M14 96 C 16 110 24 118 32 117 C 26 110 22 104 21 96Z" fill={RABBIT.furShade} />
            <path d={EAR_OUTER} fill="none" stroke={OUTLINE} strokeWidth={STROKE} />
          </g>
        </g>
      </g>

      {/* 발 */}
      <ellipse cx="62" cy="169" rx="15" ry="8" fill={RABBIT.fur} stroke={OUTLINE} strokeWidth={STROKE} />
      <ellipse cx="98" cy="169" rx="15" ry="8" fill={RABBIT.fur} stroke={OUTLINE} strokeWidth={STROKE} />
      <ellipse cx="62" cy="172" rx="9" ry="3.5" fill={RABBIT.furShade} />
      <ellipse cx="98" cy="172" rx="9" ry="3.5" fill={RABBIT.furShade} />

      {/* 몸 (초록 튜닉) */}
      <path
        d="M51 126 C 48 150 56 166 80 166 C 104 166 112 150 109 126 C 100 118 60 118 51 126 Z"
        fill={RABBIT.tunic}
      />
      <path
        d="M93 122 C 106 130 111 150 104 162 C 100 166 93 166 88 166 C 98 152 100 136 93 122 Z"
        fill={RABBIT.tunicShade}
      />
      <path
        d="M51 126 C 48 150 56 166 80 166 C 104 166 112 150 109 126 C 100 118 60 118 51 126 Z"
        fill="none"
        stroke={OUTLINE}
        strokeWidth={STROKE}
      />
      {/* 허리띠 */}
      <path d="M53 148 Q80 156 107 148" fill="none" stroke={OUTLINE} strokeWidth="8" />
      <path d="M53 148 Q80 156 107 148" fill="none" stroke="#ffd36e" strokeWidth="4.5" />
      <circle cx="80" cy="153" r="4.5" fill="#fff3b8" stroke={OUTLINE} strokeWidth="2" />

      {/* 왼팔 */}
      <ellipse
        cx="49"
        cy="142"
        rx="8.5"
        ry="12"
        transform="rotate(14 49 142)"
        fill={RABBIT.fur}
        stroke={OUTLINE}
        strokeWidth={STROKE}
      />

      {/* 머리 */}
      <ellipse cx="80" cy="80" rx="50" ry="42" fill={RABBIT.furShade} />
      <ellipse cx="76" cy="77" rx="47" ry="38.5" fill={RABBIT.fur} />
      <ellipse cx="80" cy="80" rx="50" ry="42" fill="none" stroke={OUTLINE} strokeWidth={STROKE} />
      <ellipse cx="58" cy="56" rx="14" ry="6.5" transform="rotate(-24 58 56)" fill="#fff" opacity="0.8" />
      {/* 삐죽 머리카락 */}
      <path
        d="M78 40 C 72 29 83 22 88 30 C 91 35 86 38 84 36"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="2.8"
      />

      {/* 얼굴 : 눈썹 (울상) */}
      <path d="M49 78 L67 71" stroke={OUTLINE} strokeWidth="2.8" fill="none" />
      <path d="M111 78 L93 71" stroke={OUTLINE} strokeWidth="2.8" fill="none" />
      {/* 눈 */}
      <g className="art-blink">
        <ellipse cx="60" cy="87" rx="7.2" ry="9" fill={RABBIT.eye} />
        <ellipse cx="100" cy="87" rx="7.2" ry="9" fill={RABBIT.eye} />
        <circle cx="62.6" cy="83.6" r="2.8" fill="#fff" />
        <circle cx="102.6" cy="83.6" r="2.8" fill="#fff" />
        <circle cx="58" cy="91" r="1.4" fill="#fff" />
        <circle cx="98" cy="91" r="1.4" fill="#fff" />
      </g>
      {/* 눈물 한 방울 */}
      <path
        d="M51 96 C 47.5 101 47.5 105 51 105 C 54.5 105 54.5 101 51 96 Z"
        fill="#a9ddf3"
        stroke="#5aa8cc"
        strokeWidth="1.6"
      />
      {/* 볼터치 */}
      <ellipse cx="43" cy="99" rx="8" ry="5" fill={RABBIT.blush} opacity="0.75" />
      <ellipse cx="117" cy="99" rx="8" ry="5" fill={RABBIT.blush} opacity="0.75" />
      {/* 코와 입 (울먹이는 입) */}
      <ellipse cx="80" cy="95" rx="4.8" ry="3.4" fill="#ff93a3" stroke={OUTLINE} strokeWidth="1.8" />
      <path d="M72.5 105.5 Q76.2 101 80 104.8 Q83.8 101 87.5 105.5" fill="none" stroke={OUTLINE} strokeWidth="2.4" />

      {/* 목도리 */}
      <path
        d="M52 127 C 64 138 96 138 108 127 C 110 119 100 117 80 117 C 60 117 50 119 52 127 Z"
        fill={RABBIT.scarf}
        stroke={OUTLINE}
        strokeWidth={STROKE}
      />
      <path d="M70 135 C 84 139 98 137 106 129 C 100 137 88 142 70 135Z" fill={RABBIT.scarfShade} />
      <path
        d="M94 135 L108 151 L98 155 L88 139 Z"
        fill={RABBIT.scarf}
        stroke={OUTLINE}
        strokeWidth="2.6"
      />

      {/* 오른손 + 작은 목검 */}
      <g transform="translate(113 142)">
        <g className="art-sword">
          <g transform="rotate(24)">
            <path d="M0 -38 C 5 -33 6 -22 6 -6 L-6 -6 C -6 -22 -5 -33 0 -38 Z" fill="#f6fbff" />
            <path d="M0 -38 C 5 -33 6 -22 6 -6 L2 -6 C 3 -22 2.5 -31 0 -38 Z" fill="#cfe6f1" />
            <path
              d="M0 -38 C 5 -33 6 -22 6 -6 L-6 -6 C -6 -22 -5 -33 0 -38 Z"
              fill="none"
              stroke={OUTLINE}
              strokeWidth="2.6"
            />
            <rect x="-10.5" y="-7" width="21" height="6" rx="3" fill="#ffd36e" stroke={OUTLINE} strokeWidth="2.6" />
            <rect x="-3" y="-1" width="6" height="11" rx="3" fill="#c58f66" stroke={OUTLINE} strokeWidth="2.4" />
            <circle cx="0" cy="12" r="3.4" fill="#ffd36e" stroke={OUTLINE} strokeWidth="2.2" />
            <ellipse cx="0" cy="4" rx="6.8" ry="6" fill={RABBIT.fur} stroke={OUTLINE} strokeWidth={STROKE} />
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------
 * 말랑 슬라임 : 둥글고 말랑한 초록색 몬스터
 * --------------------------------------------------------- */

const SLIME = {
  main: "#abe9a3",
  shade: "#7fd08a",
  glow: "#d4f8c8",
  outline: "#4d8f5f",
  eye: "#2f4a38",
};

const SLIME_BODY =
  "M85 12 C 118 12 146 40 154 80 C 160 108 144 122 85 122 C 26 122 10 108 16 80 C 24 40 52 12 85 12 Z";

export function GreenSlimeArt({ className }: CharacterArtProps) {
  return (
    <svg
      className={className}
      viewBox="0 -8 170 138"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* 윗부분 말랑한 꼭지 */}
      <path
        d="M80 16 C 75 4 86 -4 94 3 C 89 4 87 9 89 16 Z"
        fill={SLIME.main}
        stroke={SLIME.outline}
        strokeWidth={STROKE}
      />

      {/* 몸 */}
      <path d={SLIME_BODY} fill={SLIME.main} />
      <path
        d="M16 84 C 14 106 30 122 85 122 C 140 122 156 106 154 84 C 140 104 112 109 85 109 C 58 109 30 104 16 84 Z"
        fill={SLIME.shade}
      />
      <path d="M26 70 C 30 46 54 24 82 18 C 60 30 40 50 34 76 Z" fill={SLIME.glow} opacity="0.8" />
      <path d={SLIME_BODY} fill="none" stroke={SLIME.outline} strokeWidth={STROKE} />

      {/* 하이라이트 */}
      <ellipse cx="48" cy="44" rx="10" ry="5" transform="rotate(-38 48 44)" fill="#fff" opacity="0.85" />
      <circle cx="64" cy="29" r="2.6" fill="#fff" opacity="0.8" />

      {/* 몸속 방울 */}
      <circle cx="122" cy="98" r="4.5" fill="#fff" opacity="0.4" />
      <circle cx="134" cy="84" r="2.6" fill="#fff" opacity="0.4" />
      <circle cx="40" cy="100" r="3.2" fill="#fff" opacity="0.35" />

      {/* 눈 */}
      <g className="art-blink">
        <ellipse cx="62" cy="70" rx="7.6" ry="10" fill={SLIME.eye} />
        <ellipse cx="108" cy="70" rx="7.6" ry="10" fill={SLIME.eye} />
        <circle cx="64.8" cy="66" r="3" fill="#fff" />
        <circle cx="110.8" cy="66" r="3" fill="#fff" />
        <circle cx="60" cy="74" r="1.5" fill="#fff" />
        <circle cx="106" cy="74" r="1.5" fill="#fff" />
      </g>
      {/* 볼터치 */}
      <ellipse cx="42" cy="87" rx="8.5" ry="5" fill="#ff9fb0" opacity="0.7" />
      <ellipse cx="128" cy="87" rx="8.5" ry="5" fill="#ff9fb0" opacity="0.7" />
      {/* 입 */}
      <path
        d="M76 86 Q85 102 94 86 Q85 91 76 86 Z"
        fill="#ff8fa0"
        stroke={SLIME.eye}
        strokeWidth="2.2"
      />
    </svg>
  );
}
