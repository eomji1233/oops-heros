import type { SaveStorage } from "../storage/saveStorage.ts";
import { BALANCE } from "./balance.ts";
import { cloneGame, createInitialGame, sanitizeGame, trustedNow } from "./state.ts";
import { createBattle, stepBattle } from "./systems/battle.ts";
import { buyItem, consumeItem } from "./systems/inventory.ts";
import type { BuyResult, ConsumeItemResult } from "./systems/inventory.ts";
import { purchaseUpgrade } from "./systems/upgrades.ts";
import type { UpgradeResult } from "./systems/upgrades.ts";
import {
  claimCheckIn,
  claimOfflineReward,
  claimQuest,
  computeOfflineReward,
  mergeOfflineReward,
  refreshDaily,
} from "./systems/rewards.ts";
import type { CheckInResult, QuestClaimResult } from "./systems/rewards.ts";
import { computeHeroStats } from "./systems/stats.ts";
import { HEROES_BY_ID } from "./data/heroes.ts";
import { withSubject } from "./utils/korean.ts";
import type { BattleState, GameState, HeroId, ItemId, Notice, NoticeTone, OfflineReward, UpgradeKind } from "./types.ts";

export type Toast = { id: number; text: string; tone: NoticeTone; at: number };
export type UpgradeFx = { id: number; kind: UpgradeKind; ok: boolean };

/** 화면이 구독하는 "자주 바뀌지 않는" 상태 */
export type UiSnapshot = {
  game: GameState;
  toasts: Toast[];
  upgradeFx: UpgradeFx | null;
  /** 이번에 켠 세션에서 저장소를 사용할 수 있는지 */
  storageKind: SaveStorage["kind"];
};

type Listener = () => void;

const TOAST_LIFETIME_MS = 3200;
const MAX_TOASTS = 3;

export class GameStore {
  private storage: SaveStorage;
  private game: GameState;
  private battle: BattleState;
  private ui: UiSnapshot;
  private uiListeners = new Set<Listener>();
  private battleListeners = new Set<Listener>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastTick = 0;
  private lastSave = 0;
  private toastId = 0;
  private fxId = 0;
  private rng: () => number = Math.random;

  constructor(storage: SaveStorage, now: number = Date.now()) {
    this.storage = storage;
    let loaded: unknown = null;
    const raw = storage.load();
    if (raw) {
      try {
        loaded = JSON.parse(raw);
      } catch {
        loaded = null;
      }
    }
    const game = loaded ? sanitizeGame(loaded, now) : createInitialGame(now);
    this.game = this.applyElapsedAndRollover(game, now, true);
    this.battle = createBattle(this.game);
    this.ui = { game: this.game, toasts: [], upgradeFx: null, storageKind: storage.kind };
    this.persist(now);
  }

  /* ---------- React 연결 ---------- */

  subscribeUi = (listener: Listener): (() => void) => {
    this.uiListeners.add(listener);
    return () => this.uiListeners.delete(listener);
  };
  subscribeBattle = (listener: Listener): (() => void) => {
    this.battleListeners.add(listener);
    return () => this.battleListeners.delete(listener);
  };
  getUi = (): UiSnapshot => this.ui;
  getBattle = (): BattleState => this.battle;

  /* ---------- 루프 ---------- */

  /** 게임 루프 시작. 이미 시작되어 있으면 아무 것도 하지 않는다(중복 타이머 방지). */
  start(): void {
    if (this.timer !== null) return;
    this.lastTick = performance.now();
    this.timer = setInterval(this.tick, BALANCE.tickMs);
  }

  /** 루프 정지(화면이 가려졌거나 앱이 정리될 때) */
  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  get running(): boolean {
    return this.timer !== null;
  }

  private tick = (): void => {
    const perfNow = performance.now();
    // 탭이 오래 멈췄다 돌아와도 전투는 최대 1초만 이어서 진행하고, 나머지는 오프라인 보상에 맡긴다.
    let remaining = Math.min((perfNow - this.lastTick) / 1000, 1);
    this.lastTick = perfNow;

    let game = this.game;
    let battle = this.battle;
    const notices: Notice[] = [];
    while (remaining > 0.0001) {
      const dt = Math.min(remaining, BALANCE.maxStepSec);
      remaining -= dt;
      const result = stepBattle(game, battle, dt, this.rng);
      game = result.game;
      battle = result.battle;
      notices.push(...result.notices);
    }

    const wall = Date.now();
    const gameChanged = game !== this.game;
    this.battle = battle;
    if (gameChanged) {
      this.game = game;
      this.setUi({ game });
    }
    if (notices.length > 0) this.pushToasts(notices);
    else this.pruneToasts();

    for (const listener of this.battleListeners) listener();

    if (gameChanged && wall - this.lastSave >= BALANCE.autosaveMs) this.persist(wall);
  };

  /* ---------- 저장 / 시간 ---------- */

  private persist(now: number): void {
    const trusted = trustedNow(this.game, now);
    this.game = { ...this.game, lastSeen: trusted, maxSeen: trusted };
    this.ui = { ...this.ui, game: this.game };
    this.lastSave = now;
    this.storage.save(JSON.stringify(this.game));
  }

  /** 앱이 가려지거나 닫히기 직전에 호출 */
  flush(): void {
    this.persist(Date.now());
  }

  /** 앱이 다시 보일 때: 자리를 비운 시간을 오프라인 보상으로 환산 */
  resume(now: number = Date.now()): void {
    const next = this.applyElapsedAndRollover(this.game, now, false);
    this.game = next;
    this.persist(now);
    this.setUi({ game: this.game });
    this.lastTick = performance.now();
    for (const listener of this.battleListeners) listener();
  }

