// 이벤트 이식수술
import { deleteTodo, getTodos } from "./todo.js";
import { openModal, openResetModal } from "./modal.js";
import { getFilterState, getFilteredTodos } from "./controls.js";
import { initStatistics } from "./stats.js";
// board.js (오류 방지 안전장치 보완 버전)

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}. ${month}. ${day} ${hours}:${minutes}`;
}

const emptyIcon = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://w3.org"><path d="M25.6677 14H18.6672L16.3336 17.4997H11.6666L9.33308 14H2.33252M2.33252 14L6.35784 5.96247C6.55103 5.57376 6.84884 5.24664 7.2178 5.01789C7.58675 4.78914 8.01221 4.66783 8.44634 4.6676H19.5539C19.988 4.66783 20.4135 4.78914 20.7824 5.01789C21.1514 5.24664 21.4492 5.57376 21.6424 5.96247L25.6677 14V20.9993C25.6677 21.6181 25.4219 22.2115 24.9842 22.6491C24.5466 23.0866 23.9531 23.3324 23.3342 23.3324H4.66604C4.04715 23.3324 3.45361 23.0866 3.01599 22.6491C2.57837 22.2115 2.33252 21.6181 2.33252 20.9993V14Z" stroke="#D5D5D5" stroke-width="2" stroke-linecap="round"/></svg>`;
const editIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://w3.org"><g clip-path="url(#clip0_17_180)"><path d="M9.40305 3.79952L13.2018 7.59831M1.96697 14.013L2.39693 11.0649C2.42314 10.8722 2.51097 10.693 2.64839 10.5549L10.9791 2.21285C11.0869 2.10346 11.2212 2.02374 11.3688 1.98143C11.5165 1.93912 11.6726 1.93563 11.822 1.97131C12.5868 2.18272 13.28 2.59738 13.828 3.17123C14.4003 3.72299 14.8121 4.41973 15.0194 5.18714C15.0551 5.33655 15.0516 5.49264 15.0093 5.64031C14.967 5.78798 14.8873 5.92222 14.7779 6.03006L6.43797 14.3615C6.29965 14.4985 6.1203 14.5866 5.92726 14.6122L2.97989 15.0422C2.84066 15.0625 2.69861 15.0497 2.56525 15.0049C2.43189 14.96 2.31097 14.8844 2.21231 14.784C2.11365 14.6837 2.04003 14.5616 1.9974 14.4275C1.95477 14.2934 1.94435 14.1518 1.96697 14.013Z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_17_180"><rect width="17" height="17" fill="white" /></clipPath></defs></svg>`;
const deleteIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://w3.org"><g clip-path="url(#clip0_17_184)"><path d="M2.83333 3.54169H4.95833V2.83335C4.95833 2.45763 5.10759 2.0973 5.37327 1.83162C5.63894 1.56594 5.99928 1.41669 6.375 1.41669H10.625C11.0007 1.41669 11.3611 1.56594 11.6267 1.83162C11.8924 2.0973 12.0417 2.45763 12.0417 2.83335V3.54169H14.1667C14.3545 3.54169 14.5347 3.61632 14.6675 3.74915C14.8004 3.88199 14.875 4.06216 14.875 4.25002C14.875 4.43788 14.8004 4.61805 14.6675 4.75089C14.5347 4.88373 14.3545 4.95835 14.1667 4.25002H13.4583V14.1667C13.4583 14.5424 13.3091 14.9027 13.0434 15.1684C12.7777 15.4341 12.4174 15.5834 12.0417 15.5834H4.95833C4.58261 15.5834 4.22228 15.4341 3.9566 15.1684C3.69092 14.9027 3.54167 14.5424 3.54167 14.1667V4.95835H2.83333C2.64547 4.95835 2.4653 4.88373 2.33247 4.75089C2.19963 4.61805 2.125 4.43788 2.125 4.25002C2.125 4.06216 2.19963 3.88199 2.33247 3.74915C2.4653 3.61632 2.64547 3.54169 2.83333 3.54169ZM4.95833 4.95835V14.1667H12.0417V4.95835H4.95833ZM6.375 3.54169H10.625V2.83335H6.375V3.54169ZM6.375 6.37502H7.79167V12.75H6.375V6.37502ZM9.20833 6.37502H10.625V12.75H9.20833V6.37502Z" fill="currentColor"/></g><defs><clipPath id="clip0_17_184"><rect width="17" height="17" fill="white" /></clipPath></defs></svg>`;

