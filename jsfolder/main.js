// 초기화 및 전체 실행 JS 파일

// ===== Import =====

// Storage
import { loadTodos } from './storage.js';

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
    state.todos = loadTodos();
    
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

  renderBoard(filteredTodos, {
    onEditTodo: openEditModal,
    onDeleteTodo: deleteTodo,
  });
}

// 수정 모달
function openEditModal(id) {
    console.log("수정 : ", id);
}

// 삭제 
function deleteTodo(id) {
  console.log("삭제:", id);
}

// 전체 초기화
function resetTodos() {
  console.log("전체 초기화");
}
