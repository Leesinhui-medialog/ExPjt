import { useState, useEffect, useRef, useCallback } from 'react';
import { searchGolfCourses } from '../../api';

/**
 * 골프장 검색 패널 컴포넌트
 * - 지도 위에 오버레이로 좌측에 배치
 * - 골프장 이름/지역 검색 및 결과 목록 표시
 * - 하단 범례 표시
 */
export default function SearchPanel({ golfCourses, onSelectCourse }) {
  // 검색어
  const [keyword, setKeyword] = useState('');
  // 검색 결과 목록
  const [results, setResults] = useState([]);
  // 검색 로딩 상태
  const [searching, setSearching] = useState(false);
  // 디바운스 타이머 참조
  const debounceRef = useRef(null);

  /** 검색어가 비어 있으면 전체 골프장 목록을 표시한다 */
  useEffect(() => {
    if (!keyword.trim()) {
      setResults(golfCourses || []);
    }
  }, [keyword, golfCourses]);

  /** 검색어 변경 시 디바운스(300ms) 적용하여 API 호출 */
  const handleSearch = useCallback((value) => {
    setKeyword(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = value.trim();
    if (!trimmed) {
      setResults(golfCourses || []);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchGolfCourses(trimmed);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      }
      setSearching(false);
    }, 300);
  }, [golfCourses]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div style={styles.panel}>
      {/* 범례 (상단) */}
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: '#2196F3' }} />
          회원제
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: '#28a745' }} />
          퍼블릭
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: '#ff8c00' }} />
          회원제+퍼블릭
        </span>
      </div>

      {/* 골프장 수 표시 */}
      <div style={styles.countInfo}>
        전체 {golfCourses?.length || 0}개 / 검색 {results.length}개
      </div>

      {/* 검색 입력 필드 */}
      <input
        type="text"
        placeholder="골프장 이름 또는 지역 검색"
        value={keyword}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.input}
      />

      {/* 검색 결과 목록 */}
      <div style={styles.listContainer}>
        {searching && (
          <p style={styles.statusMsg}>검색 중...</p>
        )}

        {!searching && results.length === 0 && (
          <p style={styles.statusMsg}>검색 결과가 없습니다.</p>
        )}

        {!searching && results.map((course, idx) => (
          <div
            key={course.name + '-' + idx}
            style={styles.item}
            onClick={() => onSelectCourse && onSelectCourse(course)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f4ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={styles.itemName}>
              <span style={{
                ...styles.dot,
                backgroundColor: getDotColor(course.type),
              }} />
              {course.name}
            </span>
            <span style={styles.itemAddr}>{course.address}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 골프장 유형에 따른 점 색상 반환 */
function getDotColor(type) {
  if (type === '회원제+퍼블릭' || type === '회원제/퍼블릭') return '#ff8c00';
  if (type === '퍼블릭') return '#28a745';
  return '#2196F3';
}

/** 인라인 스타일 정의 */
const styles = {
  panel: {
    position: 'absolute',
    left: '10px',
    top: '10px',
    bottom: '10px',
    zIndex: 1000,
    width: '300px',
    background: 'rgba(255,255,255,0.92)',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '8px',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  statusMsg: {
    color: '#888',
    fontSize: '0.85rem',
    textAlign: 'center',
    padding: '16px 0',
    margin: 0,
  },
  item: {
    padding: '8px 6px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    borderRadius: '4px',
    transition: 'background-color 0.15s',
  },
  itemName: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  itemAddr: {
    fontSize: '0.78rem',
    color: '#777',
    paddingLeft: '16px',
  },
  dot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee',
    flexShrink: 0,
  },
  countInfo: {
    fontSize: '0.8rem',
    color: '#555',
    textAlign: 'center',
    flexShrink: 0,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: '#555',
  },
  legendDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.15)',
  },
};
