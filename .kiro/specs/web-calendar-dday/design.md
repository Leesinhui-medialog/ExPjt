# 설계 문서: web-calendar-dday

## 개요

순수 HTML, CSS, JavaScript로 구현하는 웹 캘린더 애플리케이션이다.
단일 HTML 파일(또는 소수의 파일)로 구성되며, 외부 프레임워크 없이 DOM API와 localStorage만 사용한다.

주요 기능:
- 월별 캘린더 그리드 (이전/다음 달 이동, 오늘 날짜 강조)
- 날짜 클릭으로 일정 추가 및 삭제
- D-Day 사이드 패널 (D-N / D-Day / D+N 표시)
- 미니멀 UI

## 아키텍처

### 전체 구조

프레임워크 없이 MVC 패턴에 가까운 구조를 따른다.

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌──────────────────────┐  ┌───────────────────────┐│
│  │   Calendar (main)    │  │   DDay Widget (side)  ││
│  │  - 월/년 헤더         │  │  - D-Day 목록         ││
│  │  - 요일 헤더          │  │  - 추가 폼            ││
│  │  - 날짜 그리드        │  │  - 삭제 버튼          ││
│  └──────────────────────┘  └───────────────────────┘│
└─────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────┐
│                  app.js (로직)                       │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Calendar │  │  DDay    │  │   Storage          │ │
│  │ Module   │  │  Module  │  │   Module           │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────┐
│                  localStorage                        │
│   "wcd_events"  │  "wcd_ddays"                      │
└─────────────────────────────────────────────────────┘
```

### 파일 구성

```
web-calendar-dday/
├── index.html      # 마크업 구조
├── style.css       # 미니멀 스타일
└── app.js          # 전체 애플리케이션 로직
```

### 모듈 구성 (app.js 내부)

| 모듈 | 역할 |
|------|------|
| `StorageModule` | localStorage 읽기/쓰기/삭제 |
| `CalendarModule` | 달력 렌더링, 월 이동, 이벤트 표시 |
| `DDayModule` | D-Day 목록 렌더링, 날짜 계산, 항목 관리 |
| `App` | 모듈 초기화 및 이벤트 바인딩 |

## 컴포넌트 및 인터페이스

### StorageModule

```javascript
StorageModule = {
  // 이벤트 전체 로드 (날짜 키 → 이벤트 배열 맵)
  loadEvents()  → { [dateKey: string]: Event[] }

  // 이벤트 전체 저장
  saveEvents(events: { [dateKey: string]: Event[] }) → void

  // D-Day 전체 로드
  loadDDays()   → DDayItem[]

  // D-Day 전체 저장
  saveDDays(ddays: DDayItem[]) → void
}
```

- `dateKey` 형식: `"YYYY-MM-DD"` (예: `"2025-07-15"`)
- localStorage 키: `"wcd_events"`, `"wcd_ddays"`

### CalendarModule

```javascript
CalendarModule = {
  // 현재 표시 중인 연/월 상태
  currentYear: number,
  currentMonth: number,  // 0-indexed

  // 달력 그리드 전체 렌더링
  render() → void

  // 이전 달로 이동
  prevMonth() → void

  // 다음 달로 이동
  nextMonth() → void

  // 특정 날짜 셀에 이벤트 목록 렌더링
  renderEventsOnCell(dateKey: string, cell: HTMLElement) → void

  // 날짜 클릭 핸들러 (일정 추가 프롬프트)
  onDateClick(dateKey: string) → void

  // 이벤트 클릭 핸들러 (삭제 확인)
  onEventClick(dateKey: string, eventId: string, e: Event) → void
}
```

### DDayModule

```javascript
DDayModule = {
  // D-Day 목록 전체 렌더링
  render() → void

  // D-Day 날짜 계산
  // 반환: 양수 = D-N(미래), 0 = D-Day, 음수 = D+N(과거)
  calcDiff(targetDate: string) → number

  // D-Day 표시 문자열 생성
  formatDiff(diff: number) → string  // "D-3", "D-Day", "D+5"

  // 새 D-Day 항목 추가
  addItem(title: string, targetDate: string) → void

  // D-Day 항목 삭제
  deleteItem(id: string) → void
}
```

### 이벤트 흐름

```
사용자 클릭 (날짜 셀)
  → CalendarModule.onDateClick(dateKey)
    → prompt()로 제목 입력
    → StorageModule.saveEvents(...)
    → CalendarModule.render()

사용자 클릭 (D-Day 추가 버튼)
  → DDayModule.addItem(title, date)
    → StorageModule.saveDDays(...)
    → DDayModule.render()
