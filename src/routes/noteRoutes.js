const express = require("express");
const router = express.Router();
const NotesController = require("../controllers/noteController");

// Create controller instance with error handling
let noteController;
try {
  noteController = new NotesController();
} catch (error) {
  console.error("Failed to initialize NotesController:", error);
  throw error;
}

// Define routes
router.get("/:id", noteController.getNoteById.bind(noteController));
router.get("/", noteController.getAllNotes.bind(noteController));
router.get("/active", noteController.getActiveNotes.bind(noteController));
router.get("/archived", noteController.getArchivedNotes.bind(noteController));
router.post("/", noteController.createNote.bind(noteController));
router.put("/:id", noteController.updateNote.bind(noteController));
router.delete("/:id", noteController.deleteNote.bind(noteController));
router.patch("/:id/archive", noteController.archiveNote.bind(noteController));
router.patch(
  "/:id/unarchive",
  noteController.unarchiveNote.bind(noteController)
);

module.exports = router;
