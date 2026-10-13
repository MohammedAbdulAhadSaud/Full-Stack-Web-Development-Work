const router = require("express").Router();
const Book = require("../models/Book");
const protect = require("../middleware/auth");

router.use(protect); // every book route needs a logged-in user

// READ  - GET /api/books?search=&status=
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ title: rx }, { author: rx }, { genre: rx }];
    }
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE - POST /api/books
router.post("/", async (req, res) => {
  try {
    const { title, author, genre, status, rating, notes } = req.body;
    if (!title || !author)
      return res.status(400).json({ message: "Title and author are required." });
    const book = await Book.create({
      user: req.user._id, title, author, genre, status, rating, notes,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE - PUT /api/books/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, author, genre, status, rating, notes } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, author, genre, status, rating, notes },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - DELETE /api/books/:id
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json({ message: "Book deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
