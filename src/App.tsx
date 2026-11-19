import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "./styles/battle.css";
import "./styles/screens.css";
import { BottomNav } from "./components/BottomNav";
import type { TabId } from "./components/BottomNav";
import { OfflineRewardModal, RewardsModal } from "./components/RewardsModal";
import { SummonModal } from "./components/SummonModal";
import { Toasts } from "./components/Toasts";
import { hasClaimableReward } from "./game/systems/rewards.ts";
import type { SummonResult } from "./game/systems/inventory.ts";
import type { ItemId } from "./game/types.ts";
import { getGameStore } from "./game/storeInstance.ts";
import { GameStoreContext, useGameStore, useGameUi } from "./game/useGame.ts";
import BattleScreen from "./screens/BattleScreen";
import CodexScreen from "./screens/CodexScreen";
import GrowthScreen from "./screens/GrowthScreen";
import HeroesScreen from "./screens/HeroesScreen";
import ShopScreen from "./screens/ShopScreen";

/** 게임 루프의 생명주기: 화면이 보일 때만 돌리고, 가려지면 저장하고 멈춘다. */
function useGameLoop() {
  const store = useGameStore();

  useEffect(() => {
    const sync = () => {
      if (document.hidden) {
        store.flush();
        store.stop();
      } else {
        store.resume();
        store.start();
      }
    };
    const onPageHide = () => store.flush();

    if (!document.hidden) store.start();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pagehide", onPageHide);

    if (import.meta.env.DEV) {
      (window as unknown as { __oops?: unknown }).__oops = store.debugApi();
    }

    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pagehide", onPageHide);
      store.flush();
      store.stop();
    };
  }, [store]);
}

function GameShell() {
  const store = useGameStore();
  const { game, toasts } = useGameUi();
  const [tab, setTab] = useState<TabId>("battle");
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [offlineDismissed, setOfflineDismissed] = useState(false);
  const [summon, setSummon] = useState<SummonResult | null>(null);

  useGameLoop();

  const handleUseItem = useCallback(
    (itemId: ItemId) => {
      const result = store.consumeItem(itemId);
      if (result.ok && result.kind === "summon") setSummon(result.summon);
    },
    [store],
  );

  const openRewards = useCallback(() => setRewardsOpen(true), []);
  const showOffline = game.pendingOffline !== null && !offlineDismissed && !rewardsOpen;

  return (
    <main className="game">
      <div className="game__view">
        {tab === "battle" && <BattleScreen onOpenRewards={openRewards} />}
        {tab === "heroes" && <HeroesScreen onUseItem={handleUseItem} />}
        {tab === "growth" && <GrowthScreen onUseItem={handleUseItem} />}
        {tab === "shop" && <ShopScreen onUseItem={handleUseItem} />}
        {tab === "codex" && <CodexScreen />}
        <Toasts toasts={toasts} />
      </div>
      <BottomNav
        active={tab}
        onChange={setTab}
        badges={{ battle: hasClaimableReward(game) || game.pendingOffline !== null }}
      />

      {showOffline && <OfflineRewardModal onClose={() => setOfflineDismissed(true)} />}
      {rewardsOpen && <RewardsModal onClose={() => setRewardsOpen(false)} />}
      {summon && <SummonModal result={summon} onClose={() => setSummon(null)} />}
    </main>
  );
}

function App() {
  const store = getGameStore();
  return (
    <GameStoreContext.Provider value={store}>
      <GameShell />
    </GameStoreContext.Provider>
  );
}

export default App;
