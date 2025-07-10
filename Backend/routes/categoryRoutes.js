const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

const categoryValidationRules = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Category name must be between 1 and 50 characters")
    .trim(),
];

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories for the current user
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/archived:
 *   get:
 *     summary: Get all archived categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of archived categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/archived", categoryController.getArchivedCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
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
 *                   example: Category name is required
 */
router.post("/", categoryValidationRules, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a specific category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
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
 *                   example: Category not found
 */
router.get("/:id", categoryController.getCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 */
router.put("/:id", categoryValidationRules, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", categoryController.deleteCategory);

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Work
 *           minLength: 1
 *           maxLength: 50
 *     Category:
 *       allOf:
 *         - $ref: '#/components/schemas/CategoryInput'
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
 */

module.exports = router;
