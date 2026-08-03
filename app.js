const { useState, useMemo, useEffect } = React;

// --- Lucide 아이콘 SVG 직접 삽입 (CDN 환경 오류 방지 및 디자인 유지) ---
const Trophy = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z"/></svg>;
const Users = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Info = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const Heart = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const ArrowRight = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const Settings = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const Train = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h0"/><path d="M16 15h0"/></svg>;
const Flag = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>;

// --- 커스텀 애니메이션 ---
const style = `
  @keyframes bobble {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  .animate-train {
    animation: bobble 1.5s ease-in-out infinite;
  }
`;

// --- 초기 팀 데이터 (7개 팀) ---
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
  const [players, setPlayers] = useState([]); // Supabase 연동을 위해 빈 배열로 시작
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', teamId: 'B', score: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPlayers();
  }, []);

  // Supabase 데이터 불러오기
  const fetchPlayers = async () => {
    if (typeof supabaseClient === 'undefined') return;
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
        .filter(p => p.team_id === team.id || p.teamId === team.id) // 호환성 유지
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

  // --- 관리자 기능: 점수 등록 (Supabase 연동) ---
  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.score) return;

    if (typeof supabaseClient === 'undefined') {
      alert('데이터베이스가 연결되지 않았습니다.');
      return;
    }

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
      fetchPlayers(); // 데이터 갱신
    }
  };

  return (
    // 최상단 컨테이너에 overflow-x-hidden 및 w-full 적용하여 가로폭 확장 완벽 차단
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans overflow-x-hidden w-full">
      <style>{style}</style>
      
      <div className="w-full max-w-md w-[100vw] sm:w-full bg-white shadow-xl flex flex-col relative overflow-x-hidden">
        
        {/* 1. 헤더 */}
        <header className="bg-white pt-6 pb-4 px-4 flex flex-col items-center border-b-8 border-[#1428A0]">
          <div className="w-full rounded-full border-4 border-[#1428A0] py-3 px-4 flex justify-between items-center relative overflow-hidden bg-white shadow-md max-w-full">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1428A0] flex items-center justify-center rounded-l-full">
              <ArrowRight className="text-white transform rotate-180 w-4 h-4" />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#1428A0] flex items-center justify-center rounded-r-full">
              <ArrowRight className="text-white w-4 h-4" />
            </div>
            
            <div className="flex-1 flex flex-col items-center z-10 px-6 max-w-full">
              <span className="text-xs text-gray-500 font-bold mb-1 tracking-wider whitespace-nowrap">SAMSUNG KIOSK</span>
              <h1 className="text-xl font-extrabold text-[#1428A0] flex items-center gap-1 whitespace-nowrap">
                삼성 나눔역 <Heart className="w-5 h-5 text-pink-500 fill-current" />
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
            <Users className="w-5 h-5 mb-1" />
            팀 랭킹
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm flex flex-col items-center transition-colors ${
              activeTab === 'individual' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Trophy className="w-5 h-5 mb-1" />
            개인 랭킹
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm flex flex-col items-center transition-colors ${
              activeTab === 'info' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Info className="w-5 h-5 mb-1" />
            부스 안내
          </button>
        </nav>

        {/* 3. 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          
          {/* 팀 랭킹 (라이트 테마 적용) */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden space-y-6 font-mono pb-8">
              
              {/* 총 모금액 표시 (라이트 테마) */}
                  [안내] 현재 나눔 랭킹이 실시간으로 업데이트 중입니다. 일상 속 나눔에 동참해 주셔서 감사합니다.
                </p>
              </div>
            </div>
          )}

          {/* 팀 랭킹 */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden space-y-6 font-mono pb-8">
              
              {/* 총 모금액 표시 */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex flex-col items-center justify-center mb-4">
                <span className="text-[#1428A0] text-sm font-bold mb-1">현재까지 모인 따뜻한 마음</span>
                <div className="text-3xl font-extrabold flex items-center gap-2 text-gray-800">
                  <Heart className="w-6 h-6 text-pink-500 fill-current animate-pulse" />
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
                        <div className="absolute right-0 -top-6 text-gray-400">
                          <Flag className="w-5 h-5" />
                        </div>
                        
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
                          <div className={`p-1.5 bg-white rounded-full shadow-md border-2 border-gray-100 ${team.textClass}`}>
                            <Train className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 개인 랭킹 */}
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
                          {INITIAL_TEAMS.find(t => t.id === player.team_id || t.id === player.teamId)?.name}
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
                  <Heart className="w-5 h-5 text-pink-500" /> 삼성 나눔 키오스크란?
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
                  <Train className="w-5 h-5 text-gray-600" /> 나눔 투어 노선도
                </h3>
                
                <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-500 before:via-green-500 before:to-pink-500">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-500 absolute -left-10 shadow">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full">
                      <h4 className="font-bold text-gray-900 mb-1">참여역</h4>
                      <p className="text-sm text-gray-600">부스에 방문하여 미니게임 안내를 받습니다.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-green-500 absolute -left-10 shadow">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full">
                      <h4 className="font-bold text-gray-900 mb-1">미니게임역</h4>
                      <p className="text-sm text-gray-600">팀을 위해 미니게임을 즐기고 랭킹 금액(점수)을 획득합니다.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-pink-500 absolute -left-10 shadow">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
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
            className="absolute bottom-2 right-2 p-2 opacity-10 hover:opacity-100 transition-opacity"
          >
            <Settings className="w-4 h-4 text-gray-600" />
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
    </div>
  );
}

// CDN 환경에서는 ReactDOM.render 실행
if (typeof ReactDOM !== 'undefined') {
  ReactDOM.render(<App />, document.getElementById('root'));
            }
