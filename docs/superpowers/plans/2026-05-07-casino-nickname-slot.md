# Casino NicknameSlot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** NicknameSlot.jsx를 풀 카지노 테마로 리디자인하고 3릴, 잭팟, 히스토리, 레버 버튼 기능을 추가한다.

**Architecture:** NicknameSlot.jsx 단일 파일 수정 + App.css의 nickname-slot 관련 스타일 전체 교체. 3번째 릴(이모지)을 추가해 잭팟 조건을 만들고, 스핀 히스토리를 최근 3개까지 저장한다.

**Tech Stack:** React hooks (useState, useEffect), CSS animations, no external dependencies

---

## 파일 구조

- Modify: `src/sections/NicknameSlot.jsx` — 3릴 로직, 잭팟 감지, 히스토리, 스핀카운터
- Modify: `src/App.css` — .nickname-slot 이하 카지노 스타일 전체 교체

---

### Task 1: NicknameSlot.jsx 로직 업그레이드

**Files:**
- Modify: `src/sections/NicknameSlot.jsx`

- [ ] **Step 1: 상수 및 상태 추가**

`NICKNAMES` 아래에 이모지 릴 상수 추가, 상태 4개 추가(spinCount, history, isJackpot, reelStopOrder):

```jsx
const SYMBOLS = ["🍒", "🍋", "🍇", "💎", "⭐", "🎰", "7️⃣", "🔔"];
const JACKPOT_SYMBOLS = ["💎", "7️⃣"];
```

기존 `useState` 블록을 아래로 교체:
```jsx
const [currentMember, setCurrentMember] = useState(members[0].name);
const [currentNickname, setCurrentNickname] = useState(NICKNAMES[0]);
const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS[0]);
const [isSpinning, setIsSpinning] = useState(false);
const [animKey, setAnimKey] = useState(0);
const [spinCount, setSpinCount] = useState(0);
const [history, setHistory] = useState([]);
const [isJackpot, setIsJackpot] = useState(false);
```

- [ ] **Step 2: useEffect 업데이트 (3릴 + 잭팟 감지)**

기존 useEffect 전체를 교체:

```jsx
useEffect(() => {
  if (!isSpinning) return;
  setIsJackpot(false);

  const interval = setInterval(() => {
    setCurrentMember(members[Math.floor(Math.random() * members.length)].name);
    setCurrentNickname(NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]);
    setCurrentSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    setAnimKey((k) => k + 1);
  }, 80);

  const timer = setTimeout(() => {
    setIsSpinning(false);
    setSpinCount((c) => c + 1);

    // 최종 값으로 잭팟 판정 및 히스토리 저장은 spinning 종료 후 별도 처리
  }, 2500);

  return () => {
    clearInterval(interval);
    clearTimeout(timer);
  };
}, [isSpinning, members]);
```

- [ ] **Step 3: 잭팟 감지 useEffect 추가**

스핀 종료 후 최종 symbol로 잭팟 판정:

```jsx
useEffect(() => {
  if (isSpinning || animKey === 0) return;
  const jackpot = JACKPOT_SYMBOLS.includes(currentSymbol);
  setIsJackpot(jackpot);
  setHistory((prev) =>
    [{ member: currentMember, symbol: currentSymbol, nickname: currentNickname, jackpot }, ...prev].slice(0, 3)
  );
}, [isSpinning]);
```

- [ ] **Step 4: handleSpin 유지 (변경 없음)**

기존 handleSpin 그대로 유지.

- [ ] **Step 5: JSX 전체 교체**

