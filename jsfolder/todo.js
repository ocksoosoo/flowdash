import { saveTodos, loadTodos } from "./storage.js";

// Todo 데이터 관리(CRUD)
let todos = loadTodos() || [];

// 초기 데이터 셋팅용 함수
export function initTodos(initialData) {
  todos = initialData || [];
  saveTodos(todos);
}

// - Todo 생성(create)
export function createTodo(todoData) {
  const newTodo = {
    id: Date.now(),

    title: todoData.title,
    content: todoData.content,

    status: todoData.status || "todo",
    priority: todoData.priority || "medium",

    createdAt: Date.now(),
    updatedAt: null,
    completedAt: null,
  };

  todos.push(newTodo);
  saveTodos(todos);

  return newTodo;
}

// - Todo 조회(Read)

export function getTodos() {
  return todos;
}

// - Todo 수정(Update)

export function updateTodo(id, updateData) {
  const todo = todos.find((item) => Number(item.id) === Number(id));
  
  if(!todo) return;

  todo.title = updateData.title;
  todo.content = updateData.content;
  todo.priority = updateData.priority;
  todo.status = updateData.status;

  todo.updatedAt = Date.now();

  if(todo.status === "done") {
    todo.completedAt = Date.now()
  }

  saveTodos(todos);
  return todo;
}
// - Todo 삭제(Delete)
export function deleteTodo(id) {
  const targetId = Number(id);
  todos = todos.filter((item) => Number(item.id) !== Number(id));
  
  saveTodos(todos);
}
// - Todo 상태 변경(TODO/ In Progress / Done)
export function updateStatus(id, status) {

  const todo = todos.find(
    (todo) => Number(todo.id) === Number(id)
  );

  if (!todo) return;

  todo.status = status;
  todo.updatedAt = Date.now();

  // done
  if (status === "done") {
    todo.completedAt = Date.now();
  } else {
    todo.completedAt = null;
  }

  saveTodos(todos);
  return todo;
}

