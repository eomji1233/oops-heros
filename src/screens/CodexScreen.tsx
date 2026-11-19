import { useState } from "react";
import { MONSTER_ART } from "../characters/characterData";
import CharacterSprite from "../characters/CharacterSprite";
import { ScreenHeader } from "../components/ScreenHeader";
import GameIcon from "../GameIcons";
import { ITEMS_BY_ID } from "../game/data/items.ts";
import { HEROES_BY_ID } from "../game/data/heroes.ts";
import { MONSTER_LIST, WORLDS, stageLabel } from "../game/data/worlds.ts";
import { formatNumber } from "../game/format.ts";
import { useGameUi } from "../game/useGame.ts";
import type { GameState, WorldDef } from "../game/types.ts";

type CodexTab = "world" | "monster";

function WorldCard({ world, index, game }: { world: WorldDef; index: number; game: GameState }) {
  const open = world.implemented;
  const current = game.stage.world === index + 1;
  const reached = game.bestStage.world === index + 1 ? game.bestStage.stage : 0;
  const cleared = open && game.finalCleared ? world.stageCount : Math.max(0, reached - 1);

  return (
    <li className={`world-card${open ? "" : " is-locked"}${current ? " is-current" : ""}`}>
      <span className="world-card__no">{index + 1}</span>
      <div className="world-card__body">
        <div className="world-card__head">
          <strong className="world-card__name">{world.name}</strong>
          {open ? (
            <span className="chip-active">{current ? "탐험 중" : "열림"}</span>
          ) : (
            <span className="chip-soon">
              <GameIcon name="lock" className="chip-soon__icon" />
              준비 중
            </span>
          )}
        </div>
        <p className="world-card__desc">{world.description}</p>
        <p className="world-card__meta">
          {open
            ? `스테이지 ${cleared} / ${world.stageCount} 클리어 · 최고 ${stageLabel(game.bestStage)}`
            : `${world.stageCount}개 스테이지 · 열리는 조건: ${world.unlockText}`}
        </p>
        {open && (
          <ul className="world-card__rewards">
            {world.stageHeroRewards.map((reward) => (
              <li key={`h${reward.stage}`}>
                {index + 1}-{reward.stage} 보스: 동료 {HEROES_BY_ID[reward.heroId].name}
              </li>
            ))}
            {world.stageItemRewards.map((reward) => (
              <li key={`i${reward.stage}`}>
                {index + 1}-{reward.stage} 보스: {ITEMS_BY_ID[reward.itemId].name} x{reward.count}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

function MonsterCard({ game, monsterId }: { game: GameState; monsterId: string }) {
  const monster = MONSTER_LIST.find((m) => m.id === monsterId);
  const art = MONSTER_ART[monsterId];
  if (!monster) return null;
  const defeated = game.discoveredMonsters[monsterId] ?? 0;
  const found = defeated > 0;

  return (
    <li className={`monster-card${found ? "" : " is-locked"}${monster.kind === "boss" ? " is-boss" : ""}`}>
      <span className={`portrait portrait--monster${found ? "" : " portrait--locked"}`} aria-hidden="true">
        <CharacterSprite character={art} size={monster.kind === "boss" ? 92 : 76} />
      </span>
      <div className="monster-card__text">
        <strong>{found ? monster.name : "???"}</strong>
        {monster.kind === "boss" && <span className="chip-boss">BOSS</span>}
        <span>{found ? monster.description : "아직 만나지 못한 몬스터예요."}</span>
        <em>{found ? `처치 ${formatNumber(defeated)}마리` : "미발견"}</em>
      </div>
    </li>
  );
}

function CodexScreen() {
  const { game } = useGameUi();
  const [tab, setTab] = useState<CodexTab>("world");
  const found = MONSTER_LIST.filter((m) => (game.discoveredMonsters[m.id] ?? 0) > 0).length;

  return (
    <div className="screen">
      <ScreenHeader title="도감" subtitle={`몬스터 ${found} / ${MONSTER_LIST.length} 발견`} gold={game.gold} />
      <div className="screen__scroll">
        <div className="segmented" role="tablist" aria-label="도감 종류">
          <button type="button" role="tab" aria-selected={tab === "world"} className={tab === "world" ? "is-on" : ""} onClick={() => setTab("world")}>
            월드
          </button>
          <button type="button" role="tab" aria-selected={tab === "monster"} className={tab === "monster" ? "is-on" : ""} onClick={() => setTab("monster")}>
            몬스터
          </button>
        </div>

        {tab === "world" ? (
          <ul className="world-list">
            {WORLDS.map((world, index) => (
              <WorldCard key={world.id} world={world} index={index} game={game} />
            ))}
          </ul>
        ) : (
          <ul className="monster-list">
            {MONSTER_LIST.slice()
              .sort((a, b) => Number(a.kind === "boss") - Number(b.kind === "boss"))
              .map((monster) => (
                <MonsterCard key={monster.id} game={game} monsterId={monster.id} />
              ))}
          </ul>
        )}
        <p className="hint">새 월드는 앞으로 계속 추가될 예정이에요.</p>
      </div>
    </div>
  );
}

export default CodexScreen;
