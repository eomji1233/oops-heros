import type { MonsterDef, StagePosition, WorldDef } from "../types.ts";

/*
 * 월드 / 몬스터 데이터
 * 새 월드를 추가하려면 WORLDS 항목을 채우고 implemented 를 true 로 바꾸면 됩니다.
 * (배경 그림과 몬스터 SVG 가 준비된 월드만 implemented: true)
 */

export const MONSTER_LIST: MonsterDef[] = [
  {
    id: "green-slime",
    name: "말랑 슬라임",
    kind: "normal",
    description: "초원 어디서나 만날 수 있는 말랑말랑한 슬라임. 건드리면 통통 튄다.",
    hpMult: 1,
    atkMult: 1,
    goldMult: 1,
    expMult: 1,
  },
  {
    id: "pink-slime",
    name: "몽글 슬라임",
    kind: "normal",
    description: "꽃꿀을 먹고 분홍빛이 된 슬라임. 조금 더 몽글몽글하다.",
    hpMult: 1.15,
    atkMult: 0.9,
    goldMult: 1.15,
    expMult: 1.1,
  },
  {
    id: "mushroom",
    name: "버섯돌이",
    kind: "normal",
    description: "빨간 모자가 자랑인 버섯. 비 오는 날 특히 기운이 넘친다.",
    hpMult: 1.3,
    atkMult: 1.1,
    goldMult: 1.3,
    expMult: 1.25,
  },
  {
    id: "bee",
    name: "뿌뿌 꿀벌",
    kind: "normal",
    description: "꿀 배달 중에 길을 잃은 꿀벌. 침은 따끔하지만 체력은 약하다.",
    hpMult: 0.8,
    atkMult: 1.5,
    goldMult: 1.1,
    expMult: 1.05,
  },
  {
    id: "king-slime",
    name: "왕슬라임",
    kind: "boss",
    description: "머리 위에 금관을 쓴 초원의 왕. 자기가 진짜 왕인 줄 안다.",
    hpMult: 1,
    atkMult: 1,
    goldMult: 1,
    expMult: 1,
  },
  {
    id: "king-mushroom",
    name: "버섯 대왕",
    kind: "boss",
    description: "거대한 버섯 모자를 쓴 숲의 파수꾼. 포자를 뿌리며 위협한다.",
    hpMult: 1.15,
    atkMult: 1.05,
    goldMult: 1.1,
    expMult: 1.1,
  },
];

export const MONSTERS_BY_ID: Record<string, MonsterDef> = Object.fromEntries(
  MONSTER_LIST.map((monster) => [monster.id, monster]),
);

export const WORLDS: WorldDef[] = [
  {
    id: "meadow",
    unlockText: "처음부터 열려 있어요",
    name: "초원",
    description: "햇살 가득한 동화 속 초원. 용사단의 첫 모험이 시작되는 곳.",
    implemented: true,
    stageCount: 10,
    monsterIds: ["green-slime", "pink-slime", "mushroom", "bee"],
    bossIds: ["king-slime", "king-mushroom"],
    stageHeroRewards: [
      { stage: 3, heroId: "bangkok-pup" },
      { stage: 6, heroId: "kkojil-swan" },
    ],
    stageItemRewards: [
      { stage: 5, itemId: "ticket_basic", count: 1 },
      { stage: 8, itemId: "gold_boost", count: 1 },
      { stage: 10, itemId: "ticket_premium", count: 1 },
    ],
  },
  {
    id: "forest",
    unlockText: "초원 1-10 보스 처치",
    name: "속삭이는 숲",
    description: "나뭇잎이 속삭이는 깊고 푸른 숲속.",
    implemented: false,
    stageCount: 10,
    monsterIds: [],
    bossIds: [],
    stageHeroRewards: [],
    stageItemRewards: [],
  },
  {
    id: "lake",
    unlockText: "속삭이는 숲 클리어",
    name: "신비한 호수",
    description: "별빛이 내려앉은 거울 같은 호수.",
    implemented: false,
    stageCount: 10,
    monsterIds: [],
    bossIds: [],
    stageHeroRewards: [],
    stageItemRewards: [],
  },
  {
    id: "cloud",
    unlockText: "신비한 호수 클리어",
    name: "구름 왕국",
    description: "솜사탕 구름 위에 떠 있는 하늘의 왕국.",
    implemented: false,
    stageCount: 10,
    monsterIds: [],
    bossIds: [],
    stageHeroRewards: [],
    stageItemRewards: [],
  },
  {
    id: "castle",
    unlockText: "구름 왕국 클리어",
    name: "마법의 성",
    description: "마법사들이 사라진 신비한 성. 모험의 마지막 무대.",
    implemented: false,
    stageCount: 10,
    monsterIds: [],
    bossIds: [],
    stageHeroRewards: [],
    stageItemRewards: [],
  },
];

/** 플레이 가능한(구현된) 월드 중 가장 마지막 위치 */
export function lastPlayableStage(): StagePosition {
  let last: StagePosition = { world: 1, stage: 1 };
  WORLDS.forEach((world, index) => {
    if (world.implemented) last = { world: index + 1, stage: world.stageCount };
  });
  return last;
}

/** 스테이지의 전체 순번 (0부터). 월드를 가로질러 몬스터 강도를 계산하는 데 사용 */
export function globalStageIndex(position: StagePosition): number {
  let index = 0;
  for (let i = 0; i < position.world - 1; i += 1) index += WORLDS[i].stageCount;
  return index + position.stage - 1;
}

export function worldOf(position: StagePosition): WorldDef {
  return WORLDS[position.world - 1];
}

export function stageLabel(position: StagePosition): string {
  return `${position.world}-${position.stage}`;
}

/** position 다음 스테이지. 구현된 마지막 스테이지라면 null */
export function nextStage(position: StagePosition): StagePosition | null {
  const world = worldOf(position);
  if (position.stage < world.stageCount) return { world: position.world, stage: position.stage + 1 };
  const nextWorld = WORLDS[position.world];
  if (nextWorld && nextWorld.implemented) return { world: position.world + 1, stage: 1 };
  return null;
}

export function isSameStage(a: StagePosition, b: StagePosition): boolean {
  return a.world === b.world && a.stage === b.stage;
}

export function compareStage(a: StagePosition, b: StagePosition): number {
  return globalStageIndex(a) - globalStageIndex(b);
}
