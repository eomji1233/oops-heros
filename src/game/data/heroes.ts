import type { HeroDef, HeroId, Rarity } from "../types.ts";

/*
 * 용사 12종 데이터 (능력치 / 패시브 / 획득 방법)
 * 그림(SVG)은 src/characters 에서 id 기준으로 연결합니다.
 */

export const RARITY_ORDER: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  epic: "영웅",
  legendary: "전설",
};

export const HERO_LIST: HeroDef[] = [
  {
    id: "heeing-rabbit",
    name: "히잉토끼",
    description: "툭하면 '히잉…' 하고 울먹이지만, 막상 싸울 땐 눈을 질끈 감고 돌진하는 용사단의 첫 번째 단원.",
    rarity: "common",
    baseAttack: 10,
    baseHp: 100,
    attackSpeed: 1.0,
    passive: {
      name: "눈물의 근성",
      description: "울먹일수록 단단해진다. 받는 피해 8% 감소.",
      effects: [{ kind: "damageReduction", value: 0.08 }],
    },
    acquisition: { type: "starter" },
    acquisitionText: "기본 용사 (처음부터 함께해요)",
  },
  {
    id: "bangkok-pup",
    name: "방콕강쥐",
    description: "밖에 나가기 싫어서 이불을 두른 채 출전했다. '집에 가고 싶다'가 입버릇.",
    rarity: "common",
    baseAttack: 9,
    baseHp: 130,
    attackSpeed: 0.9,
    passive: {
      name: "집콕 회복",
      description: "쉬는 건 자신 있다. 초당 체력 재생 +1.5%.",
      effects: [{ kind: "regenPct", value: 0.015 }],
    },
    acquisition: { type: "stage", world: 1, stage: 3 },
    acquisitionText: "초원 1-3 보스 처치 보상",
  },
  {
    id: "jjibu-penguin",
    name: "찌부펭귄",
    description: "눌려서 납작해진 몸으로 뒤뚱뒤뚱 걷는다. 얼음 위에서는 의외로 날쌔다.",
    rarity: "uncommon",
    baseAttack: 12,
    baseHp: 115,
    attackSpeed: 1.0,
    passive: {
      name: "얼음 발바닥",
      description: "미끄러지듯 급소를 찌른다. 치명타 확률 +6%.",
      effects: [{ kind: "critChance", value: 0.06 }],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "kkubeok-owl",
    name: "꾸벅부엉이",
    description: "밤새 근무하다 꾸벅꾸벅 졸지만, 눈을 번쩍 뜨는 순간 한 방이 매섭다.",
    rarity: "uncommon",
    baseAttack: 14,
    baseHp: 92,
    attackSpeed: 0.85,
    passive: {
      name: "번쩍 눈뜸",
      description: "졸다 깨면 더 아프다. 치명타 피해 +35%.",
      effects: [{ kind: "critDamage", value: 0.35 }],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "kkojil-swan",
    name: "꼬질백조",
    description: "우아한 줄 알았는데 사실 며칠째 못 씻었다. 그래도 반짝이는 건 금화뿐.",
    rarity: "uncommon",
    baseAttack: 11,
    baseHp: 125,
    attackSpeed: 1.05,
    passive: {
      name: "꼬질한 행운",
      description: "지저분한 곳에 복이 모인다. 골드 획득 +12%.",
      effects: [{ kind: "goldPct", value: 0.12 }],
    },
    acquisition: { type: "stage", world: 1, stage: 6 },
    acquisitionText: "초원 1-6 보스 처치 보상",
  },
  {
    id: "water-kitty",
    name: "수속성냥이",
    description: "물 속성 마법을 쓰는 고양이. 이마의 물방울 무늬는 훈장이라고 우긴다.",
    rarity: "rare",
    baseAttack: 16,
    baseHp: 110,
    attackSpeed: 1.15,
    passive: {
      name: "촉촉한 마력",
      description: "물방울이 마력을 키운다. 공격력 +10%.",
      effects: [{ kind: "attackPct", value: 0.1 }],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "kkomaeng-giraffe",
    name: "꼬맹이기린",
    description: "아직 목이 덜 자란 아기 기린. 높은 곳이 무서워서 눈을 질끈 감고 싸운다.",
    rarity: "rare",
    baseAttack: 14,
    baseHp: 155,
    attackSpeed: 0.9,
    passive: {
      name: "높은 시야",
      description: "큰 적일수록 잘 보인다. 보스에게 주는 피해 +25%.",
      effects: [{ kind: "bossDamagePct", value: 0.25 }],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "ppeotppeot-octopus",
    name: "뻣뻣문어",
    description: "다리 여덟 개가 제각각 놀아서 뻣뻣하게 걷는다. 의외로 똑똑한 편.",
    rarity: "rare",
    baseAttack: 15,
    baseHp: 135,
    attackSpeed: 0.95,
    passive: {
      name: "여덟 개의 다리",
      description: "다리마다 공부한다. 경험치 획득 +18%.",
      effects: [{ kind: "expPct", value: 0.18 }],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "deoldeol-gorilla",
    name: "덜덜고릴라",
    description: "힘은 천하장사지만 겁이 많아 늘 덜덜 떤다. 떨림이 곧 펀치의 힘!",
    rarity: "epic",
    baseAttack: 26,
    baseHp: 200,
    attackSpeed: 0.75,
    passive: {
      name: "떨리는 주먹",
      description: "떨림이 힘이 된다. 공격력 +20%, 대신 공격 속도 -5%.",
      effects: [
        { kind: "attackPct", value: 0.2 },
        { kind: "speedPct", value: -0.05 },
      ],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "kkumul-cheetah",
    name: "꾸물치타",
    description: "세상에서 제일 빠르다고 소문났지만 출발이 느리다. 한번 달리면 아무도 못 말린다.",
    rarity: "epic",
    baseAttack: 17,
    baseHp: 120,
    attackSpeed: 1.3,
    passive: {
      name: "느린 시동",
      description: "시동이 걸리면 폭주한다. 공격 속도 +12%, 치명타 확률 +8%.",
      effects: [
        { kind: "speedPct", value: 0.12 },
        { kind: "critChance", value: 0.08 },
      ],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "genius-goldfish",
    name: "천재금붕어",
    description: "3초마다 기억이 리셋되지만, 그 3초 동안만큼은 천재다.",
    rarity: "epic",
    baseAttack: 18,
    baseHp: 105,
    attackSpeed: 1.1,
    passive: {
      name: "3초 천재",
      description: "매번 새롭게 배운다. 경험치 획득 +28%.",
      effects: [{ kind: "expPct", value: 0.28 }],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "용사 획득권으로 만날 수 있어요",
  },
  {
    id: "ppojjak-whale",
    name: "뽀짝고래",
    description: "구름 위까지 떠오른 전설의 아기 고래. 뽀짝뽀짝 물보라가 모든 것을 돕는다.",
    rarity: "legendary",
    baseAttack: 30,
    baseHp: 260,
    attackSpeed: 1.0,
    passive: {
      name: "뽀짝 물보라",
      description: "행운의 물보라. 공격력, 체력, 골드 획득 +12%.",
      effects: [
        { kind: "attackPct", value: 0.12 },
        { kind: "hpPct", value: 0.12 },
        { kind: "goldPct", value: 0.12 },
      ],
    },
    acquisition: { type: "ticket" },
    acquisitionText: "고급 획득권에서 아주 낮은 확률로 등장",
  },
];

export const HEROES_BY_ID: Record<HeroId, HeroDef> = Object.fromEntries(
  HERO_LIST.map((hero) => [hero.id, hero]),
) as Record<HeroId, HeroDef>;

export const STARTER_HERO_ID: HeroId = "heeing-rabbit";
