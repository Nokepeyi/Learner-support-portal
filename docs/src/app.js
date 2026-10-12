
// ==========================================
// DOM ELEMENTS
// ==========================================

const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const publicHomepage = document.getElementById("public-homepage");
const learnerDashboard = document.getElementById("learner-dashboard");
const assessorDashboard = document.getElementById("assessor-dashboard");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginMessage = document.getElementById("login-message");
const registrationMessage = document.getElementById("registration-message");
const sectionButtons = document.querySelectorAll("[data-section]");
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("task-form");
const taskIdInput = document.getElementById("taskId");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskSubjectInput = document.getElementById("taskSubject");
const taskCategoryInput = document.getElementById("taskCategory");
const taskDueDateInput = document.getElementById("taskDueDate");
const taskPriorityInput = document.getElementById("taskPriority");
const taskFormMessage = document.getElementById("task-form-message");
const cancelTaskEditButton = document.getElementById("cancelTaskEditBtn");
const learnerFeedbackList = document.getElementById("learnerFeedbackList");
const assessorFeedbackStatus = document.getElementById("assessorFeedbackStatus");
const assessorFeedbackList = document.getElementById("assessorFeedbackList");
const assessorFeedbackForm = document.getElementById("assessor-feedback-form");
const supportRequestForm = document.getElementById("support-request-form");
const learnerSupportRequestsList = document.getElementById("learnerSupportRequests");
const supportRequestStatus = document.getElementById("supportRequestStatus");
const assessorSupportRequestsList = document.getElementById("assessorSupportRequests");
const supportDateInput = document.getElementById("supportDate");
const resourceFilter = document.getElementById("resourceFilter");
const learnerSearch = document.getElementById("learnerSearch");
const learnerList = document.getElementById("learnerList");
const submissionList = document.getElementById("submissionList");
let currentSessionEmail = "";
let tasks = [];
let feedbackRecords = [];
let supportRequests = [];
let editingTaskId = null;

try {
  const savedTasks = localStorage.getItem("learnerTasks");
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
  if (!Array.isArray(tasks)) tasks = [];
  tasks = tasks.map((task) => ({
    ...task,
    learnerEmail: task.learnerEmail || "unknown@example.com",
    learnerName: task.learnerName || task.learnerEmail || "Unknown student",
    status: task.status || (task.completed ? "submitted" : "not-started"),
    updatedAt: task.updatedAt || task.createdAt || Date.now(),
  }));
} catch {
  tasks = [];
}

try {
  const savedFeedback = localStorage.getItem("learnerFeedback");
  feedbackRecords = savedFeedback ? JSON.parse(savedFeedback) : [];
  if (!Array.isArray(feedbackRecords)) feedbackRecords = [];
} catch {
  feedbackRecords = [];
}

try {
  const savedSupportRequests = localStorage.getItem("learnerSupportRequests");
  supportRequests = savedSupportRequests ? JSON.parse(savedSupportRequests) : [];
  if (!Array.isArray(supportRequests)) supportRequests = [];
} catch {
  supportRequests = [];
}

// ==========================================
// NAVIGATION
// ==========================================

function showSection(dashboard, sectionToShow) {
  dashboard.querySelectorAll(".dashboard-section").forEach((section) => {
    section.hidden = section !== sectionToShow;
  });
  sectionToShow.hidden = false;
}

function setActiveNavigation(dashboard, button) {
  dashboard.querySelectorAll(".nav-button").forEach((navButton) => {
    navButton.classList.toggle("active", navButton === button);
  });
}

function handleSectionNavigation(button) {
  const dashboard = button.closest(".portal-dashboard");
  if (!dashboard) return;

  const sectionId = button.dataset.section;
  const section = dashboard.querySelector(`#${sectionId}`);

  if (!section) return;

  showSection(dashboard, section);

  const matchingNavButton = dashboard.querySelector(
    `.nav-button[data-section="${sectionId}"]`
  );

  if (matchingNavButton) {
    setActiveNavigation(dashboard, matchingNavButton);
  }
}

function resetToLogin() {
  learnerDashboard.hidden = true;
  assessorDashboard.hidden = true;
  registerPage.hidden = true;
  loginPage.hidden = false;
  loginForm.reset();
  loginMessage.textContent = "";
}

function showLogin() {
  registerPage.hidden = true;
  loginPage.hidden = false;
  registrationMessage.textContent = "";
}

document.getElementById("show-register").addEventListener("click", () => {
  loginPage.hidden = true;
  registerPage.hidden = false;
  registrationMessage.textContent = "";
  document.getElementById("register-name").focus();
});

document.getElementById("show-login").addEventListener("click", showLogin);

