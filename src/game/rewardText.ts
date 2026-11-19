import { formatNumber } from "./format.ts";
import { ITEMS_BY_ID } from "./data/items.ts";
import type { ItemId, RewardBundle } from "./types.ts";

/** "150 G + 달콤 경험치 사탕 x1" 같은 보상 문구 */
export function rewardText(reward: RewardBundle): string {
  const parts: string[] = [];
  if (reward.gold) parts.push(`${formatNumber(reward.gold)} G`);
  for (const [itemId, count] of Object.entries(reward.items ?? {})) {
    parts.push(`${ITEMS_BY_ID[itemId as ItemId].name} x${count}`);
  }
  return parts.join(" + ");
}