```jsx
return (
  <section className={`card nickname-slot ${isJackpot ? "jackpot-mode" : ""}`}>
    <div className="casino-header">
      <span className="casino-crown">♛</span>
      <h2>{teamName} 별명 슬롯머신</h2>
      <span className="casino-crown">♛</span>
    </div>

    <div className="casino-lights">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="casino-light" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>

    <div className="slot-machine">
      <div className="slot-reel">
        <div className="slot-label">이름</div>
        <div className="slot-box">
          <span key={`member-${animKey}`} className={isSpinning ? "slot-item spinning" : "slot-item"}>
            {currentMember}
          </span>
        </div>
      </div>

      <div className="slot-reel">
        <div className="slot-label">심볼</div>
        <div className="slot-box slot-box--symbol">
          <span key={`symbol-${animKey}`} className={isSpinning ? "slot-item spinning" : "slot-item"}>
            {currentSymbol}
          </span>
        </div>
      </div>

      <div className="slot-reel">
        <div className="slot-label">별명</div>
        <div className="slot-box">
          <span key={`nickname-${animKey}`} className={isSpinning ? "slot-item spinning" : "slot-item"}>
            {currentNickname}
          </span>
        </div>
      </div>
    </div>

    {spinCount > 0 && (
      <div className="spin-counter">🎰 {spinCount}번째 도전</div>
    )}

    <button
      className={`lever-button ${isSpinning ? "pulling" : ""}`}
      onClick={handleSpin}
      disabled={isSpinning}
    >
      <span className="lever-ball" />
      <span className="lever-text">{isSpinning ? "돌아가는 중..." : "SPIN!"}</span>
    </button>

    {!isSpinning && animKey > 0 && (
      <div className={`slot-result ${isJackpot ? "jackpot-result" : ""}`}>
        {isJackpot ? (
          <>
            <div className="jackpot-banner">🎊 JACKPOT!! 🎊</div>
            <p>✨ {currentMember} = {currentNickname} ✨</p>
          </>
        ) : (
          <p>✨ {currentMember} = {currentNickname} ✨</p>
        )}
      </div>
    )}

    {history.length > 0 && (
      <div className="slot-history">
        <div className="history-title">📋 최근 기록</div>
        {history.map((h, i) => (
          <div key={i} className={`history-item ${h.jackpot ? "history-jackpot" : ""}`}>
            {h.jackpot && "🏆 "}{h.member} {h.symbol} {h.nickname}
          </div>
        ))}
      </div>
    )}
  </section>
);
```

---

### Task 2: App.css 카지노 스타일 교체

**Files:**
- Modify: `src/App.css` (`.nickname-slot` 이하 섹션만 교체)

- [ ] **Step 1: 기존 nickname-slot 관련 CSS 전체 제거 후 아래로 교체**

`/* ── 별명 슬롯머신 ── */` 블록 전체(끝 `@keyframes fadeIn`까지)를 아래 CSS로 교체:

