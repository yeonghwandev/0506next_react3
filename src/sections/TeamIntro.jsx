// ─────────────────────────────────────────────
//  TeamIntro — 팀 소개 화면 (디자인 자유)
//  담당자: 사용자
// ─────────────────────────────────────────────

// React에서 useState와 useEffect를 가져옵니다. 상태 관리와 사이드 이펙트를 위해 사용합니다.
import { useState, useEffect } from "react";

// TeamIntro 컴포넌트를 정의합니다. props로 teamName과 members를 받습니다.
function TeamIntro({ teamName, members }) {
  // 슬로건 배열을 정의합니다. 3초마다 자동으로 변경됩니다.
  const slogans = [
    "우리의 팀은 최고야!",
    "함께 성장하는 팀!",
    "창의적인 아이디어가 넘치는 팀!",
    "협력과 열정이 가득한 팀!"
  ];

  // useState: 슬로건 인덱스를 관리합니다. 초기값은 0입니다.
  const [sloganIndex, setSloganIndex] = useState(0);

  // useState: 각 멤버의 카드 플립 상태를 관리합니다. 객체로 각 멤버의 이름을 키로 사용합니다.
  const [flipped, setFlipped] = useState({
    조영환: false,
    송현섭: false,
    안유진: false,
    김예은: false
  });

  // useEffect: 컴포넌트가 마운트될 때 3초마다 슬로건을 변경하는 타이머를 설정합니다.
  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 3000); // 3초마다 변경

    // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
    return () => clearInterval(interval);
  }, [slogans.length]);

  // 카드 클릭 핸들러: 클릭된 멤버의 플립 상태를 토글합니다.
  const handleFlip = (memberName) => {
    setFlipped((prev) => ({
      ...prev,
      [memberName]: !prev[memberName]
    }));
  };

  // 사진 확장자를 결정하는 함수: 안유진은 png, 나머지는 jpg
  const getImageExt = (name) => (name === "안유진" ? "png" : "jpg");

  // JSX를 반환합니다. 팀 이름, 슬로건, 멤버 리스트를 표시합니다.
  return (
    <section className="team-intro" style={{ textAlign: 'center', padding: '20px' }}>
      {/* 팀 이름을 표시합니다. */}
      <h1>{teamName}</h1>

      {/* 현재 슬로건을 표시합니다. */}
      <p className="slogan" style={{ fontSize: '1.5em', color: '#007bff' }}>
        {slogans[sloganIndex]}
      </p>

      {/* 멤버 리스트를 표시합니다. */}
      <h2>팀 멤버</h2>
      <div className="members" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* 각 멤버에 대해 카드를 렌더링합니다. */}
        {members.map((member) => (
          <div
            key={member.name}
            className="member-card"
            style={{
              width: '150px',
              height: '200px',
              perspective: '1000px',
              cursor: 'pointer'
            }}
            onClick={() => handleFlip(member.name)} // 클릭 시 플립
          >
            <div
              className="card-inner"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: flipped[member.name] ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* 앞면: 멤버 이름과 사진 */}
              <div
                className="card-front"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img
                  src={`/assets/${member.name}_front.${getImageExt(member.name)}`} // 앞면 사진 경로
                  alt={`${member.name} 앞면`}
                  style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                />
                <p>{member.name}</p>
                <p>{member.birthYear}</p>
              </div>

              {/* 뒷면: 다른 사진 */}
              <div
                className="card-back"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: 'rotateY(180deg)'
                }}
              >
                <img
                  src={`/assets/${member.name}_back.jpg`} // 뒷면 사진 경로
                  alt={`${member.name} 뒷면`}
                  style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                />
                <p>뒷면</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 컴포넌트를 내보냅니다.
export default TeamIntro;
