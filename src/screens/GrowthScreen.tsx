import { useState } from "react";
import { HeroPortrait } from "../components/HeroPortrait";
import { RarityBadge } from "../components/RarityBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import GameIcon from "../GameIcons";
import type { GameIconName } from "../GameIcons";
import { BALANCE } from "../game/balance.ts";
import { HEROES_BY_ID } from "../game/data/heroes.ts";
import { stageLabel, worldOf } from "../game/data/worlds.ts";
import { formatNumber, formatPercent, formatStat } from "../game/format.ts";
import { computeHeroStats, expToNext } from "../game/systems/stats.ts";
import { upgradeCost } from "../game/systems/upgrades.ts";
import { useGameStore, useGameUi } from "../game/useGame.ts";
import type { UpgradeFx } from "../game/store.ts";
import type { GameState, HeroStats, ItemId, UpgradeKind } from "../game/types.ts";

const UPGRADE_META: Record<UpgradeKind, { icon: GameIconName; title: string; unit: string }> = {
  attack: { icon: "sword", title: "공격력 강화", unit: "공격력" },
  health: { icon: "heart", title: "체력 강화", unit: "체력" },
};

function UpgradeRow({ kind, game, stats, fx }: { kind: UpgradeKind; game: GameState; stats: HeroStats; fx: UpgradeFx | null }) {
  const store = useGameStore();
  const [seenFx] = useState(fx?.id ?? 0);
  const level = game.upgrades[kind];
  const cost = upgradeCost(kind, level);
  const poor = game.gold < cost;
  const meta = UPGRADE_META[kind];

  const next = computeHeroStats({ ...game, upgrades: { ...game.upgrades, [kind]: level + 1 } }, game.activeHeroId);
  const current = kind === "attack" ? stats.attack : stats.maxHp;
  const after = kind === "attack" ? next.attack : next.maxHp;

  const activeFx = fx && fx.kind === kind && fx.id !== seenFx ? fx : null;
  const classes = ["upgrade-row"];
  if (activeFx) classes.push(activeFx.ok ? `pop-${activeFx.id % 2 ? "a" : "b"}` : `shake-${activeFx.id % 2 ? "a" : "b"}`);

  return (
    <div className={classes.join(" ")}>
      <span className="upgrade-row__icon">
        <GameIcon name={meta.icon} />
      </span>
      <span className="upgrade-row__text">
        <strong>
          {meta.title} <em>Lv.{level + 1}</em>
        </strong>
        <span>
          {meta.unit} {formatStat(current)} → <b>{formatStat(after)}</b>
        </span>
      </span>
      <button
        type="button"
        className={`buy-button${poor ? " is-poor" : ""}`}
        onClick={() => store.upgrade(kind)}
        aria-label={`${meta.title} 비용 ${formatNumber(cost)} 골드${poor ? ", 골드가 부족해요" : ""}`}
      >
        <GameIcon name="coin" className="buy-button__coin" />
        {formatNumber(cost)}
      </button>
      {activeFx?.ok && (
        <span key={activeFx.id} className="upgrade-row__plus" aria-hidden="true">
          +{formatStat(after - current)}
        </span>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-box">
      <span className="stat-box__label">{label}</span>
      <strong className="stat-box__value">{value}</strong>
    </div>
  );
}

function GrowthScreen({ onUseItem }: { onUseItem: (itemId: ItemId) => void }) {
  const { game, upgradeFx } = useGameUi();
  const heroId = game.activeHeroId;
  const def = HEROES_BY_ID[heroId];
  const progress = game.heroes[heroId];
  const stats = computeHeroStats(game, heroId);
  const needed = expToNext(progress.level);
  const maxed = progress.level >= BALANCE.hero.maxLevel;
  const candy = game.items.exp_candy;

  return (
    <div className="screen">
      <ScreenHeader title="성장" subtitle={`${worldOf(game.stage).name} ${stageLabel(game.stage)} 진행 중`} gold={game.gold} />
      <div className="screen__scroll">
        <section className="growth-hero">
          <div className="growth-hero__portrait">
            <HeroPortrait heroId={heroId} size={96} />
          </div>
          <div className="growth-hero__info">
            <div className="growth-hero__name">
              <strong>{def.name}</strong>
              <RarityBadge rarity={def.rarity} />
            </div>
            <div className="exp-row">
              <span className="exp-row__label">Lv.{progress.level}</span>
              <span className="exp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={needed} aria-valuenow={maxed ? needed : progress.exp}>
                <span className="exp-bar__fill" style={{ width: `${maxed ? 100 : (progress.exp / needed) * 100}%` }} />
              </span>
            </div>
            <span className="exp-row__value">{maxed ? "최고 레벨" : `경험치 ${formatNumber(progress.exp)} / ${formatNumber(needed)}`}</span>
            <div className="power-badge">
              <GameIcon name="sparkle" className="power-badge__icon" />
              전투력 <strong>{formatNumber(stats.power)}</strong>
            </div>
          </div>
        </section>

        <h2 className="section-title">능력치</h2>
        <div className="stat-grid stat-grid--3">
          <StatBox label="공격력" value={formatStat(stats.attack)} />
          <StatBox label="체력" value={formatNumber(stats.maxHp)} />
          <StatBox label="공격 속도" value={`${stats.speed.toFixed(2)}/초`} />
          <StatBox label="치명타 확률" value={formatPercent(stats.critChance)} />
          <StatBox label="치명타 피해" value={`x${stats.critDamage.toFixed(2)}`} />
          <StatBox label="초당 피해" value={formatStat(stats.dps)} />
          <StatBox label="골드 획득" value={`x${stats.goldMult.toFixed(2)}`} />
          <StatBox label="경험치 획득" value={`x${stats.expMult.toFixed(2)}`} />
          <StatBox label="받는 피해" value={`-${formatPercent(stats.damageReduction)}`} />
        </div>

        <h2 className="section-title">강화</h2>
        <div className="upgrade-list">
          <UpgradeRow kind="attack" game={game} stats={stats} fx={upgradeFx} />
          <UpgradeRow kind="health" game={game} stats={stats} fx={upgradeFx} />
        </div>
        <p className="hint">강화는 용사를 바꿔도 모든 용사에게 그대로 적용돼요.</p>

        <button type="button" className="candy-button" disabled={candy <= 0} onClick={() => onUseItem("exp_candy")}>
          <GameIcon name="candy" className="candy-button__icon" />
          <span>
            <strong>달콤 경험치 사탕 먹이기</strong>
            <em>{candy > 0 ? `보유 ${candy}개 · 경험치 +${BALANCE.items.expCandyExp}` : "보유 없음 · 상점에서 살 수 있어요"}</em>
          </span>
        </button>
      </div>
    </div>
  );
}

export default GrowthScreen;