document.querySelectorAll("[data-open-auth]").forEach((button) => {
  button.addEventListener("click", () => {
    const { openAuth, role } = button.dataset;
    publicHomepage.hidden = true;

    if (openAuth === "register") {
      loginPage.hidden = true;
      registerPage.hidden = false;
      registrationMessage.textContent = "";
      if (role) {
        const roleOption = registerForm.querySelector(
          `input[name="register-role"][value="${role}"]`
        );
        if (roleOption) roleOption.checked = true;
      }
      document.getElementById("register-name").focus();
      return;
    }

    registerPage.hidden = true;
    loginPage.hidden = false;
    loginMessage.textContent = "";
    if (role) {
      const roleOption = loginForm.querySelector(
        `input[name="user-role"][value="${role}"]`
      );
      if (roleOption) roleOption.checked = true;
    }
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const password = document.getElementById("register-password").value;
  const confirmation = document.getElementById("confirm-password").value;

  if (password !== confirmation) {
    registrationMessage.textContent = "Passwords do not match.";
    document.getElementById("confirm-password").focus();
    return;
  }

  registrationMessage.textContent =
    "Details validated. Account creation is not connected to authentication yet.";
});

// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedRole = loginForm.querySelector('input[name="user-role"]:checked').value;
  currentSessionEmail = document.getElementById("email").value.trim().toLowerCase();
  loginMessage.textContent = "";
  loginPage.hidden = true;
  learnerDashboard.hidden = selectedRole !== "learner";
  assessorDashboard.hidden = selectedRole !== "assessor";

  const dashboard = selectedRole === "assessor" ? assessorDashboard : learnerDashboard;
  const initialSection = dashboard.querySelector(".dashboard-section");
  const initialNavigation = dashboard.querySelector(".nav-button[data-section]");
  showSection(dashboard, initialSection);
  setActiveNavigation(dashboard, initialNavigation);
  if (selectedRole === "learner") renderLearnerFeedback();
  if (selectedRole === "assessor") {
    renderAssessorFeedback();
    renderAssessorWork();
    renderAssessorSupportRequests();
  }
  if (selectedRole === "learner") renderLearnerSupportRequests();
});

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => handleSectionNavigation(button));
});

// ==========================================
// LOGOUT
// ==========================================

document.getElementById("logoutBtn").addEventListener("click", resetToLogin);
document.getElementById("assessorLogoutBtn").addEventListener("click", resetToLogin);

function saveFeedback() {
  localStorage.setItem("learnerFeedback", JSON.stringify(feedbackRecords));
}

function renderLearnerFeedback() {
  learnerFeedbackList.replaceChildren();
  const learnerFeedback = feedbackRecords.filter(
    (feedback) => feedback.studentEmail === currentSessionEmail
  );

  if (learnerFeedback.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No feedback yet.";
    learnerFeedbackList.appendChild(emptyMessage);
    return;
  }

  learnerFeedback
    .slice()
    .sort((first, second) => second.createdAt - first.createdAt)
    .forEach((feedback) => {
      const entry = document.createElement("article");
      const status = feedback.status || "new";
      entry.className = `feedback-entry feedback-${status}`;

      const heading = document.createElement("div");
      heading.className = "feedback-entry-heading";
      const subjectNames = {
        html: "HTML",
        css: "CSS",
        javascript: "JavaScript",
        "web-development": "Web Development",
        "digital-literacy": "Digital Literacy",
        other: "Other",
      };
      const context = document.createElement("strong");
      const subjectName = subjectNames[feedback.subject] || "General";
      context.textContent = feedback.workTitle
        ? `${subjectName} · ${feedback.workTitle}`
        : subjectName;

      const statusLabel = document.createElement("span");
      statusLabel.className = "feedback-status";
      statusLabel.textContent = status === "discuss" ? "Discussion requested" : status === "read" ? "Reviewed" : "New";
      heading.append(context, statusLabel);

      const timestamp = document.createElement("time");
      timestamp.dateTime = new Date(feedback.createdAt).toISOString();
      timestamp.textContent = new Date(feedback.createdAt).toLocaleString();

      const message = document.createElement("p");
      message.textContent = feedback.message;

      const actions = document.createElement("div");
      actions.className = "feedback-entry-actions";

      if (status === "new") {
        const reviewedButton = document.createElement("button");
        reviewedButton.type = "button";
        reviewedButton.textContent = "Mark reviewed";
        reviewedButton.addEventListener("click", () => updateFeedbackStatus(feedback.id, "read"));

        const discussButton = document.createElement("button");
        discussButton.type = "button";
        discussButton.className = "feedback-discuss-button";
        discussButton.textContent = "I'd like to discuss this";
        discussButton.addEventListener("click", () => updateFeedbackStatus(feedback.id, "discuss"));
        actions.append(reviewedButton, discussButton);
      }

      entry.append(heading, timestamp, message, actions);
      learnerFeedbackList.appendChild(entry);
    });
}

function renderAssessorFeedback() {
  assessorFeedbackList.replaceChildren();
  const assessorNotes = feedbackRecords
    .slice()
    .sort((first, second) => second.createdAt - first.createdAt);

  if (assessorNotes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No feedback sent yet.";
    assessorFeedbackList.appendChild(emptyMessage);
    return;
  }

  assessorNotes.forEach((feedback) => {
    const entry = document.createElement("article");
    entry.className = "feedback-entry assessor-feedback-entry";

    const heading = document.createElement("div");
    heading.className = "feedback-entry-heading";
    const learner = document.createElement("strong");
    learner.textContent = feedback.studentEmail;
    const status = document.createElement("span");
    const responseStatus = feedback.status || "new";
    status.className = "feedback-status";
    status.textContent = responseStatus === "discuss"
      ? "Discussion requested"
      : responseStatus === "read"
        ? "Reviewed"
        : "Awaiting learner";
    heading.append(learner, status);

    const details = document.createElement("p");
    const subjectNames = {
      html: "HTML",
      css: "CSS",
      javascript: "JavaScript",
      "web-development": "Web Development",
      "digital-literacy": "Digital Literacy",
      other: "Other",
    };
    const subjectName = subjectNames[feedback.subject] || "General";
    details.textContent = feedback.workTitle
      ? `${subjectName} · ${feedback.workTitle}`
      : subjectName;

    const message = document.createElement("p");
    message.textContent = feedback.message;
    const timestamp = document.createElement("time");
    timestamp.dateTime = new Date(feedback.createdAt).toISOString();
    timestamp.textContent = new Date(feedback.createdAt).toLocaleString();

    entry.append(heading, details, message, timestamp);
    assessorFeedbackList.appendChild(entry);
  });
}

