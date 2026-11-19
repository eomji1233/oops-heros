import type { CSSProperties } from "react";
import { HeroPortrait } from "./HeroPortrait";
import { Modal } from "./Modal";
import { RarityBadge } from "./RarityBadge";
import GameIcon from "../GameIcons";
import { HEROES_BY_ID } from "../game/data/heroes.ts";
import type { SummonResult } from "../game/systems/inventory.ts";
import { useGameStore } from "../game/useGame.ts";

const SPARKS = [0, 40, 80, 120, 160, 200, 240, 280, 320];

export function SummonModal({ result, onClose }: { result: SummonResult; onClose: () => void }) {
  const store = useGameStore();
  const def = HEROES_BY_ID[result.heroId];

  return (
    <Modal title="용사 소환" onClose={onClose} closeLabel="확인">
      <div className={`summon summon--${result.rarity}`}>
        <div className="summon__stage">
          <span className="summon__glow" aria-hidden="true" />
          {SPARKS.map((angle) => (
            <span key={angle} className="summon__spark" style={{ "--angle": `${angle}deg` } as CSSProperties} aria-hidden="true">
              <GameIcon name="sparkle" />
            </span>
          ))}
          <GameIcon name="ticket" className="summon__ticket" />
          <div className="summon__hero">
            <HeroPortrait heroId={result.heroId} size={150} />
          </div>
        </div>

        <div className="summon__info">
          <RarityBadge rarity={result.rarity} />
          <h3 className="summon__name">{def.name}</h3>
          {result.isNew ? (
            <strong className="summon__new">NEW! 새 동료가 합류했어요</strong>
          ) : (
            <span className="summon__dup">이미 함께하는 용사예요 · 경험치 +{result.duplicateExp}로 바뀌었어요</span>
          )}
          {result.pityTriggered && <span className="summon__pity">고급 획득권 보너스로 영웅 이상이 확정됐어요!</span>}
        </div>

        <div className="summon__actions">
          {result.isNew && (
            <button
              type="button"
              className="primary-button primary-button--ghost"
              onClick={() => {
                store.setActiveHero(result.heroId);
                onClose();
              }}
            >
              바로 출전
            </button>
          )}
          <button type="button" className="primary-button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}
