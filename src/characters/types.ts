import type { ComponentType } from "react";

/** 임시 SVG 일러스트 컴포넌트가 받는 props */
export type CharacterArtProps = {
  className?: string;
};

export type CharacterKind = "hero" | "monster";

/**
 * 캐릭터 한 명(또는 한 종류의 몬스터)을 설명하는 데이터.
 *
 * 렌더링 규칙
 * - `imageSrc`가 있으면 PNG 등 실제 일러스트를 보여줍니다.
 * - 없으면 `Art`(임시 인라인 SVG)를 보여줍니다.
 * - `width`와 `aspectRatio`로 스프라이트 영역 크기가 고정되므로,
 *   일러스트를 교체해도 전투 장면 레이아웃은 바뀌지 않습니다.
 */
export type CharacterDef = {
  id: string;
  name: string;
  kind: CharacterKind;
  /** 실제 일러스트 경로. 비워두면 임시 SVG를 사용합니다. */
  imageSrc?: string;
  /** 임시 SVG 일러스트 */
  Art: ComponentType<CharacterArtProps>;
  /** 전투 화면에서 차지하는 가로 크기(px) */
  width: number;
  /** 가로 / 세로 비율 */
  aspectRatio: number;
};
