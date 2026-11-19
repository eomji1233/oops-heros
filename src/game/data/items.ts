import type { ItemDef, ItemId } from "../types.ts";

export const ITEM_LIST: ItemDef[] = [
  {
    id: "ticket_basic",
    name: "용사 획득권",
    description: "새로운 동료를 만날 수 있는 획득권. 어떤 용사가 올지는 아무도 몰라요.",
    price: 300,
    category: "ticket",
    effectText: "용사 1명 소환 (일반~전설)",
  },
  {
    id: "ticket_premium",
    name: "고급 용사 획득권",
    description: "희귀 이상 용사만 나오는 특별 획득권. 10번째마다 영웅 이상이 확정!",
    price: 1600,
    category: "ticket",
    effectText: "희귀 이상 용사 1명 소환",
  },
  {
    id: "gold_boost",
    name: "반짝 골드 부스트",
    description: "15분 동안 몬스터가 금화를 더 많이 떨어뜨려요.",
    price: 450,
    category: "gold",
    effectText: "15분간 골드 획득 +50%",
  },
  {
    id: "crit_clover",
    name: "행운의 네잎클로버",
    description: "10분 동안 용사의 치명타가 더 자주 터져요.",
    price: 380,
    category: "growth",
    effectText: "10분간 치명타 확률 +15%",
  },
  {
    id: "exp_candy",
    name: "달콤 경험치 사탕",
    description: "출전 중인 용사가 먹으면 바로 경험치가 올라요.",
    price: 260,
    category: "exp",
    effectText: "출전 용사 경험치 +120",
  },
];

export const ITEMS_BY_ID: Record<ItemId, ItemDef> = Object.fromEntries(
  ITEM_LIST.map((item) => [item.id, item]),
) as Record<ItemId, ItemDef>;
