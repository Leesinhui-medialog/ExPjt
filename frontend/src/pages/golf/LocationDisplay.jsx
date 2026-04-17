import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode, fetchGolfCourses } from '../../api';
import SearchPanel from './SearchPanel';

/* ========================================
 * Leaflet 기본 마커 아이콘 수정 (Vite 호환)
 * Vite에서 Leaflet 기본 아이콘 경로가 깨지는 문제를 해결한다
 * ======================================== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ========================================
 * 골프장 유형별 원형 마커 아이콘 생성 함수
 * - 회원제: 파란색
 * - 퍼블릭: 초록색
 * - 회원제+퍼블릭: 오렌지색
 * ======================================== */
function createCircleIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

/** 골프장 유형에 따른 마커 색상 반환 */
function getGolfIcon(type) {
  if (type === '회원제+퍼블릭' || type === '회원제/퍼블릭') return createCircleIcon('#ff8c00');
  if (type === '퍼블릭') return createCircleIcon('#28a745');
  return createCircleIcon('#2196F3'); // 회원제 (기본)
}

/** 현재 위치 마커 아이콘 (빨간색) */
const currentLocationIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#e05252;border:3px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
});

/* ========================================
 * 지도 중심 이동 컴포넌트
 * position이 변경되면 지도 중심을 해당 좌표로 이동한다
 * ======================================== */
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, DEFAULT_ZOOM);
    }
  }, [center, map]);
  return null;
}

/* ========================================
 * 지도 인스턴스 참조 컴포넌트
 * mapRef에 지도 인스턴스를 저장하여 외부에서 접근 가능하게 한다
 * ======================================== */
