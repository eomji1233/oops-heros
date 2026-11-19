import { HEROES } from "../characters/characterData";
import CharacterSprite from "../characters/CharacterSprite";
import type { HeroId } from "../game/types.ts";

type HeroPortraitProps = {
  heroId: HeroId;
  size?: number;
  /** 아직 만나지 못한 용사는 실루엣으로 보여준다 */
  locked?: boolean;
};

/** 용사 얼굴/전신을 작은 칸에 보여주는 정적 초상화 (움직임 없음) */
export function HeroPortrait({ heroId, size = 72, locked = false }: HeroPortraitProps) {
  return (
    <span className={`portrait${locked ? " portrait--locked" : ""}`} aria-hidden="true">
      <CharacterSprite character={HEROES[heroId]} size={size} />
    </span>
  );
}
