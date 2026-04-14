import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayerPopup from '../components/LayerPopup';

/**
 * 회원가입 페이지 (3단계 스텝)
 * Step 01: 회원약관동의
 * Step 02: 회원실명확인
 * Step 03: 회원정보입력
 */
export default function MemberRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });

  /* 브라우저 뒤로가기 시 이전 스텝으로 이동 */
  useEffect(() => {
    /* 스텝 변경 시 히스토리에 상태 추가 */
    window.history.pushState({ step: currentStep }, '');

    const handlePopState = (event) => {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentStep]);

  /* Step 01 - 약관동의 상태 */
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [privacyAgreement, setPrivacyAgreement] = useState(false);

  /* Step 02 - 실명인증 상태 */
  const [memberName, setMemberName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [identityVerified, setIdentityVerified] = useState(false);

  /* Step 03 - 회원정보 상태 */
  const [email, setEmail] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  /* 스텝 라벨 */
  const steps = [
    { number: 1, label: 'Step 01 회원약관동의' },
    { number: 2, label: 'Step 02 회원실명확인' },
    { number: 3, label: 'Step 03 회원정보입력' },
  ];

  /** 팝업 표시 */
  const showAlert = (message) => {
    setPopup({ show: true, message, onConfirm: null });
  };

  /** 팝업 닫기 */
  const closePopup = () => {
    setPopup({ show: false, message: '', onConfirm: null });
  };

  /** Step 01 → Step 02 이동 */
  const handleStep1Next = () => {
    if (!termsAgreement) {
      showAlert('이용약관에 동의해주세요.');
      return;
    }
    if (!privacyAgreement) {
      showAlert('개인정보 수집에 동의해주세요.');
      return;
    }
    setCurrentStep(2);
  };

  /** Step 02 - 실명인증 요청 */
  const handleVerifyIdentity = async () => {
    if (!memberName.trim()) {
      showAlert('이름을 입력해주세요.');
      return;
    }
    if (!birthDate) {
      showAlert('생년월일을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch('/api/member/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName, birthDate }),
      });
      const data = await response.json();
      if (data.verified) {
        setIdentityVerified(true);
        showAlert('실명인증이 완료되었습니다.');
      } else {
        showAlert('실명인증에 실패했습니다. 정보를 확인해주세요.');
      }
    } catch (error) {
      showAlert('실명인증 중 오류가 발생했습니다.');
    }
  };

  /** Step 02 → Step 03 이동 */
  const handleStep2Next = () => {
    if (!identityVerified) {
      showAlert('실명인증을 먼저 완료해주세요.');
      return;
    }
    setCurrentStep(3);
  };

  /** Step 03 - 회원가입 완료 */
  const handleRegister = async () => {
    if (!email.trim()) {
      showAlert('이메일을 입력해주세요.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    if (!telephoneNumber.trim()) {
      showAlert('전화번호를 입력해주세요.');
      return;
    }
    if (!password) {
      showAlert('비밀번호를 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      showAlert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await fetch('/api/member/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName,
          birthDate,
          email,
          telephoneNumber,
          password,
          termsAgreement: 'Y',
          privacyAgreement: 'Y',
          identityVerified: 'Y',
        }),
      });
      if (response.ok) {
        showAlert('회원가입이 완료되었습니다.');
        setTimeout(() => navigate('/member/list'), 1500);
      } else {
        showAlert('회원가입에 실패했습니다. 이메일 중복을 확인해주세요.');
      }
    } catch (error) {
      showAlert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h1>회원가입</h1>

      {/* 스텝 인디케이터 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '24px 0' }}>
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              backgroundColor: currentStep === step.number ? '#4a90d9' : '#e0e0e0',
              color: currentStep === step.number ? '#fff' : '#666',
              fontWeight: currentStep === step.number ? 'bold' : 'normal',
              fontSize: '14px',
            }}
          >
            {step.label}
          </div>
        ))}
      </div>

      {/* Step 01: 회원약관동의 */}
      {currentStep === 1 && (
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>약관동의</h2>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>이용약관 (필수)</h3>
            <textarea
              readOnly
              rows={6}
              style={{ width: '100%', resize: 'none', fontSize: '13px' }}
              value={`제1조 (목적)\n본 약관은 미디어로그(이하 "회사")가 제공하는 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.\n\n제2조 (이용계약의 성립)\n이용계약은 이용자의 이용신청에 대한 회사의 이용승낙과 이용자의 약관 내용에 대한 동의로 성립됩니다.\n\n제3조 (서비스의 제공)\n회사는 이용자에게 아래와 같은 서비스를 제공합니다.\n1. 회원 관리 서비스\n2. 게시판 서비스\n3. 기타 회사가 정하는 서비스`}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={termsAgreement}
                onChange={(e) => setTermsAgreement(e.target.checked)}
              />
              이용약관에 동의합니다.
            </label>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>개인정보 수집 및 이용 동의 (필수)</h3>
            <textarea
              readOnly
              rows={6}
              style={{ width: '100%', resize: 'none', fontSize: '13px' }}
              value={`1. 수집 항목: 이름, 생년월일, 이메일, 전화번호\n2. 수집 목적: 회원 관리, 서비스 제공\n3. 보유 기간: 회원 탈퇴 시까지\n\n귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.\n다만, 동의를 거부할 경우 회원가입이 제한됩니다.`}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={privacyAgreement}
                onChange={(e) => setPrivacyAgreement(e.target.checked)}
              />
              개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>

          <div className="btn-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button type="button" className="btn-submit" onClick={handleStep1Next}>다음</button>
            <button type="button" className="btn-cancel" onClick={() => { setTermsAgreement(false); setPrivacyAgreement(false); }}>취소</button>
          </div>
        </div>
      )}

      {/* Step 02: 회원실명확인 */}
      {currentStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', alignSelf: 'flex-start' }}>실명확인</h2>

          <div style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="memberName" style={{ whiteSpace: 'nowrap', minWidth: '70px' }}>이름</label>
            <input
              id="memberName"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="이름을 입력하세요"
              disabled={identityVerified}
              style={{ flex: 1 }}
            />
          </div>

          <div style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="birthDate" style={{ whiteSpace: 'nowrap', minWidth: '70px' }}>생년월일</label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={identityVerified}
              style={{ flex: 1 }}
            />
          </div>

          {identityVerified && (
            <p style={{ color: '#4a90d9', fontWeight: 'bold', margin: '12px 0' }}>
              ✔ 실명인증이 완료되었습니다.
            </p>
          )}

          <div className="btn-group" style={{ marginTop: '16px' }}>
            {!identityVerified && (
              <button type="button" className="btn-submit" onClick={handleVerifyIdentity}>실명인증</button>
            )}
            <button type="button" className="btn-submit" onClick={handleStep2Next}>다음</button>
            <button type="button" className="btn-cancel" onClick={() => setCurrentStep(1)}>이전</button>
          </div>
        </div>
      )}

      {/* Step 03: 회원정보입력 */}
      {currentStep === 3 && (
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>회원정보입력</h2>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="regName" style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>이름</label>
            <input id="regName" value={memberName} disabled style={{ flex: 1 }} />
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="regBirth" style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>생년월일</label>
            <input id="regBirth" value={birthDate} disabled style={{ flex: 1 }} />
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="email" style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>이메일</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요" style={{ flex: 1 }} />
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="telephoneNumber" style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>전화번호</label>
            <input id="telephoneNumber" type="tel" value={telephoneNumber} onChange={(e) => setTelephoneNumber(e.target.value)} placeholder="전화번호를 입력하세요" style={{ flex: 1 }} />
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="password" style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>비밀번호</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" style={{ flex: 1 }} />
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="passwordConfirm" style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>비밀번호 확인</label>
            <input id="passwordConfirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호를 다시 입력하세요" style={{ flex: 1 }} />
          </div>

          <div className="btn-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-submit" onClick={handleRegister}>가입완료</button>
            <button type="button" className="btn-cancel" onClick={() => setCurrentStep(2)}>이전</button>
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
