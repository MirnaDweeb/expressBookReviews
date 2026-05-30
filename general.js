const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Internal base URL for Axios calls
const BASE_URL = "http://localhost:5000";

// ─────────────────────────────────────────────────────────────
// Task 6: Register a New User
// POST /register
// ─────────────────────────────────────────────────────────────
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
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

// ─────────────────────────────────────────────────────────────
// Task 1: Get All Books (direct — no Axios)
// GET /
// ─────────────────────────────────────────────────────────────
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// ─────────────────────────────────────────────────────────────
// Task 2: Get Book by ISBN (direct — no Axios)
// GET /isbn/:isbn
// ─────────────────────────────────────────────────────────────
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─────────────────────────────────────────────────────────────
// Task 3: Get Books by Author (direct — no Axios)
// GET /author/:author
// ─────────────────────────────────────────────────────────────
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const result = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.author === author) {
      result[key] = value;
    }
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }
  return res
    .status(404)
    .json({ message: "No books found for this author" });
});

// ─────────────────────────────────────────────────────────────
// Task 4: Get Books by Title (direct — no Axios)
// GET /title/:title
// ─────────────────────────────────────────────────────────────
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const result = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.title === title) {
      result[key] = value;
    }
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }
  return res
    .status(404)
    .json({ message: "No books found with this title" });
});

// ─────────────────────────────────────────────────────────────
// Task 5: Get Book Reviews
// GET /review/:isbn
// ─────────────────────────────────────────────────────────────
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─────────────────────────────────────────────────────────────
// AXIOS TASKS  (Tasks 10–13 in grader numbering)
// These routes use Axios to call the existing endpoints above.
// ─────────────────────────────────────────────────────────────

// Task 10: Get All Books — Async/Await + Axios
// GET /async/books
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get Book by ISBN — Promise Callbacks + Axios
// GET /promise/isbn/:isbn
public_users.get("/promise/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error fetching book by ISBN", error: error.message });
    });
});

// Task 12: Get Books by Author — Async/Await + Axios
// GET /async/author/:author
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get Books by Title — Promise Callbacks + Axios
// GET /promise/title/:title
public_users.get("/promise/title/:title", (req, res) => {
  const title = req.params.title;
  axios
    .get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error fetching books by title", error: error.message });
    });
});

module.exports.general = public_users;
