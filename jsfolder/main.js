// 초기화 및 전체 실행 JS 파일

// ===== Import =====

// Storage
import { loadTodos } from './storage.js';

// Header
import { initHeader } from './header.js';

// main

// dashboard


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
    // initStatistics(state.todos);
    // initTodo(state.todos);
}


// ===== App Start =====
document.addEventListener('DOMContentLoaded', init);