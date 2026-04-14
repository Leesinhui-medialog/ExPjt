# Requirements Document

## Introduction

순수 HTML, CSS, JavaScript로 구현하는 웹 캘린더 애플리케이션이다.
월별 뷰 캘린더와 D-Day 전용 위젯을 함께 제공하며, 간단한 일정 추가 기능을 포함한다.
모든 데이터는 localStorage에 저장되어 브라우저를 닫아도 유지된다.
UI는 미니멀하고 클린한 스타일을 따른다.

## Glossary

- **Calendar**: 월별 날짜 그리드를 표시하는 메인 컴포넌트
- **Event**: 특정 날짜에 연결된 간단한 일정 항목 (제목 포함)
- **DDay_Widget**: D-Day 항목을 별도로 관리하고 표시하는 사이드 패널 위젯
- **DDay**: 특정 목표 날짜까지 남은 일수 또는 경과 일수를 나타내는 항목
- **Storage**: localStorage 기반 데이터 영속성 레이어

## Requirements

### Requirement 1: 월별 캘린더 뷰

**User Story:** 사용자로서, 월별 달력을 보고 싶다. 그래서 현재 달의 날짜와 요일을 한눈에 파악할 수 있다.

#### Acceptance Criteria

1. THE Calendar SHALL display the current month's dates in a 7-column grid layout (Sunday to Saturday).
2. THE Calendar SHALL highlight today's date visually distinct from other dates.
3. WHEN the user clicks the previous month button, THE Calendar SHALL display the previous month's dates.
4. WHEN the user clicks the next month button, THE Calendar SHALL display the next month's dates.
5. THE Calendar SHALL display the year and month label above the grid.
6. THE Calendar SHALL display dates from the previous and next month to fill the first and last weeks of the grid.

---

### Requirement 2: 간단한 일정 추가

**User Story:** 사용자로서, 날짜를 클릭해서 간단한 일정을 추가하고 싶다. 그래서 중요한 날을 기록해 둘 수 있다.

#### Acceptance Criteria

1. WHEN the user clicks a date cell, THE Calendar SHALL open an input prompt to enter an event title.
2. WHEN the user submits a non-empty event title, THE Calendar SHALL display the event title on the corresponding date cell.
3. WHEN a date has one or more events, THE Calendar SHALL display the event titles within that date cell.
4. WHEN the user clicks an existing event, THE Calendar SHALL allow the user to delete that event.
5. IF the user submits an empty event title, THEN THE Calendar SHALL not create an event.

---

### Requirement 3: 데이터 영속성

**User Story:** 사용자로서, 브라우저를 닫았다가 다시 열어도 데이터가 유지되길 원한다. 그래서 매번 다시 입력하지 않아도 된다.

#### Acceptance Criteria

1. WHEN an event is created, THE Storage SHALL save the event data to localStorage immediately.
2. WHEN a D-Day item is created or updated, THE Storage SHALL save the D-Day data to localStorage immediately.
3. WHEN the application loads, THE Storage SHALL restore all events and D-Day items from localStorage.
4. WHEN an event is deleted, THE Storage SHALL remove the corresponding entry from localStorage immediately.
5. WHEN a D-Day item is deleted, THE Storage SHALL remove the corresponding entry from localStorage immediately.

---

### Requirement 4: D-Day 위젯 - 항목 관리

**User Story:** 사용자로서, D-Day 항목을 별도 위젯에서 추가하고 관리하고 싶다. 그래서 중요한 날까지 남은 시간을 추적할 수 있다.

#### Acceptance Criteria

1. THE DDay_Widget SHALL display a list of all registered D-Day items.
2. WHEN the user clicks the add button in the DDay_Widget, THE DDay_Widget SHALL open a form to enter a D-Day title and target date.
3. WHEN the user submits a valid title and target date, THE DDay_Widget SHALL add the new D-Day item to the list.
4. IF the user submits a D-Day form with an empty title or missing date, THEN THE DDay_Widget SHALL not create the item.
5. WHEN the user clicks the delete button on a D-Day item, THE DDay_Widget SHALL remove that item from the list.

---

### Requirement 5: D-Day 위젯 - 날짜 계산 및 표시

**User Story:** 사용자로서, 각 D-Day 항목에서 남은 일수 또는 경과 일수를 보고 싶다. 그래서 목표일까지 얼마나 남았는지 또는 지났는지 알 수 있다.

#### Acceptance Criteria

1. WHEN a D-Day item's target date is in the future, THE DDay_Widget SHALL display the remaining days as "D-N" (e.g., D-3).
2. WHEN a D-Day item's target date is today, THE DDay_Widget SHALL display "D-Day".
3. WHEN a D-Day item's target date is in the past, THE DDay_Widget SHALL display the elapsed days as "D+N" (e.g., D+5).
4. THE DDay_Widget SHALL recalculate and update all D-Day values based on the current date each time the application loads.

---

### Requirement 6: UI 스타일

**User Story:** 사용자로서, 깔끔하고 미니멀한 UI를 원한다. 그래서 시각적으로 편안하게 사용할 수 있다.

#### Acceptance Criteria

1. THE Calendar SHALL use a white or light neutral background with minimal borders and no decorative shadows.
2. THE DDay_Widget SHALL be displayed as a side panel adjacent to the Calendar.
3. THE Calendar SHALL use a clean sans-serif font throughout.
4. WHEN the user hovers over a date cell, THE Calendar SHALL apply a subtle background color change to indicate interactivity.
5. THE Calendar SHALL display Sunday column headers in a visually distinct color to differentiate weekends.
