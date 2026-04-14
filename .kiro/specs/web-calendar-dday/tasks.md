# 구현 계획: web-calendar-dday

## 개요

순수 HTML/CSS/JavaScript로 월별 캘린더와 D-Day 위젯을 구현한다.
StorageModule → DDayModule → CalendarModule 순서로 핵심 로직을 구축하고, 마지막에 App 초기화로 연결한다.
Vitest + fast-check를 사용한 속성 기반 테스트를 각 모듈 구현 직후에 배치한다.

## Tasks

- [x] 1. 프로젝트 기본 구조 및 HTML 마크업 작성
  - `index.html` 생성: 캘린더 영역(`.calendar-container`)과 D-Day 사이드 패널(`.dday-container`) 레이아웃 마크업
  - 월/년 헤더, 이전/다음 달 버튼, 요일 헤더(일~토), 날짜 그리드 컨테이너 포함
  - D-Day 위젯: 목록 컨테이너, 추가 폼(제목 입력, 날짜 입력, 제출 버튼) 포함
  - `style.css`, `app.js` 파일 빈 파일로 생성
  - _Requirements: 1.1, 1.5, 4.1, 4.2, 6.2_

- [x] 2. style.css - 미니멀 UI 스타일 구현
  - 전체 레이아웃: 캘린더와 D-Day 패널을 나란히 배치하는 flex 레이아웃
  - 캘린더 그리드: 7열 CSS Grid, 날짜 셀 기본 스타일
  - `.today` 클래스: 오늘 날짜 시각적 강조 스타일
  - 날짜 셀 hover 효과, 일요일 헤더 구별 색상
  - D-Day 패널 스타일, 이벤트 태그 스타일
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. StorageModule 구현
  - [x] 3.1 `app.js`에 `StorageModule` 객체 구현
    - `loadEvents()`: `"wcd_events"` 키에서 JSON 파싱, 실패 시 `{}` 반환
    - `saveEvents(events)`: 이벤트 맵을 JSON 직렬화하여 저장
    - `loadDDays()`: `"wcd_ddays"` 키에서 JSON 파싱, 실패 시 `[]` 반환
    - `saveDDays(ddays)`: D-Day 배열을 JSON 직렬화하여 저장
    - 모든 읽기/쓰기는 `try/catch`로 감싸 오류 처리
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 3.2 Property 8: 이벤트 데이터 직렬화 라운드트립 속성 테스트 작성
    - **Property 8: 이벤트 데이터 직렬화 라운드트립**
    - **Validates: Requirements 3.1, 3.3**
    - `tests/storage.test.js` 파일 생성, Vitest + fast-check 설정

  - [ ]* 3.3 Property 9: D-Day 데이터 직렬화 라운드트립 속성 테스트 작성
    - **Property 9: D-Day 데이터 직렬화 라운드트립**
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 3.4 Property 10: 항목 삭제 후 localStorage에서 제거 속성 테스트 작성
    - **Property 10: 항목 삭제 후 localStorage에서 제거**
    - **Validates: Requirements 3.4, 3.5**

- [x] 4. DDayModule 구현
  - [x] 4.1 `calcDiff(targetDate)` 함수 구현
    - `new Date(targetDate + "T00:00:00")`으로 파싱하여 시간대 오류 방지
    - 오늘 자정 기준으로 일 단위 차이 계산 후 정수 반환
    - 잘못된 날짜 문자열은 `isNaN` 검사 후 `null` 반환
    - _Requirements: 5.4_

  - [ ]* 4.2 Property 15: D-Day 계산 정확성 속성 테스트 작성
    - **Property 15: D-Day 계산은 현재 날짜 기준**
    - **Validates: Requirements 5.4**
    - `tests/dday.test.js` 파일 생성

  - [x] 4.3 `formatDiff(diff)` 함수 구현
    - `diff > 0` → `"D-{diff}"`, `diff === 0` → `"D-Day"`, `diff < 0` → `"D+{Math.abs(diff)}"`
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 4.4 Property 14: D-Day 날짜 포맷 정확성 속성 테스트 작성
    - **Property 14: D-Day 날짜 포맷 정확성**
    - **Validates: Requirements 5.1, 5.2, 5.3**

  - [x] 4.5 `DDayModule` 객체 구현 (목록 관리)
    - `addItem(title, targetDate)`: 유효성 검사(빈 제목, 날짜 누락) 후 `crypto.randomUUID()`로 ID 생성, StorageModule에 저장
    - `deleteItem(id)`: 해당 ID 항목 제거 후 StorageModule에 저장
    - `render()`: D-Day 목록 DOM 렌더링, 각 항목에 `formatDiff(calcDiff(...))` 결과 표시 및 삭제 버튼 바인딩
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3_

  - [ ]* 4.6 Property 11: D-Day 추가 시 목록 길이 증가 속성 테스트 작성
    - **Property 11: D-Day 추가 시 목록 길이 증가**
    - **Validates: Requirements 4.1, 4.3**

  - [ ]* 4.7 Property 12: 유효하지 않은 D-Day 입력 거부 속성 테스트 작성
    - **Property 12: 유효하지 않은 D-Day 입력 거부**
    - **Validates: Requirements 4.4**

  - [ ]* 4.8 Property 13: D-Day 삭제 후 목록에서 제거 속성 테스트 작성
    - **Property 13: D-Day 삭제 후 목록에서 제거**
    - **Validates: Requirements 4.5**

