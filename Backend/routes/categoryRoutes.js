const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

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

router.get("/", categoryController.getAllCategories);
router.get("/archived", categoryController.getArchivedCategories);
router.post("/", categoryValidationRules, categoryController.createCategory);
router.get("/:id", categoryController.getCategory);
router.put("/:id", categoryValidationRules, categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
