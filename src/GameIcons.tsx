/*
 * 게임 UI 전용 아이콘 (인라인 SVG)
 * 모든 아이콘이 같은 그림체를 갖도록
 *  - 32x32 영역
 *  - 굵기 2의 둥근 갈색 외곽선
 *  - 파스텔 면 + 흰 하이라이트
 * 규칙을 공유합니다.
 */

export type GameIconName =
  | "sword"
  | "heart"
  | "coin"
  | "star"
  | "battle"
  | "hero"
  | "growth"
  | "shop"
  | "book"
  | "sparkle"
  | "gift"
  | "ticket"
  | "clover"
  | "candy"
  | "lock"
  | "check"
  | "crown"
  | "clock";

const LINE = "#7a5546";

type GameIconProps = {
  name: GameIconName;
  className?: string;
};

function Sword({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`rotate(45 16 16) translate(16 16) scale(${scale}) translate(-16 -16)`}>
      <path d="M16 2.5 C 19 5 19.5 10 19.5 19 L12.5 19 C 12.5 10 13 5 16 2.5 Z" fill="#f6fbff" />
      <path d="M16 2.5 C 19 5 19.5 10 19.5 19 L17.5 19 C 17.8 10 17.4 5.5 16 2.5 Z" fill="#cfe6f1" />
      <path
        d="M16 2.5 C 19 5 19.5 10 19.5 19 L12.5 19 C 12.5 10 13 5 16 2.5 Z"
        fill="none"
        stroke={LINE}
        strokeWidth="2"
      />
      <rect x="9" y="19" width="14" height="4" rx="2" fill="#ffd36e" stroke={LINE} strokeWidth="2" />
      <rect x="14" y="23" width="4" height="6" rx="2" fill="#c58f66" stroke={LINE} strokeWidth="2" />
    </g>
  );
}

