import type { BattleState, GameState, Notice } from "../types.ts";
import { BALANCE } from "../balance.ts";
import { cloneGame } from "../state.ts";
import { spawnMonster } from "./monsters.ts";
import { applyKill } from "./progression.ts";
import type { Rng } from "./inventory.ts";
import { computeHeroStats } from "./stats.ts";

export function createBattle(game: GameState): BattleState {
  const stats = computeHeroStats(game, game.activeHeroId);
  const monster = spawnMonster(game);
  return {
    phase: "monsterSpawning",
    phaseTimer: BALANCE.phase.spawningSec,
    monster,
    heroHp: stats.maxHp,
    heroCooldown: 0.3,
    swingTimer: null,
    swingDuration: BALANCE.swing.maxDuration,
    monsterCooldown: monsterInterval(monster.isBoss),
    buffAccumulator: 0,
    attackId: 0,
    lastHit: null,
    monsterAttackId: 0,
    lastHeroHit: null,
    lastKill: null,
    spawnId: 1,
    stageClearId: 0,
    heroDownId: 0,
  };
}

function monsterInterval(isBoss: boolean): number {
  return isBoss ? BALANCE.monsterAttack.bossInterval : BALANCE.monsterAttack.interval;
}

export type StepResult = { game: GameState; battle: BattleState; notices: Notice[] };

/**
 * 전투를 dt 초만큼 진행한다. 입력 객체는 수정하지 않는다.
 * 게임 상태가 바뀌지 않았다면 같은 game 참조를 그대로 돌려준다.
 */
export function stepBattle(game0: GameState, battle0: BattleState, dtRaw: number, rng: Rng): StepResult {
  const dt = Math.min(Math.max(dtRaw, 0), BALANCE.maxStepSec);
  const notices: Notice[] = [];
  let game = game0;
  let cloned = false;
  const edit = (): GameState => {
    if (!cloned) {
      game = cloneGame(game0);
      cloned = true;
    }
    return game;
  };

  const b: BattleState = { ...battle0, monster: { ...battle0.monster } };
  let stats = computeHeroStats(game, game.activeHeroId);
  if (b.heroHp > stats.maxHp) b.heroHp = stats.maxHp;

  /* 버프 시간 (게임이 실제로 진행되는 동안만 줄어든다) */
  if (game.buffs.goldBoostSec > 0 || game.buffs.critBoostSec > 0) {
    b.buffAccumulator += dt;
    if (b.buffAccumulator >= 1) {
      const seconds = Math.floor(b.buffAccumulator);
      b.buffAccumulator -= seconds;
      const g = edit();
      g.buffs.goldBoostSec = Math.max(0, g.buffs.goldBoostSec - seconds);
      g.buffs.critBoostSec = Math.max(0, g.buffs.critBoostSec - seconds);
      stats = computeHeroStats(g, g.activeHeroId);
    }
  }

  switch (b.phase) {
    case "monsterSpawning": {
      b.phaseTimer -= dt;
      if (b.phaseTimer <= 0) {
        b.phase = "fighting";
        b.phaseTimer = 0;
        b.monsterCooldown = monsterInterval(b.monster.isBoss);
      }
      break;
    }

    case "monsterDying": {
      b.phaseTimer -= dt;
      if (b.phaseTimer <= 0) {
        b.monster = spawnMonster(game);
        b.phase = "monsterSpawning";
        b.phaseTimer = BALANCE.phase.spawningSec;
        b.spawnId += 1;
        b.heroCooldown = Math.max(b.heroCooldown, 0.25);
        b.swingTimer = null;
      }
      break;
    }

    case "heroDown": {
      b.phaseTimer -= dt;
      if (b.phaseTimer <= 0) {
        // 쓰러졌다면 현재 스테이지 처음부터 다시 도전한다.
        const g = edit();
        g.killsInStage = 0;
        stats = computeHeroStats(g, g.activeHeroId);
        b.heroHp = stats.maxHp;
        b.monster = spawnMonster(g);
        b.phase = "monsterSpawning";
        b.phaseTimer = BALANCE.phase.spawningSec;
        b.spawnId += 1;
        b.swingTimer = null;
        b.heroCooldown = 0.3;
      }
      break;
    }

    case "fighting": {
      /* 체력 재생 */
      b.heroHp = Math.min(stats.maxHp, b.heroHp + stats.maxHp * stats.regenPct * dt);

      /* 용사 공격: 쿨다운이 끝나면 모션을 시작하고, 모션의 타격 시점에 피해를 준다. */
      b.heroCooldown -= dt;
      if (b.swingTimer === null && b.heroCooldown <= 0) {
        const period = 1 / stats.speed;
        const duration = Math.min(
          BALANCE.swing.maxDuration,
          Math.max(BALANCE.swing.minDuration, period * BALANCE.swing.durationOfPeriod),
        );
        b.swingDuration = duration;
        b.swingTimer = duration * BALANCE.swing.hitRatio;
        b.attackId += 1;
        b.heroCooldown += period;
        if (b.heroCooldown < 0) b.heroCooldown = 0;
      } else if (b.swingTimer !== null) {
        b.swingTimer -= dt;
        if (b.swingTimer <= 0) {
          b.swingTimer = null;
          const crit = rng() < stats.critChance;
          const variance = 0.9 + rng() * 0.2;
          let damage = stats.attack * variance * (b.monster.isBoss ? stats.bossDamageMult : 1);
          if (crit) damage *= stats.critDamage;
          damage = Math.max(1, Math.round(damage));
          b.monster.hp = Math.max(0, b.monster.hp - damage);
          b.lastHit = { id: (b.lastHit?.id ?? 0) + 1, damage, crit };

          if (b.monster.hp <= 0) {
            const g = edit();
            const result = applyKill(g, b.monster, stats);
            notices.push(...result.notices);
            b.lastKill = {
              id: (b.lastKill?.id ?? 0) + 1,
              gold: result.gold,
              exp: result.exp,
              boss: b.monster.isBoss,
            };
            if (result.stageCleared) b.stageClearId += 1;
            b.phase = "monsterDying";
            b.phaseTimer = BALANCE.phase.dyingSec;
            // 레벨업으로 능력치가 올랐다면 체력을 모두 회복
            const next = computeHeroStats(g, g.activeHeroId);
            if (result.levelsGained > 0) b.heroHp = next.maxHp;
            break;
          }
        }
      }

      /* 몬스터 공격 */
      b.monsterCooldown -= dt;
      if (b.monsterCooldown <= 0) {
        b.monsterCooldown += monsterInterval(b.monster.isBoss);
        const variance = 0.9 + rng() * 0.2;
        const damage = Math.max(1, Math.round(b.monster.attack * variance * (1 - stats.damageReduction)));
        b.heroHp = Math.max(0, b.heroHp - damage);
        b.monsterAttackId += 1;
        b.lastHeroHit = { id: b.monsterAttackId, damage };
        if (b.heroHp <= 0) {
          b.phase = "heroDown";
          b.phaseTimer = BALANCE.phase.heroDownSec;
          b.heroDownId += 1;
          b.swingTimer = null;
          notices.push({ text: "용사가 쓰러졌어요… 스테이지를 처음부터 다시 도전해요.", tone: "warn" });
        }
      }
      break;
    }
  }

  return { game, battle: b, notices };
}
