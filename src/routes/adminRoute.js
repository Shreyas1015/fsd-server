const express = require("express");

const router = express.Router();
const {
  allNotes,
  deleteNotes,
  createNote,
  getParticularNote,
  updateNote,
} = require("../controllers/adminController");

// Route to get all notes
router.get("/notes", allNotes);
// Route to get a particular note by ID
router.get("/notes/:id", getParticularNote);
// Route to create a new note
router.post("/notes", createNote);
// Route to update a note by ID
router.put("/notes/:id", updateNote);
// Route to delete a note by ID
router.delete("/notes/:id", deleteNotes);
// Route to get all notes with a specific tag

module.exports = router;
