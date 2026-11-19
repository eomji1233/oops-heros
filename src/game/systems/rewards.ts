import type { GameState, OfflineReward, QuestDef, RewardBundle } from "../types.ts";
import { BALANCE } from "../balance.ts";
import { QUEST_LIST } from "../data/quests.ts";
import { addGold, addHeroExp } from "./progression.ts";
import { dateKeyOf, previousDateKey, trustedNow } from "../state.ts";
import { computeHeroStats } from "./stats.ts";
import { buildMonster } from "./monsters.ts";
import { MONSTERS_BY_ID, worldOf } from "../data/worlds.ts";

/* =========================================================
 * 오프라인 보상
 * ========================================================= */

/** 현재 스테이지의 일반 몬스터를 계속 잡는다고 가정한 초당 수익 (실제 전투 계산과 같은 공식 사용) */
export function estimateIncomePerSecond(game: GameState): { gold: number; exp: number; killsPerSec: number } {
  const stats = computeHeroStats(game, game.activeHeroId);
  const world = worldOf(game.stage);
  const monsters = world.monsterIds.map((id, index) =>
    buildMonster(MONSTERS_BY_ID[id], game.stage, index % BALANCE.normalsPerStage, false),
  );
  const count = Math.max(1, monsters.length);
  const avgHp = monsters.reduce((sum, m) => sum + m.maxHp, 0) / count;
  const avgAttack = monsters.reduce((sum, m) => sum + m.attack, 0) / count;
  const avgGold = monsters.reduce((sum, m) => sum + m.goldReward, 0) / count;
  const avgExp = monsters.reduce((sum, m) => sum + m.expReward, 0) / count;

  const killSeconds = avgHp / Math.max(0.1, stats.dps);
  const cycle = killSeconds + BALANCE.phase.dyingSec + BALANCE.phase.spawningSec;

  // 몬스터가 용사를 쓰러뜨릴 만큼 강하다면 실제로는 제대로 파밍하지 못한다.
  const incoming = (avgAttack * (1 - stats.damageReduction)) / BALANCE.monsterAttack.interval;
  const survives = incoming * killSeconds < stats.maxHp * 0.9 + stats.maxHp * stats.regenPct * killSeconds;
  const penalty = survives ? 1 : 0.25;

  const killsPerSec = (1 / cycle) * penalty;
  return {
    gold: killsPerSec * avgGold * stats.goldMult,
    exp: killsPerSec * avgExp * stats.expMult,
    killsPerSec,
  };
}

/**
 * 자리를 비운 시간에 대한 보상을 계산한다.
 * - 최대 8시간까지만 인정
 * - 음수(기기 시간을 과거로 돌림)이거나 너무 짧으면 보상 없음
 */
export function computeOfflineReward(game: GameState, elapsedMs: number): OfflineReward | null {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return null;
  const seconds = Math.min(Math.floor(elapsedMs / 1000), BALANCE.offline.maxHours * 3600);
  if (seconds < BALANCE.offline.minSeconds) return null;

  const rate = estimateIncomePerSecond(game);
  const gold = Math.floor(rate.gold * seconds * BALANCE.offline.efficiency);
  const exp = Math.floor(rate.exp * seconds * BALANCE.offline.efficiency);
  if (gold <= 0 && exp <= 0) return null;
  return { gold, exp, seconds };
}

/** 대기 중인 오프라인 보상을 합산한다. (최대 8시간분을 넘지 않게 제한) */
export function mergeOfflineReward(current: OfflineReward | null, extra: OfflineReward): OfflineReward {
  if (!current) return extra;
  const maxSeconds = BALANCE.offline.maxHours * 3600;
  const seconds = Math.min(maxSeconds, current.seconds + extra.seconds);
  const ratio = seconds / Math.max(1, current.seconds + extra.seconds);
  return {
    gold: Math.floor((current.gold + extra.gold) * ratio),
    exp: Math.floor((current.exp + extra.exp) * ratio),
    seconds,
  };
}

