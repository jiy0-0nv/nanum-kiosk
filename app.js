const { useState, useMemo, useEffect } = React;

// --- 아이콘 SVG 직접 삽입 ---
const Trophy = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z"/></svg>;
const Users = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Info = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const Heart = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const ArrowRight = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const ArrowLeft = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const Settings = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const Train = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h0"/><path d="M16 15h0"/></svg>;
const Flag = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>;

const style = `
  @keyframes bobble {
    0%, 100% { transform: translateY(-50%); }
    50% { transform: translateY(calc(-50% - 4px)); }
  }
  .animate-train {
    animation: bobble 1.5s ease-in-out infinite;
  }
`;

const INITIAL_TEAMS = [
  { id: 'B', name: 'B호선', bgClass: 'bg-blue-500', textClass: 'text-blue-500' },
  { id: 'C', name: 'C호선', bgClass: 'bg-green-500', textClass: 'text-green-500' },
  { id: 'D', name: 'D호선', bgClass: 'bg-red-500', textClass: 'text-red-500' },
  { id: 'E', name: 'E호선', bgClass: 'bg-yellow-500', textClass: 'text-yellow-500' },
  { id: 'J', name: 'J호선', bgClass: 'bg-purple-500', textClass: 'text-purple-500' },
  { id: 'K', name: 'K호선', bgClass: 'bg-pink-500', textClass: 'text-pink-500' },
  { id: 'L', name: 'L호선', bgClass: 'bg-teal-500', textClass: 'text-teal-500' },
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

  const fetchPlayers = async () => {
    if (typeof window === 'undefined' || !window.supabaseClient) return;
    const { data, error } = await window.supabaseClient
      .from('players')
      .select('*')
      .order('score', { ascending: false });
    
    if (!error && data) {
      setPlayers(data);
    }
  };

  const individualRanking = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const teamRanking = useMemo(() => {
    const teamScores = INITIAL_TEAMS.map(team => {
      const totalScore = players
        .filter(p => p.team_id === team.id || p.teamId === team.id)
        .reduce((sum, p) => sum + p.score, 0);
      return { ...team, totalScore };
    });
    return teamScores.sort((a, b) => b.totalScore - a.totalScore);
  }, [players]);

  const maxTeamScore = useMemo(() => {
    const max = Math.max(...teamRanking.map(t => t.totalScore));
    return max > 0 ? max : 100;
  }, [teamRanking]);

  const totalRaisedAmount = useMemo(() => {
    return players.reduce((sum, player) => sum + player.score, 0);
  }, [players]);

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.score) return;
    if (!window.supabaseClient) {
      alert('DB가 연결되지 않았습니다.'); return;
    }
    const { error } = await window.supabaseClient.from('players').insert([{ 
      name: adminForm.name, team_id: adminForm.teamId, score: Number(adminForm.score) 
    }]);

    if (!error) {
      setAdminForm({ name: '', teamId: 'B', score: '' });
      setIsAdminOpen(false);
      fetchPlayers(); 
    }
  };

  return (
    <div className="w-screen max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col shadow-2xl relative font-sans text-gray-800 overflow-x-hidden">
      <style>{style}</style>
  
      {/* 1. 헤더 */}
      <header className="bg-white px-4 pt-6 pb-4 border-b border-gray-200">
        <div className="w-full bg-[#1428A0] rounded-[2.5rem] flex h-16 shadow-sm overflow-hidden border border-[#1428A0]">
          <div className="w-14 flex items-center justify-center shrink-0">
            <ArrowLeft className="text-white w-5 h-5" />
          </div>
          
          <div className="flex-1 bg-white flex flex-col items-center justify-center px-2">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest mb-0.5 uppercase">SAMSUNG KIOSK</span>
            <h1 className="text-lg font-black text-[#1428A0] flex items-center gap-1.5 whitespace-nowrap">
              삼성 나눔역 <Heart className="w-5 h-5 text-pink-500 fill-current" />
            </h1>
          </div>
          
          <div className="w-14 flex items-center justify-center shrink-0">
            <ArrowRight className="text-white w-5 h-5" />
          </div>
        </div>
        
        <div className="flex justify-between mt-3 px-3 text-[10px] font-bold text-gray-400">
          <span>← 나눔의 시작</span>
          <span>아이들의 미래 →</span>
        </div>
      </header>

      {/* 2. 내비게이션 바 */}
      <nav className="flex bg-white shadow-sm z-10 border-b-2 border-gray-100">
        <button onClick={() => setActiveTab('team')} className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${activeTab === 'team' ? 'bg-[#1428A0] text-white shadow-inner' : 'text-gray-500'}`}>
          <Users className="w-5 h-5" />
          <span className="text-xs font-bold">팀 랭킹</span>
        </button>
        <button onClick={() => setActiveTab('individual')} className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${activeTab === 'individual' ? 'bg-[#1428A0] text-white shadow-inner' : 'text-gray-500'}`}>
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-bold">개인 랭킹</span>
        </button>
        <button onClick={() => setActiveTab('info')} className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${activeTab === 'info' ? 'bg-[#1428A0] text-white shadow-inner' : 'text-gray-500'}`}>
          <Info className="w-5 h-5" />
          <span className="text-xs font-bold">부스 안내</span>
        </button>
      </nav>

      {/* 3. 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        
        {/* === 팀 랭킹 === */}
        {activeTab === 'team' && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-mono flex flex-col">
            <div className="bg-blue-50/30 p-6 flex flex-col items-center justify-center border-b border-gray-100">
              <span className="text-[#1428A0] text-sm font-bold mb-2">현재까지 모인 따뜻한 마음</span>
              <div className="flex items-center gap-2">
                <Heart className="w-7 h-7 text-pink-500 fill-current animate-pulse" />
                <span className="text-4xl font-black text-gray-800 tracking-tight">{totalRaisedAmount.toLocaleString()}</span>
                <span className="text-base font-bold text-gray-500 mt-2">만원</span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-8">
              {teamRanking.map((team, index) => {
                const progress = mounted ? Math.max(5, Math.min(95, (team.totalScore / maxTeamScore) * 100)) : 5;
                return (
                  <div key={team.id} className="w-full">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg w-6 text-center">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-gray-400 font-bold text-sm">{index + 1}</span>}</span>
                        <span className={`font-bold text-base ${index === 0 ? 'text-[#1428A0]' : 'text-gray-700'}`}>{team.name}</span>
                      </div>
                      <div className={`font-bold text-lg ${index === 0 ? 'text-[#1428A0]' : 'text-gray-800'}`}>
                        {team.totalScore.toLocaleString()} <span className="text-xs text-gray-500 font-medium">만원</span>
                      </div>
                    </div>
                    <div className="relative mt-4">
                      <div className="absolute right-0 -top-5">
                        <Flag className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full flex items-center px-2 justify-between border border-gray-200/50">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className={`absolute top-0 left-0 h-3 ${team.bgClass} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                      <div className="absolute top-1/2 animate-train transition-all duration-1000" style={{ left: `calc(${progress}% - 14px)` }}>
                        <div className={`w-7 h-7 bg-white rounded-full shadow-md border-2 border-gray-100 flex items-center justify-center ${team.textClass}`}>
                          <Train className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === 개인 랭킹 === */}
        {activeTab === 'individual' && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-mono flex flex-col p-2">
            {individualRanking.length === 0 ? (
              <div className="text-center text-gray-400 py-10 text-sm">등록된 기록이 없습니다.</div>
            ) : (
              individualRanking.map((player, index) => (
                <div key={player.id} className={`flex items-center p-4 border-b border-gray-50 last:border-b-0 ${index < 3 ? 'bg-blue-50/20' : ''}`}>
                  <div className="w-10 flex justify-center shrink-0 text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-gray-400 font-bold text-base">{index + 1}</span>}
                  </div>
                  <div className="flex-1 ml-3 min-w-0">
                    <div className={`font-bold text-base truncate ${index < 3 ? 'text-[#1428A0]' : 'text-gray-800'}`}>{player.name}</div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{INITIAL_TEAMS.find(t => t.id === player.team_id || t.id === player.teamId)?.name}</div>
                  </div>
                  <div className={`font-bold shrink-0 text-base ${index < 3 ? 'text-[#1428A0]' : 'text-gray-700'}`}>
                    {player.score.toLocaleString()} <span className="text-xs font-medium text-gray-500">만원</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* === 부스 안내 === */}
        {activeTab === 'info' && (
          <>
            <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1.5 h-full bg-[#1428A0]"></div>
              <h3 className="font-bold text-[#1428A0] text-sm flex items-center gap-1.5 mb-3 ml-1">
                <Heart className="w-4 h-4 text-pink-500 fill-current" /> 삼성 나눔 키오스크란?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-5 ml-1">
                2015년 삼성전자 구미사업장 임직원들의 아이디어로 시작된 <strong>'일상 속 기부 플랫폼'</strong>입니다. 사내에 설치된 키오스크에 사원증을 태깅하면 1,000원씩 간편하게 기부할 수 있습니다.
              </p>
              <div className="flex gap-2 mb-3 ml-1">
                <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div className="text-[10px] text-gray-500 mb-1">10년간 누적 기부액</div>
                  <div className="font-bold text-[#1428A0] text-sm">약 112억 원</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div className="text-[10px] text-gray-500 mb-1">지원 아동 수</div>
                  <div className="font-bold text-[#1428A0] text-sm">3,770여 명</div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center ml-1">여러분의 작은 태그 하나가 모여 아동들의 내일을 지켜주고 있습니다.</p>
            </div>
            <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-5">
                <Train className="w-4 h-4 text-gray-500" /> 나눔 투어 노선도
              </h3>
              <div className="relative pl-5 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-green-500 before:to-pink-500">
                <div className="relative flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 absolute -left-5 shadow-sm border-2 border-white text-[10px] text-white font-bold">1</div>
                  <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-100 w-full">
                    <h4 className="font-bold text-gray-800 text-xs mb-1">참여역</h4>
                    <p className="text-[10px] text-gray-500">부스에 방문하여 미니게임 안내를 받습니다.</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 absolute -left-5 shadow-sm border-2 border-white text-[10px] text-white font-bold">2</div>
                  <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-100 w-full">
                    <h4 className="font-bold text-gray-800 text-xs mb-1">미니게임역</h4>
                    <p className="text-[10px] text-gray-500">팀을 위해 미니게임을 즐기고 랭킹 금액을 획득합니다.</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0 absolute -left-5 shadow-sm border-2 border-white text-[10px] text-white font-bold">3</div>
                  <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-100 w-full">
                    <h4 className="font-bold text-gray-800 text-xs mb-1">나눔역 (종점)</h4>
                    <p className="text-[10px] text-gray-500">획득한 금액을 랭킹에 등록하고 기부의 기쁨을 나눕니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* 4. 푸터 */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center relative mt-auto">
        <p className="text-xs text-gray-500 font-medium">여러분의 작은 참여가 아이들에게 큰 희망이 됩니다.</p>
        <p className="text-[10px] text-gray-400 mt-1">© SAMSUNG NANUM KIOSK</p>
        
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="absolute bottom-3 right-3 p-2 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </footer>

      {/* 관리자 모달 */}
      {isAdminOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-bold text-gray-800">🛠 스태프 전용 점수 등록</h2>
              <button onClick={() => setIsAdminOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>
            
            <form onSubmit={handleAddScore} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">소속 팀</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-colors" value={adminForm.teamId} onChange={(e) => setAdminForm({...adminForm, teamId: e.target.value})}>
                  {INITIAL_TEAMS.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">참가자 이름</label>
                <input type="text" required className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-colors" placeholder="예: 홍길동" value={adminForm.name} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">획득 금액 (만원)</label>
                <input type="number" required className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-colors" placeholder="예: 50" value={adminForm.score} onChange={(e) => setAdminForm({...adminForm, score: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#1428A0] text-white font-bold rounded-lg py-3 mt-2 shadow-md">
                등록하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

if (typeof ReactDOM !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}
