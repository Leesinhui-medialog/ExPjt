# 구현 계획: 위치 정보 표시 (location-display)

## 개요

전국 골프장 위치를 지도에 표시하고, 사용자의 현재 위치를 조회하여 역지오코딩 주소와 함께 표시하는 기능을 구현한다.
백엔드는 Spring Boot (Java 17), 프론트엔드는 React (Vite), 골프장 데이터는 Kakao 로컬 API로 수집하여 JSON 파일로 관리한다.

## 태스크

- [x] 1. 골프장 데이터 수집 스크립트 작성
  - [x] 1.1 `scripts/collect-golf-courses.js` Node.js 스크립트 생성
    - Kakao 로컬 API 키워드 검색("골프장")으로 전국 골프장 데이터를 수집한다
    - 수집 데이터: 골프장 이름, 위도, 경도, 주소, 지역, 유형(회원제/퍼블릭/회원제+퍼블릭)
    - 결과를 `src/main/resources/data/golf-courses.json` 파일로 저장한다
    - Kakao REST API 키는 환경변수(`KAKAO_REST_API_KEY`)로 주입한다
    - _요구사항: 7.8, 7.9_

- [x] 2. 백엔드 골프장 API 구현
  - [x] 2.1 `GolfCourse` POJO 클래스 생성 (`com.medialog.biz.golf`)
    - 필드: name, latitude, longitude, address, region, type
    - `@Getter`, `@Setter` 적용 (VO 클래스)
    - _요구사항: 7.7_
  - [x] 2.2 `GolfCourseService` 서비스 클래스 생성
    - `@PostConstruct`로 `golf-courses.json` 파일을 메모리에 로드한다
    - Jackson ObjectMapper로 JSON 파싱하여 `List<GolfCourse>`로 보관한다
    - 전체 목록 조회 메서드(`retrieveAll`)를 구현한다
    - 키워드 검색 메서드(`searchByKeyword`)를 구현한다 — 이름 또는 지역에 키워드 포함 여부로 필터링
    - _요구사항: 7.6, 7.7, 8.4_
  - [x] 2.3 `GolfCourseController` REST 컨트롤러 생성
    - `GET /api/golf-courses` — 전체 골프장 목록 반환
    - `GET /api/golf-courses/search?keyword={keyword}` — 키워드 검색 결과 반환
    - 세션 기반 인증 확인 (미인증 시 HTTP 401 반환)
    - _요구사항: 7.6, 8.4, 6.2_
  - [ ]* 2.4 `GolfCourseService` 단위 테스트 작성
    - JSON 로드 정상 동작 검증
    - 키워드 검색 필터링 검증 (이름 매칭, 지역 매칭, 빈 키워드 시 전체 반환)
    - _요구사항: 7.6, 7.7, 8.4, 8.7_

- [x] 3. 백엔드 역지오코딩 API 구현
  - [x] 3.1 `LocationService` 서비스 클래스 생성 (`com.medialog.biz.golf`)
    - Nominatim 역지오코딩 API를 호출하여 위도·경도를 주소 문자열로 변환한다
    - `RestTemplate` 또는 `WebClient`를 사용하여 외부 API를 호출한다
    - 변환 실패 시 빈 문자열 또는 에러 메시지를 반환한다
    - _요구사항: 3.3, 3.4_
  - [x] 3.2 `LocationController` REST 컨트롤러 생성
    - `GET /api/location/reverse-geocode?lat={lat}&lng={lng}` — 주소 문자열을 JSON으로 반환
    - 세션 기반 인증 확인 (미인증 시 HTTP 401 반환)
    - _요구사항: 3.3, 6.2_
  - [ ]* 3.3 `LocationService` 단위 테스트 작성
    - 정상 응답 시 주소 반환 검증
    - 외부 API 실패 시 에러 처리 검증
    - _요구사항: 3.3, 3.4_

- [x] 4. 체크포인트 — 백엔드 API 검증
  - 모든 테스트가 통과하는지 확인하고, 문제가 있으면 사용자에게 문의한다.

- [x] 5. 프론트엔드 의존성 설치 및 설정
  - [x] 5.1 `react-leaflet`, `leaflet` 패키지 설치
    - `frontend/package.json`에 `react-leaflet`, `leaflet` 의존성을 추가한다
    - _요구사항: 4.1, 4.2_

- [x] 6. 프론트엔드 API 함수 추가
  - [x] 6.1 `frontend/src/api.js`에 골프장 및 위치 API 호출 함수 추가
    - `fetchGolfCourses()` — `GET /api/golf-courses`
    - `searchGolfCourses(keyword)` — `GET /api/golf-courses/search?keyword={keyword}`
    - `reverseGeocode(lat, lng)` — `GET /api/location/reverse-geocode?lat={lat}&lng={lng}`
    - _요구사항: 3.1, 7.1, 8.3_