export function renderBoard(todos) {
  const todoList = document.querySelector("#todo-list");
  const doingList = document.querySelector("#doing-list");
  const doneList = document.querySelector("#done-list");

  const todoCount = document.querySelector("#todo-count");
  const doingCount = document.querySelector("#doing-count");
  const doneCount = document.querySelector("#done-count");

  const todo = todos.filter((item) => item.status === "todo");
  const doing = todos.filter((item) => item.status === "doing");
  const done = todos.filter((item) => item.status === "done");

  if (todoList) renderColumn(todoList, todo);
  if (doingList) renderColumn(doingList, doing);
  if (doneList) renderColumn(doneList, done);

  if (todoCount) todoCount.textContent = todo.length;
  if (doingCount) doingCount.textContent = doing.length;
  if (doneCount) doneCount.textContent = done.length;
}

export function refreshBoardWithFilter() {
  const allTodos = getTodos();
  initStatistics(allTodos);
  const currentFilters = getFilterState ? getFilterState() : null;
  const filteredTodos = currentFilters
    ? getFilteredTodos(allTodos, currentFilters)
    : allTodos;
  renderBoard(filteredTodos);
}

//카드 렌더개수
const MAX_VISIBLE_CARDS = 3;
function renderColumn(container, todos) {
  // (기존유지)
  container.innerHTML = "";

  //접힘중복
  container.classList.remove("is-collapsed");

  //버튼중복
  const existingBtn = container.parentElement.querySelector(
    ".td-board__toggle-btn",
  );
  if (existingBtn) {
    existingBtn.remove();
  }

  // (기존유지)
  if (todos.length === 0) {
    container.appendChild(createEmpty());
    return;
  }

  // (기존유지)
  todos.forEach((todo) => {
    container.appendChild(createCard(todo));
  });

  //카드 기준 조건
  if (todos.length > MAX_VISIBLE_CARDS) {
    container.classList.add("is-collapsed");
    const toggleBtn = document.createElement("button");

    // CSS 클래스명
    toggleBtn.className = "td-board__toggle-btn";

    //개수
    toggleBtn.textContent = `+ (${todos.length - MAX_VISIBLE_CARDS})`;

    //이벤트 토글
    toggleBtn.addEventListener("click", () => {
      container.classList.toggle("is-collapsed");
      toggleBtn.classList.toggle("is-open");

      //상자 상태
      if (container.classList.contains("is-collapsed")) {
        toggleBtn.textContent = `+ (${todos.length - MAX_VISIBLE_CARDS})`;
      } else {
        toggleBtn.textContent = "-";
      }
    });

    //화면렌더
    container.parentElement.appendChild(toggleBtn);
  }
}

function createCard(todo) {
  const card = document.createElement("li");
  card.className = "td-card";

  if (todo.status === "done") {
    card.classList.add("td-card--done");
  }
  let dateHtml = `<div class="td-card__date-group">`;

  // 1. 생성 일자는 어떤 상태든 '항상' 기본으로 노출됩니다.
  dateHtml += `<time class="td-card__date td-card__date--create">생성일: ${formatDate(todo.createdAt)}</time>`;

  // 2. 완료 상태일 때는 완료 일자만 추가 표기 (수정 일자는 보여주지 않음)
  if (todo.status === "done") {
    const completedTime = todo.completedAt || Date.now();
    dateHtml += `<time class="td-card__date td-card__date--complete">완료일: ${formatDate(completedTime)}</time>`;
  }
  // 3. 완료 상태가 아니면서(todo 또는 doing) 수정 이력(updatedAt)이 존재할 때만 수정 일자 추가 표기
  else if (todo.updatedAt) {
    dateHtml += `<time class="td-card__date td-card__date--update">수정일: ${formatDate(todo.updatedAt)}</time>`;
  }

  dateHtml += `</div>`;

  card.innerHTML = `
    <div class="td-card__header">
      <span class="td-card__badge td-card__badge--${priorityClass(todo.priority)}">
        ${priorityText(todo.priority)}
      </span>

      <div class="td-card__action">
        <button class="td-card__btn-edit" data-id="${todo.id}">${editIcon}</button>
        <button class="td-card__btn-delete" data-id="${todo.id}">${deleteIcon}</button>
      </div>
    </div>

    <h4 class="td-card__title">${todo.title}</h4>
    <p class="td-card__content">${todo.content ?? ""}</p>
    
    ${dateHtml}
  `;

  const editBtn = card.querySelector(".td-card__btn-edit");
  const deleteBtn = card.querySelector(".td-card__btn-delete");

  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(null, todo);
    });
  }
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      openResetModal(e, todo.id);
    });
  }
  return card;
}



function createEmpty() {
  const empty = document.createElement("li");
  empty.className = "td-board__empty";
  empty.innerHTML = `
    ${emptyIcon}
    <p class="td-board__empty-text">할 일이 없습니다.</p>
  `;
  return empty;
}

function priorityClass(priority) {
  switch (priority) {
    case "high":
      return "high";
    case "mid":
      return "medium";
    default:
      return "low";
  }
}

function priorityText(priority) {
  switch (priority) {
    case "high":
      return "높음";
    case "mid":
      return "중간";
    default:
      return "낮음";
  }
}
