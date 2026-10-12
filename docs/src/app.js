"use strict";
import * as api from "./api.js";
import { FALLBACK, startGame } from "./game.js";

const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
const say = (id, text, ok = false) => { $(id).textContent = text; $(id).className = ok ? "msg ok" : "msg err"; };
const today = () => new Date().toISOString().slice(0, 10);

let user = null, tasks = [], bookings = [], game = null, timer = null, shown = 0, muted = false;

// Cookie preference: theme only, never sensitive data
const getCookie = (n) => document.cookie.split("; ").find((c) => c.startsWith(n + "="))?.split("=")[1];
const setTheme = (t) => { document.body.className = t; document.cookie = `theme=${t};max-age=31536000;path=/;SameSite=Lax`; };
setTheme(getCookie("theme") || "light");
$("themeBtn").onclick = () => setTheme(document.body.className === "dark" ? "light" : "dark");

// Views and redirect
const show = (v) => {
  if (!user) v = "auth";
  document.querySelectorAll("[data-view]").forEach((s) => (s.hidden = s.dataset.view !== v));
  location.hash = v;
};
document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => show(b.dataset.go)));

// Sound (multimedia element, controlled by play/mute)
const tone = (freq, ms = 200) => {
  const sr = 8000, n = (sr * ms) / 1000, v = new DataView(new ArrayBuffer(44 + n));
  const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr, true);
  v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, "data"); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128 + Math.sin((2 * Math.PI * freq * i) / sr) * 100 * (1 - i / n));
  return URL.createObjectURL(new Blob([v], { type: "audio/wav" }));
};
const play = (freq) => { if (muted) return; const a = $("sfx"); a.src = tone(freq); a.currentTime = 0; a.play().catch(() => {}); };
$("muteBtn").onclick = () => { muted = !muted; $("sfx").pause(); $("muteBtn").textContent = `Sound: ${muted ? "off" : "on"}`; };

// Progress bar animation with setInterval
const animate = (target) => {
  clearInterval(timer);
  timer = setInterval(() => {
    shown += Math.sign(target - shown);
    $("bar").style.width = shown + "%";
    $("progress").textContent = shown;
    if (shown === target) clearInterval(timer);
  }, 15);
};

