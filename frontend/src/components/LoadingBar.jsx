import React from 'react';

/**
 * 공통 로딩바 컴포넌트.
 * 화면 전체를 덮는 오버레이 + 스피너를 표시한다.
 */
export default function LoadingBar({ message = '처리 중...' }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.3)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '48px', height: '48px', border: '5px solid #e0e0e0',
        borderTop: '5px solid #4a90d9', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ marginTop: '16px', color: '#fff', fontSize: '15px' }}>{message}</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
