// example: server/routes/news.route.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const NEWS_KEY = process.env.NEWSAPI_KEY;

// GET /api/news/health?country=us&page=1&pageSize=12
router.get("/health", async (req, res) => {
  const { country = "us", page = 1, pageSize = 12 } = req.query;
  const url = `https://newsapi.org/v2/top-headlines?category=health&country=${country}&pageSize=${pageSize}&page=${page}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${NEWS_KEY}` } });
  const data = await r.json();
  res.json(data);
});

// GET /api/news/search?q=diabetes&page=1&pageSize=12&language=en
router.get("/search", async (req, res) => {
  const { q = "", page = 1, pageSize = 12, language = "en" } = req.query;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=${language}&pageSize=${pageSize}&page=${page}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${NEWS_KEY}` } });
  const data = await r.json();
  res.json(data);
});

export default router;
