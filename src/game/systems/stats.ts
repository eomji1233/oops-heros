import type { GameState, HeroId, HeroStats, PassiveKind } from "../types.ts";
import { BALANCE } from "../balance.ts";
import { HEROES_BY_ID } from "../data/heroes.ts";

/** 다음 레벨까지 필요한 경험치 */
export function expToNext(level: number): number {
  return Math.round(BALANCE.hero.expBase * BALANCE.hero.expGrowth ** (level - 1));
}

function passiveTotals(heroId: HeroId): Record<PassiveKind, number> {
  const totals: Record<PassiveKind, number> = {
    attackPct: 0,
    hpPct: 0,
    speedPct: 0,
    critChance: 0,
    critDamage: 0,
    goldPct: 0,
    expPct: 0,
    regenPct: 0,
    bossDamagePct: 0,
    damageReduction: 0,
  };
  for (const effect of HEROES_BY_ID[heroId].passive.effects) totals[effect.kind] += effect.value;
  return totals;
}

/**
 * 용사의 최종 능력치.
 * 전투 화면, 성장 탭, 용사 도감이 모두 이 함수를 사용하므로 같은 값이 보장된다.
 */
export function computeHeroStats(game: GameState, heroId: HeroId): HeroStats {
  const def = HEROES_BY_ID[heroId];
  const progress = game.heroes[heroId];
  const level = progress.level;
  const passive = passiveTotals(heroId);
  const levelMult = 1 + (level - 1) * BALANCE.hero.levelGrowth;

  const attack = (def.baseAttack * levelMult + game.upgrades.attack * BALANCE.hero.attackPerUpgrade) * (1 + passive.attackPct);
  const maxHp = (def.baseHp * levelMult + game.upgrades.health * BALANCE.hero.hpPerUpgrade) * (1 + passive.hpPct);
  const speed = def.attackSpeed * (1 + passive.speedPct);

  const cloverBonus = game.buffs.critBoostSec > 0 ? BALANCE.items.critBoostChance : 0;
  const critChance = Math.min(BALANCE.hero.critChanceCap, BALANCE.hero.baseCritChance + passive.critChance + cloverBonus);
  const critDamage = BALANCE.hero.baseCritDamage + passive.critDamage;
  const goldBoost = game.buffs.goldBoostSec > 0 ? BALANCE.items.goldBoostMult : 0;

  const dps = attack * speed * (1 + critChance * (critDamage - 1));
  const power = Math.round(dps * BALANCE.hero.powerDpsWeight + maxHp * BALANCE.hero.powerHpWeight);

  return {
    level,
    attack: Math.round(attack * 10) / 10,
    maxHp: Math.round(maxHp),
    speed: Math.round(speed * 100) / 100,
    critChance,
    critDamage,
    goldMult: 1 + passive.goldPct + goldBoost,
    expMult: 1 + passive.expPct,
    regenPct: BALANCE.hero.baseRegenPct + passive.regenPct,
    bossDamageMult: 1 + passive.bossDamagePct,
    damageReduction: Math.min(0.6, passive.damageReduction),
    dps,
    power,
  };
}
