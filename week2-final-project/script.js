let addNewButton = document.querySelector(".new-todo-button");
let newTodo = document.querySelector(".new-todo");
let closeButton = document.querySelector(".close");
let modalOverlay = document.querySelector(".modal-overlay");
let todoForm = document.querySelector("form");
let todoListContainer = document.querySelector("ul");
let emptyMessage = document.querySelector(".empty-message");
let searchArea = document.querySelector(".search");
let buttonArea = document.querySelector(".button-area");
let buttonCompleted = document.querySelector("#completed");
let buttonSortBy = document.querySelector("#sort-by");

let todos = [];

const toggleTodoModal = () => {
  newTodo.classList.toggle("active");
  modalOverlay.classList.toggle("active");
};

const sortByPriority = () => {
  try {
    todos.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    });
    todoListContainer.innerHTML = "";
    todos.forEach(addTodoList);
  } catch (error) {
    console.error("Sorting error:", error);
  }
};

let showingCompleted = false;

const completedList = () => {
  if (todos.length === 0) return;
  showingCompleted = !showingCompleted;
  todoListContainer.innerHTML = "";
  let filteredTodos = showingCompleted
    ? todos.filter((todo) => todo.completed)
    : todos;
  if (filteredTodos.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
    filteredTodos.forEach(addTodoList);
  }
  buttonCompleted.textContent = showingCompleted
    ? "Show All"
    : "Show Completed";
};

buttonCompleted.addEventListener("click", completedList);
closeButton.addEventListener("click", toggleTodoModal);
addNewButton.addEventListener("click", toggleTodoModal);
buttonSortBy.addEventListener("click", sortByPriority);

searchArea.addEventListener("input", () => {
  let searchValue = searchArea.value.toLowerCase().trim();
  let todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach((item) => {
    let title = item.querySelector("strong").textContent.toLowerCase();
    if (title.includes(searchValue)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});

todoForm.addEventListener("submit", (e) => {
  try {
    e.preventDefault();
    let todoItem = {};
    let titleInput = document.querySelector("#title");
    let commentArea = document.querySelector("#comment");
    let titleErrorMessage = document.querySelector("#title-error");
    let priorityErrorMessage = document.querySelector("#priority-error");
    let priorityAll = document.querySelectorAll(".priority-input");

    let title = titleInput.value.trim();
    let comment = commentArea.value.trim();

    let priorityInput = document.querySelector(
      'input[name="priority"]:checked'
    );
    let completedInput = document.querySelector(
      'input[name="completed"]:checked'
    );

    titleInput.classList.remove("error");
    priorityAll.forEach((input) => input.classList.remove("error"));
    titleErrorMessage.style.display = "none";
    priorityErrorMessage.style.display = "none";

    let hasError = false;

    if (!title) {
      titleErrorMessage.style.display = "block";
      titleInput.classList.add("error");
      hasError = true;
    }
    if (!priorityInput) {
      priorityErrorMessage.style.display = "block";
      priorityAll.forEach((input) => input.classList.add("error"));
      hasError = true;
    }
    if (hasError) return;

    let priorityValue = priorityInput.value;
    let completed = JSON.parse(completedInput.value);
    let uniqueId = generateId();

    todoItem = {
      id: uniqueId,
      title: title,
      comment: comment,
      priority: priorityValue,
      completed: completed,
    };
    todos.push(todoItem);
    addTodoList(todoItem);

    toggleTodoModal();
    todoForm.reset();
  } catch (error) {
    console.error("Error adding new todo:", error);
  }
});

const addTodoList = (todo) => {
  emptyMessage.style.display = todos.length === 0 ? "flex" : "none";
  buttonArea.style.display = todos.length > 0 ? "flex" : "none";

  const li = document.createElement("li");
  li.classList.add("todo-item");
  li.setAttribute("data-id", todo.id);

  if (todo.completed) {
    li.classList.add("completed");
  }

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");

  const span = document.createElement("span");
  span.classList.add("priority");
  if (todo.priority === "high") {
    span.classList.add("high");
  } else if (todo.priority === "medium") {
    span.classList.add("medium");
  } else {
    span.classList.add("low");
  }
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("todo-content");

  const strong = document.createElement("strong");
  strong.textContent = todo.title;
  strong.classList.add("todo-title");

  const p = document.createElement("p");
  p.textContent = todo.comment;
  p.classList.add("todo-description");

  contentDiv.appendChild(strong);
  contentDiv.appendChild(p);
  contentDiv.style.marginLeft = "10px";

  li.appendChild(span);
  li.appendChild(contentDiv);
  li.appendChild(deleteButton);

  document.querySelector(".todo-list").appendChild(li);
};

todoListContainer.addEventListener("click", (e) => {
  try {
    const todoItem = e.target.closest("li");
    if (!todoItem) return;
    const id = todoItem.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
      todos = todos.filter((todo) => todo.id !== id);
      todoItem.remove();
      if (todos.length === 0) {
        emptyMessage.style.display = "flex";
        buttonArea.style.display = todos.length > 0 ? "flex" : "none";
      }
      return;
    }
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    todoItem.classList.toggle("completed");
  } catch (error) {
    console.error("Error handling todo list action:", error);
  }
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