```

## 데이터 모델

### Event (일정)

```typescript
interface Event {
  id: string;       // crypto.randomUUID() 또는 Date.now() 기반 고유 ID
  title: string;    // 일정 제목 (비어있지 않음)
}
```

localStorage 저장 구조 (`"wcd_events"`):

```json
{
  "2025-07-15": [
    { "id": "abc123", "title": "팀 미팅" }
  ],
  "2025-07-20": [
    { "id": "def456", "title": "생일" },
    { "id": "ghi789", "title": "저녁 약속" }
  ]
}
```

### DDayItem (D-Day 항목)

```typescript
interface DDayItem {
  id: string;         // 고유 ID
  title: string;      // D-Day 제목 (비어있지 않음)
  targetDate: string; // "YYYY-MM-DD" 형식
}
```

localStorage 저장 구조 (`"wcd_ddays"`):

```json
[
  { "id": "xyz001", "title": "프로젝트 마감", "targetDate": "2025-08-01" },
  { "id": "xyz002", "title": "생일", "targetDate": "2025-07-15" }
]
```

### D-Day 계산 로직

```
today = 오늘 날짜 (시간 제거, 자정 기준)
target = 목표 날짜 (자정 기준)
diff = (target - today) / (1000 * 60 * 60 * 24)  // 일 단위

