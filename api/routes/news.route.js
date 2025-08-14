// server/routes/news.route.js
import express from "express";
// If you're on Node 18+, you can remove node-fetch; otherwise keep it:
import fetch from "node-fetch";

const router = express.Router();

// Prefer server-only env; tolerate accidental "NEWSAPI_KEY =..." formatting
const RAW_KEY =
  process.env.NEWSAPI_KEY ||
  process.env.VITE_NEWSAPI_KEY ||
  "";
// Clean up common mistakes like "NEWSAPI_KEY = <key>"
const NEWS_KEY = RAW_KEY.trim().replace(/^NEWSAPI_KEY\s*=\s*/i, "");

if (!NEWS_KEY) {
  console.warn("[news] Missing NEWSAPI_KEY env. Set NEWSAPI_KEY on the server.");
}

// GET /api/news/health?country=us&page=1&pageSize=12
router.get("/health", async (req, res) => {
  try {
    if (!NEWS_KEY) {
      return res.status(500).json({ status: "error", message: "NEWSAPI_KEY not set on server" });
    }
    const { country = "us", page = 1, pageSize = 12 } = req.query;
    const pageNum = Number.parseInt(page, 10) || 1;
    const pageSizeNum = Math.min(100, Number.parseInt(pageSize, 10) || 12);

    const url = `https://newsapi.org/v2/top-headlines?category=health&country=${country}&pageSize=${pageSizeNum}&page=${pageNum}`;
    const r = await fetch(url, { headers: { "X-Api-Key": NEWS_KEY } });

    const data = await r.json();
    return res.status(r.status).json(data); // propagate NewsAPI status (e.g., 401)
  } catch {
    return res.status(500).json({ status: "error", message: "Proxy failed" });
  }
});

// GET /api/news/search?q=diabetes&page=1&pageSize=12&language=en
router.get("/search", async (req, res) => {
  try {
    if (!NEWS_KEY) {
      return res.status(500).json({ status: "error", message: "NEWSAPI_KEY not set on server" });
    }
    const { q = "", page = 1, pageSize = 12, language = "en" } = req.query;
    const pageNum = Number.parseInt(page, 10) || 1;
    const pageSizeNum = Math.min(100, Number.parseInt(pageSize, 10) || 12);

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      q
    )}&language=${language}&pageSize=${pageSizeNum}&page=${pageNum}`;
    const r = await fetch(url, { headers: { "X-Api-Key": NEWS_KEY } });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch {
    return res.status(500).json({ status: "error", message: "Proxy failed" });
  }
});

export default router;
