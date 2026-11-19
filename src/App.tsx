import "./App.css";
import BattleBackground from "./BattleBackground";
import CharacterSprite from "./characters/CharacterSprite";
import { HEROES, MONSTERS } from "./characters/characterData";
import GameIcon from "./GameIcons";
import type { GameIconName } from "./GameIcons";

/* ---------- 타입 & 임시 데이터 (UI 전용, 게임 로직 없음) ---------- */

type UpgradeInfo = {
  id: "attack" | "health";
  icon: GameIconName;
  title: string;
  description: string;
  level: number;
  cost: number;
};

type NavItem = {
  id: string;
  icon: GameIconName;
  label: string;
  active: boolean;
};

const STAGE_LABEL = "1-1";
const GOLD = 1000;
const KILL_REWARD = { gold: 15, exp: 8 };

/** 현재 전투 화면에 등장하는 캐릭터 (히잉토끼 vs 슬라임) */
const BATTLE_HERO = HEROES["heeing-rabbit"];
const BATTLE_MONSTER = MONSTERS["green-slime"];
const MONSTER_STATE = { level: 1, hp: 72, maxHp: 100 };

const UPGRADES: UpgradeInfo[] = [
  { id: "attack", icon: "sword", title: "공격력 강화", description: "공격력 +2", level: 1, cost: 50 },
  { id: "health", icon: "heart", title: "체력 강화", description: "최대 체력 +10", level: 1, cost: 40 },
];

const NAV_ITEMS: NavItem[] = [
  { id: "battle", icon: "battle", label: "전투", active: true },
  { id: "heroes", icon: "hero", label: "용사", active: false },
  { id: "growth", icon: "growth", label: "성장", active: false },
  { id: "shop", icon: "shop", label: "상점", active: false },
  { id: "codex", icon: "book", label: "도감", active: false },
];

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

/* ---------- 상단 HUD (배경 위에 떠 있음) ---------- */

function GameHud() {
  return (
    <header className="hud">
      <div className="game-logo">
        <span className="game-logo__sub">귀염뽀짝 방치형 RPG</span>
        <h1 className="game-logo__title">어쩌다 용사단</h1>
      </div>

      <div className="gold-counter" aria-label={`보유 골드 ${formatNumber(GOLD)} 골드`}>
        <GameIcon name="coin" className="gold-counter__coin" />
        <span className="gold-counter__value">{formatNumber(GOLD)} G</span>
      </div>
    </header>
  );
}

/* ---------- 월드 안의 작은 UI : 스테이지 + 자동 전투 ---------- */

function StageStatus() {
  return (
    <div className="stage-status">
      <div className="stage-ribbon">
        <span className="stage-ribbon__label">현재 스테이지</span>
        <strong className="stage-ribbon__value">STAGE {STAGE_LABEL}</strong>
      </div>

      <div className="auto-chip" role="status">
        <span className="auto-chip__dot" aria-hidden="true" />
        자동 전투 중
      </div>
    </div>
  );
}

/* ---------- 몬스터 머리 위 명찰 : 체력 + 처치 보상 ---------- */

function MonsterNameplate() {
  const { level, hp, maxHp } = MONSTER_STATE;
  const hpPercent = Math.round((hp / maxHp) * 100);

  return (
    <div className="nameplate">
      <div className="nameplate__head">
        <span className="nameplate__name">
          <em className="nameplate__level">Lv.{level}</em> {BATTLE_MONSTER.name}
        </span>
      </div>

      <div
        className="nameplate__bar"
        role="progressbar"
        aria-label="몬스터 체력"
        aria-valuemin={0}
        aria-valuemax={maxHp}
        aria-valuenow={hp}
      >
        <div className="nameplate__fill" style={{ width: `${hpPercent}%` }} />
        <span className="nameplate__hp-text">
          {hp} / {maxHp}
        </span>
      </div>

      <div className="nameplate__reward">
        <span className="nameplate__reward-label">처치 보상</span>
        <span className="reward-chip">
          <GameIcon name="coin" className="reward-chip__icon" />+{KILL_REWARD.gold} G
        </span>
        <span className="reward-chip">
          <GameIcon name="star" className="reward-chip__icon" />
          EXP +{KILL_REWARD.exp}
        </span>
      </div>
    </div>
  );
}

/* ---------- 전투 장면 : 히잉토끼 vs 슬라임 ---------- */

function BattleArena() {
  return (
    <section className="arena" aria-label="전투 장면">
      {/* 용사 */}
      <div className="fighter fighter--hero">
        <div className="fighter__shadow" aria-hidden="true" />
        <div className="fighter__lunge">
          <CharacterSprite character={BATTLE_HERO} />
        </div>
        <span className="fighter__name">{BATTLE_HERO.name}</span>
      </div>

      {/* 몬스터 */}
      <div className="fighter fighter--monster">
        <MonsterNameplate />
        <div className="fighter__shadow" aria-hidden="true" />
        <div className="fighter__recoil">
          <CharacterSprite character={BATTLE_MONSTER} />
        </div>

        {/* 타격 이펙트 & 데미지 */}
        <div className="impact" aria-hidden="true">
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
          <span className="damage damage--normal">-12</span>
          <span className="damage damage--critical">치명타! 28</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- 하단에 겹쳐 떠 있는 성장 패널 ---------- */

function GrowthTray() {
  return (
    <section className="growth-tray" aria-label="용사 성장">
      <h2 className="growth-tray__tab">
        <GameIcon name="growth" className="growth-tray__tab-icon" />
        용사 성장
      </h2>

      <div className="growth-tray__list">
        {UPGRADES.map((upgrade) => (
          <button
            key={upgrade.id}
            type="button"
            className={`growth-button growth-button--${upgrade.id}`}
            aria-label={`${upgrade.title}, ${upgrade.description}, 비용 ${upgrade.cost} 골드`}
          >
            <span className="growth-button__icon">
              <GameIcon name={upgrade.icon} />
            </span>
            <span className="growth-button__text">
              <span className="growth-button__title">{upgrade.title}</span>
              <span className="growth-button__desc">{upgrade.description}</span>
            </span>
            <em className="growth-button__level">Lv.{upgrade.level}</em>
            <span className="growth-button__cost">
              <GameIcon name="coin" className="growth-button__coin" />
              {formatNumber(upgrade.cost)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- 하단 내비게이션 ---------- */

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bottom-nav__item${item.active ? " bottom-nav__item--active" : ""}`}
          aria-current={item.active ? "page" : undefined}
        >
          <span className="bottom-nav__icon">
            <GameIcon name={item.icon} />
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ---------- 메인 : 하나의 게임 월드 + 하단 내비게이션 ---------- */

function App() {
  return (
    <main className="game">
      <div className="world">
        <BattleBackground />
        <GameHud />
        <StageStatus />
        <BattleArena />
        <GrowthTray />
      </div>
      <BottomNav />
    </main>
  );
}

export default App;