diff > 0  → "D-{diff}"   (예: D-3)
diff == 0 → "D-Day"
diff < 0  → "D+{|diff|}" (예: D+5)
```

날짜 비교 시 시간대 오류를 방지하기 위해 `new Date(dateStr + "T00:00:00")`를 사용한다.


## 정확성 속성 (Correctness Properties)

*속성(Property)이란 시스템의 모든 유효한 실행에서 참이어야 하는 특성 또는 동작이다. 즉, 시스템이 무엇을 해야 하는지에 대한 형식적 명세이다. 속성은 사람이 읽을 수 있는 명세와 기계가 검증할 수 있는 정확성 보장 사이의 다리 역할을 한다.*

### Property 1: 달력 그리드 셀 수는 항상 7의 배수

*임의의* 연도와 월에 대해 달력을 렌더링했을 때, 생성된 날짜 셀의 총 수는 항상 7의 배수여야 한다.

**Validates: Requirements 1.1, 1.6**

---

### Property 2: 오늘 날짜 셀에 "today" 클래스 적용

*임의의* 연/월 렌더링에서, 오늘 날짜에 해당하는 셀에는 다른 셀과 구별되는 CSS 클래스(예: `today`)가 정확히 하나만 존재해야 한다.

**Validates: Requirements 1.2**

---

### Property 3: prevMonth/nextMonth 라운드트립

*임의의* 연/월 상태에서 `nextMonth()`를 호출한 후 `prevMonth()`를 호출하면, 연/월 상태가 원래 값으로 복원되어야 한다. 반대 순서도 동일하게 성립해야 한다.

**Validates: Requirements 1.3, 1.4**

---

### Property 4: 헤더에 현재 연/월 표시

*임의의* 연/월로 달력을 렌더링했을 때, 헤더 텍스트에 해당 연도와 월 정보가 포함되어야 한다.

**Validates: Requirements 1.5**

---

### Property 5: 비어있지 않은 제목으로 이벤트 추가 시 목록에 반영

*임의의* 날짜 키와 비어있지 않은 제목 문자열에 대해, 이벤트를 추가하면 해당 날짜의 이벤트 목록에 그 제목이 포함되어야 한다.

**Validates: Requirements 2.2, 2.3**

---

### Property 6: 공백 제목은 이벤트 생성 거부

*임의의* 공백 문자(스페이스, 탭, 개행 등)만으로 이루어진 문자열을 제목으로 제출하면, 이벤트 목록이 변경되지 않아야 한다.

**Validates: Requirements 2.5**

---

### Property 7: 이벤트 추가 후 삭제 라운드트립

*임의의* 날짜와 제목으로 이벤트를 추가한 후 해당 이벤트를 삭제하면, 해당 날짜의 이벤트 목록이 추가 이전 상태와 동일해야 한다.

**Validates: Requirements 2.4**

---

### Property 8: 이벤트 데이터 직렬화 라운드트립

*임의의* 이벤트 맵(날짜 키 → 이벤트 배열)을 `saveEvents()`로 저장한 후 `loadEvents()`로 불러오면, 원래 데이터와 동일한 구조와 내용이 반환되어야 한다.

**Validates: Requirements 3.1, 3.3**

---

### Property 9: D-Day 데이터 직렬화 라운드트립

*임의의* D-Day 항목 배열을 `saveDDays()`로 저장한 후 `loadDDays()`로 불러오면, 원래 배열과 동일한 내용이 반환되어야 한다.

**Validates: Requirements 3.2, 3.3**

---

### Property 10: 항목 삭제 후 localStorage에서 제거

*임의의* 이벤트 또는 D-Day 항목을 저장한 후 삭제하면, 이후 `loadEvents()` 또는 `loadDDays()` 호출 시 해당 항목이 반환되지 않아야 한다.

**Validates: Requirements 3.4, 3.5**

---

### Property 11: D-Day 추가 시 목록 길이 증가

*임의의* 유효한 제목과 날짜로 D-Day 항목을 추가하면, 목록의 길이가 정확히 1 증가해야 한다.

**Validates: Requirements 4.1, 4.3**

---

### Property 12: 유효하지 않은 D-Day 입력 거부

*임의의* 빈 제목 또는 날짜가 없는 D-Day 폼 제출에 대해, D-Day 목록이 변경되지 않아야 한다.

**Validates: Requirements 4.4**

---

### Property 13: D-Day 삭제 후 목록에서 제거

*임의의* D-Day 항목을 추가한 후 삭제하면, 해당 항목이 목록에서 사라지고 목록 길이가 원래대로 복원되어야 한다.

**Validates: Requirements 4.5**

---

### Property 14: D-Day 날짜 포맷 정확성

*임의의* 날짜 차이 값(diff)에 대해:
- diff > 0이면 `formatDiff(diff)`는 `"D-{diff}"` 형식을 반환해야 한다.
- diff < 0이면 `formatDiff(diff)`는 `"D+{|diff|}"` 형식을 반환해야 한다.
- diff == 0이면 `formatDiff(diff)`는 `"D-Day"`를 반환해야 한다.

**Validates: Requirements 5.1, 5.2, 5.3**

---

### Property 15: D-Day 계산은 현재 날짜 기준

*임의의* 목표 날짜와 모킹된 현재 날짜에 대해, `calcDiff(targetDate)`의 반환값은 `(target - today)`를 일 단위로 계산한 정수와 일치해야 한다.

**Validates: Requirements 5.4**

---

## 오류 처리

| 상황 | 처리 방법 |
|------|-----------|
| localStorage 읽기 실패 (JSON 파싱 오류) | `try/catch`로 감싸고 빈 기본값 반환 (`{}` 또는 `[]`) |
| 빈 이벤트 제목 제출 | 이벤트 생성 없이 조용히 무시 |
| 빈 D-Day 제목 또는 날짜 누락 | 항목 생성 없이 폼 유지 |
| 잘못된 날짜 문자열 | `isNaN(date.getTime())` 검사 후 거부 |
| localStorage 용량 초과 | `try/catch`로 감싸고 콘솔 경고 출력 |

## 테스트 전략

### 이중 테스트 접근법

단위 테스트와 속성 기반 테스트를 함께 사용한다. 두 방식은 상호 보완적이다.

- **단위 테스트**: 구체적인 예시, 엣지 케이스, 오류 조건 검증
- **속성 기반 테스트**: 임의의 입력에 대한 보편적 속성 검증

### 단위 테스트 대상

- `formatDiff(0)` → `"D-Day"` (예시 테스트)
- 앱 로드 시 localStorage에서 데이터 복원 (예시 테스트)
- D-Day 추가 버튼 클릭 시 폼 표시 (예시 테스트)
- 일요일 헤더 셀에 구별 클래스 적용 (예시 테스트)
- 날짜 셀 클릭 시 prompt 호출 (예시 테스트)

### 속성 기반 테스트 설정

**사용 라이브러리**: [fast-check](https://github.com/dubzzz/fast-check) (JavaScript용 속성 기반 테스트 라이브러리)

**테스트 실행 환경**: Vitest 또는 Jest + fast-check

각 속성 테스트는 최소 100회 반복 실행한다.

각 테스트에는 다음 형식의 태그 주석을 포함한다:
```
// Feature: web-calendar-dday, Property {번호}: {속성 설명}
```

**각 정확성 속성은 단일 속성 기반 테스트로 구현한다.**

### 속성 테스트 예시

```javascript
// Feature: web-calendar-dday, Property 3: prevMonth/nextMonth 라운드트립
fc.assert(
  fc.property(
    fc.integer({ min: 2000, max: 2099 }),
    fc.integer({ min: 0, max: 11 }),
    (year, month) => {
      const cal = createCalendar(year, month);
      cal.nextMonth();
      cal.prevMonth();
      return cal.currentYear === year && cal.currentMonth === month;
    }
  ),
  { numRuns: 100 }
);
```

```javascript
// Feature: web-calendar-dday, Property 14: D-Day 날짜 포맷 정확성
fc.assert(
  fc.property(
    fc.integer({ min: -9999, max: 9999 }),
    (diff) => {
      const result = formatDiff(diff);
      if (diff > 0) return result === `D-${diff}`;
      if (diff < 0) return result === `D+${Math.abs(diff)}`;
      return result === 'D-Day';
    }
  ),
  { numRuns: 100 }
);
```

```javascript
// Feature: web-calendar-dday, Property 8: 이벤트 데이터 직렬화 라운드트립
fc.assert(
  fc.property(
    fc.dictionary(
      fc.string({ minLength: 10, maxLength: 10 }), // YYYY-MM-DD 형식 근사
      fc.array(fc.record({ id: fc.uuid(), title: fc.string({ minLength: 1 }) }))
    ),
    (eventsMap) => {
      saveEvents(eventsMap);
      const loaded = loadEvents();
      return JSON.stringify(loaded) === JSON.stringify(eventsMap);
    }
  ),
  { numRuns: 100 }
);
```
