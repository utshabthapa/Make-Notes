const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management
 */

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

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 error:
 *                   type: string
 *                   example: Title is required
 */
router.post("/", noteValidationRules, notesController.createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for the current user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/", notesController.getAllNotes);

/**
 * @swagger
 * /api/notes/archived:
 *   get:
 *     summary: Get all archived notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of archived notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/archived", notesController.getArchivedNotes);

/**
 * @swagger
 * /api/notes/bookmarked:
 *   get:
 *     summary: Get all bookmarked notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/bookmarked", notesController.getBookmarkedNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 error:
 *                   type: string
 *                   example: Note not found
 */
router.get("/:id", notesController.getNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 */
router.put("/:id", noteValidationRules, notesController.updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note (move to trash)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
router.delete("/:id", notesController.deleteNote);

/**
 * @swagger
 * /api/notes/{id}/pin:
 *   patch:
 *     summary: Toggle pin status of a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Pin status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.patch("/:id/unarchive", notesController.unarchiveNote);
router.patch("/:id/pin", notesController.togglePin);

/**
 * @swagger
 * /api/notes/{id}/bookmark:
 *   patch:
 *     summary: Toggle bookmark status of a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Bookmark status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.patch("/:id/bookmark", notesController.toggleBookmark);

/**
 * @swagger
 * /api/notes/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Note ID
 *     responses:
 *       204:
 *         description: Note permanently deleted
 *       404:
 *         description: Note not found
 */
router.delete("/:id/permanent", notesController.permanentDeleteNote);

/**
 * @swagger
 * components:
 *   schemas:
 *     NoteInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: My First Note
 *           maxLength: 255
 *         content:
 *           type: string
 *           example: This is the content of my note.
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *             example: [1, 2]
 *         background_color:
 *           type: string
 *           pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *           example: "#ffffff"
 *         pinned:
 *           type: boolean
 *           example: false
 *         bookmarked:
 *           type: boolean
 *           example: false
 *     Note:
 *       allOf:
 *         - $ref: '#/components/schemas/NoteInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             user_id:
 *               type: integer
 *               example: 1
 *             created_at:
 *               type: string
 *               format: date-time
 *               example: '2023-01-01T00:00:00Z'
 *             updated_at:
 *               type: string
 *               format: date-time
 *               example: '2023-01-01T00:00:00Z'
 *             is_deleted:
 *               type: boolean
 *               example: false
 *             deleted_at:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               example: null
 *     NoteCategory:
 *       type: object
 *       properties:
 *         note_id:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *           example: 1
 */

module.exports = router;
