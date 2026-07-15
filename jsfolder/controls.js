// 검색 및 컨트롤 영역 관리 JS 파일
// 검색, 기간 필터, 정렬, 전체 데이터 초기화
// 데이터 초기화 부분만 데이터 변경 O, todo 데이터 생성, 수정, 삭제는 main.js에서 작성

import { refreshBoardWithFilter } from "./board.js";
import { openResetModal } from "./modal.js";
import { loadFilters, saveFilters } from "./storage.js"

// HTML DOM 요소 선택자 상수 객체
const SELECTOR = {
  searchInput: ".td-controls__search-input",
  select: ".td-controls__select",
  resetButton: ".td-controls__btn--reset",
  activeTagsContainer: "#activeTagsContainer",
};

// 필터 초기 상태 정의(Freeze 객체)
const FILTER_DEFAULTS = Object.freeze({
  keyword: "",
  period: "all",
  priority: "all",
  sort: "asc",
});
// 상단 뱃지 태그UI에 출력할 한국어 치환 맵
const TAG_LABELS = Object.freeze({
  period: {
    today: "오늘",
    week: "최근 7일",
  },
  priority: {
    high: "높음",
    mid: "중간",
    low: "낮음",
  },
  sort: {
    asc: "정렬: 오름차순",
    desc: "정렬: 내림차순"
  },
});
// 최초 시동 시 LocalStorage에서 기존 필터 정보를 복원, 비어있으면 초기값 세팅
let filterState = loadFilters() || { ...FILTER_DEFAULTS };
// 컨트롤 바 시스템 초기화 및 시작 함수
export function initControls() {
  const elements = getElements();
// 스토리지에서 복원해온 필터 상태에 맞춰 실제 화면의 검색창, 셀렉트박스 값 똑같이 맞춤
  syncFiltersToDOM(elements);

  bindEvents(elements);
  renderTags(elements.activeTagsContainer);
}
// 다른 외부 파일(board.js 등)에서 현재 적용된 필터 상태를 실시간으로 참조할 수 있도록 객체 반환 
export function getFilterState() {
  return { ...filterState };
}
// 로컬 스토리지에서 복원해온 내부 변수(filterState) 값들을 실제 웹 화면 인풋 요소들에 주입
function syncFiltersToDOM(elements) {
  const { searchInput, periodSelect, prioritySelect, sortSelect} = elements;

  if (searchInput) searchInput.value = filterState.keyword;
  if (periodSelect) periodSelect.value = filterState.period;
  if (prioritySelect) prioritySelect.value = filterState.priority;
  if (sortSelect) sortSelect.value = filterState.sort;
}
// HTML 문서 내에서 필터 상자, 검색창, 초기화 버튼 등 컨트롤에 필요한 요소들을 수집 및 반환
function getElements() {
  const searchInput = document.querySelector(SELECTOR.searchInput);
  const selectList = document.querySelectorAll(SELECTOR.select);
  const resetButton = document.querySelector(SELECTOR.resetButton);
  const activeTagsContainer = document.querySelector(SELECTOR.activeTagsContainer);
  const [periodSelect, prioritySelect, sortSelect] = selectList;

  if (
    !searchInput ||
    !periodSelect ||
    !prioritySelect ||
    !sortSelect ||
    !resetButton ||
    !activeTagsContainer
  ) {
    throw new Error("컨트롤 영역에 필요한 HTML 요소를 찾을 수 없습니다.");
  }

  return {
    searchInput,
    periodSelect,
    prioritySelect,
    sortSelect,
    resetButton,
    activeTagsContainer,
  }
}
// 사용자 인풋 및 셀렉트 변경 이벤트 리스너 바인딩
function bindEvents(elements) {
  const {
    searchInput,
    periodSelect,
    prioritySelect,
    sortSelect,
    resetButton,
    activeTagsContainer,
  } = elements;
  //  전체 초기화 버튼 클릭 시 데이터를 바로 지우지 않고 modal.js의 경고 모달을 호출
  if (resetButton) {
    resetButton.addEventListener("click", (e) => {
      openResetModal();
    });
  }
  // 실시간 타이핑 검색어 반영 및 로컬스토리지 실시간 동기화 백업
  searchInput.addEventListener("input", (event) => {
    filterState.keyword = event.currentTarget.value;
    saveFilters(filterState);
    notifyFilterChange(activeTagsContainer);
  });
  // 기간 드롭다운 메뉴 변경 및 로컬스토리지 실시간 동기화 백업
  periodSelect.addEventListener("change", (event) => {
    filterState.period = event.currentTarget.value;
    saveFilters(filterState);
    notifyFilterChange(activeTagsContainer);
  });
  // 우선순위 드롭다운 메뉴 변경 및 로컬스토리지 실시간 동기화 백업
  prioritySelect.addEventListener("change", (event) => {
    filterState.priority = event.currentTarget.value;
    saveFilters(filterState);
    notifyFilterChange(activeTagsContainer);
  });
  // 정렬 순서 드롭다운 메뉴 변경 및 로컬 스토리지 실시간 동기화 백업
  sortSelect.addEventListener("change", (event) => {
    filterState.sort = event.currentTarget.value;
    saveFilters(filterState);
    notifyFilterChange(activeTagsContainer);
  });

}
// 사용자가 검색어나 카테고리 옵션을 바꿀 때마다 실시간 호출되어 태그뱃지를 새로 그리고 칸반 보드를 새로고침
function notifyFilterChange(activeTagsContainer) {
  renderTags(activeTagsContainer);

  refreshBoardWithFilter();
}
// 현재 사용자가 선택한 필터 조건들을 묶어 상단 컨테이너 구역에 동적인 뱃지 태그(UI) 형태로 렌더링
function renderTags(container) {
  container.replaceChildren();
  const tags = [
    createTag("period", filterState.period),      // 기간 뱃지
    createTag("priority", filterState.priority),  // 정렬 뱃지
    createTag("sort", filterState.sort),          // 우선순위 뱃지
  ].filter(Boolean);

  container.append(...tags);
}
// 개별 카테고리 필터 태그(UI) 요소를 HTML <span>형태로 동적 생성
// 값이 all 상태인 필터는 화면에 굳이 노출하지 않기 위해 null을 반환하여 배제시킴
function createTag(category, value) {
  if (value === "all") {
    return null;
  }

  const tag = document.createElement("span");

  tag.className = "td-tags__item";
  tag.textContent = TAG_LABELS[category][value] ?? value;

  return tag;
}
// 데이터 필터링 및 오름차순 / 내림차순 정렬 연산 파이프라인
// 전역 할 일 배열을 가공하여 현재 켜져 있는 검색어, 필터 조건, 정렬 기준을 통과한 값 반환
export function getFilteredTodos(todos, filters) {
  let result = [...todos];
  
  // 오늘 하루 동안 생성 / 수정된 카드 판별 (기간 필터)
  if (filters.period !== "all") {
    const now = Date.now();

    result = result.filter((todo) => {
      const date = new Date(todo.updatedAt || todo.createdAt).getTime();

      if (filters.period === "today") {
        const today = new Date();

        return (
          new Date(date).toDateString() === today.toDateString()
        );
      }
      // 최근 7일(밀리초 연산) 이내에 생성 / 수정된 카드 판별
      if (filters.period === "week") {
        return now - date <= 7 * 24 * 60 * 60 * 1000;
      }
      
      return true;
    });
  }

// 오름차순 / 내림차순 날짜 정렬 (원본 훼손 및 동기화 누락을 막기 위해 안전하게 분리 가공 연산 처리)
const sortedResult = [...result].sort((a, b) => {
  const titleA = a.title ?? "";
  const titleB = b.title ?? "";
  
  if (filters.sort === "asc") {
    return titleA.localeCompare(titleB, "ko"); // 오름차순 (가나다순 / A to Z)
  }
  return titleB.localeCompare(titleA, "ko"); // 내림차순 (하파타순 / Z to A)
  });

// 텍스트 키워드 필터링 (할 일 제목 또는 할 일 내용 글자 포함 여부 검사)
if (filters.keyword) {
  const keyword = filters.keyword.toLowerCase();

  result = result.filter((todo) => {
    return (
      todo.title.toLowerCase().includes(keyword) ||
      (todo.content ?? "").toLowerCase().includes(keyword)
    );
  });
  }

// 우선순위 필터링 (높음, 중간, 낮음, 값이 설정된 데이터만 추출)
  if (filters.priority !== "all") {
    result = result.filter(
      (todo) => todo.priority === filters.priority
    );
  }
  

  
  // 고정 순서 기간 -> 정렬 -> 검색을 모두 통과한 최종 결과 반환
  return result;
};
