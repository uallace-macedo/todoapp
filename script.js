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

  todos.push({
    id: Date.now(),
    text,
    completed: false
  });

  updateItemsCount();
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

  filterTodos(currentFilter)
    .forEach((todo) => {
      const todoItem = document.createElement("li");

      todoItem.classList.add("todo-item");
      todoItem.setAttribute("data-id", todo.id);

      if (todo.completed) todoItem.classList.add("completed");

      todoItem.innerHTML = `
      <button class="drag-btn">
          <i class="fa-solid fa-bars"></i>
      </button>
      
      <label class="checkbox-container">
          <input 
              type="checkbox" 
              class="todo-checkbox" 
              ${todo.completed ? 'checked' : ''} 
          />
          <span class="checkmark"></span>
      </label>
      
      <span class="todo-item-text">${todo.text}</span>
      
      <button class="delete-btn">
          <i class="fas fa-times"></i>
      </button>
    `;

      const checkbox = todoItem.querySelector(".todo-checkbox");
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const deleteBtn = todoItem.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      todosList.appendChild(todoItem);
    });

  updateItemsCount();
  checkEmptyState();
}

function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) todo.completed = !todo.completed;
    return todo;
  });

  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
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
  if (filteredTodos.length === 0) emptyState.classList.remove("hidden");
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

/* ======= SORTABLEJS LOGIC */

function updateTodosOrder(oldIndex, newIndex) {
  const movedTodo = todos[oldIndex];
  todos.splice(oldIndex, 1);
  todos.splice(newIndex, 0, movedTodo);
}

function initSortable() {
  new Sortable(todosList, {
    animation: 100,
    handle: '.drag-btn',
    delay: 10,

    onEnd: function (evt) {
      updateTodosOrder(evt.oldIndex, evt.newIndex);
    },
  });
}

/* ======= SIMPLES LISTENERS */
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
  initSortable();
})

window.addEventListener("beforeunload", () => {
  saveTodos();
});