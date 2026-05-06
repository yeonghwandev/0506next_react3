// ─────────────────────────────────────────────
//  TeamQuiz — 미니 퀴즈
//  담당자: 안성진
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";

function TeamQuiz({ teamName, members }) {
  // 현재 몇 번째 문제를 보고 있는지 저장한다
  const [currentIndex, setCurrentIndex] = useState(0);

  // 맞힌 문제 개수를 저장한다
  const [score, setScore] = useState(0);

  // 사용자가 선택한 답의 번호를 저장한다
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // 퀴즈가 끝났는지 저장한다
  const [isFinished, setIsFinished] = useState(false);

  // 퀴즈 질문 3개와 정답 번호를 저장한다
  const QUESTIONS = [
  {
    question: "우리 팀에서 팀장을 자처한 사람은?",
    answerIndex: 0,
  },
  {
    question: "오늘 코를 풀다 코가 헌 사람은?",
    answerIndex: 3,
  },
  {
    question: "오늘 캐리어 끌고 온 사람은?",
    answerIndex: 2,
  },
];

  // 현재 문제 번호에 맞는 문제를 꺼낸다
  const currentQuestion = QUESTIONS[currentIndex];

  // 사용자가 보기 버튼을 눌렀을 때 실행된다
  const handleAnswerClick = (index) => {
    // 이미 답을 선택했다면 다시 선택하지 못하게 막는다
    if (selectedAnswer !== null) return;

    // 사용자가 선택한 보기 번호를 저장한다
    setSelectedAnswer(index);

    // 선택한 보기 번호가 정답 번호와 같으면 점수를 올린다
    if (index === currentQuestion.answerIndex) {
      setScore(score + 1);
    }
  };

  // 답을 선택하면 1.5초 뒤 자동으로 다음 문제로 넘어간다
  useEffect(() => {
    // 아직 답을 선택하지 않았으면 아무것도 하지 않는다
    if (selectedAnswer === null) return;

    // 1.5초 뒤 실행되는 타이머를 만든다
    const timer = setTimeout(() => {
      // 마지막 문제가 아니면 다음 문제로 이동한다
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);

    // 기존 타이머가 남지 않도록 정리한다
    return () => clearTimeout(timer);
  }, [selectedAnswer, currentIndex]);

  // 다시 풀기 버튼을 누르면 처음 상태로 되돌린다
  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsFinished(false);
  };

  // 퀴즈가 끝났을 때 결과 화면을 보여준다
  if (isFinished) {
    return (
      <section className="card">
        <h2>{teamName} 미니 퀴즈 결과</h2>

        <p>
          총 {QUESTIONS.length}문제 중 {score}문제를 맞혔습니다!
        </p>

        <button onClick={restartQuiz}>다시 풀기</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>{teamName} 미니 퀴즈</h2>

      <p>
        문제 {currentIndex + 1} / {QUESTIONS.length}
      </p>

      <h3>{currentQuestion.question}</h3>

      <div className="quiz-options">
        {members.map((member, index) => (
          <button
            key={member}
            onClick={() => handleAnswerClick(index)}
            disabled={selectedAnswer !== null}
          >
            {member}
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <p>
          {selectedAnswer === currentQuestion.answerIndex
            ? "정답입니다!"
            : `오답입니다! 정답은 ${members[currentQuestion.answerIndex]}입니다.`}
        </p>
      )}

      <p>현재 점수: {score}</p>
    </section>
  );
}

export default TeamQuiz;