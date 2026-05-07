// ─────────────────────────────────────────────
//  NicknameSlot — 카지노 별명 슬롯머신
//  담당자: 조영환
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";

const NICKNAMES = ["잠만보", "늙은이", "파닭러버", "엽사장인"];
const SYMBOLS = ["🍒", "🍋", "🍇", "💎", "⭐", "🎰", "7️⃣", "🔔"];
const JACKPOT_SYMBOLS = ["💎", "7️⃣"];

function NicknameSlot({ teamName, members }) {
  const [currentMember, setCurrentMember] = useState(members[0].name);
  const [currentNickname, setCurrentNickname] = useState(NICKNAMES[0]);
  const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [isJackpot, setIsJackpot] = useState(false);

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
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isSpinning, members]);

  // 스핀 종료 후 최종 심볼로 잭팟 판정 및 히스토리 저장
  useEffect(() => {
    if (isSpinning || animKey === 0) return;
    const jackpot = JACKPOT_SYMBOLS.includes(currentSymbol);
    setIsJackpot(jackpot);
    setHistory((prev) =>
      [
        { member: currentMember, symbol: currentSymbol, nickname: currentNickname, jackpot },
        ...prev,
      ].slice(0, 3)
    );
  }, [isSpinning]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
  };

  return (
    <section className={`card nickname-slot${isJackpot ? " jackpot-mode" : ""}`}>
      <div className="casino-header">
        <span className="casino-crown">♛</span>
        <h2>{teamName} 별명 슬롯머신</h2>
        <span className="casino-crown">♛</span>
      </div>

      <div className="casino-lights">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="casino-light"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <div className="slot-machine">
        <div className="slot-reel">
          <div className="slot-label">이름</div>
          <div className="slot-box">
            <span
              key={`member-${animKey}`}
              className={isSpinning ? "slot-item spinning" : "slot-item"}
            >
              {currentMember}
            </span>
          </div>
        </div>

        <div className="slot-reel">
          <div className="slot-label">심볼</div>
          <div className="slot-box slot-box--symbol">
            <span
              key={`symbol-${animKey}`}
              className={isSpinning ? "slot-item spinning" : "slot-item"}
            >
              {currentSymbol}
            </span>
          </div>
        </div>

        <div className="slot-reel">
          <div className="slot-label">별명</div>
          <div className="slot-box">
            <span
              key={`nickname-${animKey}`}
              className={isSpinning ? "slot-item spinning" : "slot-item"}
            >
              {currentNickname}
            </span>
          </div>
        </div>
      </div>

      {spinCount > 0 && (
        <div className="spin-counter">🎰 {spinCount}번째 도전</div>
      )}

      <button
        className={`lever-button${isSpinning ? " pulling" : ""}`}
        onClick={handleSpin}
        disabled={isSpinning}
      >
        <span className="lever-ball" />
        <span className="lever-text">{isSpinning ? "돌아가는 중..." : "SPIN!"}</span>
      </button>

      {!isSpinning && animKey > 0 && (
        <div className={`slot-result${isJackpot ? " jackpot-result" : ""}`}>
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
            <div key={i} className={`history-item${h.jackpot ? " history-jackpot" : ""}`}>
              {h.jackpot && "🏆 "}{h.member} {h.symbol} {h.nickname}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NicknameSlot;
