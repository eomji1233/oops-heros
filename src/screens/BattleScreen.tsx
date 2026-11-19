import { useState } from "react";
import BattleBackground from "../BattleBackground";
import { BattleArena } from "../components/BattleArena";
import GameIcon from "../GameIcons";
import type { GameIconName } from "../GameIcons";
import { BALANCE } from "../game/balance.ts";
import { worldOf } from "../game/data/worlds.ts";
import { stageLabel } from "../game/data/worlds.ts";
import { formatNumber, formatStat } from "../game/format.ts";
import { computeHeroStats } from "../game/systems/stats.ts";
import { hasClaimableReward } from "../game/systems/rewards.ts";
import { upgradeCost } from "../game/systems/upgrades.ts";
import { useBattle, useGameStore, useGameUi } from "../game/useGame.ts";
import type { GameState, HeroStats, UpgradeKind } from "../game/types.ts";
import type { UpgradeFx } from "../game/store.ts";

/* ---------- 상단 HUD (로고 + 골드만) ---------- */

function GameHud({ gold, killTick }: { gold: number; killTick: number }) {
  return (
    <header className="hud">
      <div className="game-logo">
        <span className="game-logo__sub">귀염뽀짝 방치형 RPG</span>
        <h1 className="game-logo__title">어쩌다 용사단</h1>
      </div>

      <div className="gold-counter" aria-label={`보유 골드 ${formatNumber(gold)} 골드`}>
        <GameIcon name="coin" className="gold-counter__coin" />
        <span key={killTick} className="gold-counter__value">
          {formatNumber(gold)} G
        </span>
      </div>
    </header>
  );
}

/* ---------- 스테이지 (배경에 스며드는 작은 표시) ---------- */

function StageBadge({ game }: { game: GameState }) {
  const world = worldOf(game.stage);
  const pips = Array.from({ length: BALANCE.normalsPerStage }, (_, index) => index < game.killsInStage);
  const bossNext = game.killsInStage >= BALANCE.normalsPerStage;

  return (
    <div className="stage-badge" aria-label={`${world.name} 스테이지 ${stageLabel(game.stage)}`}>
      <span className="stage-badge__world">{world.name}</span>
      <strong className="stage-badge__stage">{stageLabel(game.stage)}</strong>
      <span className="stage-pips" role="img" aria-label={`일반 몬스터 ${game.killsInStage} / ${BALANCE.normalsPerStage} 처치`}>
        {pips.map((done, index) => (
          <span key={index} className={`stage-pip${done ? " stage-pip--done" : ""}`} />
        ))}
        <GameIcon name="crown" className={`stage-pip-boss${bossNext ? " stage-pip-boss--now" : ""}`} />
      </span>
    </div>
  );
}

/* ---------- 전투 영역 보조 UI (보상 · 버프 · 작은 상태) ---------- */

