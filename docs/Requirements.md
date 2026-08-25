# Requirements — SkillsTrack Learner Support Portal

 1. Problem Statement
Learners at SkillsTrack Training Centre currently record goals, tasks, support bookings and
progress across separate documents and messages. This makes it difficult for assessors to see
outstanding work, identify learners who need support, or track progress over time. The Learner
Support Portal addresses this by providing one authenticated, browser-based application where
learners can manage their tasks, request support and track progress, and where assessors can
view and respond to support requests.

 2. Project Scope

In scope:
- User registration, sign-in, sign-out and authenticated session state (Firebase Authentication).
- A dashboard showing task totals, completed work, outstanding work and calculated progress.
- Full CRUD task manager (create, read, update, delete).
- Support-session booking form with validation and status feedback.
- Search, filter and/or sort functionality using array methods.
- A non-sensitive cookie-based preference (e.g. theme).
- Confirmation dialog before destructive actions, a redirect after an appropriate action, and a
  printable progress summary.
- One JavaScript-timer-driven animation and one controlled multimedia element.
- A basic mini-game built with an approved framework/library, with results stored in Firebase.
- Firebase Realtime Database integration via documented REST CRUD operations.

Out of scope:

- Anything not explicitly listed in the client brief unless approved by the assessor.

 3. Constraints
- Must be built with HTML5, CSS3 and JavaScript (ES6+).
- Must use Firebase Realtime Database and Firebase Authentication (or an assessor-approved
  alternative).
- Database rules must not permit unrestricted public read/write access.
- Passwords and sensitive data may not be stored in cookies, the database in plain text, or
  source code.
- Secrets and service-account files may not be committed to GitHub.
- Must be developed in a team of three, using Git feature branches, pull requests and at least
  one peer review per learner.
- Delivered across two monthly milestones (Month 1 and Month 2) matching the assessment schedule.

 4. Client Requirements (from brief)
- Single, clear interface for managing learning tasks and support requests.
- Registered users can view their own information only.
- Meaningful calculations/summaries derived from stored data (e.g. progress percentage).
- Interactive mini-game reinforcing basic programming concepts.
- Team collaboration evidenced through GitHub (branches, PRs, merges, contribution history).

 5. User Stories & Acceptance Criteria

1. As a learner, I want to register and sign in so that I can access my own tasks and data.
   - Acceptance criteria: Registration requires name, email and password; invalid input shows
     an error; successful sign-in redirects to the dashboard; the user stays signed in until they
     sign out.

2. As a learner, I want to create, edit, complete and delete tasks so that I can manage my
   learning workload.
   - Acceptance criteria: A new task requires a title and due date; edits save to Firebase and
     update the UI immediately; deleting a task requires confirmation; completed tasks are
     visually distinguished.

3. As a learner, I want to see my progress at a glance so that I know how much work is
   outstanding.
   - Acceptance criteria: The dashboard shows total, completed, outstanding and (optionally)
     overdue tasks, plus a calculated completion percentage, updated whenever task data changes.

4. As a learner, I want to book a support session so that I can get help from an assessor.
   - Acceptance criteria: The booking form validates required fields (topic, preferred date);
     on submit, a record is written to Firebase and the user sees a success or error message.

5. As a learner, I want to search and filter my tasks so that I can quickly find relevant
   items.
   - Acceptance criteria: Typing in a search box or selecting a filter (e.g. by category or
     status) updates the visible task list using array methods such as `filter`.

6. As a learner, I want to play a short coding mini-game so that I can reinforce basic
   programming concepts.
   - Acceptance criteria: The game is playable start to finish, produces a score or outcome,
     and that result is saved to the `scores` node in Firebase.

7. As an assessor, I want to view submitted support bookings so that I can see who needs help
   and respond.
   - Acceptance criteria: An assessor view lists bookings with learner, topic and status, and
     allows status updates where in scope.

- Login: invalid credentials show an error and do not redirect; valid credentials redirect to
  the dashboard.
- Task creation: a task with no title cannot be submitted; a valid task appears in the list
  without a page reload.
- Progress calculation:percentage recalculates correctly whenever a task is added, completed
  or deleted (completed ÷ total × 100).
- Deletion:d a confirmation dialog must be accepted before a task or booking is permanently
  removed.

