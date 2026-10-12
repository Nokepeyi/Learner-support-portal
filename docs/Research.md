# Research Notes

## 1. Firebase Authentication
Firebase Authentication provides email and password sign-in. It can be called over REST (the Identity Toolkit endpoints), which meets the brief's REST requirement. A successful sign-in returns an ID token that is sent with later database requests.

## 2. Firestore versus Realtime Database
Both are Firebase databases. Realtime Database stores one JSON tree; Firestore stores collections of documents and supports queries and per-collection security rules. The team chose Firestore, which is already set up in project `learner-support-portal-427a9`. [Confirm with your lecturer that Firestore is acceptable, as the requirements document mentions Realtime Database.]

## 3. Firebase REST API
CRUD maps to HTTP methods: POST creates, GET reads, PATCH updates, DELETE removes. Firestore REST wraps values in types (for example `stringValue`), so data must be converted before sending and after receiving.

## 4. Security
- Passwords are handled only by Firebase Authentication and never stored by the app.
- Database rules must check the signed-in user, so learners only reach their own records.
- Cookies hold only a harmless preference such as the theme.
- User text should be added to the page with `textContent`, not `innerHTML`, to avoid cross-site scripting.

## 5. Mini-game framework
Phaser.js is an approved game framework, loads from a CDN, and supports clickable text and scenes. The game is a coding quiz: it fits the brief's goal of reinforcing basic programming concepts.

## 6. JavaScript techniques required
`map`, `filter` and `reduce` for dashboard calculations and search; `createElement` for dynamic lists; `setInterval` for animation; `confirm` before deletion.

## 7. Team workflow
Feature branches off `main`, pull requests, and at least one peer review before merging.

## Sources
- Firebase documentation: Authentication REST API and Firestore REST API (firebase.google.com/docs)
- Phaser documentation (phaser.io)
- MDN Web Docs: Array methods, Fetch API, Document.createElement
- QCTO JavaScript Programmer Skills Programme Document (SP-220373)