function updateFeedbackStatus(feedbackId, status) {
  const feedback = feedbackRecords.find((record) => record.id === feedbackId);
  if (!feedback) return;
  feedback.status = status;
  feedback.respondedAt = Date.now();
  saveFeedback();
  renderLearnerFeedback();
  renderAssessorFeedback();
}

assessorFeedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const learnerInput = document.getElementById("feedbackLearner");
  const subjectInput = document.getElementById("feedbackSubject");
  const workTitleInput = document.getElementById("feedbackWorkTitle");
  const messageInput = document.getElementById("feedbackMessage");
  const studentEmail = learnerInput.value.trim().toLowerCase();
  const message = messageInput.value.trim();

  feedbackRecords.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    studentEmail,
    subject: subjectInput.value,
    workTitle: workTitleInput.value.trim(),
    message,
    createdAt: Date.now(),
    status: "new",
  });
  saveFeedback();
  assessorFeedbackForm.reset();
  assessorFeedbackStatus.textContent = "Feedback sent. The learner can review it in their Feedback section.";
  renderAssessorFeedback();
});

window.addEventListener("storage", (event) => {
  if (event.key === "learnerFeedback") {
    try {
      feedbackRecords = event.newValue ? JSON.parse(event.newValue) : [];
      if (!Array.isArray(feedbackRecords)) feedbackRecords = [];
    } catch {
      feedbackRecords = [];
    }
    renderLearnerFeedback();
    renderAssessorFeedback();
  }
  if (event.key === "learnerSupportRequests") {
    try {
      supportRequests = event.newValue ? JSON.parse(event.newValue) : [];
      if (!Array.isArray(supportRequests)) supportRequests = [];
    } catch {
      supportRequests = [];
    }
    renderLearnerSupportRequests();
    renderAssessorSupportRequests();
  }
  if (event.key === "learnerTasks") {
    try {
      tasks = event.newValue ? JSON.parse(event.newValue) : [];
      if (!Array.isArray(tasks)) tasks = [];
      tasks = tasks.map((task) => ({
        ...task,
        learnerEmail: task.learnerEmail || "unknown@example.com",
        learnerName: task.learnerName || task.learnerEmail || "Unknown student",
        status: task.status || (task.completed ? "submitted" : "not-started"),
        updatedAt: task.updatedAt || task.createdAt || Date.now(),
      }));
    } catch {
      tasks = [];
    }
    renderTasks();
    renderAssessorWork();
  }
});

learnerSearch.addEventListener("input", renderAssessorWork);
renderAssessorFeedback();
renderAssessorDashboardStats();
renderAssessorWork();
renderRecentActivity();

// ==========================================
// LEARNER SUPPORT
// ==========================================

const supportTopicNames = {
  web: "Web development",
  programming: "Programming",
  security: "Cybersecurity",
  networking: "Networking",
  data: "Data and databases",
  tools: "Tools and workflow",
  other: "Other",
};

const urgencyNames = {
  standard: "When available",
  soon: "In the next few days",
  urgent: "As soon as possible",
};

const supportStatusNames = {
  received: "Received",
  "in-progress": "In progress",
  confirmed: "Confirmed",
  completed: "Completed",
  declined: "Declined",
};

