// 초기화 및 전체 실행 JS 파일

// ===== Import =====

// Storage
import { loadTodos, saveTodos } from './storage.js';

// Header
import { initHeader } from './header.js';


// Board
import { renderBoard } from './board.js';

// Controls
import { getFilterState, getFilteredTodos, initControls, } from './controls.js';

// modal
// import { initModal } from './modal.js';

// stats
// import { updateStats } from './stats.js';

//todo
// import { handleTodoActions } from './todo.js';

// import { handleTodoActions } from './todo.js';



// ===== Global Sate =====
let state = {
    todos: []
};


// ===== Initialize =====
function init() {
    // 저장된 데이터 가져오기
    // state.todos = loadTodos();
    
    // ** 나중에 각 파일에서 export한 init 함수명과 일치하는지 확인
    initHeader(state.todos);

    initControls({
        onFilterChange: updateBoard,
        onResetTodos: resetTodos,
    });

    updateBoard(getFilterState());
    // initStatistics(state.todos);
    // initTodo(state.todos);
}


// ===== App Start =====
document.addEventListener('DOMContentLoaded', init);

// ===== board update =====
function updateBoard(filters) {
  const filteredTodos = getFilteredTodos(state.todos, filters);

  console.log("state.todos", state.todos);
  console.log("filteredTodos", filteredTodos);

  renderBoard(filteredTodos, {
    onEditTodo: openModal,
    onDeleteTodo: deleteTodo,
  });
}

function deleteTodo(id) {
  state.todos = state.todos.filter(todo => todo.id !== id);

  saveTodos(state.todos);

  updateBoard(getFilterState());
}


function resetTodos() {
  state.todos = [];

  saveTodos(state.todos);

  updateBoard(getFilterState());
}

state.todos = [
  {
    id: 1,
    title: "테스트",
    content: "내용",
    status: "todo",
    priority: "mid",
    createdAt: 1,
  },
  {
    id: 1,
    title: "안녕",
    content: "내용",
    status: "todo",
    priority: "high",
    createdAt: Date.now(),
  }
];

console.log(state.todos);

// 수정 모달
function openModal(id) {
    console.log("수정 : ", id);
}


