require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/users.route");
const newsRoutes = require("./routes/newsRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/news", newsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle Unauthorized Errors specifically if they aren't caught by the middleware
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Unauthorized access attempt." });
  }

  // Default Error
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

setInterval(
  () => {
    console.log("Background Task: Refreshing News Cache...");
    newsService.newsCache.clear();
  },
  30 * 60 * 1000,
);

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
