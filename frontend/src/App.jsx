import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import BoardList from './pages/BoardList';
import BoardWrite from './pages/BoardWrite';
import BoardEdit from './pages/BoardEdit';
import BoardDetail from './pages/BoardDetail';
import MemberRegister from './pages/MemberRegister';
import MemberList from './pages/MemberList';
import Login from './pages/Login';
import MemberEdit from './pages/MemberEdit';
import PasswordChange from './pages/PasswordChange';
import LeftMenu from './components/LeftMenu';

/** 페이지별 브라우저 탭 제목 매핑 */
const PAGE_TITLES = {
  '/login': '로그인',
  '/board/list': '게시판 - 목록',
  '/board/write': '게시판 - 글쓰기',
  '/board/edit': '게시판 - 수정',
  '/board/detail': '게시판 - 상세',
  '/mail': '메일',
  '/member/register': '회원 - 가입',
  '/member/list': '회원 - 목록',
  '/member/edit': '회원 - 개인정보 변경',
  '/member/password': '회원 - 비밀번호 변경',
};

/** 현재 경로에 맞는 브라우저 탭 제목을 설정하는 컴포넌트 */
function PageTitle() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    /* 정확히 일치하는 경로 먼저 확인, 없으면 접두어 매칭 */
    const title = PAGE_TITLES[path]
      || Object.entries(PAGE_TITLES).find(([key]) => path.startsWith(key))?.[1]
      || 'ExPjt';
    document.title = title;
  }, [location.pathname]);
  return null;
}

/** 공통 상단 헤더 — 로그아웃 버튼 제공 */
function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginInfo, setLoginInfo] = useState({ loggedIn: false, memberName: '' });

  /* 페이지 이동 시마다 로그인 상태 확인 */
  useEffect(() => {
    fetch('/api/login/check', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setLoginInfo(data))
      .catch(() => setLoginInfo({ loggedIn: false, memberName: '' }));
  }, [location.pathname]);

  /* 로그인 페이지에서는 헤더 미표시 */
  if (location.pathname === '/login') return null;

  /** 로그아웃 처리 */
  const handleLogout = async () => {
    await fetch('/api/login/logout', { method: 'POST', credentials: 'include' });
    setLoginInfo({ loggedIn: false, memberName: '' });
    navigate('/login');
  };

  const buttonStyle = { padding: '6px 16px', fontSize: '13px', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', padding: '10px 24px', borderBottom: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
      {loginInfo.loggedIn ? (
        <>
          <span style={{ fontSize: '13px', color: '#555' }}>{loginInfo.memberName}님</span>
          <button type="button" onClick={handleLogout} style={buttonStyle}>로그아웃</button>
        </>
      ) : (
        <button type="button" onClick={() => navigate('/login')} style={buttonStyle}>로그인</button>
      )}
    </div>
  );
}

/** 인증 가드 — 로그인되지 않은 경우 로그인 페이지로 리다이렉트 */
function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/login/check', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => { setLoggedIn(data.loggedIn); setChecking(false); })
      .catch(() => { setLoggedIn(false); setChecking(false); });
  }, []);

  if (checking) return null;
  if (!loggedIn) return <Navigate to="/login" replace />;
  return children;
}

/** 좌측 메뉴 + 우측 콘텐츠 레이아웃 래퍼 */
function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 상단 그라데이션 띠 */}
      <div style={{ height: '4px', background: 'linear-gradient(to right, #e91e63, #9c27b0, #3f51b5, #1a237e)', flexShrink: 0 }} />
      <div style={{ display: 'flex', flex: 1 }}>
        <LeftMenu />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopHeader />
          <div style={{ flex: 1, padding: '0' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  /* 로그인, 회원가입, 회원목록 페이지는 좌측 메뉴 없이 표시 */
  const noLayoutPaths = ['/login', '/member/register'];
  const showLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <>
      <PageTitle />
      {showLayout ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/board/list" element={<ProtectedRoute><BoardList /></ProtectedRoute>} />
            <Route path="/board/write" element={<ProtectedRoute><BoardWrite /></ProtectedRoute>} />
            <Route path="/board/detail/:idx" element={<ProtectedRoute><BoardDetail /></ProtectedRoute>} />
            <Route path="/board/edit/:idx" element={<ProtectedRoute><BoardEdit /></ProtectedRoute>} />
            <Route path="/member/list" element={<ProtectedRoute><MemberList /></ProtectedRoute>} />
            <Route path="/member/edit" element={<ProtectedRoute><MemberEdit /></ProtectedRoute>} />
            <Route path="/member/password" element={<ProtectedRoute><PasswordChange /></ProtectedRoute>} />
          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/member/register" element={<MemberRegister />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}
