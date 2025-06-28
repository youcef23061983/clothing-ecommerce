const express = require("express");
const router = express.Router();
const {
  getSellings,
  postSellings,
} = require("../controllers/sellController.js");

router.get("/", getSellings);
router.post("/", postSellings);

module.exports = router;
