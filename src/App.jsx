import { useState } from "react";
import "./App.css";
import TeamIntro from "./sections/TeamIntro";
import TeamQuiz from "./sections/TeamQuiz";
import ReactionTest from "./sections/ReactionTest";
import NicknameSlot from "./sections/NicknameSlot";

// ─────────────────────────────────────────────
//  ✏️  팀에서 이 부분만 직접 채워주세요
// ─────────────────────────────────────────────
const TEAM_NAME = "01.75";
const MEMBERS = [
  { name: "조영환", birthYear: "01년생" },
  { name: "송현섭", birthYear: "02년생" },
  { name: "안유진", birthYear: "02년생" },
  { name: "김예은", birthYear: "02년생" }
];
// ─────────────────────────────────────────────

const TABS = [
  { key: "intro", label: "팀 소개", Component: TeamIntro },
  { key: "quiz", label: "미니 퀴즈", Component: TeamQuiz },
  { key: "reaction", label: "반응속도", Component: ReactionTest },
  { key: "nickname", label: "별명 슬롯머신", Component: NicknameSlot },
];

function App() {
  const [activeTab, setActiveTab] = useState("intro");
  const Active = TABS.find((t) => t.key === activeTab)?.Component;

  return (
    <div className="app">
      <header className="header">
        <h1 className="teamName">{TEAM_NAME}</h1>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="main">
        {Active && <Active teamName={TEAM_NAME} members={MEMBERS} />}
      </main>
    </div>
  );
}

export default App;
