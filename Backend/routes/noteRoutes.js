const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

const noteValidationRules = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("content").optional(),
  check("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
  check("background_color")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Background color must be a valid hex color"),
];

router.use(authMiddleware.protect);

router.post("/", noteValidationRules, notesController.createNote);
router.get("/", notesController.getAllNotes);
router.get("/archived", notesController.getArchivedNotes);
router.get("/bookmarked", notesController.getBookmarkedNotes);
router.get("/:id", notesController.getNote);
router.put("/:id", noteValidationRules, notesController.updateNote);
router.delete("/:id", notesController.deleteNote);
router.patch("/:id/unarchive", notesController.unarchiveNote);
router.patch("/:id/pin", notesController.togglePin);
router.patch("/:id/bookmark", notesController.toggleBookmark);
router.delete("/:id/permanent", notesController.permanentDeleteNote);

module.exports = router;
