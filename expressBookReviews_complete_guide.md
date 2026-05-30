# IBM Express Book Reviews — Complete Project Guide
### Developing Back-End Apps with Node.js and Express (Coursera / IBM Skills Network)

---

## Project Structure

```
final_project/
├── index.js
├── package.json
├── router/
│   ├── general.js       ← Public routes (Tasks 1–5 + Axios Tasks)
│   └── auth_users.js    ← Authenticated routes (Tasks 7–10)
└── booksdb.js           ← Book data store
```

---

## Task 0 — booksdb.js (Reference — DO NOT MODIFY)

```javascript
let books = {
  1: { author: "Chinua Achebe", title: "Things Fall Apart", reviews: {} },
  2: { author: "Hans Christian Andersen", title: "Fairy tales", reviews: {} },
  3: { author: "Dante Alighieri", title: "The Divine Comedy", reviews: {} },
  4: { author: "Unknown", title: "The Epic Of Gilgamesh", reviews: {} },
  5: { author: "Unknown", title: "The Book Of Job", reviews: {} },
  6: { author: "Unknown", title: "One Thousand and One Nights", reviews: {} },
  7: { author: "Unknown", title: "Njáls Saga", reviews: {} },
  8: { author: "Jane Austen", title: "Pride and Prejudice", reviews: {} },
  9: { author: "Honoré de Balzac", title: "Le Père Goriot", reviews: {} },
  10: { author: "Samuel Beckett", title: "Molloy, Malone Dies, The Unnamable, the trilogy", reviews: {} },
};

module.exports = books;
```

---

## Task 0 — index.js (Entry Point)

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running at port " + PORT));
```

---

## Task 1 — package.json

```json
{
  "name": "expressbookreviews",
  "version": "1.0.0",
  "description": "Final Project - Book Reviews",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.0"
  }
}
```

---

## TASK 1: GitHub Repository Verification

### How to Fork Correctly

1. Go to: `https://github.com/ibm-developer-skills-network/expressBookReviews`
2. Click **Fork** (top-right)
3. Your fork will be at: `https://github.com/YOUR_USERNAME/expressBookReviews`

### Verify Fork (API check)

```bash
curl https://api.github.com/repos/YOUR_USERNAME/expressBookReviews
```

**Expected output includes:**
```json
{
  "name": "expressBookReviews",
  "fork": true,
  "parent": {
    "full_name": "ibm-developer-skills-network/expressBookReviews"
  }
}
```

### ⚠️ Common Mistakes
- Submitting the **original** IBM repo URL instead of your fork
- Repo name must be exactly `expressBookReviews` (camelCase)
- The repo must be **public**

---

## TASK 2: Retrieve All Books — GET /

### router/general.js Route

```javascript
// Task 1: Get all books
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});
```

### cURL Command
```bash
curl -X GET http://localhost:5000/
```

### Expected Output
```json
{
  "1": { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} },
  "2": { "author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {} },
  ...
}
```

---

## TASK 3: Retrieve Book by ISBN — GET /isbn/:isbn

### Route

```javascript
// Task 2: Get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
```

### cURL Command
```bash
curl -X GET http://localhost:5000/isbn/1
```

### Expected Output
```json
{
  "author": "Chinua Achebe",
  "title": "Things Fall Apart",
  "reviews": {}
}
```

---

## TASK 4: Retrieve Books by Author — GET /author/:author

### Route

```javascript
// Task 3: Get books by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.author === author) {
      booksByAuthor[key] = value;
    }
  }
  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});
```

### cURL Command
```bash
curl -X GET "http://localhost:5000/author/Jane%20Austen"
```

### Expected Output
```json
{
  "8": {
    "author": "Jane Austen",
    "title": "Pride and Prejudice",
    "reviews": {}
  }
}
```

---

## TASK 5: Retrieve Books by Title — GET /title/:title

### Route

```javascript
// Task 4: Get books by title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.title === title) {
      booksByTitle[key] = value;
    }
  }
  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});
```

### cURL Command
```bash
curl -X GET "http://localhost:5000/title/Things%20Fall%20Apart"
```