- [x] 7. LocationDisplay.jsx 페이지 컴포넌트 구현
  - [x] 7.1 `frontend/src/pages/golf/LocationDisplay.jsx` 생성
    - 페이지 로드 시 `navigator.geolocation`으로 현재 위치를 조회한다
    - 위도·경도를 텍스트로 표시하고, 역지오코딩 API를 호출하여 주소를 표시한다
    - 로딩 중 "위치 정보를 조회 중입니다" 메시지를 표시한다
    - 위치 권한 거부 시 "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요." 메시지를 표시한다
    - Geolocation 미지원 시 "이 브라우저는 위치 정보를 지원하지 않습니다." 메시지를 표시한다
    - "위치 새로고침" 버튼을 제공하여 위치를 재조회한다
    - _요구사항: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.4, 5.1, 5.2, 5.3_
  - [x] 7.2 react-leaflet 지도 영역 구현
    - 현재 위치를 중심으로 지도를 표시한다 (너비 100%, 높이 400px)
    - 현재 위치에 마커를 표시하고, 클릭 시 주소 정보 팝업을 연다
    - 골프장 API를 호출하여 전체 골프장 마커를 지도에 표시한다
    - 골프장 유형별 마커 색상: 회원제(파란색), 퍼블릭(초록색), 회원제+퍼블릭(오렌지색)
    - 골프장 마커 클릭 시 골프장 이름, 주소, "길찾기" 버튼 팝업을 표시한다
    - 골프장 API 실패 시 "골프장 정보를 불러올 수 없습니다." 메시지를 표시한다
    - _요구사항: 4.1, 4.2, 4.3, 4.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.8, 7.9_
  - [x] 7.3 네이버 길찾기 연동 구현
    - 골프장 마커 팝업의 "길찾기" 버튼 클릭 시 네이버 지도 길찾기를 새 탭으로 연다
    - URL 형식: `https://map.naver.com/p/directions/{출발위도},{출발경도},{도착위도},{도착경도}/-/car`
    - 현재 위치 미조회 상태에서 클릭 시 "현재 위치를 먼저 조회해 주세요." 메시지를 표시한다
    - _요구사항: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 8. SearchPanel.jsx 검색 패널 컴포넌트 구현
  - [x] 8.1 `frontend/src/pages/golf/SearchPanel.jsx` 생성
    - 지도 위에 position absolute로 좌측에 오버레이 배치, 반투명 배경 적용
    - 골프장 이름 또는 지역 검색 입력 필드를 제공한다
    - 검색어 입력 시 골프장 검색 API를 호출하여 결과 목록을 표시한다
    - 검색어가 비어 있으면 전체 골프장 목록을 표시한다
    - 검색 결과가 없으면 "검색 결과가 없습니다." 메시지를 표시한다
    - 하단에 범례를 표시한다 (파란색: 회원제, 초록색: 퍼블릭, 오렌지색: 회원제+퍼블릭)
    - _요구사항: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
  - [x] 8.2 검색 결과 선택 시 지도 이동 및 마커 강조 구현
    - 검색 결과 항목 클릭 시 해당 골프장 위치로 지도를 이동한다 (줌 레벨 15 이상)
    - 해당 골프장 마커를 강조하고 팝업을 자동으로 연다
    - _요구사항: 9.1, 9.2, 9.3, 9.4_

- [x] 9. 라우트 및 메뉴 연동
  - [x] 9.1 `frontend/src/components/LeftMenu.jsx` 수정
    - menus 배열에 "위치관리" 메뉴 그룹을 추가한다 (아이콘: 📍)
    - 하위 메뉴로 "위치 정보" 항목을 추가한다 (경로: `/location/display`)
    - 현재 경로가 `/location/display`일 때 활성 상태로 표시한다
    - _요구사항: 1.1, 1.2, 1.3_
  - [x] 9.2 `frontend/src/App.jsx` 수정
    - `LocationDisplay` 컴포넌트를 import한다
    - `/location/display` 경로에 `ProtectedRoute`로 감싼 라우트를 추가한다
    - `PAGE_TITLES`에 `/location/display` 항목을 추가한다
    - _요구사항: 1.2, 6.1_

- [x] 10. 체크포인트 — 전체 통합 검증
  - 모든 테스트가 통과하는지 확인하고, 문제가 있으면 사용자에게 문의한다.

## 참고

- `*` 표시된 태스크는 선택 사항이며, 빠른 MVP를 위해 건너뛸 수 있다
- 각 태스크는 특정 요구사항을 참조하여 추적 가능하다
- 체크포인트에서 점진적 검증을 수행한다
- 골프장 데이터 수집 스크립트는 1회성 실행이며, 생성된 JSON 파일을 리소스에 포함한다
