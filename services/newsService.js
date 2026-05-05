const axios = require("axios");
const newsCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 Minutes

// Fallback to a general query if user has no preferences
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
const API_KEY = process.env.NEWS_API_KEY;
const getNewsForUser = async (preferences, keyword = null) => {
  // Generate a unique cache key based on preferences or search keyword
  const cacheKey = keyword
    ? `search_${keyword}`
    : `pref_${preferences.join("_") || "general"}`;

  // 1. Check Cache
  if (newsCache.has(cacheKey)) {
    const cached = newsCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  // 2. Fetch from External API
  const query =
    keyword || (preferences.length > 0 ? preferences[0] : "general");
  const response = await axios.get("https://newsapi.org/v2/everything", {
    params: { q: query, apiKey: process.env.NEWS_API_KEY, pageSize: 10 },
  });

  const articles = response.data.articles.map((art, index) => ({
    ...art,
    id: Buffer.from(art.url).toString("base64").substring(0, 10), // Generate a mock ID
  }));

  // 3. Update Cache
  newsCache.set(cacheKey, { data: articles, timestamp: Date.now() });
  return articles;
};

module.exports = { getNewsForUser, newsCache };
