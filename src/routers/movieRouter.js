require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");

router.get('/', (req, res) => {
  res.send("Hello world 5555")
});

router.get('/2', (req, res) => {
  res.send("Hello world 6666")
});



module.exports = router;
