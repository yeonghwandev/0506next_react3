// ─────────────────────────────────────────────
//  TeamIntro — 팀 소개 (자율)
//  담당자: ____________
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";

function TeamIntro({ teamName, members }) {
  // TODO: 팀원이 채움

  return (
    <section className="card">
      <h2>{teamName}</h2>
      <p>멤버: {members.join(", ")}</p>
    </section>
  );
}

export default TeamIntro;
