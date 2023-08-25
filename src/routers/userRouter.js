const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const userController = require("../controllers/userController");

router.get("/", userController.getUsers);

module.exports = router;
