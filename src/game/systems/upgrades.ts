import type { GameState, UpgradeKind } from "../types.ts";
import { BALANCE } from "../balance.ts";

/** 현재 강화 레벨에서 다음 강화에 필요한 골드 */
export function upgradeCost(kind: UpgradeKind, level: number): number {
  const rule = BALANCE.upgrade[kind === "attack" ? "attack" : "health"];
  return Math.round(rule.base * rule.growth ** level);
}

export type UpgradeResult = { ok: true; cost: number; newLevel: number } | { ok: false; reason: "gold" };

/** 골드를 소모해 강화. 성공하면 draft 의 골드/레벨/퀘스트 집계를 수정한다. */
export function purchaseUpgrade(game: GameState, kind: UpgradeKind): UpgradeResult {
  const cost = upgradeCost(kind, game.upgrades[kind]);
  if (game.gold < cost) return { ok: false, reason: "gold" };
  game.gold -= cost;
  game.upgrades[kind] += 1;
  if (kind === "attack") game.daily.attackUpgrades += 1;
  return { ok: true, cost, newLevel: game.upgrades[kind] };
}
