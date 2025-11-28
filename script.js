/* ======= DOM ELEMENTS */
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const dateElement = document.getElementById("date");
const emptyState = document.querySelector(".empty-state");
const filters = document.querySelectorAll(".filter");

/* ======= GLOBAL VARS */
let todos = [];
let currentFilter = "all";

/* ======= FUNCTIONS */
function loadTodos() {
  todos = JSON.parse(localStorage.getItem("todos")) ?? [];
  renderTodos();
}

function addTodo(text) {
  if (text.trim() === "") return;

  const todo = {
    id: Date.now(),
    text,
    completed: false
  }

  todos.push(todo);

  saveTodos();
  renderTodos();
  taskInput.value = "";
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

function renderTodos() {
  todosList.innerHTML = "";

  const filteredTodos = filterTodos(currentFilter);
  filteredTodos.forEach(todo => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed");

    const checkBoxContainer = document.createElement("label");
    checkBoxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkBoxContainer.appendChild(checkbox);
    checkBoxContainer.appendChild(checkmark);

    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    todoItem.appendChild(checkBoxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(deleteBtn);

    todosList.appendChild(todoItem);
  })
}

function toggleTodo(id) {
  todos.map(todo => {
    if (todo.id === id) todo.completed = !todo.completed;
    return todo;
  });

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

function updateItemsCount() {
  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const itemsLeftMessage = `${uncompletedTodos.length == 0
    ? "Nenhum item restante"
    : uncompletedTodos.length == 1
      ? "Um item restante"
      : `${uncompletedTodos.length} itens restantes`
    }`

  itemsLeft.textContent = itemsLeftMessage;
  checkEmptyState();
}

function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos.length === 0) emptyState.classList.remove("hidden")
  else emptyState.classList.add("hidden");
}

function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter(todo => !todo.completed);
    case "completed":
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
}

function setActiveFilter(filter) {
  currentFilter = filter;
  filters.forEach(item => {
    if (item.getAttribute("data-filter") === filter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  })

  renderTodos();
}

function setDate() {
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric"
  }

  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("pt-BR", options);

}

/* ======= LISTENERS */
addTaskBtn.addEventListener("click", () => addTodo(taskInput.value));

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
})

clearCompletedBtn.addEventListener("click", clearCompleted);

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  })
})

/* ======= INITIALIZER */
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateItemsCount();
  setDate();
})