/** 오프라인 보상을 수령한다. 이미 수령했다면(pendingOffline 이 없다면) 아무 일도 하지 않는다. */
export function claimOfflineReward(game: GameState): OfflineReward | null {
  const reward = game.pendingOffline;
  if (!reward) return null;
  game.pendingOffline = null;
  addGold(game, reward.gold);
  addHeroExp(game, game.activeHeroId, reward.exp);
  return reward;
}

/* =========================================================
 * 일일 초기화 / 출석 보상
 * ========================================================= */

/** 날짜가 바뀌었다면 일일 데이터를 초기화한다. (기기 시간을 되돌려도 날짜는 되돌아가지 않는다) */
export function refreshDaily(game: GameState, now: number): boolean {
  const key = dateKeyOf(trustedNow(game, now));
  if (key === game.daily.dateKey) return false;
  game.daily.dateKey = key;
  game.daily.kills = 0;
  game.daily.attackUpgrades = 0;
  game.daily.goldEarned = 0;
  game.daily.claimedQuests = [];
  game.daily.checkInClaimed = false;
  return true;
}

export function checkInReward(streak: number): number {
  return BALANCE.daily.checkInGold + Math.min(streak, BALANCE.daily.maxStreakBonus) * BALANCE.daily.streakBonusGold;
}

export type CheckInResult = { ok: true; gold: number; streak: number } | { ok: false; reason: "claimed" };

export function claimCheckIn(game: GameState, now: number): CheckInResult {
  refreshDaily(game, now);
  if (game.daily.checkInClaimed) return { ok: false, reason: "claimed" };

  const today = game.daily.dateKey;
  const yesterday = previousDateKey(trustedNow(game, now));
  const streak = game.daily.lastCheckInKey === yesterday ? game.daily.streak + 1 : 1;
  const gold = checkInReward(streak - 1);

  game.daily.checkInClaimed = true;
  game.daily.lastCheckInKey = today;
  game.daily.streak = streak;
  addGold(game, gold);
  return { ok: true, gold, streak };
}

/* =========================================================
 * 퀘스트
 * ========================================================= */

export function questProgress(game: GameState, quest: QuestDef): number {
  switch (quest.metric) {
    case "kills":
      return game.daily.kills;
    case "attackUpgrades":
      return game.daily.attackUpgrades;
    case "goldEarned":
      return game.daily.goldEarned;
    case "heroesOwned":
      return Object.values(game.heroes).filter((hero) => hero.owned).length;
  }
}

export function isQuestClaimed(game: GameState, quest: QuestDef): boolean {
  return quest.scope === "daily"
    ? game.daily.claimedQuests.includes(quest.id)
    : game.claimedPermanentQuests.includes(quest.id);
}

export function isQuestComplete(game: GameState, quest: QuestDef): boolean {
  return questProgress(game, quest) >= quest.target;
}

export function applyReward(game: GameState, reward: RewardBundle): void {
  if (reward.gold) addGold(game, reward.gold);
  for (const [itemId, count] of Object.entries(reward.items ?? {})) {
    game.items[itemId as keyof typeof game.items] += count ?? 0;
  }
}

export type QuestClaimResult = { ok: true; reward: RewardBundle } | { ok: false; reason: "incomplete" | "claimed" | "unknown" };

export function claimQuest(game: GameState, questId: string, now: number): QuestClaimResult {
  refreshDaily(game, now);
  const quest = QUEST_LIST.find((q) => q.id === questId);
  if (!quest) return { ok: false, reason: "unknown" };
  if (isQuestClaimed(game, quest)) return { ok: false, reason: "claimed" };
  if (!isQuestComplete(game, quest)) return { ok: false, reason: "incomplete" };

  if (quest.scope === "daily") game.daily.claimedQuests.push(quest.id);
  else game.claimedPermanentQuests.push(quest.id);
  applyReward(game, quest.reward);
  return { ok: true, reward: quest.reward };
}

/** 수령 가능한 보상(출석 + 퀘스트)이 있는지 */
export function hasClaimableReward(game: GameState): boolean {
  if (!game.daily.checkInClaimed) return true;
  return QUEST_LIST.some((quest) => !isQuestClaimed(game, quest) && isQuestComplete(game, quest));
}
