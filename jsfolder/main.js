// 초기화 및 전체 실행 JS 파일

// ===== Import =====

// Storage
import { loadTodos, saveTodos } from "./storage.js";

// Header
import { initHeader } from "./header.js";

// Board
import { renderBoard } from "./board.js";

// Controls
import { getFilterState, getFilteredTodos, initControls } from "./controls.js";
import { initTodos, getTodos, deleteTodo as deleteTodoFromData } from "./todo.js";

// modal
import { initModal } from './modal.js';

// stats
// import { updateStats } from './stats.js';

//todo
import { createTodo, deleteTodo } from './todo.js';

// import { handleTodoActions } from './todo.js';

// ===== Global Sate =====
let state = {
  todos: [],
};

// ===== Initialize =====
function init() {
    const dummyData =
        [
  {
    id: 1,
    title: "테스트",
    content: "내용",
    status: "todo",
    priority: "mid",
    createdAt: 1,
  },
  {
    id: 2,
    title: "안녕",
    content: "내용",
    status: "todo",
    priority: "high",
    createdAt: Date.now(),
  },
];

  // 저장된 데이터 가져오기
  // state.todos = loadTodos();

  // ** 나중에 각 파일에서 export한 init 함수명과 일치하는지 확인
  initHeader(state.todos);

  initTodos(dummyData);

  initControls({
    onFilterChange: updateBoard,
    onResetTodos: resetTodos,
  });

initModal();
  updateBoard(getFilterState());
  // initStatistics(state.todos);
  // initTodo(state.todos);
}

// 플로팅버튼
const scrollTopBtn = document.querySelector("#scrollTopBtn");
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===== App Start =====
document.addEventListener("DOMContentLoaded", init);

// ===== board update =====
function updateBoard(filters) {
  const allTodos = getTodos();
  const filteredTodos = getFilteredTodos(allTodos, filters)

  console.log("전체 데이터", allTodos);
  console.log("필터링된 데이터", filteredTodos);

  renderBoard(filteredTodos, {
    onEditTodo: openModal,
    onDeleteTodo: handleDelete,
  });
}

function handleDelete(id) {
    deleteTodoFromData(id);

    saveTodos(getTodos());


  updateBoard(getFilterState());
}

function resetTodos() {

  updateBoard(getFilterState());
}

// 수정 모달
function openModal(id) {
  console.log("수정 : ", id);
}
