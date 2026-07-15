// 통계 영역 관리 JS 파일(화면 출력은 board.js, 이 파일에서는 계산만)
// 전체 Todo 통계 게산 및 통계 카드 UI 업데이트
// Total tasks, To Do, In Progress, Done, Achievement 계산
export function initStatistics(todos) {
  //데이터 갯수
  const totalTasks = todos.length;
  //status: todo | doing | done 필터
  const todoCount = todos.filter((todo) => todo.status === "todo").length;
  const doingCount = todos.filter((todo) => todo.status === "doing").length;
  const doneCount = todos.filter((todo) => todo.status === "done").length;
  //달성률 계산
  let percent = 0;
  let displayPercent = "0%";
  if (totalTasks > 0) {
    percent = Math.round((doneCount / totalTasks) * 100);
    displayPercent = percent + "%";
  }
  //html 숫자 렌더링
  document.querySelector(".td-list__card--total .td-list__count").textContent =
    totalTasks;
  document.querySelector(".td-list__card--todo .td-list__count").textContent =
    todoCount;
  document.querySelector(
    ".td-list__card--progress .td-list__count",
  ).textContent = doingCount;
  document.querySelector(".td-list__card--done .td-list__count").textContent =
    doneCount;
  document.querySelector("#achievement-percent").textContent = displayPercent;
  //wave
  const waveElement = document.querySelector("#achievementcircle .wave");
  if (waveElement) {
    waveElement.style.top = 100 - percent + "%";
  }
}
