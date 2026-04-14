import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import BoardList from './pages/BoardList';
import BoardWrite from './pages/BoardWrite';
import BoardEdit from './pages/BoardEdit';
import MailForm from './pages/MailForm';
import MemberRegister from './pages/MemberRegister';
import MemberList from './pages/MemberList';
import Login from './pages/Login';
import MemberEdit from './pages/MemberEdit';
import PasswordChange from './pages/PasswordChange';

/** 공통 상단 헤더 — 로그인 상태에 따라 로그인/로그아웃 버튼 전환 */
function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginInfo, setLoginInfo] = useState({ loggedIn: false, memberName: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  /* 페이지 이동 시마다 로그인 상태 확인 */
  useEffect(() => {
    fetch('/api/login/check', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setLoginInfo(data))
      .catch(() => setLoginInfo({ loggedIn: false, memberName: '' }));
  }, [location.pathname]);

  /* 드롭다운 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  if (location.pathname === '/login') return null;

  /** 비밀번호 확인 후 개인정보 변경 이동 */
  const handlePasswordConfirm = async () => {
    if (!confirmPassword) { alert('비밀번호를 입력해주세요.'); return; }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginInfo.email, password: confirmPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setShowPasswordConfirm(false);
        setConfirmPassword('');
        navigate('/member/edit');
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  /** 로그아웃 처리 */
  const handleLogout = async () => {
    await fetch('/api/login/logout', { method: 'POST', credentials: 'include' });
    setLoginInfo({ loggedIn: false, memberName: '' });
    navigate('/login');
  };

  const buttonStyle = { padding: '6px 16px', fontSize: '13px', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const dropdownStyle = { position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '140px' };
  const menuItemStyle = { padding: '10px 16px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', color: '#333' };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', width: '80%', margin: '0 auto', padding: '10px 0' }}>
      {loginInfo.loggedIn ? (
        <>
          <div style={{ position: 'relative' }}>
            <span
              style={{ fontSize: '13px', color: '#4a90d9', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
            >
              {loginInfo.memberName}님 ▾
            </span>
            {showDropdown && (
              <div style={dropdownStyle}>
                <div style={menuItemStyle} onClick={() => { setShowDropdown(false); setConfirmPassword(''); setShowPasswordConfirm(true); }}>개인정보 변경</div>
                <div style={{ ...menuItemStyle, borderBottom: 'none' }} onClick={() => { setShowDropdown(false); navigate('/member/password'); }}>비밀번호 변경</div>
              </div>
            )}
          </div>
          <button type="button" onClick={handleLogout} style={buttonStyle}>로그아웃</button>

          {/* 비밀번호 확인 레이어 팝업 */}
          {showPasswordConfirm && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px 20px', minWidth: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', textAlign: 'center' }}>비밀번호 확인</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>개인정보 변경을 위해 비밀번호를 입력해주세요.</p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordConfirm(); }}
                  placeholder="비밀번호를 입력하세요"
                  style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '16px' }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button type="button" className="btn-submit" onClick={handlePasswordConfirm}>확인</button>
                  <button type="button" className="btn-cancel" onClick={() => { setShowPasswordConfirm(false); setConfirmPassword(''); }}>취소</button>
                </div>
              </div>
            </div>
          )}
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
        <Route path="/member/edit" element={<ProtectedRoute><MemberEdit /></ProtectedRoute>} />
        <Route path="/member/password" element={<ProtectedRoute><PasswordChange /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