### Expected Output
```json
{
  "1": {
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {}
  }
}
```

---

## TASK 6: Retrieve Book Reviews — GET /review/:isbn

### Route

```javascript
// Task 5: Get book reviews
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
```

### cURL Command
```bash
curl -X GET http://localhost:5000/review/1
```

### Expected Output (no reviews yet)
```json
{}
```

---

## TASK 7: Register New User — POST /customer/register

### router/auth_users.js

```javascript
// Task 6: Register new user
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((u) => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});
```

> **Note:** In the IBM boilerplate, `/register` is exposed via `general.js` at the root level. See the complete `general.js` below.

### cURL Command
```bash
curl -X POST http://localhost:5000/customer/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### Expected Output
```json
{ "message": "User successfully registered. Now you can login" }
```

---

## TASK 8: Login — POST /customer/login

### router/auth_users.js

```javascript
// Task 7: Login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ data: user }, "access", { expiresIn: "1h" });

  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});
```

### cURL Command
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### Expected Output
```json
{
  "message": "User successfully logged in",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## TASK 9: Add or Modify Review — PUT /customer/auth/review/:isbn

### router/auth_users.js

```javascript
// Task 8: Add or Modify review (requires authentication)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for book ISBN ${isbn} added/updated successfully`,
    reviews: books[isbn].reviews,
  });
});
```

### cURL Command (uses session cookie from login — use Bearer token approach for testing)
```bash
# Step 1 — Login and capture cookie
curl -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'

# Step 2 — Add review using session cookie
curl -b cookies.txt -X PUT \
  "http://localhost:5000/customer/auth/review/1?review=Great%20book!" 
```

### Expected Output
```json
{
  "message": "Review for book ISBN 1 added/updated successfully",
  "reviews": { "testuser": "Great book!" }
}
```

---

## TASK 10: Delete Review — DELETE /customer/auth/review/:isbn

### router/auth_users.js

```javascript
// Task 9: Delete review (requires authentication)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for book ISBN ${isbn} deleted successfully`,
    reviews: books[isbn].reviews,
  });
});
```

### cURL Command
```bash
curl -b cookies.txt -X DELETE \
  "http://localhost:5000/customer/auth/review/1"
```

### Expected Output
```json
{
  "message": "Review for book ISBN 1 deleted successfully",
  "reviews": {}
}
```

---

## TASK 11: Complete general.js (Production-Ready with Axios)

This is the **complete, grader-ready** `general.js` file.

```javascript
const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Base URL for internal Axios calls
const BASE_URL = "http://localhost:5000";

// ─────────────────────────────────────────────
// Task 6: Register New User
// ─────────────────────────────────────────────
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((u) => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// ─────────────────────────────────────────────
// Task 1: Get all books (direct DB call)
// ─────────────────────────────────────────────
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// ─────────────────────────────────────────────
// Task 2: Get book by ISBN (direct DB call)
// ─────────────────────────────────────────────
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─────────────────────────────────────────────
// Task 3: Get books by Author (direct DB call)
// ─────────────────────────────────────────────
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const result = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.author === author) result[key] = value;
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// ─────────────────────────────────────────────
// Task 4: Get books by Title (direct DB call)
// ─────────────────────────────────────────────
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const result = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.title === title) result[key] = value;
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// ─────────────────────────────────────────────
// Task 5: Get book reviews
// ─────────────────────────────────────────────
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─────────────────────────────────────────────
// AXIOS TASKS (Tasks 10–13 in grader numbering)
// ─────────────────────────────────────────────

// Task 10: Get all books using Async/Await with Axios
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book by ISBN using Promise callbacks with Axios
public_users.get("/promise/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book", error: error.message });
    });
});

// Task 12: Get books by Author using Async/Await with Axios
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 13: Get books by Title using Promise callbacks with Axios
public_users.get("/promise/title/:title", (req, res) => {
  const title = req.params.title;
  axios
    .get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

module.exports.general = public_users;
```

---

## Complete auth_users.js (Production-Ready)

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Helper: check if username is valid (not already taken)
const isValid = (username) => {
  return !users.some((u) => u.username === username);
};

// Helper: check credentials
const authenticatedUser = (username, password) => {
  return users.some((u) => u.username === username && u.password === password);
};

// Task 7: Login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ data: { username } }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Task 8: Add or Modify review (authenticated)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated successfully`,
    reviews: books[isbn].reviews,
  });
});

