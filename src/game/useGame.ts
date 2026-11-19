import { createContext, useContext, useSyncExternalStore } from "react";
import type { GameStore, UiSnapshot } from "./store.ts";
import type { BattleState } from "./types.ts";

export const GameStoreContext = createContext<GameStore | null>(null);

export function useGameStore(): GameStore {
  const store = useContext(GameStoreContext);
  if (!store) throw new Error("GameStoreContext 안에서만 사용할 수 있어요.");
  return store;
}

/** 자주 바뀌지 않는 게임 상태 (골드, 용사, 보상, 알림 등) */
export function useGameUi(): UiSnapshot {
  const store = useGameStore();
  return useSyncExternalStore(store.subscribeUi, store.getUi);
}

/** 전투 진행 상태 (틱마다 갱신됨) */
export function useBattle(): BattleState {
  const store = useGameStore();
  return useSyncExternalStore(store.subscribeBattle, store.getBattle);
}
