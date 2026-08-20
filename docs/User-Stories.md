User Stories — SkillsTrack Learner Support Portal

They reflect the client objectives and minimum features stated in Section 2 of the Project Brief. Each story follows the usual format and contains acceptance criteria to act both as Month 1 deliverable at least six user stories with acceptance criteria and as a source of GitHub issues.


1. Registration
As a new learner, I want to register for an account with my name, email and a password, so that I have a personal profile in the system.

Acceptance criteria
Registration form validates that name, email and password are filled in before submission.
Email is checked for a valid format before the request is sent.
On success, a new record is created under `users/{uid}` in Firebase with `displayName`, `email`, `role` and `createdAt`.
On failure (e.g. email already in use), a clear error message is shown and no duplicate record is created.


2. Sign in / sign out
As a registered learner, I want to sign in and sign out securely, so that only I can see and manage my own data.

Acceptance criteria
Invalid credentials produce a clear, non-technical error message.
A successful sign-in sets an authenticated user state used to control access to personal features.
Signing out clears the authenticated state and redirects to the sign-in page.
Passwords are never stored in the database, cookies or source code.


3. Dashboard overview
As a learner, I want to see a dashboard with my task totals, completed work, outstanding work and calculated progress, so that I can quickly understand where I stand.

Acceptance criteria
Dashboard calculates completed, outstanding and overdue tasks dynamically from Firebase data (using `map`/`filter`/`reduce`).
Progress is displayed as a percentage or equivalent summary.
Dashboard updates automatically after a task is added, edited or deleted.


4. Task management (CRUD)
As a learner, I want to create, view, edit and delete my learning tasks, so that I can keep an accurate record of my work.

Acceptance criteria
New tasks are written to `tasks/{taskId}` with `userId`, `title`, `category`, `dueDate`, `priority`, `completed` and `createdAt`.
Existing tasks can be edited and the update is reflected in Firebase and the DOM.
Deleting a task requires a confirmation dialog before the record is removed.
A learner can only see and modify tasks where `userId` matches their own authenticated ID.


5. Support-session booking
As a learner, I want to book a support session with a topic, preferred date and notes, so that I can get help from an assessor when I need it.

Acceptance criteria
Booking form validates required fields (topic, preferred date) before submission.
A validated booking is written to `bookings/{bookingId}` with `userId`, `topic`, `preferredDate`, `notes` and `status`.
The learner receives clear success or error feedback after submitting.
An assessor/administrator can view submitted bookings and update status where in scope.


6. Search, filter and sort
As a learner, I want to search, filter or sort my tasks (e.g. by category, priority or completion status), so that I can find relevant work quickly.

Acceptance criteria
At least one filter or sort control uses a higher-order array method (`filter`, `sort`, `map`, or `reduce`).
The displayed task list updates dynamically without a full page reload.
An appropriate message is shown when no tasks match the search/filter criteria.




