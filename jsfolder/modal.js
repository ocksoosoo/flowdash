// modal.js
import { createTodo, updateTodo, initTodos, deleteTodo } from "./todo.js";
import { refreshBoardWithFilter } from "./board.js";

// HTML DOM 요소 선택자
// 할 일 추가 / 수정 모달 관련 요소
const taskModal = document.querySelector(".modal-overlay--task");
const openBtn = document.querySelector(".td-controls__btn--add");
const saveBtn = document.querySelector(".button__save");
const cancelBtn = document.querySelector(".button__cancel");
const titleInput = document.querySelector(".modal__title");
const contentInput = document.querySelector(".modal__content");
const statusSelect = document.querySelector(".modal__status");
const priorityBtns = document.querySelectorAll(".priority-container button");

// 전체 초기화 및 삭제 경고 모달 관련 요소
const deleteModal = document.querySelector(".modal-overlay--reset");
const resetCancelBtn = document.querySelector(".reset-modal-btn__cancel");
const confirmBtn = document.querySelector(".reset-modal-btn__delete");
const resetBtn = document.querySelector(".td-controls__btn--reset");

// 내부 로컬 상태 관리 변수
let selectedPriority = "mid";     // 선택된 우선 순위 상태 (기본 값 : 중간)
let currentEditId = null;         // 현재 수정 중인 할 일의 고유 ID (추가 모드일 땐 null)
let currentDeleteTargetId = null; // 쓰레기통 클릭 시 삭제 승인을 대기하는 할 일의 고유 ID

// 할 일 추가 / 수정 모달 제어 함수
export function openModal(e, editData = null) {
  if (e) e.preventDefault();

  if (taskModal) {
    taskModal.removeAttribute("hidden");
    taskModal.style.display = "flex";
    taskModal.classList.add("active");

    // 수정 모드인 경우 기존 데이터를 입력창에 채움
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
    } 
    // 추가 모드인 경우 입력창을 깨끗하게 비우고 초기화
    else {
      currentEditId = null;
      if (titleInput) titleInput.value = "";
      if (contentInput) contentInput.value = "";
      if (statusSelect) statusSelect.value = "todo";

      selectedPriority = "mid";
      priorityBtns.forEach((btn) => btn.classList.remove("active"));

      const midBtn = document.querySelector(".priority__mid");
      if (midBtn) midBtn.classList.add("active");

      if (saveBtn) saveBtn.textContent = "저장";
    }
  }
  // 모달이 열리자마자 UX 편의성을 위해 제목 입력창에 자동으로 커서 위치(Auto focus)
  if (titleInput) {
    titleInput.focus();
  }
}

// 열려있는 할 일 추가 / 수정 모달창을 닫고 상태 초기화
export function closeModal(e) {
  if (e) e.preventDefault();

  if (taskModal) {
    taskModal.hidden = true;
    taskModal.style.display = "none";
    taskModal.classList.remove("active"); // active 클래스 제거
  }
}

