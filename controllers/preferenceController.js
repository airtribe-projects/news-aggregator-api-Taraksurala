const userService = require("../services/usersService");

exports.getPreferences = (req, res) => {
  try {
    // req.user.id comes from the auth middleware
    const preferences = userService.getUserPreferences(req.user.id);
    res.status(200).json({ preferences });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePreferences = (req, res) => {
  try {
    const { preferences } = req.body;
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: "Preferences must be an array" });
    }
    const updated = userService.updateUserPreferences(req.user.id, preferences);
    res
      .status(200)
      .json({ message: "Preferences updated", preferences: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
