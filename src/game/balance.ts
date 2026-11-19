/*
 * 게임 밸런스 설정 — 모든 수치는 이 파일 한 곳에서 조정합니다.
 */

export const BALANCE = {
  /** 게임 루프 간격(ms)과 한 번에 처리할 수 있는 최대 시간(초) */
  tickMs: 60,
  maxStepSec: 0.25,

  /** 한 스테이지에서 보스가 나오기 전까지 처치해야 하는 일반 몬스터 수 */
  normalsPerStage: 5,

  /** 몬스터 체력 : base * growth^(스테이지 번호) * (1 + rampPerKill * 스테이지 내 처치 순서) */
  monsterHp: { base: 22, growth: 1.34, rampPerKill: 0.05, bossMult: 5 },
  /** 몬스터 공격력과 공격 주기(초) */
  monsterAttack: { base: 3.2, growth: 1.2, bossMult: 1.6, interval: 2.2, bossInterval: 1.8 },
  /** 처치 보상 */
  goldReward: { base: 7, growth: 1.24, bossMult: 6 },
  expReward: { base: 6, growth: 1.17, bossMult: 5 },

  /** 전투 진행 단계의 길이(초) */
  phase: { dyingSec: 0.6, spawningSec: 0.45, heroDownSec: 2.6 },
  /** 공격 모션: 전체 길이에서 타격이 일어나는 비율과 모션 길이 제한 */
  swing: { hitRatio: 0.44, minDuration: 0.55, maxDuration: 0.9, durationOfPeriod: 0.9 },

  hero: {
    maxLevel: 40,
    /** 레벨당 기본 능력치 증가율 */
    levelGrowth: 0.08,
    expBase: 40,
    expGrowth: 1.3,
    attackPerUpgrade: 2.2,
    hpPerUpgrade: 14,
    baseCritChance: 0.05,
    baseCritDamage: 1.5,
    critChanceCap: 0.8,
    /** 기본 체력 재생 (초당 최대 체력 비율) */
    baseRegenPct: 0.004,
    /** 전투력 = dps * powerDpsWeight + 최대 체력 * powerHpWeight */
    powerDpsWeight: 8,
    powerHpWeight: 0.6,
  },

  /** 강화 비용 : base * growth^(현재 강화 레벨) */
  upgrade: {
    attack: { base: 20, growth: 1.155 },
    health: { base: 18, growth: 1.15 },
  },

  /** 용사 중복 획득 시 전환되는 경험치 */
  duplicateExp: { common: 60, uncommon: 120, rare: 260, epic: 600, legendary: 1500 },

  /** 획득권 확률 (합이 1일 필요는 없고, 비율로 계산) */
  summon: {
    basic: { common: 50, uncommon: 30, rare: 15, epic: 4.5, legendary: 0.5 },
    premium: { common: 0, uncommon: 0, rare: 70, epic: 25, legendary: 5 },
    /** 고급 획득권 n회마다 영웅 이상 확정 */
    premiumPityEvery: 10,
    pityWeights: { epic: 80, legendary: 20 },
  },

  items: {
    goldBoostSec: 15 * 60,
    goldBoostMult: 0.5,
    critBoostSec: 10 * 60,
    critBoostChance: 0.15,
    expCandyExp: 120,
  },

  offline: {
    maxHours: 8,
    /** 이 시간(초)보다 짧은 부재는 보상하지 않는다 */
    minSeconds: 60,
    /** 실제 전투 수익 대비 오프라인 수익 비율 */
    efficiency: 0.25,
  },

  daily: { checkInGold: 200, streakBonusGold: 40, maxStreakBonus: 7 },

  autosaveMs: 5000,
  /** 화면이 다시 보일 때 이 시간(초) 이상 떨어져 있었다면 오프라인 보상으로 계산 */
  resumeOfflineSeconds: 60,
} as const;
