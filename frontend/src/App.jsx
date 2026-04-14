import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import BoardList from './pages/BoardList';
import BoardWrite from './pages/BoardWrite';
import BoardEdit from './pages/BoardEdit';
import MailForm from './pages/MailForm';
import MemberRegister from './pages/MemberRegister';
import MemberList from './pages/MemberList';
import Login from './pages/Login';

/** 공통 상단 헤더 — 로그인 상태에 따라 로그인/로그아웃 버튼 전환 */
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

  if (location.pathname === '/login') return null;

  /** 로그아웃 처리 */
  const handleLogout = async () => {
    await fetch('/api/login/logout', { method: 'POST', credentials: 'include' });
    setLoginInfo({ loggedIn: false, memberName: '' });
    navigate('/login');
  };

  const buttonStyle = { padding: '6px 16px', fontSize: '13px', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', width: '80%', margin: '0 auto', padding: '10px 0' }}>
      {loginInfo.loggedIn ? (
        <>
          <span style={{ fontSize: '13px', color: '#333' }}>{loginInfo.memberName}님</span>
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

export default function App() {
  return (
    <>
      <TopHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/board/list" element={<ProtectedRoute><BoardList /></ProtectedRoute>} />
        <Route path="/board/write" element={<ProtectedRoute><BoardWrite /></ProtectedRoute>} />
        <Route path="/board/edit/:idx" element={<ProtectedRoute><BoardEdit /></ProtectedRoute>} />
        <Route path="/mail" element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/member/list" element={<MemberList />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
