const db = require("../config/db");
const { validationResult } = require("express-validator");

exports.getAllCategories = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [categories] = await db.query(
      "SELECT * FROM categories WHERE user_id = ? AND is_deleted = FALSE ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getArchivedCategories = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [categories] = await db.query(
      "SELECT * FROM categories WHERE user_id = ? AND is_deleted = TRUE ORDER BY deleted_at DESC",
      [userId]
    );

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  try {
    const [category] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND user_id = ?",
      [categoryId, userId]
    );

    if (category.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: category[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }

  try {
    const { name } = req.body;
    const userId = req.user.id;

    const [existing] = await db.query(
      "SELECT * FROM categories WHERE name = ? AND user_id = ? AND is_deleted = FALSE",
      [name.trim(), userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Category with this name already exists",
      });
    }

    const [result] = await db.query(
      "INSERT INTO categories (name, user_id) VALUES (?, ?)",
      [name.trim(), userId]
    );

    const [newCategory] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      status: "success",
      data: newCategory[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }

  const categoryId = req.params.id;
  const userId = req.user.id;
  const { name } = req.body;

  try {
    const [category] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
      [categoryId, userId]
    );

    if (category.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found or is archived",
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM categories WHERE name = ? AND user_id = ? AND id != ? AND is_deleted = FALSE",
      [name.trim(), userId, categoryId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Category with this name already exists",
      });
    }

    await db.query(
      "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
      [name.trim(), categoryId, userId]
    );

    const [updatedCategory] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    res.status(200).json({
      status: "success",
      data: updatedCategory[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  try {
    const [category] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
      [categoryId, userId]
    );

    if (category.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found or already archived",
      });
    }

    const [notesUsingCategory] = await db.query(
      `SELECT COUNT(*) as count 
       FROM note_categories nc 
       JOIN notes n ON nc.note_id = n.id 
       WHERE nc.category_id = ? AND n.is_deleted = FALSE`,
      [categoryId]
    );

    if (notesUsingCategory[0].count > 0) {
      return res.status(400).json({
        status: "fail",
        message: `Cannot delete category. It is being used by ${notesUsingCategory[0].count} active note(s).`,
      });
    }

    const [result] = await db.query(
      "UPDATE categories SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
      [categoryId, userId]
    );

    res.status(200).json({
      status: "success",
      message: "Category archived successfully",
    });
  } catch (err) {
    next(err);
  }
};
