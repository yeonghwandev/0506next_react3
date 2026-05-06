// ─────────────────────────────────────────────
//  ReactionTest — 반응속도
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";

function ReactionTest({ teamName }) {
  const [status, setStatus] = useState("ready");
  const [startedAt, setStartedAt] = useState(null);
  const [reactionMs, setReactionMs] = useState(null);
  const [bestMs, setBestMs] = useState(null);

  useEffect(() => {
    if (status !== "waiting") return;

    const delay = Math.floor(Math.random() * 4000) + 1000;
    const timerId = setTimeout(() => {
      setStartedAt(Date.now());
      setStatus("go");
    }, delay);

    return () => clearTimeout(timerId);
  }, [status]);

  const handleClick = () => {
    if (status === "ready" || status === "result") {
      setReactionMs(null);
      setStatus("waiting");
      return;
    }

    if (status === "waiting") {
      setStatus("ready");
      return;
    }

    if (status === "go") {
      const ms = Date.now() - startedAt;
      setReactionMs(ms);
      setBestMs((prev) => (prev == null || ms < prev ? ms : prev));
      setStatus("result");
    }
  };

  const bg =
    status === "go" ? "#22c55e" :
    status === "waiting" ? "#ef4444" :
    status === "result" ? "#3b82f6" :
    "#9ca3af";

  const label =
    status === "ready" ? "시작하려면 클릭" :
    status === "waiting" ? "초록색이 되면 클릭! (먼저 누르면 리셋)" :
    status === "go" ? "지금!" :
    `${reactionMs} ms — 다시 하려면 클릭`;

  return (
    <section className="card">
      <h2>{teamName} 반응속도 측정기</h2>
      <p style={{ color: "#666", marginTop: -8, marginBottom: 20 }}>
        최고 기록: {bestMs != null ? `${bestMs} ms` : "—"}
      </p>
      <button
        onClick={handleClick}
        style={{
          width: "100%",
          height: 220,
          border: "none",
          borderRadius: 12,
          background: bg,
          color: "white",
          fontSize: 22,
          fontWeight: 700,
          transition: "background 80ms linear",
        }}
      >
        {label}
      </button>
    </section>
  );
}

export default ReactionTest;
