# Use Cases: SkillsTrack Learner Support Portal

## UC1: Register
- **Actor:** New learner
- **Precondition:** Not registered
- **Main flow:** 1. Learner enters name, email, password. 2. System validates the fields. 3. System creates the account and a `users/{uid}` profile. 4. System signs the learner in and shows the dashboard.
- **Alternate flow:** Email already used, so an error is shown and nothing is created.

## UC2: Log in / log out
- **Actor:** Learner or assessor
- **Main flow:** 1. User enters email and password. 2. System checks the credentials. 3. System opens the dashboard. 4. On logout, the system clears the session and shows the login page.
- **Alternate flow:** Invalid credentials, so an error is shown and the user stays on the login page.

## UC3: Manage tasks
- **Actor:** Learner
- **Main flow:** Learner adds a task (title and due date), edits it, marks it complete, or deletes it.
- **Alternate flow:** Title missing, so submission is blocked. On delete, the learner must confirm first.

## UC4: View progress
- **Actor:** Learner
- **Main flow:** System counts total, completed and outstanding tasks and shows progress = completed ÷ total × 100. The figures update after every change.

## UC5: Book a support session
- **Actor:** Learner
- **Main flow:** Learner enters topic and preferred date; system validates and saves the booking as Pending; learner sees a success message.
- **Alternate flow:** Required field empty, so an error is shown.

## UC6: Search and filter tasks
- **Actor:** Learner
- **Main flow:** Learner types in the search box or picks a status filter; the list updates without a page reload.
- **Alternate flow:** No matches, so a "no tasks found" message is shown.

## UC7: Play the mini-game
- **Actor:** Learner
- **Main flow:** Learner starts the game, answers questions, sees a score, and the score is saved to Firebase.

## UC8: Review bookings
- **Actor:** Assessor
- **Main flow:** Assessor opens the bookings list and changes a booking's status (Pending, Confirmed, Completed).