  private applyElapsedAndRollover(game: GameState, now: number, boot: boolean): GameState {
    const draft = cloneGame(game);
    const elapsed = now - draft.lastSeen;
    const threshold = (boot ? BALANCE.offline.minSeconds : BALANCE.resumeOfflineSeconds) * 1000;
    // 기기 시간을 과거로 돌렸다면(elapsed <= 0) 보상 없음. 믿을 수 있는 시각은 maxSeen 이다.
    if (elapsed >= threshold) {
      const reward = computeOfflineReward(draft, elapsed);
      if (reward) draft.pendingOffline = mergeOfflineReward(draft.pendingOffline, reward);
    }
    const rolled = refreshDaily(draft, now);
    const trusted = trustedNow(draft, now);
    draft.lastSeen = trusted;
    draft.maxSeen = trusted;
    return rolled || elapsed >= threshold || boot ? draft : game;
  }

  /* ---------- 상태 갱신 도우미 ---------- */

  private setUi(patch: Partial<UiSnapshot>): void {
    this.ui = { ...this.ui, ...patch };
    for (const listener of this.uiListeners) listener();
  }

  private commit(game: GameState, options: { save?: boolean } = {}): void {
    this.game = game;
    if (options.save !== false) this.persist(Date.now());
    this.setUi({ game: this.game });
  }

  private pushToasts(notices: Notice[]): void {
    const at = performance.now();
    const fresh = notices.map((n) => ({ id: ++this.toastId, text: n.text, tone: n.tone, at }));
    const toasts = [...this.ui.toasts.filter((t) => at - t.at < TOAST_LIFETIME_MS), ...fresh].slice(-MAX_TOASTS);
    this.setUi({ toasts });
  }

  pushNotice(text: string, tone: NoticeTone = "info"): void {
    this.pushToasts([{ text, tone }]);
  }

  private pruneToasts(): void {
    if (this.ui.toasts.length === 0) return;
    const at = performance.now();
    const toasts = this.ui.toasts.filter((t) => at - t.at < TOAST_LIFETIME_MS);
    if (toasts.length !== this.ui.toasts.length) this.setUi({ toasts });
  }

  /* ---------- 사용자 행동 ---------- */

  upgrade(kind: UpgradeKind): UpgradeResult {
    const draft = cloneGame(this.game);
    const result = purchaseUpgrade(draft, kind);
    if (result.ok) {
      this.commit(draft);
    } else {
      this.pushNotice("골드가 부족해요", "warn");
    }
    this.setUi({ upgradeFx: { id: ++this.fxId, kind, ok: result.ok } });
    return result;
  }

  buy(itemId: ItemId): BuyResult {
    const draft = cloneGame(this.game);
    const result = buyItem(draft, itemId);
    if (result.ok) this.commit(draft);
    else this.pushNotice("골드가 부족해요", "warn");
    return result;
  }

  consumeItem(itemId: ItemId): ConsumeItemResult {
    const draft = cloneGame(this.game);
    const result = consumeItem(draft, itemId, this.rng);
    if (!result.ok) return result;
    this.commit(draft);
    if (result.kind === "buff") this.pushNotice(result.label, "good");
    if (result.kind === "exp") {
      this.pushNotice(
        result.levelsGained > 0 ? `경험치 +${result.exp}, 레벨 업!` : `경험치 +${result.exp}`,
        "good",
      );
    }
    return result;
  }

  setActiveHero(heroId: HeroId): boolean {
    if (!this.game.heroes[heroId].owned || this.game.activeHeroId === heroId) return false;
    const draft = cloneGame(this.game);
    draft.activeHeroId = heroId;
    this.commit(draft);
    // 새 용사로 현재 스테이지를 이어서 진행
    this.battle = createBattle(draft);
    for (const listener of this.battleListeners) listener();
    this.pushNotice(`${withSubject(HEROES_BY_ID[heroId].name)} 전투에 나섰어요!`, "good");
    return true;
  }

  claimOffline(): OfflineReward | null {
    const draft = cloneGame(this.game);
    const reward = claimOfflineReward(draft);
    if (!reward) return null;
    this.commit(draft);
    const stats = computeHeroStats(draft, draft.activeHeroId);
    this.battle = { ...this.battle, heroHp: Math.min(this.battle.heroHp, stats.maxHp) };
    return reward;
  }

  checkIn(): CheckInResult {
    const draft = cloneGame(this.game);
    const result = claimCheckIn(draft, Date.now());
    if (result.ok) this.commit(draft);
    return result;
  }

  claimQuest(questId: string): QuestClaimResult {
    const draft = cloneGame(this.game);
    const result = claimQuest(draft, questId, Date.now());
    if (result.ok) this.commit(draft);
    return result;
  }

  /* ---------- 개발 전용 검증 도우미 ---------- */

  /** 개발 서버에서만 window 에 노출되어 브라우저 검증에 사용된다. 배포 빌드에는 포함되지 않는다. */
  debugApi() {
    return {
      addGold: (amount: number) => {
        const draft = cloneGame(this.game);
        draft.gold += amount;
        this.commit(draft);
      },
      addItem: (itemId: ItemId, count: number) => {
        const draft = cloneGame(this.game);
        draft.items[itemId] += count;
        this.commit(draft);
      },
      setLastSeen: (ms: number) => {
        const draft = cloneGame(this.game);
        draft.lastSeen = ms;
        draft.maxSeen = ms;
        this.game = draft;
        this.storage.save(JSON.stringify(draft));
      },
      state: () => this.game,
      reset: () => {
        this.storage.clear();
      },
    };
  }

}
