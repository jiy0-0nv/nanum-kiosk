const { useState, useEffect } = React;

const INITIAL_TEAMS = [
  { id: 'B', name: 'B호선' },
  { id: 'C', name: 'C호선' },
  { id: 'D', name: 'D호선' },
  { id: 'E', name: 'E호선' },
  { id: 'J', name: 'J호선' },
  { id: 'K', name: 'K호선' },
  { id: 'L', name: 'L호선' },
];

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [players, setPlayers] = useState([]);
  const [adminForm, setAdminForm] = useState({ name: '', teamId: 'B', score: '' });

  // 로그인 상태 확인
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    if (!window.supabaseClient) return;
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      fetchPlayers();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);

    if (!window.supabaseClient) {
      alert('Supabase 클라이언트가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    // 고정 이메일과 입력받은 비밀번호로 인증
    const { error } = await window.supabaseClient.auth.signInWithPassword({
      email: 'admin@nanum.com',
      password: password,
    });

    if (error) {
      alert('비밀번호가 올바르지 않습니다.');
      setPassword('');
    } else {
      setIsAuthenticated(true);
      fetchPlayers();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await window.supabaseClient.auth.signOut();
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchPlayers = async () => {
    const { data, error } = await window.supabaseClient
      .from('players')
      .select('*')
      .order('score', { ascending: false });
    
    if (!error && data) {
      setPlayers(data);
    }
  };

  // 데이터 추가
  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.score) return;

    const { error } = await window.supabaseClient.from('players').insert([{ 
      name: adminForm.name, 
      team_id: adminForm.teamId, 
      score: Number(adminForm.score) 
    }]);

    if (!error) {
      setAdminForm({ name: '', teamId: 'B', score: '' });
      fetchPlayers();
    } else {
      alert('추가 실패: ' + error.message);
    }
  };

  // 데이터 삭제
  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" 기록을 삭제하시겠습니까?`)) return;

    const { error } = await window.supabaseClient
      .from('players')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchPlayers();
    } else {
      alert('삭제 실패: ' + error.message);
    }
  };

  // 1. 로그인 전 화면
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-50 text-[#1428A0] rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-inner">
          🔒
        </div>
        <h1 className="text-lg font-black text-gray-800 mb-1">스태프 전용 대시보드</h1>
        <p className="text-xs text-gray-400 mb-6 text-center">관리자 비밀번호를 입력하여 접속하세요.</p>
        
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
          <input 
            type="password" 
            placeholder="관리자 비밀번호" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:border-[#1428A0] outline-none transition-colors"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1428A0] text-white font-bold rounded-xl py-3 text-sm shadow-md hover:bg-blue-900 transition-colors"
          >
            {loading ? '로그인 중...' : '접속하기'}
          </button>
        </form>
      </div>
    );
  }

  // 2. 로그인 후 대시보드 화면
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-sans flex flex-col min-h-[600px]">
      {/* 헤더 */}
      <div className="bg-[#1428A0] text-white p-5 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">ADMIN PANEL</span>
          <h1 className="text-base font-black">나눔역 점수 관리</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          로그아웃
        </button>
      </div>

      <div className="p-5 flex flex-col gap-6 flex-1">
        {/* 점수 등록 폼 */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h2 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <span>➕</span>새로운 기록 등록
          </h2>
          <form onSubmit={handleAddScore} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">소속 팀</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white focus:border-[#1428A0] outline-none"
                  value={adminForm.teamId} 
                  onChange={(e) => setAdminForm({...adminForm, teamId: e.target.value})}
                >
                  {INITIAL_TEAMS.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">참가자 이름</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white focus:border-[#1428A0] outline-none"
                  placeholder="예: 홍길동" 
                  value={adminForm.name} 
                  onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">획득 금액 (만원)</label>
              <input 
                type="number" 
                required 
                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white focus:border-[#1428A0] outline-none"
                placeholder="예: 50" 
                value={adminForm.score} 
                onChange={(e) => setAdminForm({...adminForm, score: e.target.value})} 
              />
            </div>
            <button type="submit" className="w-full bg-[#1428A0] text-white font-bold rounded-lg py-2.5 text-xs shadow-sm hover:bg-blue-900 transition-colors mt-1">
              등록하기
            </button>
          </form>
        </div>

        {/* 등록된 목록 및 삭제 기능 */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-bold text-gray-700">📋 등록된 기록 목록</h2>
            <span className="text-[10px] text-gray-400">총 {players.length}개</span>
          </div>
          
          <div className="border border-gray-100 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto bg-gray-50/50">
            {players.length === 0 ? (
              <div className="text-center text-gray-400 py-10 text-xs">등록된 기록이 없습니다.</div>
            ) : (
              players.map((player) => {
                const teamObj = INITIAL_TEAMS.find(t => t.id === player.team_id || t.id === player.teamId);
                return (
                  <div key={player.id} className="flex items-center justify-between p-3 border-b border-gray-100 bg-white last:border-b-0 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1428A0] bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                        {teamObj ? teamObj.name : player.team_id}
                      </span>
                      <span className="font-bold text-gray-800">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-700">{player.score.toLocaleString()}만원</span>
                      <button 
                        onClick={() => handleDelete(player.id, player.name)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors text-xs font-bold"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

if (typeof ReactDOM !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<AdminApp />);
}

