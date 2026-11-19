import { ITEM_ICON } from "../components/itemVisuals";
import { ScreenHeader } from "../components/ScreenHeader";
import GameIcon from "../GameIcons";
import { ITEM_LIST } from "../game/data/items.ts";
import { formatNumber } from "../game/format.ts";
import { useGameStore, useGameUi } from "../game/useGame.ts";
import type { GameState, ItemDef, ItemId } from "../game/types.ts";

const CATEGORY_TITLE: Record<ItemDef["category"], string> = {
  ticket: "용사 획득권",
  gold: "골드 아이템",
  growth: "성장 아이템",
  exp: "경험치 아이템",
};

const CATEGORY_ORDER: ItemDef["category"][] = ["ticket", "gold", "growth", "exp"];

function ItemCard({ item, game, onUseItem }: { item: ItemDef; game: GameState; onUseItem: (itemId: ItemId) => void }) {
  const store = useGameStore();
  const owned = game.items[item.id];
  const poor = game.gold < item.price;
  const isTicket = item.category === "ticket";

  const handleBuy = () => {
    const result = store.buy(item.id);
    if (result.ok) store.pushNotice(`${item.name} 구매 완료!`, "good");
  };

  return (
    <li className="item-card">
      <span className={`item-card__icon item-card__icon--${item.category}`}>
        <GameIcon name={ITEM_ICON[item.id]} />
      </span>
      <div className="item-card__text">
        <strong className="item-card__name">{item.name}</strong>
        <span className="item-card__effect">{item.effectText}</span>
        <span className="item-card__desc">{item.description}</span>
        <span className="item-card__owned">보유 {owned}개</span>
      </div>
      <div className="item-card__actions">
        <button
          type="button"
          className={`buy-button${poor ? " is-poor" : ""}`}
          onClick={handleBuy}
          aria-label={`${item.name} 구매, ${formatNumber(item.price)} 골드${poor ? ", 골드가 부족해요" : ""}`}
        >
          <GameIcon name="coin" className="buy-button__coin" />
          {formatNumber(item.price)}
        </button>
        <button type="button" className="use-button" disabled={owned <= 0} onClick={() => onUseItem(item.id)}>
          {isTicket ? "소환" : "사용"}
        </button>
      </div>
    </li>
  );
}

function ShopScreen({ onUseItem }: { onUseItem: (itemId: ItemId) => void }) {
  const { game } = useGameUi();

  return (
    <div className="screen">
      <ScreenHeader title="상점" subtitle="모은 골드로 필요한 걸 사요" gold={game.gold} />
      <div className="screen__scroll">
        {CATEGORY_ORDER.map((category) => {
          const items = ITEM_LIST.filter((item) => item.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="shop-section">
              <h2 className="section-title">{CATEGORY_TITLE[category]}</h2>
              <ul className="item-list">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} game={game} onUseItem={onUseItem} />
                ))}
              </ul>
            </section>
          );
        })}
        <p className="hint">골드로만 살 수 있어요. 실제 결제는 아직 없어요.</p>
      </div>
    </div>
  );
}

export default ShopScreen;
