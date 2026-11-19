import { useState } from "react";
import type { CSSProperties } from "react";
import { HEROES, MONSTER_ART } from "../characters/characterData";
import CharacterSprite from "../characters/CharacterSprite";
import GameIcon from "../GameIcons";
import { HEROES_BY_ID } from "../game/data/heroes.ts";
import { globalStageIndex, stageLabel } from "../game/data/worlds.ts";
import { formatNumber } from "../game/format.ts";
import type { BattleState, GameState, HeroStats } from "../game/types.ts";

type BattleArenaProps = {
  game: GameState;
  battle: BattleState;
  stats: HeroStats;
};

const parity = (id: number) => (id % 2 === 0 ? "a" : "b");
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ---------- 용사 ---------- */

function HeroFighter({ game, battle, stats }: BattleArenaProps) {
  const heroId = game.activeHeroId;
  const progress = game.heroes[heroId];
  // 이 화면이 열린 시점의 카운터는 "이미 지난 일"이므로 애니메이션을 재생하지 않는다.
  const [seen] = useState({ attack: battle.attackId, hurt: battle.monsterAttackId });

  const swing = battle.attackId !== seen.attack ? parity(battle.attackId) : null;
  const hurt = battle.monsterAttackId !== seen.hurt ? parity(battle.monsterAttackId) : null;
  const down = battle.phase === "heroDown";
  const hpRatio = clamp01(battle.heroHp / stats.maxHp);

  const classes = ["fighter", "fighter--hero"];
  if (swing) classes.push(`swing-${swing}`);
  if (hurt) classes.push(`hurt-${hurt}`);
  if (down) classes.push("is-down");

  const style = { "--swing-dur": `${battle.swingDuration}s` } as CSSProperties;

  return (
    <div className={classes.join(" ")} style={style}>
      <div className="fighter__shadow" aria-hidden="true" />
      <div className="fighter__lunge">
        {swing && <span key={battle.attackId} className="dash-trail" aria-hidden="true" />}
        <div className="fighter__hurt">
          <CharacterSprite character={HEROES[heroId]} />
        </div>
      </div>
      {battle.lastHeroHit && hurt && (
        <span key={battle.lastHeroHit.id} className="hero-damage" aria-hidden="true">
          -{formatNumber(battle.lastHeroHit.damage)}
        </span>
      )}
      {down && (
        <span className="down-stars" aria-hidden="true">
          <GameIcon name="star" />
          <GameIcon name="star" />
          <GameIcon name="star" />
        </span>
      )}
      <div className="fighter__name">
        <span className="fighter__name-row">
          {HEROES_BY_ID[heroId].name}
          <em className="fighter__level">Lv.{progress.level}</em>
        </span>
        <span
          className="hero-hp"
          role="progressbar"
          aria-label="용사 체력"
          aria-valuemin={0}
          aria-valuemax={stats.maxHp}
          aria-valuenow={Math.round(battle.heroHp)}
        >
          <span className="hero-hp__fill" style={{ width: `${hpRatio * 100}%` }} />
        </span>
      </div>
    </div>
  );
}

/* ---------- 몬스터 ---------- */

