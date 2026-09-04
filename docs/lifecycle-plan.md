# Programming Life-Cycle Plan - Learner Support Portal

## 1. Analysis
- Problem: SkillsTrack tracks goals/tasks/bookings in separate docs, no progress overview.
- Client: Needs single browser portal for learners to manage tasks, book support, track progress.
- Requirements: Registration, dashboard with calculations, task CRUD, booking validation, search/filter, printable summary, mini-game.

## 2. Design
- User Stories: 6 stories defined (see user-stories.md)
- Flowcharts: Login, Task Create, Progress Calc (completed/total*100), Delete Confirmation
- Data Model: Firestore collections - users/{uid}, tasks/{taskId}, bookings/{bookingId}, assignments, attendance, courses, notifications, resources, supportSessions
- Class Design: Class Task and Class User, Class Booking
- UI Wireframe: Login, Dashboard, Tasks, Support, Resources pages.

## 3. Coding
- Tools: VS Code + Prettier + ESLint, GitHub, Firebase Firestore, Vanilla JS ES6+
- Standards: use strict, let/const, arrow functions, modular files
- Features: Auth state, dashboard calc, CRUD via Firestore REST API (GET, POST, PATCH, DELETE), map/filter/reduce for search, createElement for dynamic tasks.

## 4. Testing
- Manual test cases: Register, Login, Add Task, Delete with confirmation, Progress calc, Print
- DevTools: console.log, breakpoints, network tab for REST calls, stack traces
- 3 bugs recorded in testing.md

## 5. Implementation Review
- GitHub repo with README,.gitignore, branches, PRs, CI lint workflow
- Firebase live link provided for assessor
- App shell deployed with navigation working

## 6. Improvement (Month 2)
- Add mini-game using Phaser.js
- Add animation with setInterval and multimedia control
- Improve security rules and input validation