function formatSupportDateTime(date, time) {
  if (!date || !time) return "Date and time not selected";
  return new Date(`${date}T${time}`).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderResources() {
  const selectedTopic = resourceFilter.value;
  const resourceCards = [...document.querySelectorAll(".resource-card")];
  let visibleCount = 0;

  resourceCards.forEach((card) => {
    const isVisible = selectedTopic === "all" || card.dataset.topic === selectedTopic;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  document.getElementById("resourceEmptyState").hidden = visibleCount !== 0;
}

function renderLearnerSupportRequests() {
  learnerSupportRequestsList.replaceChildren();
  const learnerRequests = supportRequests
    .filter((request) => request.studentEmail === currentSessionEmail)
    .slice()
    .sort((first, second) => second.createdAt - first.createdAt);

  if (learnerRequests.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No support requests yet.";
    learnerSupportRequestsList.appendChild(emptyMessage);
    return;
  }

  learnerRequests.forEach((request) => {
    const entry = document.createElement("article");
    entry.className = "support-request-entry";

    const heading = document.createElement("div");
    heading.className = "support-request-heading";
    const title = document.createElement("strong");
    title.textContent = request.subject;
    const status = document.createElement("span");
    status.className = "support-request-badge";
    status.textContent = supportStatusNames[request.status] || "Received";
    heading.append(title, status);

    const topic = document.createElement("span");
    topic.className = "support-request-topic";
    topic.textContent = `${supportTopicNames[request.topic] || "Other"} · ${urgencyNames[request.urgency] || urgencyNames.standard} · ${formatSupportDateTime(request.preferredDate, request.preferredTime)}`;

    const details = document.createElement("p");
    details.textContent = request.message;

    const timestamp = document.createElement("time");
    timestamp.dateTime = new Date(request.createdAt).toISOString();
    timestamp.textContent = new Date(request.createdAt).toLocaleString();

    entry.append(heading, topic, details, timestamp);
    if (request.response) {
      const response = document.createElement("p");
      response.className = "support-request-response";
      response.textContent = `Assessor: ${request.response}`;
      entry.appendChild(response);
    }
    learnerSupportRequestsList.appendChild(entry);
  });
}

function renderAssessorSupportRequests() {
  assessorSupportRequestsList.replaceChildren();
  const sortedRequests = supportRequests
    .slice()
    .sort((first, second) => second.createdAt - first.createdAt);

  if (sortedRequests.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No session requests yet.";
    assessorSupportRequestsList.appendChild(emptyMessage);
    return;
  }

  sortedRequests.forEach((request) => {
    const entry = document.createElement("article");
    entry.className = "support-request-entry";

    const heading = document.createElement("div");
    heading.className = "support-request-heading";
    const title = document.createElement("strong");
    title.textContent = request.subject;
    const learner = document.createElement("span");
    learner.className = "support-request-topic";
    learner.textContent = request.studentEmail;
    heading.append(title, learner);

    const details = document.createElement("p");
    details.textContent = request.message;
    const metadata = document.createElement("span");
    metadata.className = "support-request-topic";
    metadata.textContent = `${supportTopicNames[request.topic] || "Other"} · ${urgencyNames[request.urgency] || urgencyNames.standard} · Preferred: ${formatSupportDateTime(request.preferredDate, request.preferredTime)}`;

    const controls = document.createElement("div");
    controls.className = "support-response-controls";
    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status";
    const statusSelect = document.createElement("select");
    statusSelect.setAttribute("aria-label", `Status for ${request.subject}`);
    Object.entries(supportStatusNames).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = (request.status || "received") === value;
      statusSelect.appendChild(option);
    });
    statusLabel.appendChild(statusSelect);

    const responseLabel = document.createElement("label");
    responseLabel.textContent = "Message to learner";
    const responseInput = document.createElement("textarea");
    responseInput.maxLength = 600;
    responseInput.placeholder = "Add a session confirmation or short response";
    responseInput.value = request.response || "";
    responseLabel.appendChild(responseInput);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Save update";
    saveButton.addEventListener("click", () => {
      const matchingRequest = supportRequests.find((item) => item.id === request.id);
      if (!matchingRequest) return;
      matchingRequest.status = statusSelect.value;
      matchingRequest.response = responseInput.value.trim();
      matchingRequest.respondedAt = Date.now();
      localStorage.setItem("learnerSupportRequests", JSON.stringify(supportRequests));
      renderLearnerSupportRequests();
      renderAssessorSupportRequests();
    });
    controls.append(statusLabel, responseLabel, saveButton);

    entry.append(heading, metadata, details, controls);
    assessorSupportRequestsList.appendChild(entry);
  });
}

resourceFilter.addEventListener("change", renderResources);

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
supportDateInput.min = localToday;

supportRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!currentSessionEmail) {
    supportRequestStatus.textContent = "Sign in with your learner account to send a request.";
    return;
  }

  if (supportDateInput.value < localToday) {
    supportRequestStatus.textContent = "Choose today or a future date for your session.";
    return;
  }

  const request = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    studentEmail: currentSessionEmail,
    subject: document.getElementById("supportSubject").value.trim(),
    topic: document.getElementById("supportTopic").value,
    urgency: document.getElementById("supportUrgency").value,
    preferredDate: supportDateInput.value,
    preferredTime: document.getElementById("supportTime").value,
    message: document.getElementById("supportMessage").value.trim(),
    status: "received",
    createdAt: Date.now(),
  };

  supportRequests.push(request);
  localStorage.setItem("learnerSupportRequests", JSON.stringify(supportRequests));
  supportRequestForm.reset();
  supportRequestStatus.textContent = "Your request has been saved. You can track its status below.";
  renderLearnerSupportRequests();
  renderAssessorSupportRequests();
});

renderResources();
renderLearnerSupportRequests();
renderAssessorSupportRequests();

// ==========================================
// MINI-GAME
// ==========================================

