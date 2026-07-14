// 검색 및 컨트롤 영역 관리 JS 파일
// 검색, 기간 필터, 정렬, 전체 데이터 초기화
// 데이터 초기화 부분만 데이터 변경 O, todo 데이터 생성, 수정, 삭제는 main.js에서 작성

import { refreshBoardWithFilter } from "./board.js";

const SELECTOR = {
  searchInput: ".td-controls__search-input",
  select: ".td-controls__select",
  resetButton: ".td-controls__btn--reset",
  activeTagsContainer: "#activeTagsContainer",
};

const FILTER_DEFAULTS = Object.freeze({
  keyword: "",
  period: "all",
  priority: "all",
  sort: "asc",
});

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

let filterState = { ...FILTER_DEFAULTS };


export function initControls() {
  const elements = getElements();

  bindEvents(elements);
  renderTags(elements.activeTagsContainer);
}


export function getFilterState() {
  return { ...filterState };
}

function getElements() {
  const searchInput = document.querySelector(SELECTOR.searchInput);
  const selectList = document.querySelectorAll(SELECTOR.select);
  const resetButton = document.querySelector(SELECTOR.resetButton);
  const activeTagsContainer = document.querySelector(
    SELECTOR.activeTagsContainer,
  );

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
  };
}

function bindEvents(elements) {
  const {
    searchInput,
    periodSelect,
    prioritySelect,
    sortSelect,
    resetButton,
    activeTagsContainer,
  } = elements;

  searchInput.addEventListener("input", (event) => {
    filterState.keyword = event.currentTarget.value;
    notifyFilterChange(activeTagsContainer);
  });

  periodSelect.addEventListener("change", (event) => {
    filterState.period = event.currentTarget.value;
    notifyFilterChange(activeTagsContainer);
  });

  prioritySelect.addEventListener("change", (event) => {
    filterState.priority = event.currentTarget.value;
    notifyFilterChange(activeTagsContainer);
  });

  sortSelect.addEventListener("change", (event) => {
    filterState.sort = event.currentTarget.value;
    notifyFilterChange(activeTagsContainer);
  });

  resetButton.addEventListener("click", () => {
  filterState = { ...FILTER_DEFAULTS };

  searchInput.value = "";
  periodSelect.value = "all";
  prioritySelect.value = "all";
  sortSelect.value = "asc";

  renderTags(activeTagsContainer);

  refreshBoardWithFilter();
});
}

function notifyFilterChange(activeTagsContainer) {
  renderTags(activeTagsContainer);

  refreshBoardWithFilter();
}

function renderTags(container) {
  container.replaceChildren();

  const tags = [
    createTag("priority", filterState.priority),
    createTag("period", filterState.period),
    createTag("sort", filterState.sort),
  ].filter(Boolean);

  container.append(...tags);
}

function createTag(category, value) {
  if (value === "all") {
    return null;
  }

  const tag = document.createElement("span");

  tag.className = "td-tags__item";
  tag.textContent = TAG_LABELS[category][value] ?? value;

  return tag;
}

export function getFilteredTodos(todos, filters) {
  let result = [...todos];

  // 검색
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();

    result = result.filter((todo) => {
      return (
        todo.title.toLowerCase().includes(keyword) ||
        (todo.content ?? "").toLowerCase().includes(keyword)
      );
    });
  }

  // 우선순위
  if (filters.priority !== "all") {
    result = result.filter(
      (todo) => todo.priority === filters.priority
    );
  }

  // 기간
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

      if (filters.period === "week") {
        return now - date <= 7 * 24 * 60 * 60 * 1000;
      }

      return true;
    });
  }

  // 정렬
  result.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);

    if (filters.sort === "asc") {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  return result;
}
