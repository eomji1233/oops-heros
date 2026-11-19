import { MONSTERS_BY_ID } from "../game/data/worlds.ts";
import type { HeroId } from "../game/types.ts";
import { GreenSlimeArt, HeeingRabbitArt } from "./characterArt";
import {
  BangkokPupArt,
  DeoldeolGorillaArt,
  GeniusGoldfishArt,
  JjibuPenguinArt,
  KkojilSwanArt,
  KkomaengGiraffeArt,
  KkubeokOwlArt,
  KkumulCheetahArt,
  PpeotppeotOctopusArt,
  PpojjakWhaleArt,
  WaterKittyArt,
} from "./heroArt";
import { BeeArt, KingMushroomArt, KingSlimeArt, MushroomArt, PinkSlimeArt } from "./monsterArt";
import type { CharacterDef } from "./types";

/*
 * 캐릭터 등록부 (그림 정보만 담당. 이름/능력치는 game/data 에 있습니다.)
 *
 * 실제 일러스트(PNG 등)로 바꾸는 방법
 *  - 해당 항목에 imageSrc 를 넣으면 SVG 대신 이미지를 보여줍니다.
 *    예) imageSrc: new URL("../assets/characters/heeing-rabbit.png", import.meta.url).href
 *  - width / aspectRatio 가 고정되어 있어 레이아웃은 그대로 유지됩니다.
 */

const HERO_ART_WIDTH = 140;
const HERO_RATIO = 160 / 180;

const hero = (id: HeroId, name: string, Art: CharacterDef["Art"], width = HERO_ART_WIDTH): CharacterDef => ({
  id,
  name,
  kind: "hero",
  Art,
  width,
  aspectRatio: HERO_RATIO,
});

export const HEROES: Record<HeroId, CharacterDef> = {
  "heeing-rabbit": hero("heeing-rabbit", "히잉토끼", HeeingRabbitArt),
  "kkomaeng-giraffe": hero("kkomaeng-giraffe", "꼬맹이기린", KkomaengGiraffeArt),
  "kkubeok-owl": hero("kkubeok-owl", "꾸벅부엉이", KkubeokOwlArt),
  "jjibu-penguin": hero("jjibu-penguin", "찌부펭귄", JjibuPenguinArt, 146),
  "ppojjak-whale": hero("ppojjak-whale", "뽀짝고래", PpojjakWhaleArt, 148),
  "kkumul-cheetah": hero("kkumul-cheetah", "꾸물치타", KkumulCheetahArt),
  "genius-goldfish": hero("genius-goldfish", "천재금붕어", GeniusGoldfishArt),
  "deoldeol-gorilla": hero("deoldeol-gorilla", "덜덜고릴라", DeoldeolGorillaArt, 150),
  "kkojil-swan": hero("kkojil-swan", "꼬질백조", KkojilSwanArt),
  "ppeotppeot-octopus": hero("ppeotppeot-octopus", "뻣뻣문어", PpeotppeotOctopusArt),
  "water-kitty": hero("water-kitty", "수속성냥이", WaterKittyArt),
  "bangkok-pup": hero("bangkok-pup", "방콕강쥐", BangkokPupArt),
};

const monster = (id: string, Art: CharacterDef["Art"], width: number, aspectRatio: number): CharacterDef => ({
  id,
  name: MONSTERS_BY_ID[id].name,
  kind: "monster",
  Art,
  width,
  aspectRatio,
});

export const MONSTER_ART: Record<string, CharacterDef> = {
  "green-slime": monster("green-slime", GreenSlimeArt, 144, 170 / 138),
  "pink-slime": monster("pink-slime", PinkSlimeArt, 144, 170 / 138),
  mushroom: monster("mushroom", MushroomArt, 138, 170 / 150),
  bee: monster("bee", BeeArt, 128, 160 / 140),
  "king-slime": monster("king-slime", KingSlimeArt, 196, 170 / 164),
  "king-mushroom": monster("king-mushroom", KingMushroomArt, 190, 170 / 180),
};
