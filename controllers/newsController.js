const newsService = require("../services/newsService");
const userService = require("../services/usersService");

exports.getNews = async (req, res) => {
  try {
    // 1. Get user's preferences using the ID from the auth middleware
    const preferences = userService.getUserPreferences(req.user.id);

    // 2. Fetch articles based on those preferences
    const articles = await newsService.getNewsForUser(preferences);

    res.status(200).json({
      count: articles.length,
      articles: articles,
    });
  } catch (err) {
    // Handle authentication errors vs API failures
    const status = err.message.includes("NewsAPI") ? 502 : 500;
    res.status(status).json({ message: err.message });
  }
};

exports.searchNews = async (req, res) => {
  try {
    const articles = await newsService.getNewsForUser([], req.params.keyword);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleArticleAction = (req, res) => {
  const { id } = req.params;
  const action = req.path.includes("favorite") ? "favorite" : "read";
  userService.markAction(req.user.id, id, action);
  res.json({ message: `Article marked as ${action}` });
};

exports.getMarkedArticles = (req, res) => {
  const action = req.path.includes("favorites") ? "favorite" : "read";
  const items = userService.getActionItems(req.user.id, action);
  res.json({ [action]: items });
};
