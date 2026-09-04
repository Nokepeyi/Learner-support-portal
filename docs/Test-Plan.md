# Test Plan - SkillsTrack Portal - Month 1 App Shell

## 1. Test Environment
- VS Code Live Server: http://localhost:8080/src/
- Browser: Chrome
- Branch: main
- Date: Sept 2026

## 2. App Shell Loads (Critical)
- Steps: Open localhost:8080, check index.html loads
- Expected: Title "SkillsTrack Portal", Login section, Dashboard shows Total: 0 | Completed: 0
- Result: PASS

## 3. DevTools Console - No Errors
- Steps: Press F12 > Console tab
- Expected: No red errors, shows console.log for tasks
- Result: PASS - Fixed 404 for app.js and style.css by saving files (Ctrl+S)

## 4. CSS and JS Linked
- Steps: Check Network tab F12 > Refresh
- Expected: app.js 200 OK, style.css 200 OK (not 404)
- Result: PASS

## 5. Coding Requirements Check (5.3)
- 'use strict' at top of app.js: YES
- let/const used: YES
- Arrow function => used: YES
- map/filter/reduce for dashboard calculations: YES
- document.createElement + appendChild: YES
- Result: PASS

## 6. Dashboard Calculation Test
- Steps: Add 3 tasks in code, mark 1 as completed
- Expected: Total: 3, Completed: 1, Pending: 2, Progress % calculated with reduce()
- Result: PASS

## 7. CRUD Simulation (Month 1)
- Steps: Click Add button, new task appears in list
- Steps: Click Delete, task removed
- Result: PASS - Manual DOM test

## 8. Bugs Found and Fixed
- Bug 1: GET http://localhost:8080/app.js 404 (Not Found) - Cause: file unsaved (U) - Fix: Ctrl+S
- Bug 2: GET http://localhost:8080/style.css 404 - Cause: server started before save - Fix: Restart server with npx http-server
- Bug 3: lifecycle-plan.md created as folder not file - Fix: Deleted folder, created new file

## 9. GitHub Pages Deployment
- Steps: Push to main, Settings > Pages > Source main/docs
- Expected: https://nokepeyi.github.io/Learner-support-portal/src/ loads same as localhost
- Result: PENDING - after push

## 10. Conclusion
App Shell is working locally with no console errors. Ready for Month 2 Firebase integration.