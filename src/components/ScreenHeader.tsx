import type { ReactNode } from "react";
import GameIcon from "../GameIcons";
import { formatNumber } from "../game/format.ts";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  gold: number;
  extra?: ReactNode;
};

/** 전투 화면이 아닌 탭들의 공통 상단 영역 */
export function ScreenHeader({ title, subtitle, gold, extra }: ScreenHeaderProps) {
  return (
    <header className="screen-header">
      <div className="screen-header__titles">
        <h1 className="screen-header__title">{title}</h1>
        {subtitle && <p className="screen-header__subtitle">{subtitle}</p>}
      </div>
      {extra}
      <div className="gold-counter gold-counter--screen" aria-label={`보유 골드 ${formatNumber(gold)} 골드`}>
        <GameIcon name="coin" className="gold-counter__coin" />
        <span className="gold-counter__value">{formatNumber(gold)} G</span>
      </div>
    </header>
  );
}
