"use strict";

import {
  signIn,
  signUp,
  signOut,
  getSession,
  getDoc,
  setDoc,
  create,
  listMine,
  listAll,
  update,
  remove
} from "./firebase.js";

const $ = (id) => document.getElementById(id);

let currentSession = null;
let currentProfile = null;
let currentRole = null;
let tasks = [];
let bookings = [];
let gameIndex = 0;
let gameScore = 0;

const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language"
    ],
    correct: 0
  },
  {
    question: "Which language is commonly used to style web pages?",
    answers: ["Python", "CSS", "SQL"],
    correct: 1
  },
  {
    question: "Which keyword declares a constant in JavaScript?",
    answers: ["const", "repeat", "style"],
    correct: 0
  }
];

function message(text) {
  $("appMessage").textContent = text || "";
}

function authMessage(text) {
  $("authMessage").textContent = text || "";
}

function friendlyError(error) {
  console.error(error);
  return (error.message || "Something went wrong.")
    .replaceAll("INVALID_LOGIN_CREDENTIALS", "Incorrect email or password.")
    .replaceAll("EMAIL_EXISTS", "This email is already registered.")
    .replaceAll("EMAIL_NOT_FOUND", "No account was found for this email.")
    .replaceAll("INVALID_PASSWORD", "Incorrect email or password.")
    .replaceAll("INVALID_EMAIL", "Please enter a valid email address.")
    .replaceAll("WEAK_PASSWORD", "Choose a stronger password.");
}

function showAuth() {
  $("auth-section").hidden = false;
  $("portal").hidden = true;
}

function showPortal() {
  $("auth-section").hidden = true;
  $("portal").hidden = false;
}

function showView(view) {
  document.querySelectorAll(".view").forEach((section) => {
    section.hidden = true;
  });

  document.querySelectorAll("#navigation button[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  const learnerViews = ["tasks", "support", "game"];

  if (learnerViews.includes(view) && currentRole !== "learner") {
    view = "assessor";
  }

  if (view === "assessor" && currentRole !== "assessor") {
    view = "dashboard";
  }

  const viewIds = {
    dashboard: currentRole === "assessor"
      ? "assessor-dashboard"
      : "learner-dashboard",
    tasks: "tasks-view",
    support: "support-view",
    game: "game-view",
    assessor: "assessor-dashboard"
  };

  const section = $(viewIds[view]);
  if (section) section.hidden = false;

  const titles = {
    dashboard: currentRole === "assessor"
      ? "Assessor Dashboard"
      : "Learner Dashboard",
    tasks: "My Tasks",
    support: "Support Sessions",
    game: "Coding Game",
    assessor: "Assessor Workspace"
  };

  $("pageTitle").textContent = titles[view] || "Dashboard";
}

async function openPortal(session) {
  currentSession = session;

  let profile;

  try {
    profile = await getDoc("users", session.localId);
  } catch (error) {
    throw new Error(
      "Could not load your profile. Check your Firestore collection name and Security Rules. " +
      friendlyError(error)
    );
  }

  if (!profile) {
    throw new Error(
      "Your account has no profile in the users collection. Please create the profile first."
    );
  }

  currentProfile = profile;
  currentRole = profile.role === "assessor" ? "assessor" : "learner";

  showPortal();

  $("userWelcome").textContent =
    `Welcome, ${profile.displayName || profile.email || "User"}`;

  $("roleLabel").textContent =
    currentRole === "assessor" ? "Assessor account" : "Learner account";

  $("assessorNav").hidden = currentRole !== "assessor";
  $("tasksNav").hidden = currentRole !== "learner";
  $("supportNav").hidden = currentRole !== "learner";
  $("gameNav").hidden = currentRole !== "learner";

  document.querySelectorAll("#navigation button[data-view]").forEach((button) => {
    button.onclick = () => {
      showView(button.dataset.view);
      message("");

      if (button.dataset.view === "tasks") loadTasks();
      if (button.dataset.view === "support") loadLearnerBookings();
      if (button.dataset.view === "assessor") loadAssessorBookings();
    };
  });

  $("printBtn").onclick = () => window.print();

  if (currentRole === "assessor") {
    showView("dashboard");
    await loadAssessorBookings();
  } else {
    showView("dashboard");
    await Promise.all([loadTasks(), loadLearnerBookings()]);
  }

  message("Your portal is ready.");
}

// ========================================
// AUTHENTICATION
// ========================================

$("authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage("Signing in...");

  try {
    const session = await signIn(
      $("email").value.trim(),
      $("password").value
    );

    await openPortal(session);
    authMessage("");
  } catch (error) {
    authMessage(friendlyError(error));
  }
});

