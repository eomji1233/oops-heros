/*
 * 게임 전체에서 쓰는 타입 정의 (React에 의존하지 않는 순수 타입)
 */

/* ---------- 용사 ---------- */

export const HERO_IDS = [
  "heeing-rabbit",
  "kkomaeng-giraffe",
  "kkubeok-owl",
  "jjibu-penguin",
  "ppojjak-whale",
  "kkumul-cheetah",
  "genius-goldfish",
  "deoldeol-gorilla",
  "kkojil-swan",
  "ppeotppeot-octopus",
  "water-kitty",
  "bangkok-pup",
] as const;

export type HeroId = (typeof HERO_IDS)[number];

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type PassiveKind =
  | "attackPct" // 공격력 +%
  | "hpPct" // 최대 체력 +%
  | "speedPct" // 공격 속도 +%
  | "critChance" // 치명타 확률 +(절대값)
  | "critDamage" // 치명타 피해 배율 +(절대값)
  | "goldPct" // 골드 획득 +%
  | "expPct" // 경험치 획득 +%
  | "regenPct" // 초당 체력 재생 (최대 체력 비율)
  | "bossDamagePct" // 보스에게 주는 피해 +%
  | "damageReduction"; // 받는 피해 감소 (비율)

export type PassiveEffect = { kind: PassiveKind; value: number };

export type HeroAcquisition =
  | { type: "starter" }
  | { type: "stage"; world: number; stage: number }
  | { type: "ticket" };

export type HeroDef = {
  id: HeroId;
  name: string;
  description: string;
  rarity: Rarity;
  baseAttack: number;
  baseHp: number;
  /** 초당 공격 횟수 */
  attackSpeed: number;
  passive: { name: string; description: string; effects: PassiveEffect[] };
  acquisition: HeroAcquisition;
  acquisitionText: string;
};

export type HeroProgress = {
  owned: boolean;
  level: number;
  exp: number;
};

/* ---------- 몬스터 / 월드 ---------- */

export type MonsterKind = "normal" | "boss";

export type MonsterDef = {
  id: string;
  name: string;
  kind: MonsterKind;
  description: string;
  hpMult: number;
  atkMult: number;
  goldMult: number;
  expMult: number;
};

export type WorldDef = {
  id: string;
  name: string;
  description: string;
  /** 실제로 플레이 가능한 월드인지 (배경/몬스터가 준비되었는지) */
  implemented: boolean;
  stageCount: number;
  monsterIds: string[];
  bossIds: string[];
  /** 보스를 처음 처치했을 때 지급되는 용사 */
  stageHeroRewards: { stage: number; heroId: HeroId }[];
  /** 보스를 처음 처치했을 때 지급되는 아이템 */
  stageItemRewards: { stage: number; itemId: ItemId; count: number }[];
};

export type StagePosition = { world: number; stage: number };

/* ---------- 아이템 / 상점 ---------- */

export const ITEM_IDS = ["ticket_basic", "ticket_premium", "gold_boost", "crit_clover", "exp_candy"] as const;
export type ItemId = (typeof ITEM_IDS)[number];

export type ItemDef = {
  id: ItemId;
  name: string;
  description: string;
  price: number;
  category: "ticket" | "gold" | "growth" | "exp";
  /** 사용 효과를 설명하는 짧은 문구 */
  effectText: string;
};

/* ---------- 퀘스트 / 보상 ---------- */

export type RewardBundle = { gold?: number; items?: Partial<Record<ItemId, number>> };

export type QuestMetric = "kills" | "attackUpgrades" | "goldEarned" | "heroesOwned";

export type QuestDef = {
  id: string;
  name: string;
  description: string;
  metric: QuestMetric;
  target: number;
  /** daily: 매일 초기화, permanent: 한 번만 수령 */
  scope: "daily" | "permanent";
  reward: RewardBundle;
};

/* ---------- 저장되는 게임 상태 ---------- */

export type UpgradeKind = "attack" | "health";

export type DailyState = {
  dateKey: string;
  kills: number;
  attackUpgrades: number;
  goldEarned: number;
  claimedQuests: string[];
  checkInClaimed: boolean;
  /** 마지막으로 출석 보상을 받은 날짜 */
  lastCheckInKey: string;
  streak: number;
};

export type OfflineReward = { gold: number; exp: number; seconds: number };

export type GameState = {
  version: number;
  gold: number;
  totalKills: number;
  stage: StagePosition;
  bestStage: StagePosition;
  /** 구현된 마지막 스테이지의 보스를 한 번이라도 처치했는지 */
  finalCleared: boolean;
  /** 현재 스테이지에서 처치한 일반 몬스터 수 (일반 몬스터 수에 도달하면 보스 등장) */
  killsInStage: number;
  activeHeroId: HeroId;
  heroes: Record<HeroId, HeroProgress>;
  upgrades: Record<UpgradeKind, number>;
  items: Record<ItemId, number>;
  /** 남은 지속 시간(초). 게임이 실제로 진행되는 동안만 줄어든다. */
  buffs: { goldBoostSec: number; critBoostSec: number };
  daily: DailyState;
  claimedPermanentQuests: string[];
  discoveredMonsters: Record<string, number>;
  premiumPity: number;
  pendingOffline: OfflineReward | null;
  stats: { totalGoldEarned: number; bossKills: number; summons: number };
  /** 마지막으로 게임이 실행 중이던 시각 (ms) */
  lastSeen: number;
  /** 지금까지 관측한 가장 늦은 시각 (기기 시간을 되돌려도 믿을 수 있는 시계) */
  maxSeen: number;
};

/* ---------- 전투 상태 (저장하지 않는 일시 상태) ---------- */

export type BattlePhase = "fighting" | "monsterDying" | "monsterSpawning" | "heroDown";

export type BattleMonster = {
  defId: string;
  name: string;
  isBoss: boolean;
  maxHp: number;
  hp: number;
  attack: number;
  goldReward: number;
  expReward: number;
};

export type HitInfo = { id: number; damage: number; crit: boolean };
export type KillInfo = { id: number; gold: number; exp: number; boss: boolean };
export type HeroHitInfo = { id: number; damage: number };

export type BattleState = {
  phase: BattlePhase;
  phaseTimer: number;
  monster: BattleMonster;
  heroHp: number;
  heroCooldown: number;
  swingTimer: number | null;
  swingDuration: number;
  monsterCooldown: number;
  buffAccumulator: number;
  /** 시각 연출 동기화용 카운터 (값이 바뀌면 애니메이션을 다시 재생) */
  attackId: number;
  lastHit: HitInfo | null;
  monsterAttackId: number;
  lastHeroHit: HeroHitInfo | null;
  lastKill: KillInfo | null;
  spawnId: number;
  stageClearId: number;
  heroDownId: number;
};

/* ---------- 알림 ---------- */

export type NoticeTone = "info" | "good" | "warn";
export type Notice = { text: string; tone: NoticeTone };

/* ---------- 계산 결과 ---------- */

export type HeroStats = {
  level: number;
  attack: number;
  maxHp: number;
  speed: number;
  critChance: number;
  critDamage: number;
  goldMult: number;
  expMult: number;
  regenPct: number;
  bossDamageMult: number;
  damageReduction: number;
  /** 초당 기대 피해량 (치명타 반영) */
  dps: number;
  power: number;
};
