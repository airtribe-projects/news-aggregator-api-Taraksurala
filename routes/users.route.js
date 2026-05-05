const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const prefController = require("../controllers/preferenceController");
const auth = require("../middleware/auth");
const {
  validate,
  registerSchema,
  preferenceSchema,
} = require("../middleware/validate");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/preferences", auth, prefController.getPreferences);
router.put(
  "/preferences",
  auth,
  [auth, validate(preferenceSchema)],
  prefController.updatePreferences,
);

module.exports = router;
