const db = require("../config/db");
const { verifyToken } = require("../utils/tokenUtils");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: "fail",
        error: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = await verifyToken(token);

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        status: "fail",
        error: "The user belonging to this token no longer exists.",
      });
    }

    req.user = users[0];
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
