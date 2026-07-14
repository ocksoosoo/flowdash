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
function initApp() {
    
function updateView() {
    const currentTodos = getTodos()

    renderBoard(currentTodos, {
        onEditTodo: (id) => {
            console.log(`수정 ID: ${id}`);
        },
        onDeleteTodo: (id) => {
            if (confirm("정말 삭제하시겠습니까?")) {
                deleteTodo(id)
                updateView()
            }
        }
    });
}

// 저장된 데이터 가져오기
// state.todos = loadTodos();

// ** 나중에 각 파일에서 export한 init 함수명과 일치하는지 확인
initHeader(state.todos);

initControls({
    onFilterChange: updateBoard,
    onResetTodos: resetTodos,
});

initModal((todoData) => {
    createTodo(todoData);
    updateView();
});


updateView();
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
document.addEventListener("DOMContentLoaded", initApp);

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


