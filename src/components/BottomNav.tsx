import GameIcon from "../GameIcons";
import type { GameIconName } from "../GameIcons";

export type TabId = "battle" | "heroes" | "growth" | "shop" | "codex";

const NAV_ITEMS: { id: TabId; icon: GameIconName; label: string }[] = [
  { id: "battle", icon: "battle", label: "전투" },
  { id: "heroes", icon: "hero", label: "용사" },
  { id: "growth", icon: "growth", label: "성장" },
  { id: "shop", icon: "shop", label: "상점" },
  { id: "codex", icon: "book", label: "도감" },
];

type BottomNavProps = {
  active: TabId;
  onChange: (tab: TabId) => void;
  /** 탭 오른쪽 위에 빨간 점을 띄울 탭 */
  badges?: Partial<Record<TabId, boolean>>;
};

export function BottomNav({ active, onChange, badges = {} }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <span className="bottom-nav__icon">
              <GameIcon name={item.icon} />
              {badges[item.id] && <span className="red-dot" aria-label="새 소식" />}
            </span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
