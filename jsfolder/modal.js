import { createTodo, updateTodo, initTodos, deleteTodo } from "./todo.js";
import { refreshBoardWithFilter } from "./board.js";
// modal.js
// 1. 모달 열기/닫기
// 2. 저장/취소 버튼 이벤트
// 3. 입력 데이터 반환

// HTML DOM 요소 선택자
const taskModal = document.querySelector(".modal-overlay--task");
const openBtn = document.querySelector(".td-controls__btn--add");
const saveBtn = document.querySelector(".button__save");
const cancelBtn = document.querySelector(".button__cancel");
const titleInput = document.querySelector(".modal__title");
const contentInput = document.querySelector(".modal__content");
const statusSelect = document.querySelector(".modal__status");
const priorityBtns = document.querySelectorAll(".priority-container button");

// 초기화 모달 관련 요소
const deleteModal = document.querySelector(".modal-overlay--reset");
const resetCancelBtn = document.querySelector(".reset-modal-btn__cancel");
const confirmBtn = document.querySelector(".reset-modal-btn__delete");
const resetBtn = document.querySelector(".td-controls__btn--reset");

let selectedPriority = "mid";
let currentEditId = null;

let currentDeleteTargetId = null;

// 1. 할 일 추가 / 수정 모달 열기 / 닫기
export function openModal(e, editData = null) {
  if (e) e.preventDefault();

  if (taskModal) {
    taskModal.removeAttribute("hidden");
    taskModal.style.display = "flex";
    taskModal.classList.add("active");

    if (editData) {
      currentEditId = editData.id;
      if (titleInput) titleInput.value = editData.title;
      if (contentInput) contentInput.value = editData.content;
      if (statusSelect) statusSelect.value = editData.status;

      selectedPriority = editData.priority;
      priorityBtns.forEach((btn) => {
        btn.classList.remove("active");
        if (
          btn.classList.contains(`priority__${editData.priority}`) ||
          (editData.priority === "mid" &&
            btn.classList.contains("priority__mid"))
        ) {
          btn.classList.add("active");
        }
      });

      if (saveBtn) saveBtn.textContent = "수정하기";
    } else {
      currentEditId = null;
      if (titleInput) titleInput.value = "";
      if (contentInput) contentInput.value = "";
      if (statusSelect) statusSelect.value = "todo";

      selectedPriority = "mid";
      priorityBtns.forEach((btn) => btn.classList.remove("active"));

      const midBtn = document.querySelector(".priority__mid");
      if (midBtn) midBtn.classList.add("active");

      if (saveBtn) saveBtn.textContent = "저장하기";
    }
  }
  if (titleInput) {
    titleInput.focus();
  }
}

export function closeModal(e) {
  if (e) e.preventDefault();

  if (taskModal) {
    taskModal.hidden = true;
    taskModal.style.display = "none";
    taskModal.classList.remove("active"); // active 클래스 제거
  }
}

// 전체 초기화 모달 열기 / 닫기
export function openResetModal(e = null, id = null) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  currentDeleteTargetId = id;

  if (deleteModal) {
    const messageSpans = deleteModal.querySelectorAll(".reset-modal__message span"); 
    const deleteButton = deleteModal.querySelector(".reset-modal-btn__delete");     

    if (messageSpans && messageSpans.length >= 2) {
      if (id) {
        messageSpans[0].textContent = "이 할 일을 정말 삭제하시겠습니까?";
        messageSpans[1].textContent = "삭제 후엔 데이터를 되돌릴 수 없습니다.";
        if (deleteButton) deleteButton.textContent = "삭제";
      } else {
        messageSpans[0].textContent = "정말 초기화 하시겠습니까?";
        messageSpans[1].textContent = "초기화 후엔 되돌릴 수 없습니다.";
        if (deleteButton) deleteButton.textContent = "초기화"; 
      }
    }

    deleteModal.removeAttribute("hidden");
    deleteModal.style.display = "flex";
    deleteModal.classList.add("active");
  }
}

export function closeResetModal(e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  if (deleteModal) {
    deleteModal.hidden = true;
    deleteModal.style.display = "none";
    deleteModal.classList.remove("active");
    currentDeleteTargetId = null;
  }
}

// 메인 이벤트 리스너 세팅 및 진입
export function initModal() {
  // 새 할 일
  if (openBtn) {openBtn.addEventListener("click", (e) => openModal(e))};
  // 취소
  if (cancelBtn) { cancelBtn.addEventListener("click", closeModal)};

  
  // 저장

  function handleSaveTodo() {
    if (titleInput.value.trim() === "") {
      alert("제목을 입력해 주세요!");
      titleInput.focus();
      return;
    }
    const todoData = getModalData();
    if (currentEditId) { updateTodo(currentEditId, todoData);}
    else {createTodo(todoData); }
    refreshBoardWithFilter();
    closeModal();
  } 

  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSaveTodo();
    });
  }

  [titleInput, contentInput].forEach((inputField) => {
    if (!inputField) return;
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.isComposing) {
        if (inputField === contentInput && e.shiftKey) {
          return;
        }

        e.preventDefault();
        handleSaveTodo();
      }
    });
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      if (taskModal && taskModal.classList.contains("active")) closeModal(e);
      if (deleteModal && deleteModal.classList.contains("active")) closeResetModal(e);
    }
  });

  // 배경 클릭 시 닫기
  if (taskModal) {
    taskModal.addEventListener("click", (e) => {
      if (e.target === taskModal) {
        closeModal();
      }
    });
  }

  // 우선순위 선택
  if (priorityBtns) {
    priorityBtns.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // 모든 버튼에서 active 제거
        priorityBtns.forEach((btn) => btn.classList.remove("active"));

        // 클릭한 버튼에 active 추가
        button.classList.add("active");

        // 값을 앱 전체 기준에 맞게 low, mid, high로 통일
        if (button.classList.contains("priority__low")) {
          selectedPriority = "low";
        } else if (
          button.classList.contains("priority__medium") ||
          button.classList.contains("priority__mid")
        ) {
          selectedPriority = "mid";
        } else {
          selectedPriority = "high";
        }
      });
    });
  }
  initResetModal();
  return {
    openForEdit: (targetTodo) => {
      openModal(null, targetTodo);
    },
  };
}

// 3. 입력 데이터 반환
export function getModalData() {
  return {
    title: titleInput ? titleInput.value.trim() : "",
    content: contentInput ? contentInput.value.trim() : "",
    priority: selectedPriority,
    status: statusSelect ? statusSelect.value : "todo",
  };
}

//초기화 모달 작성//

// 저장(설정) 모달
const saveModalCancelBtn = document.querySelector(".button__cancel");

// 초기화(삭제) 모달

// --- 초기화 모달 이벤트 ---

// 초기화 모달
const deleteModal = document.querySelector(".modal-overlay--reset");
const confirmBtn = document.querySelector(".reset-modal-btn__delete");

export function initResetModal() {

  // 취소 버튼 클릭 시
  if (resetCancelBtn) {
    resetCancelBtn.addEventListener("click", () => {
      closeResetModal();
    });
  }

  // 삭제 버튼 클릭 시
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (currentDeleteTargetId) {
        deleteTodo(Number(currentDeleteTargetId));
      } else {
        initTodos([]);
      }

      refreshBoardWithFilter();
      closeResetModal();
    });
  }

  // 모달 배경 클릭 → 닫기
  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) {
        closeResetModal();
      }
    });
  }
}