```css
/* ── 별명 슬롯머신 (카지노 테마) ── */
.nickname-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background: linear-gradient(160deg, #1a0533 0%, #2d0a4e 50%, #1a0533 100%);
  border: 2px solid #c9a84c;
  box-shadow:
    0 0 40px rgba(201, 168, 76, 0.25),
    inset 0 0 60px rgba(0, 0, 0, 0.4);
  color: #f0d080;
}

.nickname-slot.jackpot-mode {
  animation: jackpotFlash 0.4s ease infinite alternate;
}

@keyframes jackpotFlash {
  from { border-color: #c9a84c; box-shadow: 0 0 40px rgba(201, 168, 76, 0.3); }
  to   { border-color: #ff4444; box-shadow: 0 0 80px rgba(255, 68, 68, 0.7), 0 0 120px rgba(255, 200, 0, 0.4); }
}

.casino-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.casino-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #f0d080;
  text-shadow: 0 0 20px rgba(240, 208, 128, 0.6);
  letter-spacing: 1px;
}

.casino-crown {
  font-size: 20px;
  color: #c9a84c;
  text-shadow: 0 0 10px rgba(201, 168, 76, 0.8);
}

/* 장식용 전구 라인 */
.casino-lights {
  display: flex;
  gap: 16px;
}

.casino-light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffe066;
  box-shadow: 0 0 8px #ffe066, 0 0 16px #ffaa00;
  animation: bulbBlink 1s ease-in-out infinite alternate;
}

@keyframes bulbBlink {
  from { opacity: 1; box-shadow: 0 0 8px #ffe066, 0 0 16px #ffaa00; }
  to   { opacity: 0.3; box-shadow: none; }
}

/* 슬롯머신 3릴 */
.slot-machine {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.slot-reel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.slot-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #c9a84c;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.slot-box {
  width: 140px;
  height: 90px;
  background: linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%);
  border: 2px solid #c9a84c;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow:
    0 0 20px rgba(201, 168, 76, 0.3),
    inset 0 2px 8px rgba(0, 0, 0, 0.8),
    inset 0 -1px 4px rgba(201, 168, 76, 0.1);
  position: relative;
}

.slot-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 30%;
  background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
  border-radius: 8px 8px 0 0;
  pointer-events: none;
}

.slot-box--symbol {
  width: 100px;
  background: linear-gradient(180deg, #120a00 0%, #1f1200 100%);
  border-color: #ff9900;
  box-shadow:
    0 0 20px rgba(255, 153, 0, 0.4),
    inset 0 2px 8px rgba(0, 0, 0, 0.8);
}

.slot-item {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffe066;
  display: block;
  text-shadow: 0 0 12px rgba(255, 224, 102, 0.6);
}

.slot-box--symbol .slot-item {
  font-size: 2rem;
}

.slot-item.spinning {
  animation: reelSpin 0.08s ease-out;
}

@keyframes reelSpin {
  from { transform: translateY(-80%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* 스핀 카운터 */
.spin-counter {
  font-size: 0.85rem;
  color: rgba(240, 208, 128, 0.6);
  letter-spacing: 1px;
}

/* 레버 버튼 */
.lever-button {
  appearance: none;
  border: 2px solid #c9a84c;
  background: linear-gradient(135deg, #7b4f00 0%, #c9a84c 40%, #7b4f00 100%);
  color: #1a0533;
  font-size: 1.1rem;
  font-weight: 900;
  padding: 14px 48px;
  border-radius: 999px;
  letter-spacing: 3px;
  transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s;
  box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4), 0 2px 0 #7b4f00;
  position: relative;
}

.lever-button::before {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 50%);
  pointer-events: none;
}

.lever-button:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 12px 32px rgba(201, 168, 76, 0.6), 0 2px 0 #7b4f00;
}

.lever-button:active:not(:disabled),
.lever-button.pulling {
  transform: translateY(2px) scale(0.97);
  box-shadow: 0 2px 8px rgba(201, 168, 76, 0.3), 0 1px 0 #7b4f00;
  transition-duration: 0.06s;
}

.lever-button:disabled {
  background: linear-gradient(135deg, #3a3a3a 0%, #555 100%);
  border-color: #555;
  color: #888;
  box-shadow: none;
  cursor: not-allowed;
}

.lever-ball {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff 0%, #c9a84c 60%);
  margin-right: 8px;
  vertical-align: middle;
}

.lever-text {
  vertical-align: middle;
}

/* 결과 */
.slot-result {
  text-align: center;
  animation: resultFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slot-result p {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffe066;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 224, 102, 0.6);
}

@keyframes resultFadeIn {
  from { opacity: 0; transform: scale(0.8) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.jackpot-result p {
  color: #ff6b6b;
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
}

.jackpot-banner {
  font-size: 1.6rem;
  font-weight: 900;
  color: #ffe066;
  text-shadow: 0 0 30px rgba(255, 224, 102, 1);
  animation: jackpotPulse 0.5s ease infinite alternate;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

@keyframes jackpotPulse {
  from { transform: scale(1);    text-shadow: 0 0 20px rgba(255,224,102,0.8); }
  to   { transform: scale(1.08); text-shadow: 0 0 40px rgba(255,224,102,1), 0 0 60px rgba(255,150,0,0.6); }
}

/* 히스토리 */
.slot-history {
  width: 100%;
  max-width: 340px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
}

.history-title {
  font-size: 0.75rem;
  color: #c9a84c;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.history-item {
  font-size: 0.9rem;
  color: rgba(240, 208, 128, 0.7);
  padding: 4px 0;
  border-bottom: 1px solid rgba(201, 168, 76, 0.1);
}

.history-item:last-child {
  border-bottom: none;
}

.history-jackpot {
  color: #ffe066;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(255, 224, 102, 0.4);
}
```
