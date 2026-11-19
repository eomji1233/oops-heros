import { RARITY_LABEL } from "../game/data/heroes.ts";
import type { Rarity } from "../game/types.ts";

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return <span className={`rarity-badge rarity-badge--${rarity}`}>{RARITY_LABEL[rarity]}</span>;
}
