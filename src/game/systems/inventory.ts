import type { GameState, HeroId, ItemId, Rarity } from "../types.ts";
import { BALANCE } from "../balance.ts";
import { HERO_LIST, RARITY_ORDER } from "../data/heroes.ts";
import { ITEMS_BY_ID } from "../data/items.ts";
import { addHeroExp } from "./progression.ts";

export type Rng = () => number;

/* ---------- 구매 ---------- */

export type BuyResult = { ok: true; cost: number } | { ok: false; reason: "gold" };

export function buyItem(game: GameState, itemId: ItemId): BuyResult {
  const item = ITEMS_BY_ID[itemId];
  if (game.gold < item.price) return { ok: false, reason: "gold" };
  game.gold -= item.price;
  game.items[itemId] += 1;
  return { ok: true, cost: item.price };
}

/* ---------- 용사 소환 ---------- */

export type SummonResult = {
  heroId: HeroId;
  rarity: Rarity;
  isNew: boolean;
  /** 이미 가진 용사가 나왔을 때 경험치로 전환된 양 */
  duplicateExp: number;
  pityTriggered: boolean;
};

function pickWeighted<T extends string>(weights: Record<T, number>, order: readonly T[], rng: Rng): T {
  const total = order.reduce((sum, key) => sum + weights[key], 0);
  let roll = rng() * total;
  for (const key of order) {
    roll -= weights[key];
    if (roll < 0) return key;
  }
  return order[order.length - 1];
}

/** 획득권 한 장을 사용해 용사를 소환한다. (draft 를 직접 수정) */
export function summonHero(game: GameState, kind: "basic" | "premium", rng: Rng): SummonResult {
  let pityTriggered = false;
  let rarity: Rarity;

  if (kind === "premium") {
    game.premiumPity += 1;
    if (game.premiumPity >= BALANCE.summon.premiumPityEvery) {
      rarity = pickWeighted(BALANCE.summon.pityWeights, ["epic", "legendary"] as const, rng);
      game.premiumPity = 0;
      pityTriggered = true;
    } else {
      rarity = pickWeighted(BALANCE.summon.premium, RARITY_ORDER, rng);
      if (rarity === "epic" || rarity === "legendary") game.premiumPity = 0;
    }
  } else {
    rarity = pickWeighted(BALANCE.summon.basic, RARITY_ORDER, rng);
  }

  const pool = HERO_LIST.filter((hero) => hero.rarity === rarity);
  const hero = pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
  const progress = game.heroes[hero.id];
  game.stats.summons += 1;

  if (!progress.owned) {
    progress.owned = true;
    return { heroId: hero.id, rarity, isNew: true, duplicateExp: 0, pityTriggered };
  }
  const duplicateExp = BALANCE.duplicateExp[rarity];
  addHeroExp(game, hero.id, duplicateExp);
  return { heroId: hero.id, rarity, isNew: false, duplicateExp, pityTriggered };
}

/* ---------- 아이템 사용 ---------- */

export type ConsumeItemResult =
  | { ok: true; kind: "summon"; summon: SummonResult }
  | { ok: true; kind: "buff"; label: string }
  | { ok: true; kind: "exp"; exp: number; levelsGained: number }
  | { ok: false; reason: "empty" };

export function consumeItem(game: GameState, itemId: ItemId, rng: Rng): ConsumeItemResult {
  if (game.items[itemId] <= 0) return { ok: false, reason: "empty" };
  game.items[itemId] -= 1;

  switch (itemId) {
    case "ticket_basic":
      return { ok: true, kind: "summon", summon: summonHero(game, "basic", rng) };
    case "ticket_premium":
      return { ok: true, kind: "summon", summon: summonHero(game, "premium", rng) };
    case "gold_boost":
      game.buffs.goldBoostSec = BALANCE.items.goldBoostSec;
      return { ok: true, kind: "buff", label: "골드 획득 +50% (15분)" };
    case "crit_clover":
      game.buffs.critBoostSec = BALANCE.items.critBoostSec;
      return { ok: true, kind: "buff", label: "치명타 확률 +15% (10분)" };
    case "exp_candy": {
      const exp = BALANCE.items.expCandyExp;
      const levelsGained = addHeroExp(game, game.activeHeroId, exp);
      return { ok: true, kind: "exp", exp, levelsGained };
    }
  }
}
