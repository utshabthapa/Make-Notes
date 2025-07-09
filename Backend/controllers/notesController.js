const db = require("../config/db");
const { validationResult } = require("express-validator");

const getNoteWithCategories = async (noteId, userId) => {
  const [note] = await db.query(
    "SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
    [noteId, userId]
  );

  if (note.length === 0) return null;

  const [categories] = await db.query(
    `SELECT c.id, c.name 
     FROM note_categories nc 
     JOIN categories c ON nc.category_id = c.id 
     WHERE nc.note_id = ?`,
    [noteId]
  );

  return {
    ...note[0],
    categories,
  };
};

const getArchivedNoteWithCategories = async (noteId, userId) => {
  const [note] = await db.query(
    "SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = TRUE",
    [noteId, userId]
  );

  if (note.length === 0) return null;

  const [categories] = await db.query(
    `SELECT c.id, c.name 
     FROM note_categories nc 
     JOIN categories c ON nc.category_id = c.id 
     WHERE nc.note_id = ?`,
    [noteId]
  );

  return {
    ...note[0],
    categories,
  };
};

exports.createNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, categories, background_color } = req.body;
  const userId = req.user.id;

  try {
    await db.query("START TRANSACTION");

    const [noteResult] = await db.query(
      "INSERT INTO notes (title, content, user_id, background_color) VALUES (?, ?, ?, ?)",
      [title, content, userId, background_color || "#ffffff"]
    );

    if (categories && categories.length > 0) {
      const categoryInserts = categories.map((categoryId) => [
        noteResult.insertId,
        categoryId,
      ]);
      await db.query(
        "INSERT INTO note_categories (note_id, category_id) VALUES ?",
        [categoryInserts]
      );
    }

    await db.query("COMMIT");

    const newNote = await getNoteWithCategories(noteResult.insertId, userId);

    res.status(201).json({
      status: "success",
      data: newNote,
    });
  } catch (err) {
    await db.query("ROLLBACK");
    next(err);
  }
};

exports.getAllNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [notes] = await db.query(
      "SELECT * FROM notes WHERE user_id = ? AND is_deleted = FALSE ORDER BY pinned DESC, updated_at DESC",
      [userId]
    );

    const notesWithCategories = await Promise.all(
      notes.map(async (note) => {
        const [categories] = await db.query(
          `SELECT c.id, c.name 
           FROM note_categories nc 
           JOIN categories c ON nc.category_id = c.id 
           WHERE nc.note_id = ?`,
          [note.id]
        );
        return { ...note, categories };
      })
    );

    res.status(200).json({
      status: "success",
      results: notesWithCategories.length,
      data: notesWithCategories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookmarkedNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [notes] = await db.query(
      "SELECT * FROM notes WHERE user_id = ? AND is_deleted = FALSE AND bookmarked = TRUE ORDER BY updated_at DESC",
      [userId]
    );

    const notesWithCategories = await Promise.all(
      notes.map(async (note) => {
        const [categories] = await db.query(
          `SELECT c.id, c.name 
           FROM note_categories nc 
           JOIN categories c ON nc.category_id = c.id 
           WHERE nc.note_id = ?`,
          [note.id]
        );
        return { ...note, categories };
      })
    );

    res.status(200).json({
      status: "success",
      results: notesWithCategories.length,
      data: notesWithCategories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNote = async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    let note = await getNoteWithCategories(noteId, userId);

    if (!note) {
      note = await getArchivedNoteWithCategories(noteId, userId);
    }

    if (!note) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: note,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const noteId = req.params.id;
  const userId = req.user.id;
  const { title, content, categories, background_color } = req.body;

  try {
    await db.query("START TRANSACTION");

    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
      [noteId, userId]
    );

    if (note.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({
        status: "fail",
        message: "Note not found or is archived",
      });
    }

    await db.query(
      "UPDATE notes SET title = ?, content = ?, background_color = ? WHERE id = ?",
      [title, content, background_color || "#ffffff", noteId]
    );

    await db.query("DELETE FROM note_categories WHERE note_id = ?", [noteId]);

    if (categories && categories.length > 0) {
      const categoryInserts = categories.map((categoryId) => [
        noteId,
        categoryId,
      ]);
      await db.query(
        "INSERT INTO note_categories (note_id, category_id) VALUES ?",
        [categoryInserts]
      );
    }

    await db.query("COMMIT");

    const updatedNote = await getNoteWithCategories(noteId, userId);

    res.status(200).json({
      status: "success",
      data: updatedNote,
    });
  } catch (err) {
    await db.query("ROLLBACK");
    next(err);
  }
};

exports.togglePin = async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
      [noteId, userId]
    );

    if (note.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found",
      });
    }

    const newPinStatus = !note[0].pinned;
    await db.query("UPDATE notes SET pinned = ? WHERE id = ? AND user_id = ?", [
      newPinStatus,
      noteId,
      userId,
    ]);

    res.status(200).json({
      status: "success",
      message: newPinStatus
        ? "Note pinned successfully"
        : "Note unpinned successfully",
      data: { pinned: newPinStatus },
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
      [noteId, userId]
    );

    if (note.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found",
      });
    }

    const newBookmarkStatus = !note[0].bookmarked;
    await db.query(
      "UPDATE notes SET bookmarked = ? WHERE id = ? AND user_id = ?",
      [newBookmarkStatus, noteId, userId]
    );

    res.status(200).json({
      status: "success",
      message: newBookmarkStatus
        ? "Note bookmarked successfully"
        : "Note removed from bookmarks",
      data: { bookmarked: newBookmarkStatus },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      "UPDATE notes SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ? AND is_deleted = FALSE",
      [noteId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found or already archived",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Note archived successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.unarchiveNote = async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      "UPDATE notes SET is_deleted = FALSE, deleted_at = NULL WHERE id = ? AND user_id = ? AND is_deleted = TRUE",
      [noteId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Archived note not found",
      });
    }

    const unarchivedNote = await getNoteWithCategories(noteId, userId);

    res.status(200).json({
      status: "success",
      message: "Note unarchived successfully",
      data: unarchivedNote,
    });
  } catch (err) {
    next(err);
  }
};

exports.getArchivedNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [notes] = await db.query(
      "SELECT * FROM notes WHERE user_id = ? AND is_deleted = TRUE ORDER BY deleted_at DESC",
      [userId]
    );

    const notesWithCategories = await Promise.all(
      notes.map(async (note) => {
        const [categories] = await db.query(
          `SELECT c.id, c.name 
           FROM note_categories nc 
           JOIN categories c ON nc.category_id = c.id 
           WHERE nc.note_id = ?`,
          [note.id]
        );
        return { ...note, categories };
      })
    );

    res.status(200).json({
      status: "success",
      results: notesWithCategories.length,
      data: notesWithCategories,
    });
  } catch (err) {
    next(err);
  }
};

exports.permanentDeleteNote = async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    await db.query("START TRANSACTION");

    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = TRUE",
      [noteId, userId]
    );

    if (note.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({
        status: "fail",
        message: "Archived note not found",
      });
    }

    await db.query("DELETE FROM note_categories WHERE note_id = ?", [noteId]);

    const [result] = await db.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ? AND is_deleted = TRUE",
      [noteId, userId]
    );

    await db.query("COMMIT");

    res.status(200).json({
      status: "success",
      message: "Note permanently deleted",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    next(err);
  }
};
