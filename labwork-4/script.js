// ===== Data =====
let tasks = [];   // each task: { id, text, completed }

// ===== Get elements from the page =====
const errorMessage = document.getElementById("errorMessage");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterCompleted = document.getElementById("filterCompleted");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let currentFilter = "all";   // "all", "active" or "completed"
// ===== Add a new task =====
function addTask() {
  const text = taskInput.value.trim();

  // Validation: block empty or spaces-only input
  if (text === "") {
    errorMessage.classList.remove("d-none");   // show the error
    taskInput.classList.add("is-invalid");     // red border on the input
    taskInput.focus();
    return;                                    // stop here, don't add
  }

  // Input is valid: hide any error
  errorMessage.classList.add("d-none");
  taskInput.classList.remove("is-invalid");

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}
// ===== Mark a task completed / active =====
function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;   // flip true <-> false
    }
  });
  renderTasks();
}
// ===== Delete a task =====
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;   // keep every task except the selected one
  });
  renderTasks();
}
// ===== Update the task counter =====
function updateCounter() {
  const activeCount = tasks.filter(function (task) {
    return !task.completed;
  }).length;

  if (activeCount === 1) {
    taskCounter.textContent = "1 task left";
  } else {
    taskCounter.textContent = activeCount + " tasks left";
  }
}

// ===== Clear all completed tasks =====
function clearCompleted() {
  tasks = tasks.filter(function (task) {
    return !task.completed;   // keep only the active tasks
  });
  renderTasks();
}
// ===== Draw the task list on the page =====
function renderTasks() {
  taskList.innerHTML = ""; 
  updateCounter();  // empty the list first

  // Pick only the tasks that match the current filter
  let visibleTasks = tasks;
  if (currentFilter === "active") {
    visibleTasks = tasks.filter(function (task) {
      return !task.completed;
    });
  } else if (currentFilter === "completed") {
    visibleTasks = tasks.filter(function (task) {
      return task.completed;
    });
  }

  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-3 mt-0";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // Task text
    const span = document.createElement("span");
    span.className = "flex-grow-1";
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add("task-completed");
    }

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-outline-danger btn-sm ms-2";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// ===== Events =====
addTaskBtn.addEventListener("click", addTask);

// Pressing Enter in the input also adds the task
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
// Hide the error as soon as the user starts typing
taskInput.addEventListener("input", function () {
  errorMessage.classList.add("d-none");
  taskInput.classList.remove("is-invalid");
});
// ===== Change the filter =====
function setFilter(filter, clickedButton) {
  currentFilter = filter;

  // Move the "active" highlight to the clicked button
  filterAll.classList.remove("active");
  filterActive.classList.remove("active");
  filterCompleted.classList.remove("active");
  clickedButton.classList.add("active");

  renderTasks();
}

filterAll.addEventListener("click", function () {
  setFilter("all", filterAll);
});

filterActive.addEventListener("click", function () {
  setFilter("active", filterActive);
});

filterCompleted.addEventListener("click", function () {
  setFilter("completed", filterCompleted);
});
clearCompletedBtn.addEventListener("click", clearCompleted);

// Draw the list once when the page loads so the counter shows "0 tasks left"
renderTasks();