function MonsterFighter({ game, battle, stats }: BattleArenaProps) {
  const monster = battle.monster;
  const art = MONSTER_ART[monster.defId];
  const [seen] = useState({ hit: battle.lastHit?.id ?? 0, attack: battle.monsterAttackId });

  const hit = battle.lastHit && battle.lastHit.id !== seen.hit ? battle.lastHit : null;
  const attacking = battle.monsterAttackId !== seen.attack ? parity(battle.monsterAttackId) : null;
  const dying = battle.phase === "monsterDying";
  const spawning = battle.phase === "monsterSpawning";
  const hpRatio = clamp01(monster.hp / monster.maxHp);
  const level = globalStageIndex(game.stage) + 1;

  const classes = ["fighter", "fighter--monster"];
  if (monster.isBoss) classes.push("is-boss");
  if (dying) classes.push("is-dying");
  if (spawning) classes.push("is-spawning");
  if (hit) classes.push(`hit-${parity(hit.id)}`);
  if (attacking) classes.push(`strike-${attacking}`);

  const goldReward = Math.round(monster.goldReward * stats.goldMult);
  const expReward = Math.round(monster.expReward * stats.expMult);

  return (
    <div className={classes.join(" ")}>
      <div className={`nameplate${monster.isBoss ? " nameplate--boss" : ""}${dying ? " nameplate--hidden" : ""}`}>
        <div className="nameplate__head">
          <span className="nameplate__name">
            {monster.isBoss ? (
              <em className="nameplate__level nameplate__level--boss">
                <GameIcon name="crown" className="nameplate__crown" />
                BOSS
              </em>
            ) : (
              <em className="nameplate__level">Lv.{level}</em>
            )}{" "}
            {monster.name}
          </span>
        </div>

        <div
          className="nameplate__bar"
          role="progressbar"
          aria-label="몬스터 체력"
          aria-valuemin={0}
          aria-valuemax={monster.maxHp}
          aria-valuenow={monster.hp}
        >
          <div className="nameplate__fill" style={{ width: `${hpRatio * 100}%` }} />
          <span className="nameplate__hp-text">
            {formatNumber(monster.hp)} / {formatNumber(monster.maxHp)}
          </span>
        </div>

        <div className="nameplate__reward">
          <span className="nameplate__reward-label">처치 보상</span>
          <span className="reward-chip">
            <GameIcon name="coin" className="reward-chip__icon" />+{formatNumber(goldReward)} G
          </span>
          <span className="reward-chip">
            <GameIcon name="star" className="reward-chip__icon" />
            EXP +{formatNumber(expReward)}
          </span>
        </div>
      </div>

      <div className="fighter__shadow" aria-hidden="true" />
      {monster.isBoss && <span className="boss-aura" aria-hidden="true" />}
      <div className="fighter__life">
        <div className="fighter__hop">
          <div className="fighter__recoil">
            <CharacterSprite character={art} />
          </div>
        </div>
      </div>

      {hit && (
        <div key={hit.id} className="impact" aria-hidden="true">
          <svg className="impact__slash" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 68 C 14 34 38 10 70 8 C 46 18 30 38 26 70 Z"
              fill="#fff"
              stroke="#ffd36e"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M6 40 L22 44" stroke="#ffd36e" strokeWidth="4" strokeLinecap="round" />
            <path d="M12 22 L24 30" stroke="#ffd36e" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <GameIcon name="sparkle" className="impact__spark impact__spark--one" />
          <GameIcon name="sparkle" className="impact__spark impact__spark--two" />
          <GameIcon name="sparkle" className="impact__spark impact__spark--three" />
          <span className={`damage ${hit.crit ? "damage--critical" : "damage--normal"}`}>
            {hit.crit ? `치명타! ${formatNumber(hit.damage)}` : `-${formatNumber(hit.damage)}`}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- 처치 / 클리어 연출 ---------- */

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function KillEffect({ gold, exp, boss }: { gold: number; exp: number; boss: boolean }) {
  return (
    <div className={`kill-fx${boss ? " kill-fx--boss" : ""}`} aria-hidden="true">
      {boss && <span className="boss-flash" />}
      {BURST_ANGLES.map((angle) => (
        <span key={angle} className="kill-fx__spark" style={{ "--angle": `${angle}deg` } as CSSProperties}>
          <GameIcon name={angle % 90 === 0 ? "sparkle" : "star"} />
        </span>
      ))}
      <span className="kill-fx__reward">
        <span className="kill-fx__gold">
          <GameIcon name="coin" />+{formatNumber(gold)}
        </span>
        <span className="kill-fx__exp">EXP +{formatNumber(exp)}</span>
      </span>
    </div>
  );
}

export function BattleArena({ game, battle, stats }: BattleArenaProps) {
  const [seen] = useState({ kill: battle.lastKill?.id ?? 0, clear: battle.stageClearId });
  const kill = battle.lastKill && battle.lastKill.id !== seen.kill ? battle.lastKill : null;
  const cleared = battle.stageClearId !== seen.clear;

  return (
    <section className="arena" aria-label="전투 장면">
      <HeroFighter key={game.activeHeroId} game={game} battle={battle} stats={stats} />
      <MonsterFighter key={battle.spawnId} game={game} battle={battle} stats={stats} />
      {kill && <KillEffect key={kill.id} gold={kill.gold} exp={kill.exp} boss={kill.boss} />}
      {cleared && (
        <div key={battle.stageClearId} className="stage-banner" role="status">
          <strong className="stage-banner__title">스테이지 클리어!</strong>
          <span className="stage-banner__sub">STAGE {stageLabel(game.stage)}</span>
        </div>
      )}
    </section>
  );
}
