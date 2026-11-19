import type { GameIconName } from "../GameIcons";
import type { ItemId } from "../game/types.ts";

export const ITEM_ICON: Record<ItemId, GameIconName> = {
  ticket_basic: "ticket",
  ticket_premium: "ticket",
  gold_boost: "coin",
  crit_clover: "clover",
  exp_candy: "candy",
};
