import { useState } from "react";
import { HeroPortrait } from "../components/HeroPortrait";
import { Modal } from "../components/Modal";
import { RarityBadge } from "../components/RarityBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import GameIcon from "../GameIcons";
import { BALANCE } from "../game/balance.ts";
import { HERO_LIST, HEROES_BY_ID } from "../game/data/heroes.ts";
import { formatNumber, formatPercent, formatStat } from "../game/format.ts";
import { computeHeroStats, expToNext } from "../game/systems/stats.ts";
import { useGameStore, useGameUi } from "../game/useGame.ts";
import type { GameState, HeroId, ItemId } from "../game/types.ts";

type HeroesScreenProps = {
  onUseItem: (itemId: ItemId) => void;
};

/* ---------- 소환 배너 ---------- */

function SummonBar({ game, onUseItem }: { game: GameState; onUseItem: (itemId: ItemId) => void }) {
  const basic = game.items.ticket_basic;
  const premium = game.items.ticket_premium;
  const untilPity = BALANCE.summon.premiumPityEvery - game.premiumPity;

  return (
    <section className="summon-bar" aria-label="용사 소환">
      <button type="button" className="summon-button" disabled={basic <= 0} onClick={() => onUseItem("ticket_basic")}>
        <GameIcon name="ticket" className="summon-button__icon" />
        <span className="summon-button__text">
          <strong>용사 획득권</strong>
          <span>{basic > 0 ? `보유 ${basic}장 · 사용하기` : "없음 · 상점/보스 보상"}</span>
        </span>
      </button>
      <button
        type="button"
        className="summon-button summon-button--premium"
        disabled={premium <= 0}
        onClick={() => onUseItem("ticket_premium")}
      >
        <GameIcon name="ticket" className="summon-button__icon" />
        <span className="summon-button__text">
          <strong>고급 획득권</strong>
          <span>{premium > 0 ? `보유 ${premium}장 · ${untilPity}회 내 영웅+` : "없음 · 1-10 보스 보상"}</span>
        </span>
      </button>
    </section>
  );
}

/* ---------- 용사 카드 ---------- */

function HeroCard({ game, heroId, onOpen }: { game: GameState; heroId: HeroId; onOpen: () => void }) {
  const def = HEROES_BY_ID[heroId];
  const progress = game.heroes[heroId];
  const active = game.activeHeroId === heroId;

  return (
    <button
      type="button"
      className={`hero-card hero-card--${def.rarity}${progress.owned ? "" : " is-locked"}${active ? " is-active" : ""}`}
      onClick={onOpen}
      aria-label={`${def.name}, ${progress.owned ? `Lv.${progress.level}${active ? ", 출전 중" : ""}` : "아직 만나지 못했어요"}`}
    >
      <span className="hero-card__rarity">
        <RarityBadge rarity={def.rarity} />
      </span>
      <HeroPortrait heroId={heroId} size={74} locked={!progress.owned} />
      <span className="hero-card__name">
        {progress.owned ? def.name : <GameIcon name="lock" className="hero-card__lock" />}
        {!progress.owned && <span>???</span>}
      </span>
      <span className="hero-card__sub">{progress.owned ? `Lv.${progress.level}` : "미획득"}</span>
      {active && <span className="hero-card__active">출전 중</span>}
    </button>
  );
}

/* ---------- 상세 시트 ---------- */

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-box">
      <span className="stat-box__label">{label}</span>
      <strong className="stat-box__value">{value}</strong>
    </div>
  );
}

function HeroDetail({ game, heroId, onClose }: { game: GameState; heroId: HeroId; onClose: () => void }) {
  const store = useGameStore();
  const def = HEROES_BY_ID[heroId];
  const progress = game.heroes[heroId];
  const stats = computeHeroStats(game, heroId);
  const active = game.activeHeroId === heroId;
  const needed = expToNext(progress.level);
  const maxed = progress.level >= BALANCE.hero.maxLevel;

  return (
    <Modal title={def.name} variant="sheet" onClose={onClose}>
      <div className={`hero-detail hero-detail--${def.rarity}`}>
        <div className="hero-detail__stage">
          <HeroPortrait heroId={heroId} size={128} locked={!progress.owned} />
        </div>

        <div className="hero-detail__title">
          <h3 className="hero-detail__name">{progress.owned ? def.name : `${def.name} (미획득)`}</h3>
          <RarityBadge rarity={def.rarity} />
          {active && <span className="chip-active">출전 중</span>}
        </div>
        <p className="hero-detail__desc">{def.description}</p>

        {progress.owned && (
          <div className="exp-row">
            <span className="exp-row__label">Lv.{progress.level}</span>
            <span className="exp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={needed} aria-valuenow={maxed ? needed : progress.exp}>
              <span className="exp-bar__fill" style={{ width: `${maxed ? 100 : (progress.exp / needed) * 100}%` }} />
            </span>
            <span className="exp-row__value">{maxed ? "MAX" : `${formatNumber(progress.exp)} / ${formatNumber(needed)}`}</span>
          </div>
        )}

        <div className="stat-grid">
          <StatBox label="공격력" value={formatStat(stats.attack)} />
          <StatBox label="체력" value={formatNumber(stats.maxHp)} />
          <StatBox label="공격 속도" value={`${stats.speed.toFixed(2)}/초`} />
          <StatBox label="치명타" value={`${formatPercent(stats.critChance)} · x${stats.critDamage.toFixed(2)}`} />
        </div>
        {!progress.owned && <p className="hero-detail__note">능력치는 Lv.1 기준이에요. 만나면 내 강화 수치도 그대로 적용돼요.</p>}

        <div className="info-box">
          <span className="info-box__tag">패시브</span>
          <strong className="info-box__title">{def.passive.name}</strong>
          <span className="info-box__text">{def.passive.description}</span>
        </div>

        <div className="info-box info-box--acq">
          <span className="info-box__tag">획득 방법</span>
          <span className="info-box__text">{def.acquisitionText}</span>
        </div>

        {progress.owned ? (
          <button
            type="button"
            className="primary-button"
            disabled={active}
            onClick={() => {
              store.setActiveHero(heroId);
              onClose();
            }}
          >
            {active ? "지금 출전 중이에요" : "이 용사로 출전하기"}
          </button>
        ) : (
          <button type="button" className="primary-button primary-button--ghost" onClick={onClose}>
            <GameIcon name="lock" className="primary-button__icon" />
            아직 만나지 못했어요
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ---------- 화면 ---------- */

function HeroesScreen({ onUseItem }: HeroesScreenProps) {
  const { game } = useGameUi();
  const [selected, setSelected] = useState<HeroId | null>(null);
  const ownedCount = HERO_LIST.filter((hero) => game.heroes[hero.id].owned).length;

  return (
    <div className="screen">
      <ScreenHeader title="용사단" subtitle={`함께하는 동료 ${ownedCount} / ${HERO_LIST.length}`} gold={game.gold} />
      <div className="screen__scroll">
        <SummonBar game={game} onUseItem={onUseItem} />
        <ul className="hero-grid">
          {HERO_LIST.map((hero) => (
            <li key={hero.id}>
              <HeroCard game={game} heroId={hero.id} onOpen={() => setSelected(hero.id)} />
            </li>
          ))}
        </ul>
      </div>
      {selected && <HeroDetail game={game} heroId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default HeroesScreen;
