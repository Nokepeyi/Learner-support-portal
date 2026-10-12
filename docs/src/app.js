
"use strict";

// Store tasks while the portal is open
let tasks = [];

// Get the HTML elements we need
const taskListDiv = document.getElementById("taskList");
const taskTitleInput = document.getElementById("taskTitle");
const taskDueDateInput = document.getElementById("taskDueDate");
const searchInput = document.getElementById("searchInput");

// Calculate the percentage of completed tasks
const calculateProgress = () => {
  const total = tasks.length;

  if (total === 0) {
    return 0;
  }

  const completed = tasks.filter(task => task.completed).length;

  return Math.round((completed / total) * 100);
};

// Display tasks and update the dashboard
const renderTasks = (filterText = "") => {
  taskListDiv.innerHTML = "";

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(filterText.toLowerCase())
  );

  filteredTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";

    // Display the task title and due date
    const description = document.createElement("span");

    description.textContent =
      `${task.title} - Due: ${task.dueDate || "No date"}`;

    // Cross out completed tasks
    if (task.completed) {
      description.style.textDecoration = "line-through";
    }

    // Create the Complete/Outstanding button
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";

    toggleButton.textContent = task.completed
      ? "Mark Outstanding"
      : "Mark Complete";

    toggleButton.addEventListener("click", () => {
      toggleTask(task.id);
    });

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    // Add the elements to the task
    div.append(description, toggleButton, deleteButton);
    taskListDiv.appendChild(div);
  });

  // Update dashboard totals
  document.getElementById("totalTasks").textContent = tasks.length;

  document.getElementById("completedTasks").textContent =
    tasks.filter(task => task.completed).length;

  document.getElementById("outstanding").textContent =
    tasks.filter(task => !task.completed).length;

  document.getElementById("progress").textContent =
    calculateProgress();
};

// Add a new task
const addTask = () => {
  const title = taskTitleInput.value.trim();
  const dueDate = taskDueDateInput.value;

  if (!title) {
    alert("Please enter a task title.");
    taskTitleInput.focus();
    return;
  }

  if (!dueDate) {
    alert("Please select a due date.");
    taskDueDateInput.focus();
    return;
  }

  // Create and save the task in the current session
  tasks.push({
    id: Date.now().toString(),
    title: title,
    dueDate: dueDate,
    completed: false
  });

  // Clear the input fields
  taskTitleInput.value = "";
  taskDueDateInput.value = "";

  // Refresh the task list
  renderTasks(searchInput.value);
};

// Mark a task complete or outstanding
const toggleTask = (id) => {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  renderTasks(searchInput.value);
};

// Delete a task after confirmation
const deleteTask = (id) => {
  const confirmed = confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) {
    return;
  }

  tasks = tasks.filter(task => task.id !== id);

  renderTasks(searchInput.value);
};

// Search tasks as the user types
searchInput.addEventListener("input", event => {
  renderTasks(event.target.value);
});

// Connect the Add Task button
document.getElementById("addTaskBtn").addEventListener("click", addTask);

// Apply the saved display preference
const savedTheme = localStorage.getItem("theme") || "light";
document.body.className = savedTheme;

// Animate the navigation bar every second
let opacity = 1;

setInterval(() => {
  const nav = document.querySelector("nav");

  if (nav) {
    nav.style.opacity = opacity;
    opacity = opacity === 1 ? 0.8 : 1;
  }
}, 1000);

// Display the initial dashboard
renderTasks();