function IconShapes({ name }: { name: GameIconName }) {
  switch (name) {
    case "sword":
      return <Sword />;

    case "battle":
      return (
        <>
          <g transform="scale(-1 1) translate(-32 0)">
            <Sword scale={0.92} />
          </g>
          <Sword scale={0.92} />
        </>
      );

    case "heart":
      return (
        <>
          <path
            d="M16 27.5 C 6 20.5 3 14.5 5 9.8 C 7.2 5 13.2 5 16 10 C 18.8 5 24.8 5 27 9.8 C 29 14.5 26 20.5 16 27.5 Z"
            fill="#ff9fb4"
            stroke={LINE}
            strokeWidth="2"
          />
          <path d="M9 11 C 10 9 12 8.8 13.4 10" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
        </>
      );

    case "coin":
      return (
        <>
          <circle cx="16" cy="16" r="12" fill="#ffd36e" stroke={LINE} strokeWidth="2" />
          <circle cx="16" cy="16" r="7.5" fill="#ffe59a" stroke="#e5a93a" strokeWidth="1.6" />
          <path d="M10 10 C 12 7.5 15 7 17 7.5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
        </>
      );

    case "star":
      return (
        <path
          d="M16 3.5 L19.6 11.4 L28.2 12.4 L21.8 18.2 L23.6 26.8 L16 22.5 L8.4 26.8 L10.2 18.2 L3.8 12.4 L12.4 11.4 Z"
          fill="#ffd36e"
          stroke={LINE}
          strokeWidth="2"
        />
      );

    case "sparkle":
      return (
        <path
          d="M16 2 C 17 11 21 15 30 16 C 21 17 17 21 16 30 C 15 21 11 17 2 16 C 11 15 15 11 16 2 Z"
          fill="#fff6bf"
          stroke="#e5a93a"
          strokeWidth="1.6"
        />
      );

    case "hero":
      return (
        <>
          <path
            d="M10 12 C 5 10 3 17 5 24 C 6.5 28 10.5 26 11 22 C 11.5 18 12 14 10 12 Z"
            fill="#fff6ec"
            stroke={LINE}
            strokeWidth="2"
          />
          <path
            d="M22 12 C 27 10 29 17 27 24 C 25.5 28 21.5 26 21 22 C 20.5 18 20 14 22 12 Z"
            fill="#fff6ec"
            stroke={LINE}
            strokeWidth="2"
          />
          <ellipse cx="16" cy="18" rx="9.5" ry="8.5" fill="#fff6ec" stroke={LINE} strokeWidth="2" />
          <ellipse cx="12.4" cy="18.6" rx="1.5" ry="2" fill={LINE} />
          <ellipse cx="19.6" cy="18.6" rx="1.5" ry="2" fill={LINE} />
          <ellipse cx="16" cy="21.4" rx="1.4" ry="1" fill="#ff93a3" />
          <ellipse cx="9.6" cy="21.4" rx="1.8" ry="1.2" fill="#ffa5ad" opacity="0.8" />
          <ellipse cx="22.4" cy="21.4" rx="1.8" ry="1.2" fill="#ffa5ad" opacity="0.8" />
        </>
      );

    case "growth":
      return (
        <>
          <path d="M16 28 C 16 21 16 17 16 13" fill="none" stroke={LINE} strokeWidth="2" />
          <path
            d="M16 16 C 8 17 4 12 4 6 C 11 5 16 9 16 16 Z"
            fill="#a8e68a"
            stroke={LINE}
            strokeWidth="2"
          />
          <path
            d="M16 13 C 16 7 20 3.5 27 4 C 28 10 23 15 16 13 Z"
            fill="#c5f2a4"
            stroke={LINE}
            strokeWidth="2"
          />
          <path d="M9 24 C 9 27 12 29 16 29 C 20 29 23 27 23 24 Z" fill="#ffb98a" stroke={LINE} strokeWidth="2" />
        </>
      );

    case "shop":
      return (
        <>
          <path d="M11 11 C 11 4 21 4 21 11" fill="none" stroke={LINE} strokeWidth="2" />
          <path
            d="M6 11 L26 11 C 27 18 27.5 23 26 26 C 25.4 27.4 24 28 22 28 L10 28 C 8 28 6.6 27.4 6 26 C 4.5 23 5 18 6 11 Z"
            fill="#ffc7a0"
            stroke={LINE}
            strokeWidth="2"
          />
          <path
            d="M16 14.5 L17.5 18 L21 18.4 L18.4 20.8 L19.1 24.2 L16 22.5 L12.9 24.2 L13.6 20.8 L11 18.4 L14.5 18 Z"
            fill="#fff3b8"
            stroke={LINE}
            strokeWidth="1.4"
          />
        </>
      );

    case "book":
      return (
        <>
          <path
            d="M3.5 7 C 8 5 12.5 5.5 16 8 C 19.5 5.5 24 5 28.5 7 L28.5 25 C 24 23 19.5 23.5 16 26 C 12.5 23.5 8 23 3.5 25 Z"
            fill="#fff6ec"
            stroke={LINE}
            strokeWidth="2"
          />
          <path d="M16 8 L16 26" stroke={LINE} strokeWidth="2" />
          <path d="M7 11 C 9.5 10.5 11.5 11 13 12" fill="none" stroke="#a8e68a" strokeWidth="2" />
          <path d="M7 15.5 C 9.5 15 11.5 15.5 13 16.5" fill="none" stroke="#ffb7c5" strokeWidth="2" />
          <path d="M23 3.5 L23 11 L25.5 9 L28 11 L28 4.5 Z" fill="#ff9fb4" stroke={LINE} strokeWidth="1.6" />
        </>
      );

    case "gift":
      return (
        <>
          <rect x="5" y="13" width="22" height="14" rx="3" fill="#ffb7c5" stroke={LINE} strokeWidth="2" />
          <rect x="3.5" y="9" width="25" height="6" rx="2.5" fill="#ff9fb4" stroke={LINE} strokeWidth="2" />
          <path d="M16 9 L16 27" stroke={LINE} strokeWidth="2" />
          <path d="M16 9 C 12 3 6 5 9 9 Z M16 9 C 20 3 26 5 23 9 Z" fill="#fff3b8" stroke={LINE} strokeWidth="1.8" />
          <path d="M8 17 L8 23" stroke="#fff" strokeWidth="2" opacity="0.8" />
        </>
      );

    case "ticket":
      return (
        <>
          <path
            d="M3.5 10 L28.5 10 L28.5 14 C 25.5 14 25.5 18 28.5 18 L28.5 22 L3.5 22 L3.5 18 C 6.5 18 6.5 14 3.5 14 Z"
            fill="#ffe59a"
            stroke={LINE}
            strokeWidth="2"
          />
          <path d="M11 11.5 L11 20.5" stroke={LINE} strokeWidth="1.6" strokeDasharray="2 2" />
          <path d="M20 12.5 L21.2 15.2 L24 15.5 L21.9 17.4 L22.5 20 L20 18.6 L17.5 20 L18.1 17.4 L16 15.5 L18.8 15.2 Z" fill="#ff9fb4" stroke={LINE} strokeWidth="1.2" />
        </>
      );

    case "clover":
      return (
        <>
          <circle cx="11" cy="11" r="6" fill="#a8e68a" stroke={LINE} strokeWidth="2" />
          <circle cx="21" cy="11" r="6" fill="#a8e68a" stroke={LINE} strokeWidth="2" />
          <circle cx="11" cy="20" r="6" fill="#a8e68a" stroke={LINE} strokeWidth="2" />
          <circle cx="21" cy="20" r="6" fill="#a8e68a" stroke={LINE} strokeWidth="2" />
          <circle cx="16" cy="15.5" r="4" fill="#c9f3b0" />
          <path d="M16 18 C 16 23 18 27 22 29" fill="none" stroke={LINE} strokeWidth="2" />
          <path d="M8 8.5 C 9 7 10.5 6.6 12 7.2" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.9" />
        </>
      );

    case "candy":
      return (
        <>
          <path d="M5 10 L11 14 L11 18 L5 22 C 3 18 3 14 5 10 Z" fill="#ffb7c5" stroke={LINE} strokeWidth="2" />
          <path d="M27 10 L21 14 L21 18 L27 22 C 29 18 29 14 27 10 Z" fill="#ffb7c5" stroke={LINE} strokeWidth="2" />
          <circle cx="16" cy="16" r="8.5" fill="#ffd9a8" stroke={LINE} strokeWidth="2" />
          <path d="M10.5 13 C 13 12 16 14 15 17 C 14 20 18 21 21 19" fill="none" stroke="#ff9fb4" strokeWidth="2.4" />
          <path d="M11 11.5 C 12 10 13.5 9.4 15 9.6" fill="none" stroke="#fff" strokeWidth="1.8" opacity="0.9" />
        </>
      );

    case "lock":
      return (
        <>
          <path d="M10 14 L10 10 C 10 4 22 4 22 10 L22 14" fill="none" stroke={LINE} strokeWidth="2.4" />
          <rect x="6" y="13" width="20" height="15" rx="4" fill="#cfc4bb" stroke={LINE} strokeWidth="2" />
          <circle cx="16" cy="20" r="2.6" fill="#7a5546" />
          <path d="M16 21 L16 24" stroke="#7a5546" strokeWidth="2" />
        </>
      );

    case "check":
      return (
        <>
          <circle cx="16" cy="16" r="12" fill="#a8e8cd" stroke={LINE} strokeWidth="2" />
          <path d="M10 16.5 L14.5 21 L22.5 11.5" fill="none" stroke="#fff" strokeWidth="3.4" />
          <path d="M10 16.5 L14.5 21 L22.5 11.5" fill="none" stroke="#2d5c4a" strokeWidth="1.4" />
        </>
      );

    case "crown":
      return (
        <>
          <path d="M4 24 L5 10 L11.5 16 L16 7 L20.5 16 L27 10 L28 24 Z" fill="#ffd36e" stroke={LINE} strokeWidth="2" />
          <path d="M5 21 L27 21" stroke="#e5a93a" strokeWidth="2" />
          <circle cx="16" cy="6.5" r="2" fill="#ff9fb4" stroke={LINE} strokeWidth="1.4" />
          <circle cx="5" cy="9.5" r="1.8" fill="#8ed6ff" stroke={LINE} strokeWidth="1.2" />
          <circle cx="27" cy="9.5" r="1.8" fill="#8ed6ff" stroke={LINE} strokeWidth="1.2" />
        </>
      );

    case "clock":
      return (
        <>
          <circle cx="16" cy="17" r="11.5" fill="#fff6ec" stroke={LINE} strokeWidth="2" />
          <path d="M16 10.5 L16 17 L20.5 19.5" fill="none" stroke={LINE} strokeWidth="2.4" />
          <circle cx="7" cy="7" r="3.6" fill="#ffb7c5" stroke={LINE} strokeWidth="1.8" />
          <circle cx="25" cy="7" r="3.6" fill="#ffb7c5" stroke={LINE} strokeWidth="1.8" />
        </>
      );
  }
}

function GameIcon({ name, className }: GameIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <IconShapes name={name} />
    </svg>
  );
}

export default GameIcon;
