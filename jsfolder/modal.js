// modal 관련 JS 파일
// 1. 모달 열기/닫기
// 2. 저장/취소 버튼 이벤트
// 3. 입력 데이터 반환

// 할 일 추가 모달
const taskModal = document.querySelector(".modal-overlay--task");

// 버튼
const openBtn = document.querySelector(".td-controls__btn--add");
const saveBtn = document.querySelector(".button-container");
const cancelBtn = document.querySelector(".button__cancel");

// 입력 요소
const titleInput = document.querySelector(".modal__title");
const contentInput = document.querySelector(".modal__content");
const statusSelect = document.querySelector(".modal__status");

// 우선순위 버튼
const priorityBtns = document.querySelectorAll(".priority-container button");

if (button.classList.contains("priority__mid")) {
  selectedPriority = "mid";
}

// 1. 모달 열기/닫기

export function openModal() {
  taskModal.hidden = false;
}

export function closeModal() {
  taskModal.hidden = true;
}
("active");

// 2. 저장/취소 버튼 이벤트

export function initModal() {
  // 새 할 일 버튼
  openBtn.addEventListener("click", openModal);

  // 취소
  cancelBtn.addEventListener("click", closeModal);

  // 저장
  saveBtn.addEventListener("click", () => {
    const todoData = getModalData();

    console.log(todoData);

    closeModal();
  });

  // 배경 클릭 시 닫기
  taskModal.addEventListener("click", (e) => {
    if (e.target === taskModal) {
      closeModal();
    }
  });

  // 우선순위 선택
  priorityBtns.forEach((button) => {
    button.addEventListener("click", () => {
      priorityBtns.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      if (button.classList.contains("priority__low")) {
        selectedPriority = "low";
      } else if (button.classList.contains("priority__medium")) {
        selectedPriority = "medium";
      } else {
        selectedPriority = "high";
      }
    });
  });
}

// 3. 입력 데이터 반환

export function getModalData() {
  return {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    priority: selectedPriority,
    status: statusSelect.value,
  };
}