$("registerBtn").addEventListener("click", async () => {
  const email = $("email").value.trim();
  const password = $("password").value;
  const displayName = $("displayName").value.trim();

  if (!email || !password) {
    authMessage("Enter an email address and password first.");
    return;
  }

  if (password.length < 6) {
    authMessage("Your password must be at least 6 characters.");
    return;
  }

  if (!displayName) {
    authMessage("Enter your name before creating an account.");
    return;
  }

  authMessage("Creating your learner account...");

  try {
    const session = await signUp(email, password);

    await setDoc("users", session.localId, {
      email,
      displayName,
      role: "learner",
      createdAt: new Date().toISOString()
    });

    await openPortal(session);
    authMessage("");
  } catch (error) {
    authMessage(friendlyError(error));
  }
});

$("logoutBtn").addEventListener("click", () => {
  signOut();
  currentSession = null;
  currentProfile = null;
  currentRole = null;
  tasks = [];
  bookings = [];
  $("authForm").reset();
  showAuth();
  authMessage("You have signed out.");
  message("");
});

// ========================================
// LEARNER TASKS
// ========================================

async function loadTasks() {
  if (currentRole !== "learner") return;

  try {
    tasks = await listMine("tasks", currentSession.localId);
    renderTasks();
    renderTaskStats();
  } catch (error) {
    message("Could not load tasks: " + friendlyError(error));
  }
}

function renderTaskStats() {
  const completed = tasks.filter((task) => task.completed === true).length;
  const outstanding = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  $("totalTasks").textContent = tasks.length;
  $("completedTasks").textContent = completed;
  $("outstandingTasks").textContent = outstanding;
  $("progressPercent").textContent = `${progress}%`;
  $("progressBar").style.width = `${progress}%`;
}

function renderTasks() {
  const container = $("taskList");
  container.replaceChildren();

  const search = $("taskSearch").value.trim().toLowerCase();

  const filtered = tasks.filter((task) =>
    (task.title || "").toLowerCase().includes(search)
  );

  if (!filtered.length) {
    container.textContent = "No tasks found. Add a task to get started.";
    return;
  }

  filtered.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = task.title || "Untitled task";

    const due = document.createElement("p");
    due.textContent = task.dueDate
      ? `Due: ${task.dueDate}`
      : "No due date";

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = task.completed ? "Completed" : "Outstanding";

    details.append(title, due, status);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggle = document.createElement("button");
    toggle.textContent = task.completed ? "Reopen" : "Complete";
    toggle.className = "success";
    toggle.onclick = async () => {
      try {
        await update("tasks", task.id, {
          completed: !task.completed
        });
        await loadTasks();
        message("Task updated.");
      } catch (error) {
        message(friendlyError(error));
      }
    };

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.className = "secondary";
    edit.onclick = async () => {
      const titleValue = prompt("Enter the task title:", task.title || "");
      if (titleValue === null || !titleValue.trim()) return;

      try {
        await update("tasks", task.id, {
          title: titleValue.trim()
        });
        await loadTasks();
        message("Task updated.");
      } catch (error) {
        message(friendlyError(error));
      }
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "danger";
    del.onclick = async () => {
      if (!confirm("Delete this task?")) return;

      try {
        await remove("tasks", task.id);
        await loadTasks();
        message("Task deleted.");
      } catch (error) {
        message(friendlyError(error));
      }
    };

    actions.append(toggle, edit, del);
    item.append(details, actions);
    container.appendChild(item);
  });
}

$("taskForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (currentRole !== "learner") return;

  try {
    await create("tasks", {
      userId: currentSession.localId,
      title: $("taskTitle").value.trim(),
      dueDate: $("taskDueDate").value,
      completed: false,
      createdAt: new Date().toISOString()
    });

    $("taskForm").reset();
    await loadTasks();
    message("Task created successfully.");
  } catch (error) {
    message("Could not create task: " + friendlyError(error));
  }
});

$("taskSearch").addEventListener("input", renderTasks);

// ========================================
// SUPPORT BOOKINGS
// ========================================

async function loadLearnerBookings() {
  if (currentRole !== "learner") return;

  try {
    bookings = await listMine("supportBookings", currentSession.localId);
    renderLearnerBookings();
  } catch (error) {
    message("Could not load your bookings: " + friendlyError(error));
  }
}

