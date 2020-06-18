const express = require("express");
const { check } = require("express-validator");

const { getUsers, signUp, login } = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty().withMessage("name is required"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password must bee at least 5 char long"),
    check("email").isEmail().withMessage("email is required"),
  ],
  signUp
);

router.post(
  "/login",
  [
    check("password").not().isEmpty().withMessage("password is required"),
    check("email").normalizeEmail().isEmail().withMessage("email is required"),
  ],
  login
);

module.exports = router;
