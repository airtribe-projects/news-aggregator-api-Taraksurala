const userService = require("../services/usersService");

exports.register = async (req, res) => {
  try {
    // Validation: Ensure body isn't empty
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await userService.registerUser(req.body);
    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    // Differentiate between auth failure and server errors
    const status = err.message === "Invalid credentials" ? 401 : 500;
    res.status(status).json({ message: err.message });
  }
};
