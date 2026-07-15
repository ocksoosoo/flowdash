# 5조 세스코

> 공통 과제: 칸반 기반 태스크 관리 대시보드  
> 팀원: 김명서, 나민우, 최현옥, 황상빈 
> 저장소: [GitHub](https://github.com/ocksoosoo/flowdash)
> 배포: [GitHub Pages](https://링크주소)

---

## 0. 프로젝트 개요

본 프로젝트는 공통 요구사항을 기반으로 한  
칸반 형태의 태스크 관리 대시보드 구현 과제이다.

CRUD, 기간 필터, 통계, 테마 및 UX 요소를 포함하며  
팀 단위 협업을 통해 설계 및 구현을 진행했다.

---

## 1. 팀 구성 및 역할 분담 (Team & Roles)

### 👥 팀 구성 및 역할 분담

| 이름 | 역할 | 주요 담당 업무 |
| :--- | :--- | :--- |
| **최현옥** | **Team Lead**<br>• Web UI/UX 디자인<br>• Header 개발 | • 프로젝트 총괄 및 일정 관리<br>• Header 스타일링 및 JS 기능 구현 (다크모드 토글)<br>• LocalStorage 데이터 관리 로직 설계<br>• 모달(Modal) 마크업 구조 설계 |
| **김명서** | **Tech Lead (반응형/테마)**<br>• Mobile UI/UX 디자인<br>• Modal JS 개발 | • 다크모드 공통 CSS 변수(Variables) 설계 및 관리<br>• 모바일 및 태블릿 반응형 레이아웃 구현<br>• 모달(Modal) 기능 관련 JS 로직 개발 |
| **나민우** | **Markup Lead**<br>• Stats 개발 | • 메인 HTML 레이아웃 및 웹 표준 구조 설계<br>• 통계 대시보드 UI 구현<br>• Chart.js 또는 SVG 활용 원형 그래프 구현 |
| **황상빈** | **CSS Lead**<br>• Kanban Board 개발 | • 전체 프로젝트 CSS 공통 레이아웃 시스템 설계<br>• 모달(Modal) 컴포넌트 세부 스타일링<br>• 칸반 보드 CRUD(등록/조회/수정/삭제) 및 검색·필터·정렬 기능 구현 |

> 💡 **공동 작업:** 팀원 전원이 CSS/JS 세부 구현에 유기적으로 참여하였으며, 상호 코드 리뷰를 통해 코드 품질을 유지했습니다.
---

## 2. 수행 절차 및 방법 (Process & Strategy)

### 2-1. 진행 순서
1. 요구사항 전체 리뷰 및 필수 / 가산 구분 / 목표 설정
2. UI/UX / HTML / CSS 역할 분담
3. Web / Mobile Design 분담
4. HTML 구조 작업
5. CSS 파일 구조 분리하여 파트 분담
6. CSS Layout / DarkMode
7. JS 파일 구조 분리 및 세팅, 섹션별 파트 분담
8. Profile / Statstics / Todo-Dashboard / Redsponsive Styling&JS
9. Modal JS
10. 

### 2-2. 협업 규칙
- 브랜치 전략: main / dev / feature/*
- PR 단위: 기능 1개 기준
- PR 전 rebase 필수
- 스펙 변경은 dev merge 전까지만 허용

---

## 3. 프로젝트 구조 및 아키텍처

### 3-1. 디렉터리 구조
```
flowdash/
├─ README.md
├─ index.html
└─ cssfolder/
   ├── reset.css
   ├── layout.css
   ├── variables.css
   ├── theme.css
   ├── components.css
   └── responsive.css
└─ jsfolder/
   ├─ main.js
   ├─ storage.js
   ├─ header.js
   ├─ stats.js
   ├─ controls.js
   ├─ board.js
   ├─ todo.js
   └─ modal.js
```

프로젝트의 각 JS 파일은 단일 책임 원칙(SRP)에 따라 역할을 명확히 분리하여 설계 및 구현되었습니다.

*   **`main.js`**: 애플리케이션의 진입점(Entry Point) 및 각 모듈의 초기화 함수(`init`)를 일괄 실행하고 관리하는 파일
*   **`storage.js`**: 로컬 스토리지(LocalStorage) 관련 데이터 조회, 저장, 삭제 등 데이터 영속성 관리를 전담하는 파일
*   **`header.js`**: 사용자 맞춤형 인사말, 오늘 날짜 출력, 프로필 배경 색상 및 테마 토글, 닉네임 수정 등 상단 헤더 영역의 UI 및 데이터 상태를 제어하는 파일
*   **`stats.js`**: 전체 할 일 데이터에 따른 원형 그래프 렌더링 및 대시보드 통계 수치를 계산하고 업데이트하는 파일
*   **`controls.js`**: 할 일 목록의 검색, 정렬, 필터링 등 칸반 보드 전체 데이터의 흐름과 조회 방식을 제어하는 유틸리티 파일
*   **`board.js`**: 칸반 보드의 컬럼(To-Do, In-Progress, Done 등) 렌더링 및 드래그 앤 드롭(Drag & Drop)을 통한 상태 변경 이벤트를 처리하는 파일
*   **`todo.js`**: 개별 할 일(Todo Item) 객체의 생성, 수정, 삭제(CRUD) 비즈니스 로직과 세부 상태 관리를 전담하는 파일
*   **`modal.js`**: 할 일 추가/수정 시 띄워지는 팝업창(모달)의 노출, 입력 폼 제어, 유효성 검사 및 닫기 이벤트를 관리하는 파일

### 3-3. 데이터 흐름 (Data Flow)

#### 1) 할 일 생성 (Create)
모달 등록 (`modal.js`) 
→ `createTodo()` 데이터 추가 (`todo.js`) 
→ `saveTodos()` 스토리지 저장 (`storage.js`) 
→ `refreshBoardWithFilter()` 호출 (`board.js`)
  - `getFilteredTodos()` 필터/정렬 적용 (`controls.js`)
  -  `initStatistics()` 대시보드 및 달성률 갱신 (`stats.js`)
  - `renderBoard()` 칸반 카드 출력 (`board.js`)

---

#### 2) 할 일 수정 (Update)
수정 버튼 클릭 (`board.js`) 
→ `openModal()` 기존 데이터 바인딩 (`modal.js`) 
→ 내용 수정 및 완료 클릭 
→ `updateTodo()` 데이터 및 수정일 갱신 (`todo.js`) 
→ `saveTodos()` 스토리지 저장 (`storage.js`) 
→ `refreshBoardWithFilter()` 실시간 UI 및 통계 갱신 (`board.js`)

---

#### 3) 할 일 삭제 (Delete)
삭제 클릭 및 확인 (`board.js`) 
→ `deleteTodo()` 데이터 제거 (`todo.js`) 
→ `saveTodos()` 스토리지 저장 (`storage.js`) 
→ `refreshBoardWithFilter()` 실시간 UI 및 통계 갱신 (`board.js`)

---

#### 4) 검색 및 필터/정렬 (Filter & Sort)
컨트롤러 입력 (`controls.js`) 
→ `filterState` 상태 변경 (`controls.js`) 
→ `getFilteredTodos()` 조건별 가공 (`controls.js`) 
→ `renderBoard()` 필터링된 보드 렌더링 (`board.js`)

---

## 4. 핵심 설계 결정 사항 (Design Decisions)

- status 기반 보드 분리 → 상태 필터 제거
- 모든 날짜 데이터는 timestamp(number)로 통일
- 기간 필터 → 정렬 → 검색 순서의 고정 파이프라인 적용
- 통계는 기간 필터와 무관하게 전체 Todo 기준으로 계산

---

## 5. 수행 결과 (Implementation Result)

### 5-1. 구현 완료 기능
- CRUD 전 기능
- TODO / DOING / DONE 칸반 보드
- 기간 필터 / 검색 / 정렬
- 통계 대시보드 및 달성률
- 라이트 / 다크 테마
- 인사말 및 닉네임 UX
- 반응형 레이아웃

### 5-2. 요구사항 충족 범위
- 필수 요구사항: 충족
- [] Todo CRUD 기능이 모두 정상 동작한다 (생성 / 조회 / 수정 / 삭제)
- [✔️] TODO / DOING / DONE 상태별 칸반 보드가 분리되어 렌더링된다
- [✔️ ] status 변경 시 Todo가 즉시 해당 보드로 이동한다
- [ ] DONE 전환 시 completedAt이 기록되며, 해제 시 null로 초기화된다
- [✔️] 우선순위(HIGH / MID / LOW)를 설정 및 수정할 수 있다
- [✔️] 기간 필터(전체 / 오늘 / 7일)가 createdAt 기준으로 동작한다
- [✔️] 필터 적용 순서(기간 → 정렬 → 검색)가 항상 유지된다
- [✔️] 제목/내용 기준 검색이 필터 결과 내에서 정상 동작한다
- [✔️] 제목 기준 오름차순 / 내림차순 정렬이 가능하다
- [✔️] 통계 대시보드에 전체 / TODO / DOING / DONE / 달성률이 표시된다
- [✔️] 달성률은 (DONE / 전체) * 100 기준으로 계산된다
- [✔️] 전체 초기화 시 Todo 데이터만 삭제되며 확인 절차가 존재한다
- [✔️] 테마(Light / Dark) 전환이 가능하며 LocalStorage에 저장된다
- [✔️] 인사말이 시간대 기준으로 표시된다
- [✔️] 닉네임을 인라인으로 수정할 수 있으며 LocalStorage에 저장된다
- [✔️] 새로고침 후에도 Todo / 테마 / 닉네임 상태가 유지된다
- [✔️] 반응형 레이아웃이 Mobile / Tablet / Desktop 기준으로 동작한다
- [ ] 콘솔에 치명적인 에러가 발생하지 않는다
- 가산 요소: (해당 시 작성)
- [✔️] 디자인 커스터마이징
- [✔️] UX 개선 아이디어 적용
- [✔️] 예외 처리 강화 (빈 상태, 입력 검증 등)
- [✔️] 추가 기능 구현 (명세 외): 랜덤 프로필 색상 변경 기능, 변경된 프로필 색상에 따라 닉네임 색상도 함께 변경, 모바일 및 태블릿 모드에서 todo 카드가 너무 많아질 때 무한대로 길어지는 것을 방지하기 위해 펼치기/숨기기 버튼을 추가하여 사용자가 조절
---

## 6. 트러블슈팅 (Troubleshooting)

### 6-1. (문제 제목)
- 증상:
- 원인:
- 해결:
- 회고:

### 6-2. (문제 제목)
- 증상:
- 원인:
- 해결:
- 회고:

---

## 7. 자체 평가 및 회고 (Self Review)

### 7-1. 잘한 점
- 역할 분담이 명확해 병렬 작업이 가능했다
- 데이터 규칙을 초기에 합의해 충돌이 적었다

### 7-2. 아쉬운 점
- 통합 시점이 늦어 충돌 해결 시간이 부족했다
- 테스트 케이스를 코드로 남기지 못했다

### 7-3. 다음에 개선할 점
- 상태 변경 로직 테스트 자동화
- 드래그 앤 드롭 UX 도입

---

## 8. 실행 방법

Live Server 실행 또는 index.html 직접 실행

---

## 9. 결론

공통 과제를 통해 협업 구조와 상태 관리의 중요성을 체감했으며  
요구사항을 코드 구조로 해석하는 경험을 얻었다.
