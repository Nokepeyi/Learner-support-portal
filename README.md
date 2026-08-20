# Learner-support-portal
A Javascript-based learner support portal for Skills Track Training Centre ,featuring learner tasks ,progress tracking ,resources ,bookings ,authentication , and interactive features.

# SkillsTrack Learner Support Portal

## Project Overview
The Learner Support Portal is a browser-based application built for SkillsTrack Training Centre.
It gives learners a single place to manage learning tasks, book support sessions, track their
progress, access learning resources and play a short coding mini-game. The system is built with
JavaScript, uses Firebase (Realtime Database and Authentication) for data storage and user
accounts, and communicates with Firebase through its REST API.

This repository is the single source of truth for the project: all planning documents, designs,
source code and project history live here.

## Client Brief Summary
Learners at SkillsTrack currently track goals, tasks, support bookings and progress across
separate documents and messages, which makes it hard for assessors to see outstanding work or
identify learners who need support. The Learner Support Portal solves this by centralising task
management, support booking, and progress tracking in one authenticated web application backed
by Firebase.

**Required users:**
| User | Access |
|---|---|
| Learner | Register/sign in, manage own tasks, book support, view progress, play the mini-game, print a progress summary |
| Assessor/Administrator | View submitted support bookings and relevant learner activity, update booking status |

## Project Objectives
- Provide a single, clear interface for managing learning tasks and support requests.
- Allow users to register, sign in and view their own information.
- Store, retrieve, update and delete application data in Firebase.
- Provide meaningful calculations and summaries based on stored data.
- Include an interactive mini-game that reinforces basic programming concepts.
- Enable team collaboration through GitHub with controlled version history.

## Technologies
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework/Library:** _[state your Assessor-approved framework/library here, e.g. React / Vue / vanilla JS + a game library such as Phaser.js or Kaboom.js]_
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Authentication
- **API communication:** Firebase Realtime Database REST API (GET, POST, PUT/PATCH, DELETE)
- **Version control:** Git & GitHub (branches, pull requests, code review, CI)

## Development Tools
- Visual Studio Code (or _[assessor-approved IDE]_) with formatter, linter and debugger configured
- Git / GitHub Desktop or CLI
- Browser Developer Tools (console, breakpoints, network tab)
- GitHub Actions for a basic CI check (e.g. linting)
- _[Figma / Canva / Miro — whichever you use for wireframes]_

## Team Members and Responsibilities
| Name | Role / Primary Responsibilities |
|---|---|
| _[lIHLE]_ | 
| _[tEMOSHO]_ | 
| _[LESEDI]_ | 

## Repository Structure
```
Learner-Support-Portal/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── Client Brief
│   ├── Requirements
│   ├── Research
│   ├── Meeting Minutes
│   ├── User Stories
│   ├── Use Cases
│   ├── Wireframes
│   ├── UI Designs
│   └── Test Plan
├── designs/
│   ├── Figma Link.md
│   ├── UI Mockups
│   └── Images
├── src/
├── assets/
└── presentation/
```

## Git Branching Strategy
- `main` — protected, always reflects a working, tested version of the app.
- `feature/<short-description>` — one branch per feature or issue, created from `main`.
- Work is committed to feature branches with meaningful commit messages (e.g.
  `feat: add task creation form`, `fix: correct progress percentage calculation`).
- Once a feature is complete, a pull request is opened into `main`.
- At least one peer review is required per pull request before merging.
- Merge conflicts and integration issues are documented in `docs/Meeting Minutes` or a
  dedicated `docs/Merge-Log.md`.

## Contribution Guidelines
1. Pick up an issue from the Project Board and assign it to yourself.
2. Create a feature branch off `main`: `git checkout -b feature/your-feature-name`.
3. Commit regularly with clear, descriptive messages.
4. Push your branch and open a pull request describing what changed and why.
5. Request a review from at least one teammate before merging.
6. Move the related card on the Project Board as your work progresses.
7. Never commit secrets, API keys, service-account files or passwords — check `.gitignore`.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Install dependencies (if using a package manager):
   ```
   npm install
   ```
3. Create a Firebase project and add your Firebase config to a local, git-ignored config file
   (e.g. `src/firebase-config.js`, listed in `.gitignore`).
4. _[Add any framework-specific setup steps here.]_


## Project Milestones
| Milestone | Target Date | Status |
|---|---|---|
| Repository & Project Board set up | | |
| Month 1 submission (planning, environment, core JS) | | |
| Firebase Authentication & data model live | | |
| Full CRUD for tasks via REST | | |
| Mini-game operable | | |
| Month 2 submission (final integration) | | |

## Changelog
See [CHANGELOG.md](./CHANGELOG.md) for a full history of changes.

## Links
- Documentation: `docs/`
- Design files (Figma/Canva/Miro): _[link]_
- GitHub Project Board: _[link]_

## References
- QCTO JavaScript Programmer Skills Programme Document (SP-220373)
- JavaScript Programmer Curriculum Document (Curriculum Code 900219-000-00-00)
- 