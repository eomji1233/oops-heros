import { GreenSlimeArt, HeeingRabbitArt } from "./characterArt";
import type { CharacterDef } from "./types";

/*
 * 캐릭터 등록부
 *
 * 새 용사를 추가하는 방법
 *  1. 아래 HEROES에 항목을 한 개 추가합니다. (id, name, Art, width, aspectRatio)
 *  2. 실제 일러스트가 준비되면 imageSrc에 경로를 넣습니다.
 *     예) imageSrc: new URL("../assets/characters/heeing-rabbit.png", import.meta.url).href
 *
 * 앞으로 등장 예정인 용사:
 *  꼬맹이기린, 꾸벅부엉이, 찌부펭귄, 뽀짝고래, 꾸물치타, 천재금붕어,
 *  덜덜고릴라, 꼬질백조, 뻣뻣문어, 수속성냥이, 방콕강쥐
 *  (현재 메인 전투 화면에는 히잉토끼만 등장합니다.)
 */

export const HEROES = {
  "heeing-rabbit": {
    id: "heeing-rabbit",
    name: "히잉토끼",
    kind: "hero",
    Art: HeeingRabbitArt,
    width: 140,
    aspectRatio: 160 / 180,
  },
} as const satisfies Record<string, CharacterDef>;

export const MONSTERS = {
  "green-slime": {
    id: "green-slime",
    name: "말랑 슬라임",
    kind: "monster",
    Art: GreenSlimeArt,
    width: 144,
    aspectRatio: 170 / 138,
  },
} as const satisfies Record<string, CharacterDef>;

export type HeroId = keyof typeof HEROES;
export type MonsterId = keyof typeof MONSTERS;
