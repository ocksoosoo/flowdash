import { createTodo, updateTodo } from "./todo.js";
import { refreshBoardWithFilter } from "./board.js";
// modal.js
// 1. 모달 열기/닫기
// 2. 저장/취소 버튼 이벤트
// 3. 입력 데이터 반환

// 할 일 추가 모달
const taskModal = document.querySelector(".modal-overlay--task");

// 버튼
const openBtn = document.querySelector(".td-controls__btn--add");
const saveBtn = document.querySelector(".button__save");
const cancelBtn = document.querySelector(".button__cancel");

// 입력 요소
const titleInput = document.querySelector(".modal__title");
const contentInput = document.querySelector(".modal__content");
const statusSelect = document.querySelector(".modal__status");

// 우선순위 버튼
const priorityBtns = document.querySelectorAll(".priority-container button");

// 기본 우선순위 변수 선언
let selectedPriority = "mid";
let currentEditId = null;

// 1. 모달 열기/닫기
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
// 2. 저장/취소 버튼 이벤트
export function initModal() {
  // 새 할 일 버튼
  if (openBtn) {
    openBtn.addEventListener("click", (e) => openModal(e));
  }

  // 취소
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  // 저장
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 기본 동작 방지

      if (titleInput.value.trim() === "") {
        alert("제목을 입력해 주세요!");
        titleInput.focus();
        return;
      }
      const todoData = getModalData();

      if (currentEditId) {
        updateTodo(currentEditId, todoData);
      } else {
        createTodo(todoData);
      }

      refreshBoardWithFilter();

      closeModal();
    });
  }

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
