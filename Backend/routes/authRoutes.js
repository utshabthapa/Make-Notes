const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");

const validateSignup = [
  check("username").not().isEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").exists().withMessage("Password is required"),
];

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);
router.get("/logout", authController.logout);
router.get("/me", authController.protect, authController.getCurrentUser);

module.exports = router;
