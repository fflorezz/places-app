const express = require("express");

const { getUsers, signUp, login } = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", getUsers);

router.post("/signup", signUp);

router.post("/login", login);

module.exports = router;
