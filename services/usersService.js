const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock Database (Replace with your actual DB logic)
let users = [];
const readArticles = new Map(); // userId -> Set of articleIds
const favoriteArticles = new Map(); // userId -> Set of articleIds
const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = { ...userData, password: hashedPassword, preferences: [] };
  users.push(newUser);
  return newUser;
};

const loginUser = async (email, password) => {
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return { user, token };
};

const getUserPreferences = (userId) => {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  return user.preferences || [];
};

const updateUserPreferences = (userId, newPreferences) => {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error("User not found");

  // Ensure preferences is an array (e.g., ['technology', 'science'])
  users[userIndex].preferences = newPreferences;
  return users[userIndex].preferences;
};

const markAction = (userId, articleId, type) => {
  const store = type === "read" ? readArticles : favoriteArticles;
  if (!store.has(userId)) store.set(userId, new Set());
  store.get(userId).add(articleId);
  return true;
};

const getActionItems = (userId, type) => {
  const store = type === "read" ? readArticles : favoriteArticles;
  return Array.from(store.get(userId) || []);
};

module.exports = {
  registerUser,
  loginUser,
  users,
  getUserPreferences,
  updateUserPreferences,
  markAction,
  getActionItems,
};
