import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 회원 목록 페이지.
 * 등록된 회원 목록을 테이블 형태로 표시한다.
 */
export default function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  /** 회원 목록 조회 */
  useEffect(() => {
    fetch('/api/member/list')
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error('회원 목록 조회 실패:', error));
  }, []);

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h1>회원 목록</h1>

      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>생년월일</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                등록된 회원이 없습니다.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.memberIndex}>
                <td>{member.memberIndex}</td>
                <td>{member.memberName}</td>
                <td>{member.email}</td>
                <td>{member.telephoneNumber}</td>
                <td>{member.birthDate}</td>
                <td>{member.registrationDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        <button type="button" className="btn-submit" onClick={() => navigate('/member/register')}>
          회원가입
        </button>
        <button type="button" className="btn-submit" onClick={() => navigate('/login')}>
          로그인
        </button>
      </div>
    </div>
  );
}