function MapRefSetter({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  return null;
}

/* ========================================
 * 서울 시청 기본 좌표 및 반경 30km 줌 레벨
 * Leaflet 줌 레벨 11 ≈ 반경 약 30km 표시
 * ======================================== */
const DEFAULT_CENTER = [37.5666, 126.9784];
const DEFAULT_ZOOM = 11;

/**
 * 위치 정보 표시 페이지
 * - 브라우저 Geolocation API로 현재 위치를 조회한다
 * - 역지오코딩 API를 호출하여 주소를 표시한다
 * - react-leaflet 지도에 현재 위치 및 골프장 마커를 표시한다
 * - 골프장 유형별 마커 색상을 구분한다
 */
export default function LocationDisplay() {
  // 현재 위치 (위도, 경도)
  const [position, setPosition] = useState(null);
  // 역지오코딩 주소
  const [address, setAddress] = useState('');
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 에러 메시지
  const [error, setError] = useState('');
  // 골프장 목록
  const [golfCourses, setGolfCourses] = useState([]);
  // 골프장 API 에러 메시지
  const [golfError, setGolfError] = useState('');
  // 선택된 골프장 (태스크 8에서 사용)
  const [selectedCourse, setSelectedCourse] = useState(null);
  // 지도 인스턴스 참조 (태스크 7.3, 8에서 사용)
  const mapRef = useRef(null);
  // 골프장 마커 참조 맵 (외부에서 팝업 열기용)
  const markerRefs = useRef({});

  /** 현재 위치를 조회하고 역지오코딩을 수행한다 */
  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError('');
    setAddress('');

    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      setPosition({ latitude: DEFAULT_CENTER[0], longitude: DEFAULT_CENTER[1] });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });

        try {
          const data = await reverseGeocode(latitude, longitude);
          if (data && data.address) {
            setAddress(data.address);
          } else {
            setAddress('주소 정보를 가져올 수 없습니다.');
          }
        } catch {
          setAddress('주소 정보를 가져올 수 없습니다.');
        }

        setLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.');
        } else {
          setError('위치 정보를 가져올 수 없습니다.');
        }
        /* 위치 조회 실패 시 서울 시청 기본 좌표로 초기화 */
        setPosition({ latitude: DEFAULT_CENTER[0], longitude: DEFAULT_CENTER[1] });
        setLoading(false);
      }
    );
  }, []);

  /** 골프장 목록을 API에서 조회한다 */
  const loadGolfCourses = useCallback(async () => {
    try {
      const data = await fetchGolfCourses();
      setGolfCourses(Array.isArray(data) ? data : []);
      setGolfError('');
    } catch {
      setGolfError('골프장 정보를 불러올 수 없습니다.');
      setGolfCourses([]);
    }
  }, []);

  // 페이지 로드 시 위치 조회 및 골프장 목록 로드
  useEffect(() => {
    fetchLocation();
    loadGolfCourses();
  }, [fetchLocation, loadGolfCourses]);

  // 지도 중심 좌표 계산
  const mapCenter = position
    ? [position.latitude, position.longitude]
    : DEFAULT_CENTER;

  return (
    <div className="container-wide">
      <h1>위치 정보</h1>

      {/* 위치 정보 영역 */}
      <div style={styles.infoCard}>
        <div style={styles.infoHeader}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>📍 현재 위치</span>
          <button
            type="button"
            className="btn-submit"
            onClick={fetchLocation}
            disabled={loading}
            style={styles.refreshBtn}
          >
            위치 새로고침
          </button>
        </div>

        {loading && (
          <p style={styles.statusMsg}>위치 정보를 조회 중입니다</p>
        )}

        {!loading && error && (
          <p style={styles.errorMsg}>{error}</p>
        )}

        {!loading && !error && position && (
          <div style={styles.infoBody}>
            <p style={styles.coordText}>
              위도: {position.latitude.toFixed(6)} / 경도: {position.longitude.toFixed(6)}
            </p>
            <p style={styles.addressText}>
              주소: {address || '조회 중...'}
            </p>
          </div>
        )}
      </div>

      {/* 골프장 API 에러 메시지 */}
      {golfError && (
        <p style={styles.errorMsg}>{golfError}</p>
      )}

      {/* react-leaflet 지도 영역 */}
      <div style={styles.mapContainer}>
        {/* 골프장 검색 패널 (지도 위 오버레이) */}
        <SearchPanel
          golfCourses={golfCourses}
          onSelectCourse={(course) => {
            if (!course) return;

            // 선택된 골프장 상태 업데이트
            setSelectedCourse(course);

            // 해당 골프장 위치로 지도 이동 (현재 줌 레벨 유지)
            if (mapRef.current) {
              mapRef.current.setView([course.latitude, course.longitude], mapRef.current.getZoom());
            }

            // 해당 골프장 마커를 찾아 팝업 열기
            const markerKey = Object.keys(markerRefs.current).find(
              (key) => key.startsWith(course.name + '-')
            );
            if (markerKey && markerRefs.current[markerKey]) {
              markerRefs.current[markerKey].openPopup();
            }
          }}
        />
        <MapContainer
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          style={{ width: '100%', height: '700px' }}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          {/* 줌 컨트롤을 오른쪽 하단에 배치 */}
          <ZoomControl position="bottomright" />
          {/* 지도 인스턴스 참조 저장 */}
          <MapRefSetter mapRef={mapRef} />
          {/* 위치 변경 시 지도 중심 이동 */}
          <MapCenterUpdater center={mapCenter} />

          {/* VWorld 타일 레이어 (국토교통부 제공, 한글 지명 지원) */}
          <TileLayer
            attribution='&copy; <a href="https://www.vworld.kr">VWorld</a>'
            url="https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png"
          />

          {/* 현재 위치 마커 */}
          {position && (
            <Marker
              position={[position.latitude, position.longitude]}
              icon={currentLocationIcon}
            >
              <Popup>
                <div style={styles.popupContent}>
                  <strong>📍 현재 위치</strong>
                  <p style={styles.popupText}>{address || '주소 조회 중...'}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 골프장 마커 */}
          {golfCourses.map((course, idx) => (
            <Marker
              key={course.name + '-' + idx}
              position={[course.latitude, course.longitude]}
              icon={getGolfIcon(course.type)}
              ref={(ref) => {
                if (ref) markerRefs.current[course.name + '-' + idx] = ref;
              }}
              eventHandlers={{
                click: () => setSelectedCourse(course),
              }}
            >
              <Popup>
                <div style={styles.popupContent}>
                  <strong>⛳ {course.name}</strong>
                  <p style={styles.popupText}>📍 {course.address}</p>
                  <p style={styles.popupText}>🏷️ 유형: {course.type} | 지역: {course.region}</p>
                  <button
                    type="button"
                    className="btn-submit"
                    style={styles.directionBtn}
                    onClick={() => {
                      if (!position) {
                        alert('현재 위치를 먼저 조회해 주세요.');
                        return;
                      }
                      const url = `https://map.naver.com/p/directions/${position.latitude},${position.longitude},${course.latitude},${course.longitude}/-/car`;
                      window.open(url, '_blank');
                    }}
                  >
                    🧭 길찾기
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

/** 인라인 스타일 정의 */
const styles = {
  infoCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#fff',
  },
  infoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  refreshBtn: {
    padding: '6px 16px',
    fontSize: '0.85rem',
  },
  statusMsg: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '8px 0',
  },
  errorMsg: {
    color: '#e05252',
    fontSize: '0.9rem',
    margin: '8px 0',
  },
  infoBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  coordText: {
    fontSize: '0.9rem',
    color: '#333',
    margin: '4px 0',
  },
  addressText: {
    fontSize: '0.9rem',
    color: '#555',
    margin: '4px 0',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
  },
  popupContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '160px',
  },
  popupText: {
    fontSize: '0.85rem',
    color: '#555',
    margin: '2px 0',
  },
  directionBtn: {
    padding: '4px 12px',
    fontSize: '0.8rem',
    marginTop: '4px',
    cursor: 'pointer',
  },
};
