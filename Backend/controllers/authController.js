const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { validationResult } = require("express-validator");
const { signToken } = require("../utils/tokenUtils");
const { setCookie, clearCookie } = require("../utils/cookieUtils");
const { verifyToken } = require("../utils/tokenUtils");

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    const token = signToken(result.insertId);
    setCookie(res, token);

    res.status(201).json({
      status: "success",
      data: {
        id: result.insertId,
        username,
        email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user.id);
    setCookie(res, token);

    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  clearCookie(res);
  res.status(200).json({ status: "success" });
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Not authenticated",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access",
      });
    }

    const decoded = await verifyToken(token);

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);
    if (users.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists",
      });
    }

    req.user = users[0];
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser: exports.getCurrentUser,
  protect,
};