const gameTopics = {
  html: [
    {
      question: "Which HTML element is used for the main heading of a page?",
      options: ["<header>", "<h1>", "<title>", "<main>"],
      answer: 1,
      explanation: "The h1 element represents the principal heading of a page or section.",
    },
    {
      question: "Which attribute provides alternative text for an image?",
      options: ["alt", "src", "title", "href"],
      answer: 0,
      explanation: "The alt attribute describes an image for screen readers and unavailable images.",
    },
    {
      question: "Which HTML element creates a paragraph?",
      options: ["<p>", "<para>", "<section>", "<text>"],
      answer: 0,
      explanation: "The p element represents a paragraph of text.",
    },
    {
      question: "Which element is used to create an unordered list?",
      options: ["<ol>", "<list>", "<ul>", "<li>"],
      answer: 2,
      explanation: "The ul element creates an unordered list, while li represents each item.",
    },
    {
      question: "What is the purpose of the action attribute on a form?",
      options: [
        "It identifies the form's submit button",
        "It gives the form a CSS class",
        "It determines where form data is sent",
        "It makes the form read-only",
      ],
      answer: 2,
      explanation: "The action attribute specifies the URL that receives submitted form data.",
    },
    {
      question: "Which semantic element is best for content that is independently meaningful, such as a news article?",
      options: ["<article>", "<div>", "<span>", "<aside>"],
      answer: 0,
      explanation: "The article element represents a self-contained piece of content.",
    },
    {
      question: "Which attribute must be added to an input element to make it required?",
      options: ["needed", "mandatory", "required", "validate"],
      answer: 2,
      explanation: "The required boolean attribute prevents form submission until the field is completed.",
    },
    {
      question: "What does the target=\"_blank\" attribute do on a link?",
      options: [
        "Opens the link in a new tab or window",
        "Makes the link invisible",
        "Loads the link without JavaScript",
        "Downloads the linked file automatically",
      ],
      answer: 0,
      explanation: "The _blank target opens the linked page in a new browsing context.",
    },
    {
      question: "Which element is used to define a table row?",
      options: ["<td>", "<tr>", "<th>", "<thead>"],
      answer: 1,
      explanation: "The tr element represents a table row containing cells.",
    },
    {
      question: "Which HTML attribute is used to identify a unique element on the page?",
      options: ["class", "type", "id", "name"],
      answer: 2,
      explanation: "The id attribute provides a unique identifier for one element in the document.",
    },
  ],
  css: [
    {
      question: "Which CSS selector targets an element with the class name card?",
      options: ["#card", ".card", "card", "card[]"],
      answer: 1,
      explanation: "A class selector begins with a period.",
    },
    {
      question: "Which property changes the text color?",
      options: ["background-color", "color", "font-size", "text-transform"],
      answer: 1,
      explanation: "The color property controls the foreground color of text.",
    },
    {
      question: "Which CSS property creates flexible spacing between child items?",
      options: ["justify-content", "font-family", "position", "border"],
      answer: 0,
      explanation: "justify-content controls the alignment and spacing of flex items along the main axis.",
    },
    {
      question: "Which CSS value makes an element display as a block-level box?",
      options: ["display: block;", "display: inline;", "display: none;", "display: flex;"],
      answer: 0,
      explanation: "The block display mode creates a full-width block-level element.",
    },
    {
      question: "Which property controls the space between an element's border and its content?",
      options: ["margin", "padding", "gap", "outline"],
      answer: 1,
      explanation: "Padding adds space inside the element, between its content and border.",
    },
    {
      question: "Which CSS layout system provides rows and columns?",
      options: ["Flexbox", "Grid", "Float layout", "Inline layout"],
      answer: 1,
      explanation: "CSS Grid defines two-dimensional layouts using rows and columns.",
    },
    {
      question: "Which selector selects every paragraph on a page?",
      options: ["#p", ".p", "p", "*p"],
      answer: 2,
      explanation: "The p selector targets all paragraph elements.",
    },
    {
      question: "Which property creates a visible border around an element?",
      options: ["border", "outline-color", "text-decoration", "background"],
      answer: 0,
      explanation: "The border property sets the border width, style, and color.",
    },
    {
      question: "Which value of position makes an element remain in the normal document flow?",
      options: ["fixed", "absolute", "sticky", "static"],
      answer: 3,
      explanation: "Static is the default position and keeps an element in normal flow.",
    },
    {
      question: "Which CSS declaration changes the background color to blue?",
      options: ["background: blue;", "color: blue;", "border-color: blue;", "text-color: blue;"],
      answer: 0,
      explanation: "The background property controls the element's background color.",
    },
  ],
  javascript: [
    {
      question: "Which keyword declares a block-scoped variable that can be reassigned?",
      options: ["const", "let", "var", "static"],
      answer: 1,
      explanation: "let creates a block-scoped variable that can be reassigned.",
    },
    {
      question: "What does const prevent?",
      options: [
        "Reassigning the variable's value",
        "Creating a variable",
        "Defining a function",
        "Using the DOM",
      ],
      answer: 0,
      explanation: "A const variable cannot be reassigned after its initial value is assigned.",
    },
    {
      question: "Which JavaScript method adds an item to the end of an array?",
      options: ["shift()", "unshift()", "push()", "slice()"],
      answer: 2,
      explanation: "push() adds one or more elements to the end of an array.",
    },
    {
      question: "What does a function return when it has no explicit return statement?",
      options: ["null", "false", "undefined", "0"],
      answer: 2,
      explanation: "A function without a return statement returns undefined.",
    },
    {
      question: "Which method selects an element by its ID?",
      options: ["document.querySelector()", "document.getElementById()", "document.getElementsByTagName()", "document.select()"],
      answer: 1,
      explanation: "getElementById() returns the element whose id matches the supplied value.",
    },
    {
      question: "Which operator checks whether two values are equal without comparing their type?",
      options: ["===", "==", "=", "!=="],
      answer: 1,
      explanation: "== performs loose equality and does not require the same data type.",
    },
    {
      question: "Which event occurs when a user clicks an element?",
      options: ["mouseover", "click", "submit", "keydown"],
      answer: 1,
      explanation: "The click event is triggered when the user activates an element with a pointer.",
    },
    {
      question: "What is the result of 5 + '5' in JavaScript?",
      options: ["10", "55", "NaN", "Error"],
      answer: 1,
      explanation: "The number 5 is converted to a string and concatenated with the other string.",
    },
    {
      question: "Which array method creates a new array containing only elements that pass a test?",
      options: ["filter()", "find()", "forEach()", "map()"],
      answer: 0,
      explanation: "filter() returns a new array containing elements that satisfy the provided test.",
    },
    {
      question: "What does the addEventListener() method attach to an element?",
      options: [
        "A CSS class",
        "An event handler",
        "A function's return value",
        "An HTML attribute",
      ],
      answer: 1,
      explanation: "addEventListener() registers a function to run when a specified event occurs.",
    },
  ],
  cybersecurity: [
    {
      question: "Which type of attack tricks a user into revealing sensitive information?",
      options: ["Phishing", "Defragmentation", "Compiling", "Caching"],
      answer: 0,
      explanation: "Phishing uses deceptive messages or websites to persuade users to share information.",
    },
    {
      question: "What is the safest way to create a strong password?",
      options: [
        "Use a short personal name",
        "Reuse the same password across sites",
        "Use a long password with random words and symbols",
        "Write it on a sticky note near your computer",
      ],
      answer: 2,
      explanation: "Long, unique passwords are much harder for attackers to guess or crack.",
    },
    {
      question: "What is malware?",
      options: [
        "A browser feature",
        "A type of software designed to harm or compromise a computer",
        "A safe backup tool",
        "A network cable",
      ],
      answer: 1,
      explanation: "Malware is software created to damage, disrupt, or gain unauthorized access to systems.",
    },
    {
      question: "Which security measure helps verify a user's identity?",
      options: ["Authentication", "Caching", "Compression", "Formatting"],
      answer: 0,
      explanation: "Authentication confirms that a user is who they claim to be.",
    },
    {
      question: "What is social engineering?",
      options: [
        "Using software to repair hardware",
        "Manipulating people into giving away information or access",
        "Installing an operating system",
        "Creating a secure network firewall",
      ],
      answer: 1,
      explanation: "Social engineering relies on human trust and manipulation rather than technical exploitation.",
    },
    {
      question: "Which security control helps protect a network by controlling incoming and outgoing traffic?",
      options: ["Firewall", "Browser cache", "Text editor", "Printer driver"],
      answer: 0,
      explanation: "A firewall filters network traffic according to security rules.",
    },
    {
      question: "What does multi-factor authentication add to password protection?",
      options: [
        "A second or additional verification step",
        "A stronger network cable",
        "Automatic password deletion",
        "A faster Wi-Fi connection",
      ],
      answer: 0,
      explanation: "Multi-factor authentication requires an additional proof of identity beyond a password.",
    },
    {
      question: "Which action is most appropriate after discovering a suspicious email attachment?",
      options: [
        "Open it to check its contents",
        "Forward it to colleagues",
        "Delete it and report it to the appropriate security contact",
        "Save it in case it is needed later",
      ],
      answer: 2,
      explanation: "Suspicious attachments should not be opened; they should be reported and handled securely.",
    },
    {
      question: "What is the main purpose of encryption?",
      options: [
        "To make files larger",
        "To convert information so only authorized parties can read it",
        "To delete old files",
        "To improve screen resolution",
      ],
      answer: 1,
      explanation: "Encryption protects data by making it unreadable to unauthorized users.",
    },
    {
      question: "Why should software be updated regularly?",
      options: [
        "Updates always remove all previous files",
        "Updates can fix security vulnerabilities and improve stability",
        "Updates make devices slower",
        "Updates are only useful for new hardware",
      ],
      answer: 1,
      explanation: "Security updates often fix vulnerabilities that attackers could exploit.",
    },
  ],
};

