// 초기화 및 전체 실행 JS 파일

// ===== Import =====

// Storage
import { loadTodos, saveTodos } from "./storage.js";

// Header
import { initHeader } from "./header.js";

// Board
import { refreshBoardWithFilter } from "./board.js";

// Controls
import { initControls } from "./controls.js";

// modal
import { initModal } from './modal.js';

//todo
import { getTodos } from "./todo.js";


// ===== Global Sate =====
let state = {
  todos: [],
};

// ===== Initialize =====
function initApp() {

// ** 나중에 각 파일에서 export한 init 함수명과 일치하는지 확인
initHeader(getTodos());

initControls();

initModal();


refreshBoardWithFilter();
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





