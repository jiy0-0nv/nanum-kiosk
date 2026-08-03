const { useState, useMemo, useEffect } = React;

const INITIAL_TEAMS = [
  { id: 'B', name: 'B팀', bgClass: 'bg-blue-500', textClass: 'text-blue-500' },
  { id: 'C', name: 'C팀', bgClass: 'bg-green-500', textClass: 'text-green-500' },
  { id: 'D', name: 'D팀', bgClass: 'bg-red-500', textClass: 'text-red-500' },
  { id: 'E', name: 'E팀', bgClass: 'bg-yellow-500', textClass: 'text-yellow-500' },
  { id: 'J', name: 'J팀', bgClass: 'bg-purple-500', textClass: 'text-purple-500' },
  { id: 'K', name: 'K팀', bgClass: 'bg-pink-500', textClass: 'text-pink-500' },
  { id: 'L', name: 'L팀', bgClass: 'bg-teal-500', textClass: 'text-teal-500' },
];

function App() {
  const [activeTab, setActiveTab] = useState('team'); 
  const [players, setPlayers] = useState([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', teamId: 'B', score: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPlayers();
  }, []);

  // Supabase에서 데이터 불러오기
  const fetchPlayers = async () => {
    const { data, error } = await supabaseClient
      .from('players')
      .select('*')
      .order('score', { ascending: false });
    
    if (error) {
      console.error('데이터 조회 오류:', error);
    } else {
      setPlayers(data || []);
    }
  };

  // --- 데이터 정제 (순위 계산) ---
  const individualRanking = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const teamRanking = useMemo(() => {
    const teamScores = INITIAL_TEAMS.map(team => {
      const totalScore = players
        .filter(p => p.team_id === team.id)
        .reduce((sum, p) => sum + p.score, 0);
      return { ...team, totalScore };
    });
    return teamScores.sort((a, b) => b.totalScore - a.totalScore);
  }, [players]);

  const maxTeamScore = useMemo(() => {
    const max = Math.max(...teamRanking.map(t => t.totalScore));
    return max > 0 ? max : 100;
  }, [teamRanking]);

  // 총 모금액 계산
  const totalRaisedAmount = useMemo(() => {
    return players.reduce((sum, player) => sum + player.score, 0);
  }, [players]);

  // --- 관리자 기능: Supabase에 점수 등록 ---
  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.score) return;

    const { error } = await supabaseClient
      .from('players')
      .insert([{ 
        name: adminForm.name, 
        team_id: adminForm.teamId, 
        score: Number(adminForm.score) 
      }]);

    if (error) {
      alert('등록 실패: ' + error.message);
    } else {
      setAdminForm({ name: '', teamId: 'B', score: '' });
      setIsAdminOpen(false);
      fetchPlayers(); // 목록 실시간 새로고침
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-xl flex flex-col relative min-h-screen overflow-hidden">
      
      {/* 1. 헤더 */}
      <header className="bg-white pt-6 pb-4 px-4 flex flex-col items-center border-b-8 border-[#1428A0]">
        <div className="w-full rounded-full border-4 border-[#1428A0] py-3 px-4 flex justify-between items-center relative overflow-hidden bg-white shadow-md">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1428A0] flex items-center justify-center rounded-l-full">
            <span className="text-white text-xs">◀</span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#1428A0] flex items-center justify-center rounded-r-full">
            <span className="text-white text-xs">▶</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center z-10 px-6">
            <span className="text-xs text-gray-500 font-bold mb-1 tracking-wider">SAMSUNG KIOSK</span>
            <h1 className="text-xl font-extrabold text-[#1428A0] flex items-center gap-1">
              삼성 나눔역 💖
            </h1>
          </div>
        </div>
        <div className="flex justify-between w-full px-6 mt-2 text-xs font-bold text-gray-400">
          <span>← 나눔의 시작</span>
          <span>아이들의 미래 →</span>
        </div>
      </header>

      {/* 2. 내비게이션 바 */}
      <nav className="flex bg-gray-50 border-b border-gray-200 p-2 gap-2">
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm flex flex-col items-center transition-colors ${
            activeTab === 'team' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span>👥</span>
          팀 랭킹
        </button>
        <button
          onClick={() => setActiveTab('individual')}
          className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm flex flex-col items-center transition-colors ${
            activeTab === 'individual' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span>🏆</span>
          개인 랭킹
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm flex flex-col items-center transition-colors ${
            activeTab === 'info' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span>ℹ️</span>
          부스 안내
        </button>
      </nav>

      {/* 3. 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        
        {/* 전광판 헤더 마키 텍스트 (다크 테마 유지) */}
        {(activeTab === 'individual' || activeTab === 'team') && (
          <div className="overflow-hidden mb-5 bg-gray-900 py-2 rounded-lg border-2 border-gray-800 shadow-md">
            <p className="text-amber-400 font-mono text-xs font-bold animate-marquee led-text">
              [안내] 현재 나눔 랭킹이 실시간으로 업데이트 중입니다. 일상 속 나눔에 동참해 주셔서 감사합니다.
            </p>
          </div>
        )}

        {/* 팀 랭킹 (라이트 테마 적용) */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden space-y-6 font-mono pb-8">
            
            {/* 총 모금액 표시 */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex flex-col items-center justify-center mb-4">
              <span className="text-[#1428A0] text-sm font-bold mb-1">현재까지 모인 따뜻한 마음</span>
              <div className="text-3xl font-extrabold flex items-center gap-2 text-gray-800">
                <span className="text-pink-500 animate-pulse">💖</span>
                <span>{totalRaisedAmount.toLocaleString()}</span>
                <span className="text-lg font-normal text-gray-500">만원</span>
              </div>
            </div>

            {/* 팀별 레이싱 트랙 */}
            <div className="space-y-8 mt-6">
              {teamRanking.map((team, index) => {
                const progress = mounted ? Math.max(5, (team.totalScore / maxTeamScore) * 85) : 0;
                
                return (
                  <div key={team.id} className="relative w-full">
                    <div className="flex justify-between items-end mb-3 border-b border-gray-100 pb-2">
                      <span className="font-bold flex items-center gap-2 text-sm text-gray-800">
                        <span className="text-xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="w-6 text-center text-gray-400 inline-block">{index + 1}</span>}
                        </span>
                        <span className={index === 0 ? 'text-[#1428A0] text-lg' : ''}>{team.name}</span>
                      </span>
                      <span className={`font-bold tracking-wider ${index === 0 ? 'text-[#1428A0] text-lg' : 'text-gray-700'}`}>
                        {team.totalScore.toLocaleString()}<span className="text-xs ml-1 text-gray-500">만원</span>
                      </span>
                    </div>

                    <div className="relative h-4 w-full bg-gray-200 rounded-full flex items-center mt-4">
                      <div className="absolute right-0 -top-6 text-gray-400 text-xs">🏁</div>
                      
                      <div className="absolute w-full flex justify-between px-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                        ))}
                      </div>

                      <div
                        className={`h-full ${team.bgClass} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${progress}%` }}
                      ></div>

                      <div
                        className="absolute -top-3 transition-all duration-1000 ease-out animate-train flex flex-col items-center"
                        style={{ left: `calc(${progress}% - 14px)` }}
                      >
                        <div className={`p-1 bg-white rounded-full shadow-md border-2 border-gray-100 ${team.textClass} text-xs font-bold`}>
                          🚇
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 개인 랭킹 (라이트 테마 적용) */}
        {activeTab === 'individual' && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm relative overflow-hidden font-mono">
            <div className="space-y-3">
              {individualRanking.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">등록된 기록이 없습니다.</p>
              ) : (
                individualRanking.map((player, index) => (
                  <div key={player.id} className={`flex items-center p-3 rounded-lg border border-gray-100 ${index < 3 ? 'bg-blue-50/50' : 'bg-gray-50'}`}>
                    <div className="w-8 flex justify-center items-center">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      {index > 2 && <span className="text-gray-400 font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1 ml-3">
                      <div className={`font-bold ${index < 3 ? 'text-[#1428A0] text-lg' : 'text-gray-800'}`}>
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {INITIAL_TEAMS.find(t => t.id === player.team_id)?.name}
                      </div>
                    </div>
                    <div className={`font-bold tracking-wider ${index < 3 ? 'text-[#1428A0] text-xl' : 'text-gray-700'}`}>
                      {player.score.toLocaleString()}<span className="text-xs ml-1 text-gray-500">만원</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 부스 안내 */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1428A0]"></div>
              <h3 className="font-extrabold text-[#1428A0] mb-2 flex items-center gap-2">
                <span>💖</span> 삼성 나눔 키오스크란?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                2015년 삼성전자 구미사업장 임직원들의 아이디어로 시작된 <strong>'일상 속 기부 플랫폼'</strong>입니다. 
                사내에 설치된 키오스크에 사원증을 태깅하면 1,000원씩 간편하게 기부할 수 있습니다.
              </p>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">10년간 누적 기부액</div>
                  <div className="font-bold text-[#1428A0]">약 112억 원</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">지원 아동 수</div>
                  <div className="font-bold text-[#1428A0]">3,770여 명</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                여러분의 작은 태그 하나가 모여 희귀·난치병 아동들의 꿈과 내일을 지켜주고 있습니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
              <h3 className="font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <span>🚇</span> 나눔 투어 노선도
              </h3>
              
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-500 before:via-green-500 before:to-pink-500">
                <div className="relative flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-500 absolute -left-10 shadow text-white text-xs font-bold">1</div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full">
                    <h4 className="font-bold text-gray-900 mb-1">참여역</h4>
                    <p className="text-sm text-gray-600">부스에 방문하여 미니게임 안내를 받습니다.</p>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-green-500 absolute -left-10 shadow text-white text-xs font-bold">2</div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full">
                    <h4 className="font-bold text-gray-900 mb-1">미니게임역</h4>
                    <p className="text-sm text-gray-600">팀을 위해 미니게임을 즐기고 랭킹 금액을 획득합니다.</p>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-pink-500 absolute -left-10 shadow text-white text-xs font-bold">3</div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full">
                    <h4 className="font-bold text-gray-900 mb-1">나눔역 (종점)</h4>
                    <p className="text-sm text-gray-600">획득한 금액을 랭킹에 등록하고 일상 속 기부의 기쁨을 나눕니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. 푸터 */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center relative">
        <p className="text-xs text-gray-500 font-medium">여러분의 작은 참여가 아이들에게 큰 희망이 됩니다.</p>
        <p className="text-[10px] text-gray-400 mt-1">© SAMSUNG NANUM KIOSK</p>
        
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="absolute bottom-2 right-2 p-2 opacity-10 hover:opacity-100 transition-opacity text-xs"
        >
          ⚙️
        </button>
      </footer>

      {/* 관리자 모달 */}
      {isAdminOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">🛠 스태프 전용 점수 등록</h2>
              <button onClick={() => setIsAdminOpen(false)} className="text-gray-500 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleAddScore} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">소속 팀</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  value={adminForm.teamId}
                  onChange={(e) => setAdminForm({...adminForm, teamId: e.target.value})}
                >
                  {INITIAL_TEAMS.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">참가자 이름</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  placeholder="예: 홍길동"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">획득 금액 (만원)</label>
                <input 
                  type="number" required
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  placeholder="예: 50"
                  value={adminForm.score}
                  onChange={(e) => setAdminForm({...adminForm, score: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#1428A0] text-white font-bold rounded py-3 mt-2 hover:bg-blue-900 transition-colors"
              >
                등록하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