const gameQuestionHeading = document.getElementById("question");
const gameQuestionCount = document.getElementById("gameQuestionCount");
const gameOptions = document.querySelector(".game-options");
const gameOptionButtons = [...document.querySelectorAll(".answer-option")];
const gameFeedback = document.getElementById("gameFeedback");
const gameScoreDisplay = document.getElementById("gameScore");
const gameBestScoreDisplay = document.getElementById("gameBestScore");
const gameTopicSelect = document.getElementById("gameTopic");
const nextQuestionButton = document.getElementById("nextQuestionBtn");
const restartGameButton = document.getElementById("restartGameBtn");
let gameQuestions = gameTopics.html;
let currentGameQuestion = 0;
let currentGameScore = 0;
let gameQuestionAnswered = false;
let bestGameScore = Number(localStorage.getItem("skillShareGameBestScore")) || 0;

function renderGameQuestion() {
  const question = gameQuestions[currentGameQuestion];
  gameQuestionHeading.textContent = question.question;
  gameQuestionCount.textContent = `Question ${currentGameQuestion + 1} of ${gameQuestions.length}`;
  gameScoreDisplay.textContent = String(currentGameScore);
  gameFeedback.textContent = "";
  gameQuestionAnswered = false;
  nextQuestionButton.disabled = true;
  nextQuestionButton.hidden = false;
  restartGameButton.hidden = true;
  gameOptions.hidden = false;

  gameOptionButtons.forEach((button, index) => {
    button.textContent = question.options[index];
    button.disabled = false;
    button.classList.remove("correct", "incorrect");
    button.setAttribute("aria-pressed", "false");
  });
}

function answerGameQuestion(selectedIndex, selectedButton) {
  if (gameQuestionAnswered) return;
  gameQuestionAnswered = true;

  const question = gameQuestions[currentGameQuestion];
  const isCorrect = selectedIndex === question.answer;

  gameOptionButtons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
  });

  selectedButton.setAttribute("aria-pressed", "true");
  if (isCorrect) {
    currentGameScore += 1;
    gameScoreDisplay.textContent = String(currentGameScore);
    gameFeedback.textContent = `Correct. ${question.explanation}`;
  } else {
    selectedButton.classList.add("incorrect");
    gameFeedback.textContent = `Not quite. ${question.explanation}`;
  }

  nextQuestionButton.disabled = false;
}

function finishGame() {
  gameOptions.hidden = true;
  gameQuestionHeading.textContent = "Round complete!";
  gameQuestionCount.textContent = "Finished";
  nextQuestionButton.hidden = true;
  restartGameButton.hidden = false;

  if (currentGameScore > bestGameScore) {
    bestGameScore = currentGameScore;
    localStorage.setItem("skillShareGameBestScore", String(bestGameScore));
    gameBestScoreDisplay.textContent = String(bestGameScore);
  }

  gameFeedback.textContent = `You scored ${currentGameScore} out of ${gameQuestions.length}. Play again to improve your score.`;
}

function loadGameTopic(topic) {
  gameQuestions = gameTopics[topic];
  currentGameQuestion = 0;
  currentGameScore = 0;
  renderGameQuestion();
}

gameOptionButtons.forEach((button, index) => {
  button.addEventListener("click", () => answerGameQuestion(index, button));
});

gameTopicSelect.addEventListener("change", (event) => {
  loadGameTopic(event.target.value);
});

