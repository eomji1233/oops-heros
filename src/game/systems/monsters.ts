import type { BattleMonster, GameState, MonsterDef, StagePosition } from "../types.ts";
import { BALANCE } from "../balance.ts";
import { MONSTERS_BY_ID, globalStageIndex, worldOf } from "../data/worlds.ts";

/** 지금 상태에서 다음에 나올 몬스터 정의와 보스 여부 */
export function pickMonster(game: GameState): { def: MonsterDef; isBoss: boolean; killIndex: number } {
  const world = worldOf(game.stage);
  const stageIndex = globalStageIndex(game.stage);
  const isBoss = game.killsInStage >= BALANCE.normalsPerStage;

  if (isBoss) {
    const bossId = world.bossIds[game.stage.stage % world.bossIds.length];
    return { def: MONSTERS_BY_ID[bossId], isBoss: true, killIndex: BALANCE.normalsPerStage };
  }
  const id = world.monsterIds[(stageIndex + game.killsInStage) % world.monsterIds.length];
  return { def: MONSTERS_BY_ID[id], isBoss: false, killIndex: game.killsInStage };
}

/** 스테이지 번호에 따라 강해지는 몬스터 능력치 계산 */
export function buildMonster(def: MonsterDef, stage: StagePosition, killIndex: number, isBoss: boolean): BattleMonster {
  const index = globalStageIndex(stage);
  const ramp = 1 + BALANCE.monsterHp.rampPerKill * killIndex;

  const hp = BALANCE.monsterHp.base * BALANCE.monsterHp.growth ** index * ramp * def.hpMult * (isBoss ? BALANCE.monsterHp.bossMult : 1);
  const attack = BALANCE.monsterAttack.base * BALANCE.monsterAttack.growth ** index * def.atkMult * (isBoss ? BALANCE.monsterAttack.bossMult : 1);
  const gold = BALANCE.goldReward.base * BALANCE.goldReward.growth ** index * def.goldMult * (isBoss ? BALANCE.goldReward.bossMult : 1);
  const exp = BALANCE.expReward.base * BALANCE.expReward.growth ** index * def.expMult * (isBoss ? BALANCE.expReward.bossMult : 1);

  const maxHp = Math.max(1, Math.round(hp));
  return {
    defId: def.id,
    name: def.name,
    isBoss,
    maxHp,
    hp: maxHp,
    attack: Math.max(1, attack),
    goldReward: Math.max(1, Math.round(gold)),
    expReward: Math.max(1, Math.round(exp)),
  };
}

export function spawnMonster(game: GameState): BattleMonster {
  const { def, isBoss, killIndex } = pickMonster(game);
  return buildMonster(def, game.stage, killIndex, isBoss);
}