- [x] 5. 체크포인트 - 모든 테스트 통과 확인
  - 모든 테스트가 통과하는지 확인하고, 문제가 있으면 사용자에게 질문한다.

- [x] 6. CalendarModule 구현
  - [x] 6.1 달력 그리드 생성 로직 구현
    - `currentYear`, `currentMonth` 상태 초기화 (오늘 날짜 기준)
    - 해당 월의 1일 요일과 마지막 날짜를 계산하여 날짜 셀 배열 생성
    - 첫 주 앞쪽과 마지막 주 뒤쪽을 이전/다음 달 날짜로 채워 7의 배수 셀 수 보장
    - _Requirements: 1.1, 1.6_

  - [ ]* 6.2 Property 1: 달력 그리드 셀 수는 항상 7의 배수 속성 테스트 작성
    - **Property 1: 달력 그리드 셀 수는 항상 7의 배수**
    - **Validates: Requirements 1.1, 1.6**
    - `tests/calendar.test.js` 파일 생성

  - [x] 6.3 `render()` 함수 구현
    - 헤더에 `{year}년 {month}월` 텍스트 업데이트
    - 날짜 셀 생성 및 DOM 렌더링, 오늘 날짜 셀에 `today` 클래스 적용
    - 각 셀에 저장된 이벤트 태그 렌더링 (`renderEventsOnCell`)
    - _Requirements: 1.2, 1.5, 2.3_

  - [ ]* 6.4 Property 2: 오늘 날짜 셀에 "today" 클래스 적용 속성 테스트 작성
    - **Property 2: 오늘 날짜 셀에 "today" 클래스 적용**
    - **Validates: Requirements 1.2**

  - [ ]* 6.5 Property 4: 헤더에 현재 연/월 표시 속성 테스트 작성
    - **Property 4: 헤더에 현재 연/월 표시**
    - **Validates: Requirements 1.5**

  - [x] 6.6 `prevMonth()` / `nextMonth()` 구현
    - 월 경계(0월 → 11월, 11월 → 0월) 처리 및 연도 변경 포함
    - 호출 후 `render()` 실행
    - _Requirements: 1.3, 1.4_

  - [ ]* 6.7 Property 3: prevMonth/nextMonth 라운드트립 속성 테스트 작성
    - **Property 3: prevMonth/nextMonth 라운드트립**
    - **Validates: Requirements 1.3, 1.4**

  - [x] 6.8 `onDateClick(dateKey)` 구현
    - `prompt()`로 이벤트 제목 입력 받기
    - 빈 문자열 또는 공백만 있는 경우 이벤트 생성 안 함
    - 유효한 제목이면 `crypto.randomUUID()`로 ID 생성 후 StorageModule에 저장, `render()` 호출
    - _Requirements: 2.1, 2.2, 2.5_

  - [ ]* 6.9 Property 5: 비어있지 않은 제목으로 이벤트 추가 시 목록에 반영 속성 테스트 작성
    - **Property 5: 비어있지 않은 제목으로 이벤트 추가 시 목록에 반영**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 6.10 Property 6: 공백 제목은 이벤트 생성 거부 속성 테스트 작성
    - **Property 6: 공백 제목은 이벤트 생성 거부**
    - **Validates: Requirements 2.5**

  - [x] 6.11 `onEventClick(dateKey, eventId, e)` 구현
    - 이벤트 전파 중단 (`e.stopPropagation()`)
    - `confirm()`으로 삭제 확인 후 StorageModule에서 해당 이벤트 제거, `render()` 호출
    - _Requirements: 2.4_

  - [ ]* 6.12 Property 7: 이벤트 추가 후 삭제 라운드트립 속성 테스트 작성
    - **Property 7: 이벤트 추가 후 삭제 라운드트립**
    - **Validates: Requirements 2.4**

- [x] 7. 체크포인트 - 모든 테스트 통과 확인
  - 모든 테스트가 통과하는지 확인하고, 문제가 있으면 사용자에게 질문한다.

- [x] 8. App 초기화 및 모듈 연결
  - [x] 8.1 `App` 초기화 함수 구현
    - `DOMContentLoaded` 이벤트에서 `StorageModule`로 데이터 로드
    - `CalendarModule.render()`, `DDayModule.render()` 호출
    - 이전/다음 달 버튼에 이벤트 리스너 바인딩
    - D-Day 추가 폼 `submit` 이벤트 바인딩 (유효성 검사 포함)
    - _Requirements: 3.3, 4.2, 4.3, 4.4_

  - [x] 8.2 Vitest 설정 파일 및 테스트 환경 구성
    - `package.json` 생성: `vitest`, `fast-check`, `jsdom` 의존성 추가
    - `vitest.config.js` 생성: `jsdom` 환경 설정
    - _Requirements: (테스트 인프라)_

- [x] 9. 최종 체크포인트 - 전체 통합 확인
  - 모든 테스트가 통과하는지 확인하고, 문제가 있으면 사용자에게 질문한다.

## 참고

- `*` 표시된 서브태스크는 선택적 테스트 태스크로, MVP 구현 시 건너뛸 수 있다.
- 각 태스크는 이전 태스크의 결과물을 기반으로 하며, 고아 코드 없이 순차적으로 통합된다.
- 속성 기반 테스트는 fast-check의 `fc.assert` + `fc.property`를 사용하며, 각 테스트는 최소 100회 반복 실행한다.
- 테스트 파일 상단에 `// Feature: web-calendar-dday, Property {번호}: {설명}` 형식의 태그 주석을 포함한다.