nextQuestionButton.addEventListener("click", () => {
  if (!gameQuestionAnswered) return;
  if (currentGameQuestion === gameQuestions.length - 1) {
    finishGame();
    return;
  }

  currentGameQuestion += 1;
  renderGameQuestion();
});

restartGameButton.addEventListener("click", () => {
  currentGameQuestion = 0;
  currentGameScore = 0;
  renderGameQuestion();
});

gameBestScoreDisplay.textContent = String(bestGameScore);
renderGameQuestion();

// ==========================================
// LEARNER TASKS
// ==========================================

function getTaskStatus(task) {
  if (task.status) return task.status;
  return task.completed ? "submitted" : "not-started";
}

function saveTasks() {
  localStorage.setItem("learnerTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No tasks available yet.";
    taskList.appendChild(emptyMessage);
  }

  tasks.forEach((task) => {
    const progress = getTaskStatus(task) === "reviewed" ? 100 : task.completed ? 100 : 0;
    const taskItem = document.createElement("article");
    taskItem.className = "task-item";

    const taskDetails = document.createElement("div");
    taskDetails.className = "task-details";

    const title = document.createElement("h4");
    title.textContent = task.title;
    taskDetails.appendChild(title);

    if (task.description) {
      const description = document.createElement("p");
      description.textContent = task.description;
      taskDetails.appendChild(description);
    }

    const metadata = document.createElement("span");
    const dueDate = task.dueDate ? `Due ${task.dueDate}` : "No due date";
    const category = task.category || "other";
    const subjects = {
      html: "HTML",
      css: "CSS",
      javascript: "JavaScript",
      "web-development": "Web Development",
      "digital-literacy": "Digital Literacy",
      other: "Other",
    };
    const subject = subjects[task.subject] || "Other";
    metadata.textContent = `${subject} · ${category} · ${task.priority} priority · ${dueDate}`;
    taskDetails.appendChild(metadata);

    const ring = document.createElement("div");
    ring.className = "task-progress-ring";
    ring.style.setProperty("--task-progress", `${progress}%`);
    ring.setAttribute("role", "progressbar");
    ring.setAttribute("aria-label", `${task.title} completion`);
    ring.setAttribute("aria-valuemin", "0");
    ring.setAttribute("aria-valuemax", "100");
    ring.setAttribute("aria-valuenow", String(progress));
    const ringValue = document.createElement("span");
    ringValue.textContent = `${progress}%`;
    ring.appendChild(ringValue);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editingTaskId = task.id;
      taskIdInput.value = task.id;
      taskTitleInput.value = task.title;
      taskDescriptionInput.value = task.description || "";
      taskSubjectInput.value = task.subject || "other";
      taskCategoryInput.value = task.category || "other";
      taskDueDateInput.value = task.dueDate || "";
      taskPriorityInput.value = task.priority || "medium";
      document.getElementById("addTaskBtn").textContent = "Save Changes";
      cancelTaskEditButton.hidden = false;
      taskFormMessage.textContent = "Editing task. Update the details and save your changes.";
      const createTaskSection = document.getElementById("create-task-section");
      showSection(learnerDashboard, createTaskSection);
      setActiveNavigation(
        learnerDashboard,
        learnerDashboard.querySelector('.nav-button[data-section="create-task-section"]')
      );
      taskTitleInput.focus();
    });

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = task.completed ? "Mark incomplete" : "Mark complete";
    toggleButton.setAttribute("aria-pressed", String(task.completed));
    toggleButton.addEventListener("click", () => {
      task.completed = !task.completed;
      task.status = task.completed ? "submitted" : "not-started";
      task.updatedAt = Date.now();
      saveTasks();
      renderTasks();
      renderAssessorWork();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      if (!window.confirm("Delete this task? This cannot be undone.")) return;
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.append(editButton, toggleButton, deleteButton);
    taskItem.append(taskDetails, ring, actions);
    taskList.appendChild(taskItem);
  });

  const completedCount = tasks.filter((task) => getTaskStatus(task) === "reviewed" || task.completed).length;
  document.getElementById("totalTasks").textContent = String(tasks.length);
  document.getElementById("completedTasks").textContent = String(completedCount);
  document.getElementById("outstandingTasks").textContent = String(tasks.length - completedCount);
  document.getElementById("progress").textContent = tasks.length
    ? String(Math.round((completedCount / tasks.length) * 100))
    : "0";

  if (assessorDashboard.hidden === false) renderAssessorWork();
}

function renderAssessorDashboardStats() {
  const learners = [...new Set(tasks.map((task) => task.learnerEmail || "unknown@example.com"))];
  const pendingSubmissions = tasks.filter((task) => getTaskStatus(task) === "submitted" || getTaskStatus(task) === "in-progress").length;
  const reviewedSubmissions = tasks.filter((task) => getTaskStatus(task) === "reviewed").length;
  const feedbackGiven = feedbackRecords.length;

  document.getElementById("totalLearners").textContent = String(learners.length);
  document.getElementById("pendingSubmissions").textContent = String(pendingSubmissions);
  document.getElementById("reviewedSubmissions").textContent = String(reviewedSubmissions);
  document.getElementById("feedbackGiven").textContent = String(feedbackGiven);
}