// Dashboard
const renderTasks = () => {
  const stats = tasks.reduce(
    (a, t) => ({ done: a.done + (t.completed ? 1 : 0), late: a.late + (!t.completed && t.dueDate && t.dueDate < today() ? 1 : 0) }),
    { done: 0, late: 0 }
  );
  $("totalTasks").textContent = tasks.length;
  $("completedTasks").textContent = stats.done;
  $("outstanding").textContent = tasks.length - stats.done;
  $("overdue").textContent = stats.late;
  animate(tasks.length ? Math.round((stats.done / tasks.length) * 100) : 0);

  const text = $("searchInput").value.toLowerCase(), status = $("statusFilter").value;
  const list = tasks
    .filter((t) => t.title.toLowerCase().includes(text))
    .filter((t) => status === "all" || (status === "done") === t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  $("taskList").replaceChildren(
    ...(list.length ? list.map(taskRow) : [el("p", { textContent: "No tasks match. Add one above or change the filter." })])
  );
};

const taskRow = (t) => {
  const late = !t.completed && t.dueDate < today();
  return el("div", { className: `item${t.completed ? " done" : ""}${late ? " late" : ""}` },
    el("span", { textContent: `${t.title} | ${t.category} | ${t.priority} | Due ${t.dueDate}${late ? " (overdue)" : ""}` }),
    el("span", {},
      el("button", { textContent: t.completed ? "Reopen" : "Complete", onclick: () => change(t, { completed: !t.completed }) }), " ",
      el("button", { className: "ghost", textContent: "Edit", onclick: () => { const title = prompt("New title", t.title); if (title?.trim()) change(t, { title: title.trim() }); } }), " ",
      el("button", { className: "danger", textContent: "Delete", onclick: () => del("tasks", t, "task") })
    ));
};

const change = async (t, patch) => {
  try { await api.update("tasks", t.id, patch); Object.assign(t, patch); renderTasks(); }
  catch (e) { say("taskMsg", e.message); }
};
const del = async (col, item, label) => {
  if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
  try {
    await api.remove(col, item.id);
    if (col === "tasks") { tasks = tasks.filter((x) => x.id !== item.id); renderTasks(); }
    else { bookings = bookings.filter((x) => x.id !== item.id); renderBookings(); }
  } catch (e) { say(col === "tasks" ? "taskMsg" : "bookingMsg", e.message); }
};

$("taskForm").onsubmit = async (e) => {
  e.preventDefault();
  const title = $("taskTitle").value.trim(), dueDate = $("taskDueDate").value;
  if (!title || !dueDate) return say("taskMsg", "Enter a title and a due date.");
  try {
    const t = await api.create("tasks", { userId: user.uid, title, dueDate, category: $("taskCategory").value, priority: $("taskPriority").value, completed: false, createdAt: new Date().toISOString() });
    tasks.push(t); e.target.reset(); say("taskMsg", "Task added.", true); renderTasks();
  } catch (err) { say("taskMsg", err.message); }
};
$("searchInput").oninput = renderTasks;
$("statusFilter").onchange = renderTasks;

// Bookings
const renderBookings = () =>
  $("bookingList").replaceChildren(...(bookings.length ? bookings.map((b) =>
    el("div", { className: "item" }, el("span", { textContent: `${b.topic} | ${b.preferredDate} | ${b.status}` }),
      el("button", { className: "danger", textContent: "Cancel", onclick: () => del("bookings", b, "booking") })))
    : [el("p", { textContent: "No bookings yet. Book a session above." })]));

$("bookingForm").onsubmit = async (e) => {
  e.preventDefault();
  const topic = $("bTopic").value.trim(), preferredDate = $("bDate").value;
  if (!topic || !preferredDate) return say("bookingMsg", "Enter a topic and a preferred date.");
  if (preferredDate < today()) return say("bookingMsg", "Choose today or a future date.");
  try {
    bookings.push(await api.create("bookings", { userId: user.uid, learner: user.name, topic, preferredDate, notes: $("bNotes").value.trim(), status: "Pending", createdAt: new Date().toISOString() }));
    e.target.reset(); say("bookingMsg", "Booking sent. An assessor will confirm it.", true); renderBookings();
  } catch (err) { say("bookingMsg", err.message); }
};

// Assessor view
const renderAssessor = (all) =>
  $("assessorList").replaceChildren(...(all.length ? all.map((b) => {
    const sel = el("select", {}, ...["Pending", "Confirmed", "Completed"].map((s) => el("option", { value: s, textContent: s, selected: s === b.status })));
    sel.onchange = () => api.update("bookings", b.id, { status: sel.value }).catch((e) => alert(e.message));
    return el("div", { className: "item" }, el("span", { textContent: `${b.learner} | ${b.topic} | ${b.preferredDate}` }), sel);
  }) : [el("p", { textContent: "No bookings submitted yet." })]));

// Mini-game
$("startGame").onclick = async () => {
  game?.destroy(true);
  say("gameMsg", "Loading questions...", true);
  let qs = [];
  try { qs = (await api.listAll("questions")).map((d) => ({ q: d.q, a: [d.a1, d.a2, d.a3, d.a4], c: d.c })); } catch { /* use fallback */ }
  if (qs.length < 3) qs = FALLBACK;
  say("gameMsg", "", true);
  game = startGame("gameBox", qs, (ok) => play(ok ? 880 : 220), async (score, total) => {
    play(660);
    try { await api.create("scores", { userId: user.uid, score, total, playedAt: new Date().toISOString() }); say("gameMsg", `Score ${score}/${total} saved.`, true); }
    catch (e) { say("gameMsg", "Score could not be saved: " + e.message); }
  });
};

// Auth
const enter = async () => {
  const s = api.getSession();
  user = { uid: s.localId, email: s.email, name: s.email, role: "learner" };
  try { const p = await api.getDoc("users", user.uid); user.name = p.displayName || user.name; user.role = p.role; } catch { /* profile missing */ }
  $("who").textContent = `${user.name} (${user.role})`;
  document.querySelectorAll(".assessor-only").forEach((e) => (e.hidden = user.role !== "assessor"));
  [tasks, bookings] = await Promise.all([api.listMine("tasks", user.uid), api.listMine("bookings", user.uid)]);
  if (user.role === "assessor") renderAssessor(await api.listAll("bookings"));
  renderTasks(); renderBookings(); show("dashboard");
};

const creds = () => {
  const email = $("email").value.trim(), password = $("password").value;
  if (!email || !password) { say("authMsg", "Enter your email and password."); return null; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { say("authMsg", "Enter a valid email address."); return null; }
  return { email, password };
};
$("authForm").onsubmit = async (e) => {
  e.preventDefault();
  const c = creds(); if (!c) return;
  try { await api.signIn(c.email, c.password); await enter(); } catch (err) { say("authMsg", err.message); }
};
$("registerBtn").onclick = async () => {
  const name = $("name").value.trim(), c = creds();
  if (!c) return;
  if (!name) return say("authMsg", "Enter your full name to register.");
  try {
    const s = await api.signUp(c.email, c.password);
    await api.setDoc("users", s.localId, { displayName: name, email: c.email, role: "learner", createdAt: new Date().toISOString() });
    await enter();
  } catch (err) { say("authMsg", err.message); }
};
$("logoutBtn").onclick = () => { api.signOut(); user = null; game?.destroy(true); $("authForm").reset(); say("authMsg", "You have been logged out.", true); show("auth"); };
$("printBtn").onclick = () => { show("dashboard"); window.print(); };

if (api.getSession()) enter().catch(() => show("auth")); else show("auth");
