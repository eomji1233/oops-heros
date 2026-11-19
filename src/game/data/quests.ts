import type { QuestDef } from "../types.ts";

export const QUEST_LIST: QuestDef[] = [
  {
    id: "daily-kill-10",
    name: "몬스터 10마리 처치",
    description: "오늘 몬스터를 10마리 처치하세요.",
    metric: "kills",
    target: 10,
    scope: "daily",
    reward: { gold: 150 },
  },
  {
    id: "daily-attack-3",
    name: "공격력 3회 강화",
    description: "오늘 공격력을 3번 강화하세요.",
    metric: "attackUpgrades",
    target: 3,
    scope: "daily",
    reward: { items: { exp_candy: 1 } },
  },
  {
    id: "daily-gold-500",
    name: "골드 500 획득",
    description: "오늘 전투로 골드를 500 G 모으세요.",
    metric: "goldEarned",
    target: 500,
    scope: "daily",
    reward: { items: { ticket_basic: 1 } },
  },
  {
    id: "permanent-collect-3",
    name: "용사단 모집 (3명)",
    description: "용사를 3명 이상 모으세요.",
    metric: "heroesOwned",
    target: 3,
    scope: "permanent",
    reward: { gold: 500, items: { ticket_basic: 1 } },
  },
  {
    id: "permanent-collect-6",
    name: "용사단 모집 (6명)",
    description: "용사를 6명 이상 모으세요.",
    metric: "heroesOwned",
    target: 6,
    scope: "permanent",
    reward: { items: { ticket_premium: 1 } },
  },
];
