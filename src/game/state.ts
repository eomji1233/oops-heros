import { HERO_IDS, ITEM_IDS } from "./types.ts";
import type { DailyState, GameState, HeroId, HeroProgress, ItemId, StagePosition } from "./types.ts";
import { BALANCE } from "./balance.ts";
import { HEROES_BY_ID, STARTER_HERO_ID } from "./data/heroes.ts";
import { WORLDS, compareStage } from "./data/worlds.ts";

export const SAVE_VERSION = 1;

/** 기기의 현지 날짜를 YYYY-MM-DD 문자열로 변환 */
export function dateKeyOf(ms: number): string {
  const date = new Date(ms);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** 하루 전 날짜 키 */
export function previousDateKey(ms: number): string {
  return dateKeyOf(ms - 24 * 60 * 60 * 1000);
}

function createDaily(dateKey: string): DailyState {
  return {
    dateKey,
    kills: 0,
    attackUpgrades: 0,
    goldEarned: 0,
    claimedQuests: [],
    checkInClaimed: false,
    lastCheckInKey: "",
    streak: 0,
  };
}

export function createInitialGame(now: number): GameState {
  const heroes = {} as Record<HeroId, HeroProgress>;
  for (const id of HERO_IDS) heroes[id] = { owned: id === STARTER_HERO_ID, level: 1, exp: 0 };

  const items = {} as Record<ItemId, number>;
  for (const id of ITEM_IDS) items[id] = 0;

  return {
    version: SAVE_VERSION,
    gold: 0,
    totalKills: 0,
    stage: { world: 1, stage: 1 },
    bestStage: { world: 1, stage: 1 },
    finalCleared: false,
    killsInStage: 0,
    activeHeroId: STARTER_HERO_ID,
    heroes,
    upgrades: { attack: 0, health: 0 },
    items,
    buffs: { goldBoostSec: 0, critBoostSec: 0 },
    daily: createDaily(dateKeyOf(now)),
    claimedPermanentQuests: [],
    discoveredMonsters: {},
    premiumPity: 0,
    pendingOffline: null,
    stats: { totalGoldEarned: 0, bossKills: 0, summons: 0 },
    lastSeen: now,
    maxSeen: now,
  };
}

export function cloneGame(game: GameState): GameState {
  return structuredClone(game);
}

/** 기기 시간을 되돌려도 줄어들지 않는 "믿을 수 있는 현재 시각" */
export function trustedNow(game: GameState, now: number): number {
  return Math.max(now, game.maxSeen);
}

/* ---------- 불러오기 방어 코드 ---------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function num(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function int(value: unknown, fallback: number, min: number, max: number): number {
  return Math.floor(num(value, fallback, min, max));
}

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function sanitizeStage(value: unknown, fallback: StagePosition): StagePosition {
  if (!isRecord(value)) return fallback;
  const world = int(value.world, 1, 1, WORLDS.length);
  if (!WORLDS[world - 1].implemented) return fallback;
  const stage = int(value.stage, 1, 1, WORLDS[world - 1].stageCount);
  return { world, stage };
}

const BIG = 1e15;

/** 저장된 데이터(신뢰할 수 없는 값)를 안전한 GameState 로 변환 */
export function sanitizeGame(raw: unknown, now: number): GameState {
  const base = createInitialGame(now);
  if (!isRecord(raw)) return base;

  base.gold = Math.floor(num(raw.gold, 0, 0, BIG));
  base.totalKills = int(raw.totalKills, 0, 0, BIG);
  base.stage = sanitizeStage(raw.stage, base.stage);
  base.bestStage = sanitizeStage(raw.bestStage, base.stage);
  if (compareStage(base.bestStage, base.stage) < 0) base.bestStage = { ...base.stage };
  base.finalCleared = raw.finalCleared === true;
  base.killsInStage = int(raw.killsInStage, 0, 0, BALANCE.normalsPerStage);

  if (isRecord(raw.heroes)) {
    for (const id of HERO_IDS) {
      const saved = raw.heroes[id];
      if (!isRecord(saved)) continue;
      base.heroes[id] = {
        owned: id === STARTER_HERO_ID ? true : saved.owned === true,
        level: int(saved.level, 1, 1, BALANCE.hero.maxLevel),
        exp: int(saved.exp, 0, 0, BIG),
      };
    }
  }

  const active = raw.activeHeroId;
  base.activeHeroId =
    typeof active === "string" && (HERO_IDS as readonly string[]).includes(active) && base.heroes[active as HeroId].owned
      ? (active as HeroId)
      : STARTER_HERO_ID;

  if (isRecord(raw.upgrades)) {
    base.upgrades.attack = int(raw.upgrades.attack, 0, 0, 1000);
    base.upgrades.health = int(raw.upgrades.health, 0, 0, 1000);
  }
  if (isRecord(raw.items)) {
    for (const id of ITEM_IDS) base.items[id] = int(raw.items[id], 0, 0, 100000);
  }
  if (isRecord(raw.buffs)) {
    base.buffs.goldBoostSec = int(raw.buffs.goldBoostSec, 0, 0, 24 * 3600);
    base.buffs.critBoostSec = int(raw.buffs.critBoostSec, 0, 0, 24 * 3600);
  }
  if (isRecord(raw.daily)) {
    base.daily = {
      dateKey: typeof raw.daily.dateKey === "string" ? raw.daily.dateKey : base.daily.dateKey,
      kills: int(raw.daily.kills, 0, 0, BIG),
      attackUpgrades: int(raw.daily.attackUpgrades, 0, 0, BIG),
      goldEarned: int(raw.daily.goldEarned, 0, 0, BIG),
      claimedQuests: strList(raw.daily.claimedQuests),
      checkInClaimed: raw.daily.checkInClaimed === true,
      lastCheckInKey: typeof raw.daily.lastCheckInKey === "string" ? raw.daily.lastCheckInKey : "",
      streak: int(raw.daily.streak, 0, 0, 100000),
    };
  }
  base.claimedPermanentQuests = strList(raw.claimedPermanentQuests);

  if (isRecord(raw.discoveredMonsters)) {
    for (const [key, value] of Object.entries(raw.discoveredMonsters)) {
      base.discoveredMonsters[key] = int(value, 0, 0, BIG);
    }
  }
  base.premiumPity = int(raw.premiumPity, 0, 0, 1000);

  if (isRecord(raw.pendingOffline)) {
    const gold = int(raw.pendingOffline.gold, 0, 0, BIG);
    const exp = int(raw.pendingOffline.exp, 0, 0, BIG);
    const seconds = int(raw.pendingOffline.seconds, 0, 0, BALANCE.offline.maxHours * 3600);
    if (gold > 0 || exp > 0) base.pendingOffline = { gold, exp, seconds };
  }

  if (isRecord(raw.stats)) {
    base.stats = {
      totalGoldEarned: int(raw.stats.totalGoldEarned, 0, 0, BIG),
      bossKills: int(raw.stats.bossKills, 0, 0, BIG),
      summons: int(raw.stats.summons, 0, 0, BIG),
    };
  }

  // 시각은 저장값을 신뢰하되, 미래 값은 허용하지 않는다(기기 시간 조작 방어는 offline 계산에서 처리).
  base.lastSeen = num(raw.lastSeen, now, 0, 8.64e15);
  base.maxSeen = Math.max(num(raw.maxSeen, base.lastSeen, 0, 8.64e15), base.lastSeen);

  // 사용 가능한 용사 데이터가 없는 경우를 대비해 한 번 더 확인
  for (const id of HERO_IDS) if (!HEROES_BY_ID[id]) base.heroes[id].owned = false;
  base.heroes[STARTER_HERO_ID].owned = true;
  return base;
}
