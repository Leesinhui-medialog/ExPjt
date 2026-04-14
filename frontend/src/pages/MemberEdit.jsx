import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayerPopup from '../components/LayerPopup';

/**
 * 개인정보 변경 페이지.
 * 로그인한 사용자의 이름, 전화번호를 수정할 수 있다.
 */
export default function MemberEdit() {
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState('');
  const [email, setEmail] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '' });

  /* 로그인 사용자 정보 조회 */
  useEffect(() => {
    fetch('/api/login/check', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) { navigate('/login'); return; }
        setEmail(data.email);
        /* 회원 상세 정보 조회 */
        return fetch(`/api/member/detail?email=${encodeURIComponent(data.email)}`, { credentials: 'include' });
      })
      .then((res) => res && res.json())
      .then((member) => {
        if (member) {
          setMemberName(member.memberName || '');
          setTelephoneNumber(member.telephoneNumber || '');
          setBirthDate(member.birthDate || '');
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const showAlert = (message) => setPopup({ show: true, message });
  const closePopup = () => setPopup({ show: false, message: '' });

  /** 저장 처리 */
  const handleSave = async () => {
    if (!memberName.trim()) { showAlert('이름을 입력해주세요.'); return; }
    if (!telephoneNumber.trim()) { showAlert('전화번호를 입력해주세요.'); return; }
    try {
      const response = await fetch('/api/member/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, memberName, telephoneNumber, birthDate }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert('개인정보가 변경되었습니다.');
        setTimeout(() => navigate('/board/list'), 1500);
      } else {
        showAlert(data.message || '변경에 실패했습니다.');
      }
    } catch (error) {
      showAlert('개인정보 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ margin: '20px 2%' }}>
      <h1>개인정보 변경</h1>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>이메일</label>
        <input value={email} disabled style={{ flex: 1 }} />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>이름</label>
        <input value={memberName} onChange={(e) => setMemberName(e.target.value)} style={{ flex: 1 }} />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>생년월일</label>
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ flex: 1 }} />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>전화번호</label>
        <input value={telephoneNumber} onChange={(e) => setTelephoneNumber(e.target.value)} placeholder="전화번호를 입력하세요" style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        <button type="button" className="btn-submit" onClick={handleSave}>저장</button>
        <button type="button" className="btn-cancel" onClick={() => navigate('/board/list')}>취소</button>
      </div>

      {popup.show && <LayerPopup message={popup.message} onConfirm={closePopup} confirmOnly />}
    </div>
  );
}
