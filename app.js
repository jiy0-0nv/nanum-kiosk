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

  const totalRaisedAmount = useMemo(() => {
    return players.reduce((sum, player) => sum + player.score, 0);
  }, [players]);

  // Supabase에 점수 등록하기
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
      fetchPlayers(); // 목록 새로고침
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-xl flex flex-col relative min-h-screen overflow-hidden">
      <header className="bg-white pt-6 pb-4 px-4 flex flex-col items-center border-b-8 border-[#1428A0]">
        <div className="w-full rounded-full border-4 border-[#1428A0] py-3 px-4 flex justify-between items-center bg-white shadow-md">
          <div className="flex-1 flex flex-col items-center px-6">
            <span className="text-xs text-gray-500 font-bold mb-1">SAMSUNG KIOSK</span>
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

      <nav className="flex bg-gray-50 border-b border-gray-200 p-2 gap-2">
        <button onClick={() => setActiveTab('team')} className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm ${activeTab === 'team' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500'}`}>팀 랭킹</button>
        <button onClick={() => setActiveTab('individual')} className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm ${activeTab === 'individual' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500'}`}>개인 랭킹</button>
        <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm ${activeTab === 'info' ? 'bg-[#1428A0] text-white shadow-md' : 'text-gray-500'}`}>부스 안내</button>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {(activeTab === 'individual' || activeTab === 'team') && (
          <div className="overflow-hidden mb-5 bg-gray-900 py-2 rounded-lg border-2 border-gray-800 shadow-md">
            <p className="text-amber-400 font-mono text-xs font-bold animate-marquee led-text">
              [안내] 현재 나눔 랭킹이 실시간으로 업데이트 중입니다. 일상 속 나눔에 동참해 주셔서 감사합니다.
            </p>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-6 font-mono pb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex flex-col items-center justify-center mb-4">
              <span className="text-[#1428A0] text-sm font-bold mb-1">현재까지 모인 따뜻한 마음</span>
              <div className="text-3xl font-extrabold flex items-center gap-2 text-gray-800">
                <span>{totalRaisedAmount.toLocaleString()}</span>
                <span className="text-lg font-normal text-gray-500">만원</span>
              </div>
            </div>

            <div className="space-y-8 mt-6">
              {teamRanking.map((team, index) => {
                const progress = mounted ? Math.max(5, (team.totalScore / maxTeamScore) * 85) : 0;
                return (
                  <div key={team.id} className="relative w-full">
                    <div className="flex justify-between items-end mb-3 border-b border-gray-100 pb-2">
                      <span className="font-bold flex items-center gap-2 text-sm text-gray-800">
                        <span className="text-xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</span>
                        <span className={index === 0 ? 'text-[#1428A0] text-lg' : ''}>{team.name}</span>
                      </span>
                      <span className={`font-bold ${index === 0 ? 'text-[#1428A0] text-lg' : 'text-gray-700'}`}>
                        {team.totalScore.toLocaleString()}<span className="text-xs ml-1 text-gray-500">만원</span>
                      </span>
                    </div>
                    <div className="relative h-4 w-full bg-gray-200 rounded-full flex items-center mt-4">
                      <div className={`h-full ${team.bgClass} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                      <div className="absolute -top-3 animate-train" style={{ left: `calc(${progress}% - 14px)` }}>
                        <div className={`p-1 bg-white rounded-full shadow border text-xs font-bold ${team.textClass}`}>🚇</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm font-mono">
            <div className="space-y-3">
              {individualRanking.map((player, index) => (
                <div key={player.id} className={`flex items-center p-3 rounded-lg border border-gray-100 ${index < 3 ? 'bg-blue-50/50' : 'bg-gray-50'}`}>
                  <div className="w-8 text-center font-bold">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</div>
                  <div className="flex-1 ml-3">
                    <div className={`font-bold ${index < 3 ? 'text-[#1428A0] text-lg' : 'text-gray-800'}`}>{player.name}</div>
                    <div className="text-xs text-gray-500">{INITIAL_TEAMS.find(t => t.id === player.team_id)?.name}</div>
                  </div>
                  <div className={`font-bold ${index < 3 ? 'text-[#1428A0] text-xl' : 'text-gray-700'}`}>{player.score.toLocaleString()}만원</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100">
              <h3 className="font-extrabold text-[#1428A0] mb-2">💡 삼성 나눔 키오스크란?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                2015년 삼성전자 임직원들의 아이디어로 시작된 '일상 속 기부 플랫폼'입니다. 
                10년간 약 112억 원이 모금되어 3,770여 명의 아동을 지원했습니다.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 text-center relative">
        <p className="text-xs text-gray-500">© SAMSUNG NANUM KIOSK</p>
        <button onClick={() => setIsAdminOpen(true)} className="absolute bottom-2 right-2 p-2 opacity-10 hover:opacity-100">⚙️</button>
      </footer>

      {isAdminOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">점수 등록</h2>
              <button onClick={() => setIsAdminOpen(false)} className="text-xl font-bold">×</button>
            </div>
            <form onSubmit={handleAddScore} className="space-y-4">
              <select className="w-full border rounded p-2 text-sm" value={adminForm.teamId} onChange={(e) => setAdminForm({...adminForm, teamId: e.target.value})}>
                {INITIAL_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input type="text" placeholder="이름" className="w-full border rounded p-2 text-sm" value={adminForm.name} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} />
              <input type="number" placeholder="금액(만원)" className="w-full border rounded p-2 text-sm" value={adminForm.score} onChange={(e) => setAdminForm({...adminForm, score: e.target.value})} />
              <button type="submit" className="w-full bg-[#1428A0] text-white font-bold rounded py-3">등록</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
