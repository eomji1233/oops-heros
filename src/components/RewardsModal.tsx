import { Modal } from "./Modal";
import { BALANCE } from "../game/balance.ts";
import GameIcon from "../GameIcons";
import { QUEST_LIST } from "../game/data/quests.ts";
import { formatDuration, formatNumber } from "../game/format.ts";
import { isQuestClaimed, isQuestComplete, questProgress } from "../game/systems/rewards.ts";
import { useGameStore, useGameUi } from "../game/useGame.ts";
import { rewardText } from "../game/rewardText.ts";

/* ---------- 오프라인 보상 ---------- */

function OfflineSection() {
  const store = useGameStore();
  const { game } = useGameUi();
  const reward = game.pendingOffline;
  if (!reward) return null;

  return (
    <section className="reward-card reward-card--offline">
      <GameIcon name="clock" className="reward-card__icon" />
      <div className="reward-card__text">
        <strong>자리를 비운 동안 모았어요!</strong>
        <span>{formatDuration(reward.seconds)} 동안의 모험 결과</span>
        <span className="reward-card__values">
          <b>+{formatNumber(reward.gold)} G</b>
          <b>EXP +{formatNumber(reward.exp)}</b>
        </span>
      </div>
      <button
        type="button"
        className="claim-button"
        onClick={() => {
          const claimed = store.claimOffline();
          if (claimed) store.pushNotice(`${formatNumber(claimed.gold)} G를 받았어요!`, "good");
        }}
      >
        받기
      </button>
    </section>
  );
}

/* ---------- 출석 ---------- */

function CheckInSection() {
  const store = useGameStore();
  const { game } = useGameUi();
  const claimed = game.daily.checkInClaimed;

  return (
    <section className="reward-card">
      <GameIcon name="gift" className="reward-card__icon" />
      <div className="reward-card__text">
        <strong>오늘의 출석 보상</strong>
        <span>{claimed ? `${game.daily.streak}일 연속 출석 중!` : "연속으로 출석하면 보너스가 커져요"}</span>
        <span className="reward-card__values">
          <b>{formatNumber(BALANCE.daily.checkInGold)} G~</b>
        </span>
      </div>
      <button
        type="button"
        className="claim-button"
        disabled={claimed}
        onClick={() => {
          const result = store.checkIn();
          if (result.ok) store.pushNotice(`출석 완료! ${formatNumber(result.gold)} G`, "good");
        }}
      >
        {claimed ? "받음" : "받기"}
      </button>
    </section>
  );
}

/* ---------- 퀘스트 ---------- */

function QuestSection() {
  const store = useGameStore();
  const { game } = useGameUi();

  return (
    <section className="quest-section">
      <h3 className="section-title">퀘스트</h3>
      <ul className="quest-list">
        {QUEST_LIST.map((quest) => {
          const progress = Math.min(quest.target, questProgress(game, quest));
          const done = isQuestComplete(game, quest);
          const claimed = isQuestClaimed(game, quest);
          return (
            <li key={quest.id} className={`quest${done && !claimed ? " is-ready" : ""}${claimed ? " is-claimed" : ""}`}>
              <div className="quest__text">
                <strong>
                  {quest.name}
                  <em className={quest.scope === "daily" ? "quest__tag" : "quest__tag quest__tag--once"}>
                    {quest.scope === "daily" ? "매일" : "1회"}
                  </em>
                </strong>
                <span className="quest__reward">보상: {rewardText(quest.reward)}</span>
                <span className="quest__bar" role="progressbar" aria-valuemin={0} aria-valuemax={quest.target} aria-valuenow={progress}>
                  <span className="quest__fill" style={{ width: `${(progress / quest.target) * 100}%` }} />
                  <span className="quest__count">
                    {formatNumber(progress)} / {formatNumber(quest.target)}
                  </span>
                </span>
              </div>
              <button
                type="button"
                className="claim-button"
                disabled={!done || claimed}
                onClick={() => {
                  const result = store.claimQuest(quest.id);
                  if (result.ok) store.pushNotice(`퀘스트 보상: ${rewardText(result.reward)}`, "good");
                }}
              >
                {claimed ? "받음" : "받기"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function RewardsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="출석 · 퀘스트" variant="sheet" onClose={onClose}>
      <div className="rewards">
        <OfflineSection />
        <CheckInSection />
        <QuestSection />
      </div>
    </Modal>
  );
}

/* ---------- 앱을 켰을 때 뜨는 오프라인 보상 팝업 ---------- */

export function OfflineRewardModal({ onClose }: { onClose: () => void }) {
  const store = useGameStore();
  const { game } = useGameUi();
  const reward = game.pendingOffline;
  if (!reward) return null;

  return (
    <Modal title="돌아오신 걸 환영해요" onClose={onClose} closeLabel="나중에 받기">
      <div className="offline-popup">
        <GameIcon name="clock" className="offline-popup__icon" />
        <p className="offline-popup__text">
          자리를 비운 <b>{formatDuration(reward.seconds)}</b> 동안
          <br />
          용사단이 열심히 싸웠어요!
        </p>
        <div className="offline-popup__rewards">
          <span className="offline-popup__chip">
            <GameIcon name="coin" /> +{formatNumber(reward.gold)} G
          </span>
          <span className="offline-popup__chip">
            <GameIcon name="star" /> EXP +{formatNumber(reward.exp)}
          </span>
        </div>
        <p className="hint">오프라인 보상은 최대 8시간까지 쌓여요.</p>
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            store.claimOffline();
            onClose();
          }}
        >
          보상 받기
        </button>
      </div>
    </Modal>
  );
}
