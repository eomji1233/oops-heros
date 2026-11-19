import type { CSSProperties } from "react";
import type { CharacterDef } from "./types";

type CharacterSpriteProps = {
  character: CharacterDef;
};

/**
 * 캐릭터를 그리는 유일한 곳.
 * 실제 이미지(imageSrc)가 있으면 <img>, 없으면 임시 SVG를 렌더링합니다.
 * 크기는 character.width / aspectRatio로 고정되어 있어 교체해도 레이아웃이 유지됩니다.
 */
function CharacterSprite({ character }: CharacterSpriteProps) {
  const { Art, imageSrc, name, kind, width, aspectRatio } = character;

  const style = {
    "--sprite-width": `${width}px`,
    "--sprite-ratio": aspectRatio,
  } as CSSProperties;

  return (
    <div className={`sprite sprite--${kind}`} style={style} role="img" aria-label={name}>
      {imageSrc ? (
        <img className="sprite__image" src={imageSrc} alt="" draggable={false} />
      ) : (
        <Art className="sprite__art" />
      )}
    </div>
  );
}

export default CharacterSprite;
