const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const auth = require("../middleware/auth");

// Protected route
router.get("/", auth, newsController.getNews);

router.post("/news/:id/read", auth, newsController.handleArticleAction);
router.post("/news/:id/favorite", auth, newsController.handleArticleAction);
router.get("/news/read", auth, newsController.getMarkedArticles);
router.get("/news/favorites", auth, newsController.getMarkedArticles);

module.exports = router;
