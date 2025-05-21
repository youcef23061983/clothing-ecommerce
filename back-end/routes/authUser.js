const express = require("express");
const {
  signupUser,
  signinUser,
  firebaseSignup,
  userAuthorization,
} = require("../controllers/authController.js");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken.js");
const {
  authorization,
  firebaseUidAuthorization,
} = require("../middleware/authorization.js");
const router = express.Router();

// signup:
router.post("/signup", signupUser);
// signin:
router.post("/signin", signinUser);
// fire signup:
router.post("/firebaseSignup", verifyFirebaseToken, firebaseSignup);
router.get("/verify", authorization, userAuthorization);
// routes/auth.js

module.exports = router;
