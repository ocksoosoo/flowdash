// 검색 및 컨트롤 영역 관리 JS 파일
// 검색, 기간 필터, 정렬, 전체 데이터 초기화
// 데이터 초기화 부분만 데이터 변경 O, todo 데이터 생성, 수정, 삭제는 todj.js에서 작성

const searchInput = document.querySelector(".td-controls__search-input");
const periodSelect = document.querySelectorAll(".td-controls__select")[0];
const prioritySelect = document.querySelectorAll(".td-controls__select")[1];
const sortSelect = document.querySelectorAll(".td-controls__select")[2];
const resetBtn = document.querySelector(".td-controls__btn--reset");
const activeTagsContainer = document.querySelector("#activeTagsContainer");

const filterState = {
  keyword: "",
  period: "all",
  priority: "all",
  sort: "asc",
};

searchInput.addEventListener("input", (e) => {
  filterState.keyword = e.target.value;

  updateBoard();
});

periodSelect.addEventListener("change", (e) => {
  filterState.period = e.target.value;

  updateBoard();
});

sortSelect.addEventListener("change", (e) => {
  filterState.sort = e.target.value;

  updateBoard();
});

resetBtn.addEventListener("click", () => {
  filterState.keyword = "";
  filterState.period = "all";
  filterState.priority = "all";
  filterState.sort = "asc";

  searchInput.value = "";
  periodSelect.value = "all";
  prioritySelect.value = "all";
  sortSelect.value = "asc";

  updateBoard();
});

function renderTags() {
  activeTagsContainer.innerHTML = "";

  if (filterState.priority !== "all") {
    activeTagsContainer.innerHTML += `
    <span class="td-tags__item">
      ${filterState.priority}
    </span>
    `;
  }

  if (filterState.period !== "all") {
    activeTagsContainer.innerHTML += `
    <span class="td-tags__item">
      ${filterState.period}
    </span>
    `;
  }
}
