import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 공통 좌측 메뉴 컴포넌트.
 * 상단에 로그인 사용자 정보, 하단에 네비게이션 메뉴를 표시한다.
 * 각 메뉴는 접기/펼치기(아코디언) 기능을 제공한다.
 */
export default function LeftMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginInfo, setLoginInfo] = useState({ loggedIn: false, memberName: '', email: '' });
  const [openMenus, setOpenMenus] = useState({});

  /* 로그인 상태 조회 */
  useEffect(() => {
    fetch('/api/login/check', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setLoginInfo(data))
      .catch(() => setLoginInfo({ loggedIn: false, memberName: '', email: '' }));
  }, [location.pathname]);

  /** 메뉴 접기/펼치기 토글 */
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /** 메뉴 항목 정의 */
  const menus = [
    {
      key: 'main',
      icon: '🏠',
      label: '관리자 메인',
      path: '/board/list',
    },
    {
      key: 'settings',
      icon: '⚙️',
      label: '환경설정',
      children: [
        { label: '개인정보 변경', path: '/member/edit' },
        { label: '비밀번호 변경', path: '/member/password' },
      ],
    },
    {
      key: 'member',
      icon: '👤',
      label: '회원관리',
      children: [
        { label: '회원 목록', path: '/member/list' },
        { label: '회원 가입', path: '/member/register' },
      ],
    },
    {
      key: 'board',
      icon: '📋',
      label: '게시판관리',
      children: [
        { label: '게시판 목록', path: '/board/list' },
        { label: '게시글 작성', path: '/board/write' },
      ],
    },
  ];

  /** 현재 경로가 해당 메뉴에 속하는지 확인 */
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={styles.sidebar}>
      {/* 상단 사용자 정보 영역 */}
      <div style={styles.userArea}>
        <div style={styles.avatar}>👤</div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{loginInfo.memberName || '게스트'}</div>
          <div style={styles.userEmail}>{loginInfo.email || ''}</div>
        </div>
      </div>

      {/* 구분선 */}
      <div style={styles.divider} />

      {/* 네비게이션 라벨 */}
      <div style={styles.navLabel}>NAVIGATION</div>

      {/* 메뉴 목록 */}
      <nav>
        {menus.map((menu) => (
          <div key={menu.key}>
            {/* 메뉴 헤더 */}
            <div
              style={{
                ...styles.menuItem,
                ...(menu.path && isActive(menu.path) ? styles.menuItemActive : {}),
                fontWeight: 'bold',
              }}
              onClick={() => {
                if (menu.children) {
                  toggleMenu(menu.key);
                } else if (menu.path) {
                  navigate(menu.path);
                }
              }}
            >
              <span style={styles.menuIcon}>{menu.icon}</span>
              <span style={styles.menuLabel}>{menu.label}</span>
              {menu.children && (
                <span style={styles.arrow}>{openMenus[menu.key] ? '▲' : '▼'}</span>
              )}
            </div>

            {/* 하위 메뉴 */}
            {menu.children && openMenus[menu.key] && (
              <div style={styles.subMenu}>
                {menu.children.map((child) => (
                  <div
                    key={child.path}
                    style={{
                      ...styles.subMenuItem,
                      ...(isActive(child.path) ? styles.subMenuItemActive : {}),
                    }}
                    onClick={() => navigate(child.path)}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

/** 스타일 정의 */
const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 16px',
    backgroundColor: '#111',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    border: '2px solid #777',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '17px',
    color: '#fff',
  },
  userEmail: {
    fontSize: '13px',
    color: '#aaa',
  },
  divider: {
    height: '1px',
    backgroundColor: '#222',
  },
  navLabel: {
    padding: '16px 16px 8px',
    fontSize: '13px',
    color: '#f0a500',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background 0.2s',
    borderBottom: '1px solid #222',
  },
  menuItemActive: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  menuIcon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  menuLabel: {
    flex: 1,
  },
  arrow: {
    fontSize: '12px',
    color: '#888',
  },
  subMenu: {
    backgroundColor: '#111',
  },
  subMenuItem: {
    padding: '10px 16px 10px 42px',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '15px',
    borderBottom: '1px solid #222',
    transition: 'background 0.2s',
  },
  subMenuItemActive: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
};
