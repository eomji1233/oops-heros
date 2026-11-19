import type { BattleMonster, GameState, HeroId, HeroStats, Notice } from "../types.ts";
import { BALANCE } from "../balance.ts";
import { HEROES_BY_ID } from "../data/heroes.ts";
import { ITEMS_BY_ID } from "../data/items.ts";
import { WORLDS, compareStage, lastPlayableStage, nextStage, stageLabel, worldOf } from "../data/worlds.ts";
import { withObject, withSubject, withTopic } from "../utils/korean.ts";
import { expToNext } from "./stats.ts";

/** 용사에게 경험치를 주고 레벨업 횟수를 돌려준다. (draft 를 직접 수정) */
export function addHeroExp(game: GameState, heroId: HeroId, amount: number): number {
  const progress = game.heroes[heroId];
  if (!progress.owned || amount <= 0) return 0;

  let levels = 0;
  progress.exp += Math.floor(amount);
  while (progress.level < BALANCE.hero.maxLevel && progress.exp >= expToNext(progress.level)) {
    progress.exp -= expToNext(progress.level);
    progress.level += 1;
    levels += 1;
  }
  if (progress.level >= BALANCE.hero.maxLevel) progress.exp = 0;
  return levels;
}

/** 골드 획득 (통계와 일일 퀘스트 집계 포함) */
export function addGold(game: GameState, amount: number): void {
  const gained = Math.max(0, Math.floor(amount));
  game.gold += gained;
  game.stats.totalGoldEarned += gained;
  game.daily.goldEarned += gained;
}

export type KillResult = {
  gold: number;
  exp: number;
  levelsGained: number;
  stageCleared: boolean;
  notices: Notice[];
};

/** 몬스터 처치 보상과 스테이지 진행을 적용한다. (draft 를 직접 수정) */
export function applyKill(game: GameState, monster: BattleMonster, stats: HeroStats): KillResult {
  const notices: Notice[] = [];
  const gold = Math.max(1, Math.round(monster.goldReward * stats.goldMult));
  const exp = Math.max(1, Math.round(monster.expReward * stats.expMult));

  addGold(game, gold);
  game.totalKills += 1;
  game.daily.kills += 1;
  game.discoveredMonsters[monster.defId] = (game.discoveredMonsters[monster.defId] ?? 0) + 1;

  const levelsGained = addHeroExp(game, game.activeHeroId, exp);
  if (levelsGained > 0) {
    notices.push({
      text: `${HEROES_BY_ID[game.activeHeroId].name} 레벨 업! Lv.${game.heroes[game.activeHeroId].level}`,
      tone: "good",
    });
  }

  let stageCleared = false;
  if (!monster.isBoss) {
    game.killsInStage += 1;
  } else {
    stageCleared = true;
    game.stats.bossKills += 1;
    notices.push(...clearStage(game));
  }
  return { gold, exp, levelsGained, stageCleared, notices };
}

/** 보스를 처치했을 때: 첫 클리어 보상 지급 + 다음 스테이지로 이동 */
function clearStage(game: GameState): Notice[] {
  const notices: Notice[] = [];
  const cleared = { ...game.stage };
  const world = worldOf(cleared);
  const firstClear = compareStage(cleared, game.bestStage) === 0 && !game.finalCleared;
  const finalStage = lastPlayableStage();
  const isFinal = cleared.world === finalStage.world && cleared.stage === finalStage.stage;

  notices.push({ text: `STAGE ${stageLabel(cleared)} 클리어!`, tone: "good" });

  if (firstClear) {
    for (const reward of world.stageHeroRewards) {
      if (reward.stage !== cleared.stage) continue;
      const hero = game.heroes[reward.heroId];
      if (!hero.owned) {
        hero.owned = true;
        notices.push({ text: `새 동료 ${withSubject(HEROES_BY_ID[reward.heroId].name)} 합류했어요!`, tone: "good" });
      }
    }
    for (const reward of world.stageItemRewards) {
      if (reward.stage !== cleared.stage) continue;
      game.items[reward.itemId] += reward.count;
      notices.push({ text: `${ITEMS_BY_ID[reward.itemId].name} x${reward.count} 획득!`, tone: "good" });
    }
  }

  game.killsInStage = 0;
  const next = nextStage(cleared);
  if (next) {
    game.stage = next;
    if (compareStage(next, game.bestStage) > 0) game.bestStage = { ...next };
  } else if (isFinal) {
    game.finalCleared = true;
    if (firstClear) {
      const nextWorld = WORLDS[cleared.world];
      notices.push({
        text: nextWorld ? `${withObject(world.name)} 모두 클리어! ${withTopic(nextWorld.name)} 준비 중이에요.` : `${withObject(world.name)} 모두 클리어!`,
        tone: "info",
      });
    }
  }
  return notices;
}
