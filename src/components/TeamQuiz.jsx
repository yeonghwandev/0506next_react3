// React에서 상태 관리를 위한 useState와 시간성 동작을 위한 useEffect를 가져온다
import { useEffect, useState } from "react";

// TeamQuiz 컴포넌트는 App.jsx에서 teamName과 members를 props로 받아온다
function TeamQuiz({ teamName, members }) {
  // 현재 몇 번째 문제를 보고 있는지 저장한다
  const [currentIndex, setCurrentIndex] = useState(0);

  // 사용자가 맞힌 문제 개수를 저장한다
  const [score, setScore] = useState(0);

  // 사용자가 선택한 답을 저장한다
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // 모든 문제가 끝났는지 여부를 저장한다
  const [isFinished, setIsFinished] = useState(false);

  // 퀴즈 문제 3개를 배열로 관리한다
  const questions = [
    // 첫 번째 문제 객체다
    {
      // 화면에 보여줄 첫 번째 질문이다
      question: "우리 팀에서 ‘거의 다 됐어’라고 말하고 2시간 더 할 것 같은 사람은?",

      // 정답은 members 배열의 0번째 사람으로 설정한다
      answerIndex: 0,
    },

    // 두 번째 문제 객체다
    {
      // 화면에 보여줄 두 번째 질문이다
      question: "우리 팀에서 에러가 나면 console.log를 가장 많이 찍을 것 같은 사람은?",

      // 정답은 members 배열의 1번째 사람으로 설정한다
      answerIndex: 1,
    },

    // 세 번째 문제 객체다
    {
      // 화면에 보여줄 세 번째 질문이다
      question: "우리 팀에서 발표자 랜덤 뽑기 걸리면 갑자기 말 잘할 것 같은 사람은?",

      // 정답은 members 배열의 2번째 사람으로 설정한다
      answerIndex: 2,
    },
  ];

  // 현재 화면에 보여줄 문제를 currentIndex 기준으로 꺼낸다
  const currentQuestion = questions[currentIndex];

  // 사용자가 보기 버튼을 눌렀을 때 실행되는 함수다
  const handleSelectAnswer = (member, index) => {
    // 이미 답을 선택했다면 중복 클릭을 막기 위해 함수를 종료한다
    if (selectedAnswer !== null) return;

    // 사용자가 고른 답이 정답인지 확인한다
    const isCorrect = index === currentQuestion.answerIndex;

    // 사용자가 선택한 답 정보를 state에 저장한다
    setSelectedAnswer({
      // 사용자가 선택한 팀원 이름을 저장한다
      member,

      // 사용자가 선택한 보기 번호를 저장한다
      index,

      // 정답 여부를 저장한다
      isCorrect,
    });

    // 정답이면 점수를 1점 올린다
    if (isCorrect) {
      // 이전 점수에 1을 더해서 새로운 점수로 저장한다
      setScore((prevScore) => prevScore + 1);
    }
  };

  // selectedAnswer가 정해지면 1.5초 뒤 다음 문제로 넘어가게 한다
  useEffect(() => {
    // 아직 답을 선택하지 않았다면 아무 동작도 하지 않는다
    if (selectedAnswer === null) return;

    // 1.5초 뒤 실행할 타이머를 만든다
    const timerId = setTimeout(() => {
      // 현재 문제가 마지막 문제가 아니라면 다음 문제로 넘어간다
      if (currentIndex < questions.length - 1) {
        // 현재 문제 번호를 1 증가시킨다
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // 다음 문제에서 새 답을 고를 수 있도록 선택 답을 초기화한다
        setSelectedAnswer(null);
      } else {
        // 마지막 문제였다면 퀴즈 종료 상태로 바꾼다
        setIsFinished(true);
      }
    }, 1500);

    // 컴포넌트가 사라지거나 값이 바뀔 때 기존 타이머를 정리한다
    return () => clearTimeout(timerId);

    // selectedAnswer나 currentIndex가 바뀔 때 이 useEffect를 다시 실행한다
  }, [selectedAnswer, currentIndex]);

  // 다시 풀기 버튼을 눌렀을 때 실행되는 함수다
  const handleRestart = () => {
    // 첫 번째 문제로 돌아간다
    setCurrentIndex(0);

    // 점수를 0점으로 초기화한다
    setScore(0);

    // 선택한 답을 초기화한다
    setSelectedAnswer(null);

    // 퀴즈 종료 상태를 해제한다
    setIsFinished(false);
  };

  // 모든 문제가 끝났을 때 보여줄 결과 화면이다
  if (isFinished) {
    // 퀴즈 결과 화면을 반환한다
    return (
      // 결과 영역 전체를 감싸는 section이다
      <section className="quiz-section">
        {/* 팀 이름을 포함한 결과 제목을 보여준다 */}
        <h2>{teamName} 미니 퀴즈 결과</h2>

        {/* 총 3문제 중 몇 문제를 맞혔는지 보여준다 */}
        <p>
          총 {questions.length}문제 중 {score}문제를 맞혔습니다!
        </p>

        {/* 퀴즈를 처음부터 다시 시작하는 버튼이다 */}
        <button onClick={handleRestart}>다시 풀기</button>
      </section>
    );
  }

  // 퀴즈가 진행 중일 때 보여줄 화면이다
  return (
    // 퀴즈 영역 전체를 감싸는 section이다
    <section className="quiz-section">
      {/* 팀 이름을 포함한 퀴즈 제목을 보여준다 */}
      <h2>{teamName} 미니 퀴즈</h2>

      {/* 현재 몇 번째 문제인지 보여준다 */}
      <p>
        문제 {currentIndex + 1} / {questions.length}
      </p>

      {/* 현재 문제의 질문을 보여준다 */}
      <h3>{currentQuestion.question}</h3>

      {/* 팀원 이름 4개를 보기 버튼으로 보여주는 영역이다 */}
      <div className="quiz-options">
        {/* members 배열을 순회하면서 팀원 이름 버튼을 만든다 */}
        {members.map((member, index) => (
          // 각 팀원 이름을 하나의 보기 버튼으로 만든다
          <button
            // React가 버튼들을 구분할 수 있도록 고유한 key를 준다
            key={member}

            // 버튼을 누르면 해당 팀원을 답으로 선택한다
            onClick={() => handleSelectAnswer(member, index)}

            // 답을 이미 선택했다면 버튼을 더 누르지 못하게 한다
            disabled={selectedAnswer !== null}

            // 선택한 답과 정답 여부에 따라 CSS 클래스를 다르게 준다
            className={
              selectedAnswer?.index === index
                ? selectedAnswer.isCorrect
                  ? "correct"
                  : "wrong"
                : ""
            }
          >
            {/* 버튼 안에 팀원 이름을 보여준다 */}
            {member}
          </button>
        ))}
      </div>

      {/* 답을 선택했을 때 정답 또는 오답 메시지를 보여준다 */}
      {selectedAnswer && (
        // 선택 결과 메시지를 보여주는 p 태그다
        <p>
          {/* 정답이면 정답 문구를, 오답이면 오답 문구를 보여준다 */}
          {selectedAnswer.isCorrect
            ? "정답입니다!"
            : `오답입니다! 정답은 ${members[currentQuestion.answerIndex]}입니다.`}
        </p>
      )}

      {/* 현재 점수를 보여준다 */}
      <p>현재 점수: {score}</p>
    </section>
  );
}

// TeamQuiz 컴포넌트를 다른 파일에서 import할 수 있도록 내보낸다
export default TeamQuiz;