function renderLearnerBookings() {
  const container = $("learnerBookings");
  container.replaceChildren();

  if (!bookings.length) {
    container.textContent = "You have not made any support bookings yet.";
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement("div");
    item.className = "booking-item";

    const details = document.createElement("div");
    const topic = document.createElement("strong");
    topic.textContent = booking.topic || "Support session";

    const date = document.createElement("p");
    date.textContent = `Preferred date: ${booking.date || "Not set"}`;

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = booking.status || "pending";

    details.append(topic, date, status);
    item.append(details);
    container.appendChild(item);
  });
}

$("bookingForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (currentRole !== "learner") return;

  try {
    await create("supportBookings", {
      userId: currentSession.localId,
      email: currentProfile.email,
      learnerName: currentProfile.displayName || "",
      topic: $("supportTopic").value.trim(),
      date: $("supportDate").value,
      notes: $("supportNotes").value.trim(),
      status: "pending",
      createdAt: new Date().toISOString()
    });

    $("bookingForm").reset();
    await loadLearnerBookings();
    message("Support booking submitted.");
  } catch (error) {
    message("Could not submit booking: " + friendlyError(error));
  }
});

// ========================================
// ASSESSOR WORKSPACE
// ========================================

async function loadAssessorBookings() {
  if (currentRole !== "assessor") return;

  const container = $("assessorBookings");
  container.textContent = "Loading bookings...";

  try {
    bookings = await listAll("supportBookings");

    const pending = bookings.filter(
      (booking) => (booking.status || "pending") === "pending"
    ).length;

    const confirmed = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    const completed = bookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    $("totalBookings").textContent = bookings.length;
    $("pendingBookings").textContent = pending;
    $("confirmedBookings").textContent = confirmed;
    $("completedBookings").textContent = completed;

    renderAssessorBookings();
  } catch (error) {
    container.textContent = "Could not load bookings: " + friendlyError(error);
  }
}

function renderAssessorBookings() {
  const container = $("assessorBookings");
  container.replaceChildren();

  if (!bookings.length) {
    container.textContent = "No learner support bookings have been submitted yet.";
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement("div");
    item.className = "booking-item";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = booking.learnerName || booking.email || "Learner";

    const topic = document.createElement("p");
    topic.textContent = `Topic: ${booking.topic || "Not specified"}`;

    const date = document.createElement("p");
    date.textContent = `Preferred date: ${booking.date || "Not set"}`;

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = booking.status || "pending";

    details.append(name, topic, date, status);

    const controls = document.createElement("div");
    controls.className = "task-actions";

    const statusSelect = document.createElement("select");
    statusSelect.setAttribute("aria-label", "Booking status");

    ["pending", "confirmed", "completed", "cancelled"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = (booking.status || "pending") === value;
      statusSelect.appendChild(option);
    });

    const save = document.createElement("button");
    save.textContent = "Update status";
    save.onclick = async () => {
      try {
        await update("supportBookings", booking.id, {
          status: statusSelect.value
        });
        await loadAssessorBookings();
        message("Booking status updated.");
      } catch (error) {
        message("Could not update status: " + friendlyError(error));
      }
    };

    controls.append(statusSelect, save);
    item.append(details, controls);
    container.appendChild(item);
  });
}

$("viewBookingsBtn").addEventListener("click", async () => {
  showView("assessor");
  await loadAssessorBookings();
});

// ========================================
// CODING GAME
// ========================================

$("startGameBtn").addEventListener("click", startGame);

function startGame() {
  gameIndex = 0;
  gameScore = 0;
  $("gameResult").textContent = "";
  renderQuestion();
}

function renderQuestion() {
  const box = $("gameBox");
  box.replaceChildren();

  if (gameIndex >= questions.length) {
    finishGame();
    return;
  }

  const question = questions[gameIndex];
  $("gameProgress").textContent =
    `Question ${gameIndex + 1} of ${questions.length}`;

  const title = document.createElement("h3");
  title.textContent = question.question;
  box.appendChild(title);

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.onclick = () => {
      if (index === question.correct) gameScore++;
      gameIndex++;
      renderQuestion();
    };
    box.appendChild(button);
  });
}

async function finishGame() {
  $("gameProgress").textContent = "Game completed!";
  $("gameBox").replaceChildren();
  $("gameResult").textContent =
    `Your score: ${gameScore} out of ${questions.length}`;

  if (currentRole !== "learner") return;

  try {
    await create("gameScores", {
      userId: currentSession.localId,
      score: gameScore,
      total: questions.length,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    message("Game finished, but the score could not be saved: " +
      friendlyError(error));
  }
}

// ========================================
// STARTUP
// ========================================

async function startPortal() {
  const session = getSession();

  if (!session) {
    showAuth();
    return;
  }

  try {
    await openPortal(session);
  } catch (error) {
    signOut();
    showAuth();
    authMessage(friendlyError(error));
  }
}

startPortal();