// Task 9: Delete review (authenticated)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for ISBN ${isbn} deleted successfully`,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
```

---

## All cURL Commands (Quick Reference)

```bash
# ─── Start the server ───────────────────────────────────
cd final_project && npm install && node index.js

# ─── Task 1: All books ──────────────────────────────────
curl -X GET http://localhost:5000/

# ─── Task 2: By ISBN ────────────────────────────────────
curl -X GET http://localhost:5000/isbn/1
curl -X GET http://localhost:5000/isbn/8

# ─── Task 3: By Author ──────────────────────────────────
curl -X GET "http://localhost:5000/author/Jane%20Austen"
curl -X GET "http://localhost:5000/author/Unknown"

# ─── Task 4: By Title ───────────────────────────────────
curl -X GET "http://localhost:5000/title/Fairy%20tales"

# ─── Task 5: Reviews ────────────────────────────────────
curl -X GET http://localhost:5000/review/1

# ─── Task 6: Register ───────────────────────────────────
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# ─── Task 7: Login (saves session cookie) ───────────────
curl -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# ─── Task 8: Add Review ─────────────────────────────────
curl -b cookies.txt -X PUT \
  "http://localhost:5000/customer/auth/review/1?review=Masterpiece"

# ─── Task 9: Delete Review ──────────────────────────────
curl -b cookies.txt -X DELETE \
  "http://localhost:5000/customer/auth/review/1"

# ─── Axios Tasks (if you added the /async and /promise routes) ───
curl -X GET http://localhost:5000/async/books
curl -X GET "http://localhost:5000/async/author/Jane%20Austen"
curl -X GET "http://localhost:5000/promise/title/Fairy%20tales"
curl -X GET http://localhost:5000/promise/isbn/1
```

---

## Submission Checklist (Score > 70%)

| # | Requirement | Check |
|---|-------------|-------|
| 1 | Repo forked from `ibm-developer-skills-network/expressBookReviews` | ☐ |
| 2 | Repo is **public** | ☐ |
| 3 | `GET /` returns all 10 books as JSON | ☐ |
| 4 | `GET /isbn/:isbn` returns correct book | ☐ |
| 5 | `GET /author/:author` filters correctly | ☐ |
| 6 | `GET /title/:title` filters correctly | ☐ |
| 7 | `GET /review/:isbn` returns reviews object | ☐ |
| 8 | `POST /register` creates user, rejects duplicates | ☐ |
| 9 | `POST /customer/login` returns JWT, sets session | ☐ |
| 10 | `PUT /customer/auth/review/:isbn` adds review (auth required) | ☐ |
| 11 | `DELETE /customer/auth/review/:isbn` deletes own review only | ☐ |
| 12 | Axios used in `general.js` for at least 2 routes | ☐ |
| 13 | Async/Await OR Promise callbacks used with Axios | ☐ |
| 14 | Server starts without errors (`npm start`) | ☐ |
| 15 | Screenshots captured for each task | ☐ |

---

## Common Grading Failures

1. **Wrong repo URL** — submitting the IBM source instead of your fork
2. **Private repo** — grader can't access it
3. **Server not running** when screenshots are taken
4. **Register route in wrong file** — it must be accessible at `POST /register` (via `general.js`) AND optionally `POST /customer/register`
5. **Axios routes missing** — Tasks 10–13 require Axios; pure `books[isbn]` direct lookups don't count for those specific tasks
6. **JWT secret mismatch** — make sure `"access"` is used consistently in both signing and `jwt.verify()`
7. **Review not keyed by username** — the grader checks that different users can have different reviews for the same book
8. **Delete removes another user's review** — must only delete the review belonging to `req.user.data.username`

---

## GitHub Submission URL Format

```
https://github.com/YOUR_GITHUB_USERNAME/expressBookReviews
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username. The repo name **must** remain `expressBookReviews`.