function BattleChrome({
  game,
  tone,
  statusHint,
  onOpenRewards,
}: {
  game: GameState;
  tone: "auto" | "boss" | "down";
  statusHint: string | null;
  onOpenRewards: () => void;
}) {
  const alert = hasClaimableReward(game) || game.pendingOffline !== null;
  const buffs: string[] = [];
  if (game.buffs.goldBoostSec > 0) buffs.push(`골드 +50% ${Math.ceil(game.buffs.goldBoostSec / 60)}분`);
  if (game.buffs.critBoostSec > 0) buffs.push(`치명타 +15% ${Math.ceil(game.buffs.critBoostSec / 60)}분`);

  return (
    <div className="battle-chrome">
      <div className="battle-chrome__left">
        <StageBadge game={game} />
        {statusHint ? (
          <span className={`battle-status battle-status--${tone}`} role="status">
            <span className="battle-status__dot" aria-hidden="true" />
            {statusHint}
          </span>
        ) : (
          <span className="battle-status battle-status--auto battle-status--quiet" role="status" aria-label="자동 전투 중">
            <span className="battle-status__dot" aria-hidden="true" />
            AUTO
          </span>
        )}
      </div>

      <div className="battle-chrome__right">
        <button type="button" className="gift-button" onClick={onOpenRewards} aria-label="출석과 퀘스트 보상">
          <GameIcon name="gift" className="gift-button__icon" />
          {alert && <span className="red-dot red-dot--gift" aria-label="받을 보상이 있어요" />}
        </button>
        {buffs.map((text) => (
          <span key={text} className="buff-chip">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 하단에 겹쳐 떠 있는 성장 패널 ---------- */

const UPGRADE_META: Record<UpgradeKind, { icon: GameIconName; title: string }> = {
  attack: { icon: "sword", title: "공격력 강화" },
  health: { icon: "heart", title: "체력 강화" },
};

function UpgradeButton({ kind, game, stats, fx }: { kind: UpgradeKind; game: GameState; stats: HeroStats; fx: UpgradeFx | null }) {
  const store = useGameStore();
  const [seenFx] = useState(fx?.id ?? 0);
  const level = game.upgrades[kind];
  const cost = upgradeCost(kind, level);
  const poor = game.gold < cost;

  const next = computeHeroStats({ ...game, upgrades: { ...game.upgrades, [kind]: level + 1 } }, game.activeHeroId);
  const current = kind === "attack" ? stats.attack : stats.maxHp;
  const after = kind === "attack" ? next.attack : next.maxHp;
  const meta = UPGRADE_META[kind];

  const activeFx = fx && fx.kind === kind && fx.id !== seenFx ? fx : null;
  const classes = ["growth-button", `growth-button--${kind}`];
  if (poor) classes.push("is-poor");
  if (activeFx) classes.push(activeFx.ok ? `pop-${activeFx.id % 2 ? "a" : "b"}` : `shake-${activeFx.id % 2 ? "a" : "b"}`);

  return (
    <button
      type="button"
      className={classes.join(" ")}
      aria-label={`${meta.title}, 현재 ${formatStat(current)}에서 ${formatStat(after)}, 비용 ${formatNumber(cost)} 골드${poor ? ", 골드가 부족해요" : ""}`}
      onClick={() => store.upgrade(kind)}
    >
      <span className="growth-button__icon">
        <GameIcon name={meta.icon} />
      </span>
      <span className="growth-button__text">
        <span className="growth-button__title">{meta.title}</span>
        <span className="growth-button__desc">
          {formatStat(current)} → <b>{formatStat(after)}</b>
        </span>
      </span>
      <em className="growth-button__level">Lv.{level + 1}</em>
      <span className="growth-button__cost">
        <GameIcon name="coin" className="growth-button__coin" />
        {formatNumber(cost)}
      </span>
      {activeFx?.ok && (
        <span key={activeFx.id} className="growth-button__plus" aria-hidden="true">
          +{formatStat(after - current)}
        </span>
      )}
    </button>
  );
}

function GrowthTray({ game, stats, fx }: { game: GameState; stats: HeroStats; fx: UpgradeFx | null }) {
  return (
    <section className="growth-tray" aria-label="용사 성장">
      <h2 className="growth-tray__tab">
        <GameIcon name="growth" className="growth-tray__tab-icon" />
        용사 성장
      </h2>
      <div className="growth-tray__list">
        <UpgradeButton kind="attack" game={game} stats={stats} fx={fx} />
        <UpgradeButton kind="health" game={game} stats={stats} fx={fx} />
      </div>
    </section>
  );
}

/* ---------- 전투 화면 ---------- */

function BattleScreen({ onOpenRewards }: { onOpenRewards: () => void }) {
  const { game, upgradeFx } = useGameUi();
  const battle = useBattle();
  const stats = computeHeroStats(game, game.activeHeroId);

  // 평소 자동 전투는 작은 AUTO만. 보스·쓰러짐 등 예외만 짧은 문구.
  const tone: "auto" | "boss" | "down" =
    battle.phase === "heroDown" ? "down" : battle.monster.isBoss ? "boss" : "auto";
  const statusHint =
    battle.phase === "heroDown" ? "다시 도전" : battle.monster.isBoss ? "보스!" : null;

  return (
    <div className="world">
      <BattleBackground />
      <GameHud gold={game.gold} killTick={battle.lastKill?.id ?? 0} />
      <BattleChrome game={game} tone={tone} statusHint={statusHint} onOpenRewards={onOpenRewards} />
      <BattleArena game={game} battle={battle} stats={stats} />
      <GrowthTray game={game} stats={stats} fx={upgradeFx} />
    </div>
  );
}

export default BattleScreen;
