// Todo 데이터 관리(CRUD)
let todos = [];
// - Todo 생성(create)
export function createTodo(todoData) {
  const newTodo = {
    id: Date.now(),

    title: todoData.title,
    content: todoData.content,

    status: todoData.status || "todo",
    priority: todoData.priority || "medium",

    createdAt: new Date(),
    updatedAt: null,
    completedAt: null,
  };

  todos.push(newTodo);

  return newTodo;
}

// - Todo 조회(Read)

export function getTodos() {
  return todos;
}

// - Todo 수정(Update)

function updateTodo(id, updateData) {
  const todo = todos.find((item) => item.id === id);
  
  if(!todo) return;

  todo.title = updateData.title;
  todo.content = updateData.content;
  todo.priority = updateData.priority;
  todo.status = updateData.status;

  todo.updatedAt = date.now();

  if(todo.status === "done") {
    todo.completedAt = Date.now()
  }

  return todo;
}
// - Todo 삭제(Delete)
export function deleteTodo(id) {
  todos = todos.filter(
    (item) => item.id !== id
  );
}
// - Todo 상태 변경(TODO/ In Progress / Done)
export function updateStatus(id, status) {

  const todo = todos.find(
    (todo) => todo.id === id
  );

  if (!todo) return;

  todo.status = status;
  todo.updatedAt = new Date();

  // done
  if (status === "DONE") {
    todo.completedAt = new Date();
  }

  return
}

// createdAt, updatedAt, completedAt 관리

// board.js: 화면 렌더링
// status.js: 통계 계산
// controls.js: 검색, 필터, 정렬
// modal.js: 모달