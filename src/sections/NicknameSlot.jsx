// ─────────────────────────────────────────────
//  NicknameSlot — 별명 슬롯머신
//  담당자: 조영환
// ─────────────────────────────────────────────

// React에서 상태 관리와 사이드이펙트 훅을 가져옴
import { useState, useEffect } from "react";

// 오른쪽 슬롯에 쓸 별명 후보 목록, 컴포넌트 밖에서 상수로 정의해 매 렌더마다 새로 만들어지지 않게 함
const NICKNAMES = ["잠만보", "늙은이", "파닭러버", "엽사장인"];

// teamName은 헤더 표시용, members는 왼쪽 슬롯의 이름 풀로 사용
function NicknameSlot({ teamName, members }) {
  // 왼쪽 슬롯에 현재 보여줄 멤버 이름, 초기값은 첫 번째 멤버
  const [currentMember, setCurrentMember] = useState(members[0]);
  // 오른쪽 슬롯에 현재 보여줄 별명, 초기값은 첫 번째 별명
  const [currentNickname, setCurrentNickname] = useState(NICKNAMES[0]);
  // 슬롯이 돌고 있는지 여부, 버튼 클릭으로 true가 됨
  const [isSpinning, setIsSpinning] = useState(false);
  // 이 값이 바뀔 때마다 슬롯 span이 리마운트되어 CSS 애니메이션이 처음부터 재실행됨
  const [animKey, setAnimKey] = useState(0);

  // isSpinning이 true가 되면 80ms마다 무작위 갱신하고 2.5초 후 자동 정지
  useEffect(() => {
    // isSpinning이 false이면 아무 동작도 하지 않고 종료
    if (!isSpinning) return;

    // 80ms마다 멤버와 별명을 무작위로 교체하는 인터벌 등록
    const interval = setInterval(() => {
      // members 배열 길이 안에서 무작위 인덱스를 골라 멤버 갱신
      setCurrentMember(members[Math.floor(Math.random() * members.length)]);
      // NICKNAMES 배열 길이 안에서 무작위 인덱스를 골라 별명 갱신
      setCurrentNickname(NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]);
      // animKey를 1씩 올려서 span이 리마운트되고 슬라이드 애니메이션이 다시 실행됨
      setAnimKey((k) => k + 1);
    }, 80);

    // 2.5초 후 isSpinning을 false로 바꿔 슬롯을 자동으로 멈춤
    const timer = setTimeout(() => {
      setIsSpinning(false);
    }, 2500);

    // 컴포넌트 언마운트 또는 isSpinning 변경 시 인터벌과 타이머를 정리해 메모리 누수를 막음
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  // isSpinning 또는 members가 바뀔 때 이 effect를 다시 실행
  }, [isSpinning, members]);

  // 돌리기 버튼을 눌렀을 때 스핀을 시작하는 핸들러
  const handleSpin = () => {
    // 이미 돌고 있으면 중복 실행 방지
    if (isSpinning) return;
    // isSpinning을 true로 바꿔 useEffect가 인터벌을 시작하도록 트리거
    setIsSpinning(true);
  };

  return (
    // 카드 레이아웃과 슬롯머신 전용 스타일을 함께 적용
    <section className="card nickname-slot">
      {/* 팀명을 포함한 섹션 제목 */}
      <h2>{teamName} 별명 슬롯머신</h2>

      {/* 두 슬롯과 구분 텍스트를 가로로 배치하는 컨테이너 */}
      <div className="slot-machine">
        {/* 왼쪽 슬롯: members 배열에서 무작위로 뽑은 이름 표시 */}
        <div className="slot-box">
          {/* animKey가 바뀔 때마다 리마운트되어 슬라이드 애니메이션이 재실행됨 */}
          <span
            key={`member-${animKey}`}
            className={isSpinning ? "slot-item spinning" : "slot-item"}
          >
            {currentMember}
          </span>
        </div>

        {/* 두 슬롯 사이의 구분 텍스트 */}
        <div className="slot-divider">의 별명은</div>

        {/* 오른쪽 슬롯: NICKNAMES 배열에서 무작위로 뽑은 별명 표시 */}
        <div className="slot-box">
          {/* animKey가 바뀔 때마다 리마운트되어 슬라이드 애니메이션이 재실행됨 */}
          <span
            key={`nickname-${animKey}`}
            className={isSpinning ? "slot-item spinning" : "slot-item"}
          >
            {currentNickname}
          </span>
        </div>
      </div>

      {/* 스핀 중에는 비활성화, 상태에 따라 버튼 텍스트가 바뀜 */}
      <button
        className={`spin-button ${isSpinning ? "active" : ""}`}
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? "🎰 돌아가는 중..." : "🎰 돌리기!"}
      </button>

      {/* 스핀이 끝났고 한 번이라도 돌렸을 때만 결과 메시지 표시 */}
      {!isSpinning && animKey > 0 && (
        <p className="slot-result">
          ✨ {currentMember} = {currentNickname} ✨
        </p>
      )}
    </section>
  );
}

export default NicknameSlot;