function renderAssessorWork() {
  const searchTerm = learnerSearch.value.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => {
    const learnerName = task.learnerName || task.learnerEmail || "Unknown student";
    return !searchTerm || learnerName.toLowerCase().includes(searchTerm) || (task.learnerEmail || "").toLowerCase().includes(searchTerm);
  });

  const learners = [...new Map(
    filteredTasks.map((task) => [task.learnerEmail || "unknown@example.com", task])
  ).values()];

  learnerList.replaceChildren();
  if (learners.length === 0) {
    learnerList.innerHTML = "<p>No learner work matches your search.</p>";
  } else {
    learners.forEach((task) => {
      const learnerTasks = filteredTasks.filter((item) => (item.learnerEmail || "unknown@example.com") === (task.learnerEmail || "unknown@example.com"));
      const learnerCard = document.createElement("article");
      learnerCard.className = "learner-work-card";
      learnerCard.innerHTML = `
        <div>
          <strong>${task.learnerName || task.learnerEmail || "Unknown student"}</strong>
          <span>${task.learnerEmail || "No email recorded"}</span>
        </div>
        <div class="learner-work-summary">
          <span>${learnerTasks.length} task${learnerTasks.length === 1 ? "" : "s"}</span>
          <strong>${learnerTasks.filter((item) => getTaskStatus(item) === "reviewed").length}/${learnerTasks.length} reviewed</strong>
        </div>
      `;
      learnerList.appendChild(learnerCard);
    });
  }

  submissionList.replaceChildren();
  if (filteredTasks.length === 0) {
    submissionList.innerHTML = "<p>No learner work matches your search.</p>";
    return;
  }

  filteredTasks
    .slice()
    .sort((first, second) => (second.updatedAt || second.createdAt || 0) - (first.updatedAt || first.createdAt || 0))
    .forEach((task) => {
      const entry = document.createElement("article");
      entry.className = "submission-entry";

      const heading = document.createElement("div");
      heading.className = "submission-heading";
      const learner = document.createElement("strong");
      learner.textContent = task.learnerName || task.learnerEmail || "Unknown student";
      const timestamp = document.createElement("time");
      timestamp.dateTime = new Date(task.updatedAt || task.createdAt || Date.now()).toISOString();
      timestamp.textContent = new Date(task.updatedAt || task.createdAt || Date.now()).toLocaleDateString();
      heading.append(learner, timestamp);

      const details = document.createElement("p");
      details.textContent = `${task.title} · ${task.subject || "Other"} · ${task.category || "Other"}`;

      const statusSelect = document.createElement("select");
      statusSelect.setAttribute("aria-label", `Update status for ${task.title}`);
      [
        ["not-started", "Not started"],
        ["in-progress", "In progress"],
        ["submitted", "Submitted"],
        ["reviewed", "Reviewed"],
      ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        option.selected = getTaskStatus(task) === value;
        statusSelect.appendChild(option);
      });
      statusSelect.addEventListener("change", () => updateTaskStatus(task.id, statusSelect.value));

      entry.append(heading, details, statusSelect);
      submissionList.appendChild(entry);
    });

  renderAssessorDashboardStats();
  renderRecentActivity();
}

function renderRecentActivity() {
  const recentTasks = tasks
    .slice()
    .sort((first, second) => (second.updatedAt || second.createdAt || 0) - (first.updatedAt || first.createdAt || 0))
    .slice(0, 5);
  const recentActivity = document.getElementById("recentActivity");

  recentActivity.replaceChildren();
  if (recentTasks.length === 0) {
    recentActivity.innerHTML = "<p>No recent activity.</p>";
    return;
  }

  recentTasks.forEach((task) => {
    const activity = document.createElement("article");
    activity.className = "activity-entry";
    activity.innerHTML = `
      <div>
        <strong>${task.learnerName || task.learnerEmail || "Unknown student"}</strong>
        <span>${task.title}</span>
      </div>
      <span class="activity-status">${getStatusLabel(task)}</span>
    `;
    recentActivity.appendChild(activity);
  });
}

function getStatusLabel(task) {
  const status = getTaskStatus(task);
  return {
    "not-started": "Not started",
    "in-progress": "In progress",
    submitted: "Submitted",
    reviewed: "Reviewed",
  }[status] || "Not started";
}

function updateTaskStatus(taskId, status) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.status = status;
  task.completed = status === "reviewed" || status === "submitted";
  task.updatedAt = Date.now();
  saveTasks();
  renderTasks();
  renderAssessorWork();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) {
    taskTitleInput.focus();
    return;
  }

  const taskDetails = {
    title,
    description: taskDescriptionInput.value.trim(),
    subject: taskSubjectInput.value,
    category: taskCategoryInput.value,
    dueDate: taskDueDateInput.value,
    priority: taskPriorityInput.value,
  };

  if (editingTaskId) {
    const taskToUpdate = tasks.find((task) => task.id === editingTaskId);
    if (taskToUpdate) Object.assign(taskToUpdate, taskDetails);
  } else {
    tasks.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...taskDetails,
      learnerEmail: currentSessionEmail || "unknown@example.com",
      learnerName: currentSessionEmail || "Unknown student",
      status: "not-started",
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskIdInput.value = "";
  editingTaskId = null;
  document.getElementById("addTaskBtn").textContent = "Create Task";
  cancelTaskEditButton.hidden = true;
  taskFormMessage.textContent = "";

  const dashboardSection = document.getElementById("dashboard-section");
  showSection(learnerDashboard, dashboardSection);
  setActiveNavigation(
    learnerDashboard,
    learnerDashboard.querySelector('.nav-button[data-section="dashboard-section"]')
  );
});

cancelTaskEditButton.addEventListener("click", () => {
  taskForm.reset();
  taskIdInput.value = "";
  editingTaskId = null;
  document.getElementById("addTaskBtn").textContent = "Create Task";
  cancelTaskEditButton.hidden = true;
  taskFormMessage.textContent = "Editing cancelled.";
  taskTitleInput.focus();
});

taskDueDateInput.min = new Date().toISOString().slice(0, 10);

renderTasks();