// 전체 초기화 및 개별 삭제 경고 모달 제어
// 컨텍스트 기반 동적 경고 모달창 띄움
// ex) 초기화 버튼시   : 초기화 하시겠습니까?
// ex) 쓰레기통 버튼시 : 삭제 하시겠습니까?
export function openResetModal(e = null, id = null) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  currentDeleteTargetId = id; // 넘겨받은 ID를 승인 대기소 메모리에 임시 보관

  if (deleteModal) {
    const messageSpans = deleteModal.querySelectorAll(".reset-modal__message span"); 
    const deleteButton = deleteModal.querySelector(".reset-modal-btn__delete");     

    if (messageSpans && messageSpans.length >= 2) {
      // 개별 카드 삭제 진입 시 : 문구와 버튼명 "삭제" 컨셉 맞춤 가변
      if (id) {
        messageSpans[0].textContent = "이 할 일을 정말 삭제하시겠습니까?";
        messageSpans[1].textContent = "삭제 후엔 데이터를 되돌릴 수 없습니다.";
        if (deleteButton) deleteButton.textContent = "삭제";
      } 
      // 전체 초기화 진입 시 : 문구와 버튼명 "초기화" 컨셉 맞춤 가변
      else {
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
// 열려있는 경고 모달창을 안전하게 닫고 대기소 ID 메모리 초기화
export function closeResetModal(e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  if (deleteModal) {
    deleteModal.hidden = true;
    deleteModal.style.display = "none";
    deleteModal.classList.remove("active");
    currentDeleteTargetId = null; // 대기소 메모리 초기화
  }
}

// 메인 이벤트 리스너 세팅 및 진입
export function initModal() {
  // 새 할 일 버튼 클릭 시 추가 모달 오픈
  if (openBtn) {openBtn.addEventListener("click", (e) => openModal(e))};
  // 모달 내부 "취소" 버튼 클릭 시 모달 닫힘
  if (cancelBtn) { cancelBtn.addEventListener("click", closeModal)};

// 유효성 검사 후 새 데이터를 생성 또는 기존 데이터 수정처리
// 마우스 클릭 이벤트, 엔터 이벤트 공통 사용
  function handleSaveTodo() {
    if (titleInput.value.trim() === "") {
      alert("제목을 입력해 주세요!");
      titleInput.focus();
      return;
    }
    const todoData = getModalData();
    if (currentEditId) { updateTodo(currentEditId, todoData);}
    else {createTodo(todoData); }
    refreshBoardWithFilter(); // 필터 조건에 맞춰 컨반 보드 실시간 리프레시
    closeModal();
  } 

  // 저장 / 수정하기 버튼 클릭 시 작동
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSaveTodo();
    });
  }

  // 키보드 단축키 - 제목창과 내용창에서 Enter키 입력시 즉시 저장
  [titleInput, contentInput].forEach((inputField) => {
    if (!inputField) return;
    inputField.addEventListener("keydown", (e) => {
      // !e.isComposing으로 한글 입력기 완성 타이밍의 중복 실행 버그 방어
      if (e.key === "Enter" && !e.isComposing) {
        // 내용 입력창 안에서 shift + Enter 조합 시 줄바꿈
        if (inputField === contentInput && e.shiftKey) {
          return;
        }

        e.preventDefault(); // 엔터 고유의 브라우저 개행 / 제출 동작 방지
        handleSaveTodo();   // 저장 프로세스 가동
      }
    });
  });
  // ESC키로 모달 닫기
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      if (taskModal && taskModal.classList.contains("active")) closeModal(e);
      if (deleteModal && deleteModal.classList.contains("active")) closeResetModal(e);
    }
  });

  // overlay 영역 클릭 시 모달창 닫기
  if (taskModal) {
    taskModal.addEventListener("click", (e) => {
      if (e.target === taskModal) {
        closeModal();
      }
    });
  }

  // 우선순위 3개 버튼 토글 이벤트 바인딩
  if (priorityBtns) {
    priorityBtns.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // 모든 버튼에서 active 제거
        priorityBtns.forEach((btn) => btn.classList.remove("active")); // 모든 버튼 활성화 해제
        button.classList.add("active"); // 클릭한 버튼에 active 추가

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
  // 삭제 확인 모달 리스너 작동시키기 위한 트리거
  initResetModal();
  // 외부 컨트롤 모듈에서 수정용 인터페이스로 호출 할 수 있도록 리턴
  return {
    openForEdit: (targetTodo) => {
      openModal(null, targetTodo);
    },
  };
}

// 현재 입력 상자에 기입된 데이터들 객체형태로 묶어 정갈하게 반환
export function getModalData() {
  return {
    title: titleInput ? titleInput.value.trim() : "",
    content: contentInput ? contentInput.value.trim() : "",
    priority: selectedPriority,
    status: statusSelect ? statusSelect.value : "todo",
  };
}

// 초기화 및 삭제 경고 모달 내부 자체 이벤트 리스너
export function initResetModal() {
// 전체 초기화 버튼 클릭 시 경고 모달 오픈 ID에 null 전달
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      openResetModal(e, null); 
    })
  }
// 경고 모달 내 '취소' 버튼 클릭 시 모달창 닫기
  if (resetCancelBtn) {
    resetCancelBtn.addEventListener("click", () => {
      closeResetModal();
    });
  }
  // 경고 모달 내 '확인(삭제 / 초기화)' 버튼 클릭 시 삭제문 작동
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      // 검색 및 필터 조건 유지한 상태로 '해당 카드만' 삭제
      if (currentDeleteTargetId) {
        // 자료형 안정성을 보장하기 위해 Num() 함수로 엄격하게 변환하여 삭제 핸들러에 전달
        deleteTodo(Number(currentDeleteTargetId));
        refreshBoardWithFilter(); // 필터 파이프라인 유지하며 화면 실시간 새로고침
      } 
      // 대기소 ID가 null일 때 '카드 배열 데이터' + '스토리지 필터 값' 전체 포맷
      else {
        // 전체 초기화
        initTodos([]); // 모든 할 일 카드 배열 포맷(스토리지 클리어)

        // 로컬 스토리지에 백업되어 있던 필터 객체까지 깨끗한 기본 스펙 양식으로 초기화
        localStorage.setItem("flowdash-filters", JSON.stringify({ keyword: "", period: "all", priority: "all", sort: "asc"}))

        const searchInput = document.querySelector(".td-controls__search-input");
        const selectList = document.querySelectorAll(".td-controls__select");
        // 전체 초기화 시 검색 및 필터 초기화
        if (searchInput) searchInput.value = "";
        if (selectList && selectList.length >= 3) {
          selectList[0].value = "all"; // 기간 리셋
          selectList[1].value = "all"; // 우선순위 리셋
          selectList[2].value = "asc"; // 정렬 리셋
        }
        // 전체 파이프라인을 최초 구동 상태로 전면 리프레시하기 위해 페이지 강제 새로고침
        window.location.reload();
      }
      closeResetModal(); // 작업 완료 후 모달 닫기
    });
  }

  // 경고 모달 overlay 영역 클릭 시 닫기 
  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) {
        closeResetModal();
      }
    });
  }
}