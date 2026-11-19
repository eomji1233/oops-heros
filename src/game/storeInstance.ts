import { createSaveStorage } from "../storage/saveStorage.ts";
import { GameStore } from "./store.ts";

let instance: GameStore | null = null;

/** 앱 전체에서 단 하나만 만들어지는 게임 스토어 (타이머 중복 방지) */
export function getGameStore(): GameStore {
  if (!instance) instance = new GameStore(createSaveStorage());
  return instance;
}
