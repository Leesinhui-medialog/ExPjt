import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayerPopup from '../components/LayerPopup';

/**
 * 비밀번호 변경 페이지.
 * 현재 비밀번호 확인 후 새 비밀번호로 변경한다.
 */
export default function PasswordChange() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '' });

  /* 로그인 사용자 이메일 조회 */
  useEffect(() => {
    fetch('/api/login/check', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) { navigate('/login'); return; }
        setEmail(data.email);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const showAlert = (message) => setPopup({ show: true, message });
  const closePopup = () => setPopup({ show: false, message: '' });

  /** 비밀번호 변경 처리 */
  const handleChange = async () => {
    if (!currentPassword) { showAlert('현재 비밀번호를 입력해주세요.'); return; }
    if (!newPassword) { showAlert('새 비밀번호를 입력해주세요.'); return; }
    if (newPassword !== confirmPassword) { showAlert('새 비밀번호가 일치하지 않습니다.'); return; }
    if (currentPassword === newPassword) { showAlert('현재 비밀번호와 새 비밀번호가 동일합니다.'); return; }

    try {
      const response = await fetch('/api/member/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert('비밀번호가 변경되었습니다.');
        setTimeout(() => navigate('/board/list'), 1500);
      } else {
        showAlert(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      showAlert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ margin: '20px 2%' }}>
      <h1>비밀번호 변경</h1>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>현재 비밀번호</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="현재 비밀번호를 입력하세요" style={{ flex: 1 }} />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>새 비밀번호</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새 비밀번호를 입력하세요" style={{ flex: 1 }} />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>새 비밀번호 확인</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="새 비밀번호를 다시 입력하세요" style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        <button type="button" className="btn-submit" onClick={handleChange}>변경</button>
        <button type="button" className="btn-cancel" onClick={() => navigate('/board/list')}>취소</button>
      </div>

      {popup.show && <LayerPopup message={popup.message} onConfirm={closePopup} confirmOnly />}
    </div>
  );
}
