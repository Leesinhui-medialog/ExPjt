import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayerPopup from '../components/LayerPopup';

/**
 * 로그인 페이지.
 * 이메일/비밀번호 로그인, 아이디 자동저장, 회원가입/비밀번호찾기 링크를 제공한다.
 */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveEmail, setSaveEmail] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '' });
  const [showFindPassword, setShowFindPassword] = useState(false);
  const [findEmail, setFindEmail] = useState('');

  /* 저장된 이메일 불러오기 */
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, []);

  /** 팝업 표시 */
  const showAlert = (message) => {
    setPopup({ show: true, message });
  };

  /** 팝업 닫기 */
  const closePopup = () => {
    setPopup({ show: false, message: '' });
  };

  /** 로그인 처리 */
  const handleLogin = async () => {
    if (!email.trim()) {
      showAlert('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      showAlert('비밀번호를 입력해주세요.');
      return;
    }

    /* 아이디 자동저장 처리 */
    if (saveEmail) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert(`${data.memberName}님, 환영합니다.`);
        setTimeout(() => navigate('/board/list'), 1500);
      } else {
        showAlert(data.message);
      }
    } catch (error) {
      showAlert('로그인 중 오류가 발생했습니다.');
    }
  };

  /** 비밀번호 찾기 처리 */
  const handleFindPassword = async () => {
    if (!findEmail.trim()) {
      showAlert('이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch('/api/login/retrieve-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: findEmail }),
      });
      const data = await response.json();
      setShowFindPassword(false);
      setFindEmail('');
      showAlert(data.message);
    } catch (error) {
      showAlert('비밀번호 찾기 중 오류가 발생했습니다.');
    }
  };

  /** Enter 키 로그인 */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{ width: '400px', margin: '80px auto', padding: '32px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '28px', fontSize: '24px' }}>로그인</h1>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="이메일을 입력하세요"
          style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>비밀번호</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="비밀번호를 입력하세요"
          style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={saveEmail}
            onChange={(e) => setSaveEmail(e.target.checked)}
          />
          아이디 자동저장
        </label>
      </div>

      <button
        type="button"
        onClick={handleLogin}
        style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        로그인
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '13px' }}>
        <span style={{ cursor: 'pointer', color: '#4a90d9' }} onClick={() => navigate('/member/register')}>회원가입</span>
        <span style={{ color: '#ccc' }}>|</span>
        <span style={{ cursor: 'pointer', color: '#4a90d9' }} onClick={() => setShowFindPassword(true)}>비밀번호찾기</span>
      </div>

      {/* 비밀번호 찾기 레이어 팝업 */}
      {showFindPassword && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: '28px 32px 20px', minWidth: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', textAlign: 'center' }}>비밀번호 찾기</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>가입 시 등록한 이메일을 입력하세요.</p>
            <input
              type="email"
              value={findEmail}
              onChange={(e) => setFindEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button type="button" className="btn-submit" onClick={handleFindPassword}>확인</button>
              <button type="button" className="btn-cancel" onClick={() => { setShowFindPassword(false); setFindEmail(''); }}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 공통 레이어 팝업 */}
      {popup.show && (
        <LayerPopup message={popup.message} onConfirm={closePopup} confirmOnly />
      )}
    </div>
  );
}
