require("dotenv").config();
const asyncHand = require("express-async-handler");
const db = require("../config/dbConfig");


const allNotes = asyncHand(async (req, res) => {
  const query = "SELECT * FROM notes ORDER BY created_at DESC";
  db.query(query, (err, rows) => {
    if (err) {
      console.error("Internal Server Error", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(rows);
    }
  });
});

const deleteNotes = asyncHand(async (req, res) => {
  const noteId = req.params.id;
  const query = "DELETE FROM notes WHERE id = ?";

  db.query(query, [noteId], (err, result) => {
    if (err) {
      console.error("Internal Server Error", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.status(200).json({ message: "Note deleted successfully" });
    }
  });
});

const createNote = asyncHand(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const query = "INSERT INTO notes (title, content, tags) VALUES (?, ?, ?)";
  db.query(query, [title, content, JSON.stringify(tags || [])], (err, result) => {
    if (err) {
      console.error("Internal Server Error", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({
        message: "Note created successfully",
        noteId: result.insertId,
      });
    }
  });
});


const getParticularNote = asyncHand(async (req, res) => {
  const { id } = req.params;
  console.log("Received request to fetch note with ID:", id); // Log the ID received from the request

  const query = "SELECT * FROM notes WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err); // Log the error if the query fails
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Query result:", result); // Log the result of the query

      if (result.length === 0) {
        console.warn("No note found with the given ID:", id); // Log a warning if no note is found
        res.status(404).json({ error: "Note not found" });
      } else {
        const note = result[0];
        console.log("Fetched note:", note); // Log the fetched note before parsing tags

        try {
          note.tags = note.tags ? JSON.parse(note.tags) : [];
          console.log("Parsed tags:", note.tags); // Log the parsed tags
        } catch (parseError) {
          console.error("Error parsing tags for note ID:", id, parseError); // Log parsing errors
          note.tags = []; // Default to an empty array if parsing fails
        }

        res.status(200).json(note);
      }
    }
  });
});


const updateNote = asyncHand(async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const query = `
    UPDATE notes 
    SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;

  db.query(query, [title, content, JSON.stringify(tags || []), id], (err, result) => {
    if (err) {
      console.error("Internal Server Error", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.status(200).json({ message: "Note updated successfully" });
    }
  });
});




module.exports = {
  allNotes,
  deleteNotes,
  createNote,
  getParticularNote,
  updateNote,
};
