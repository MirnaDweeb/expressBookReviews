const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

// Shared user list (exported so general.js can push new users here)
let users = [];

// Helper: returns true if username does NOT already exist
const isValid = (username) => {
  return !users.some((u) => u.username === username);
};

// Helper: returns true if username + password match a stored user
const authenticatedUser = (username, password) => {
  return users.some(
    (u) => u.username === username && u.password === password
  );
};

// ─────────────────────────────────────────────────────────────
// Task 7: Login as a Registered User
// POST /customer/login
// ─────────────────────────────────────────────────────────────
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Sign JWT with the "access" secret (must match jwt.verify in index.js)
  const accessToken = jwt.sign(
    { data: { username } },
    "access",
    { expiresIn: "1h" }
  );

  req.session.authorization = { accessToken };

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken,
  });
});

// ─────────────────────────────────────────────────────────────
// Task 8: Add or Modify a Book Review (requires authentication)
// PUT /customer/auth/review/:isbn
// Query param: ?review=<your review text>
// ─────────────────────────────────────────────────────────────
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res
      .status(400)
      .json({ message: "Review text is required as a query parameter" });
  }

  // Each user can only have one review per book (keyed by username)
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated successfully`,
    reviews: books[isbn].reviews,
  });
});

// ─────────────────────────────────────────────────────────────
// Task 9: Delete a Book Review (requires authentication)
// DELETE /customer/auth/review/:isbn
// Only deletes the review belonging to the logged-in user
// ─────────────────────────────────────────────────────────────
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res
      .status(404)
      .json({ message: "No review found for this user on this book" });
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
