/*
 * 저장소 어댑터.
 * 현재는 브라우저 localStorage 를 사용한다. (앱인토스 SDK 의 Storage API 는 이 환경에서
 * 동작을 확인하지 못했으므로 사용하지 않는다. 나중에 확인되면 이 파일의 구현만 교체하면 된다.)
 * localStorage 를 쓸 수 없는 환경에서는 메모리에만 저장하며, 이 경우 새로고침 시 진행 상황이 사라진다.
 */

export const SAVE_KEY = "oops-heros/save/v1";

export type SaveStorage = {
  readonly kind: "localStorage" | "memory";
  load(): string | null;
  save(json: string): boolean;
  clear(): void;
};

function createMemoryStorage(): SaveStorage {
  let value: string | null = null;
  return {
    kind: "memory",
    load: () => value,
    save: (json) => {
      value = json;
      return true;
    },
    clear: () => {
      value = null;
    },
  };
}

function createLocalStorage(): SaveStorage | null {
  try {
    const probe = "__oops_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
  } catch {
    return null;
  }
  return {
    kind: "localStorage",
    load: () => {
      try {
        return window.localStorage.getItem(SAVE_KEY);
      } catch {
        return null;
      }
    },
    save: (json) => {
      try {
        window.localStorage.setItem(SAVE_KEY, json);
        return true;
      } catch {
        return false;
      }
    },
    clear: () => {
      try {
        window.localStorage.removeItem(SAVE_KEY);
      } catch {
        /* 저장소를 쓸 수 없으면 무시 */
      }
    },
  };
}

export function createSaveStorage(): SaveStorage {
  return createLocalStorage() ?? createMemoryStorage();
}
