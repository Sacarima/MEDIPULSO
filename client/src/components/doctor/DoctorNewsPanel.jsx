// src/components/doctor/DoctorNewsPanel.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
       <rect width='100%' height='100%' fill='#f3f4f6'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='16'>No image</text>
     </svg>`
  );

function formatRelativeTime(dateStr) {
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}


export default function DoctorNewsPanel({
  country = "us",
  pageSize = 12,
  language = "en",
  initialTopics = [],
}) {
  // --- personalization ---
  const [topics, setTopics] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("news_topics") || "[]");
      return Array.isArray(saved) && saved.length ? saved : initialTopics;
    } catch {
      return initialTopics;
    }
  });
  const [activeTopic, setActiveTopic] = useState("");
  const [topicInput, setTopicInput] = useState("");

  // --- search/news state ---
  const [q, setQ] = useState(""); // search query
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // read/unread by article URL
  const [readMap, setReadMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("news_read_map") || "{}");
    } catch {
      return {};
    }
  });

  // persist topics + read state
  useEffect(() => {
    localStorage.setItem("news_topics", JSON.stringify(topics));
  }, [topics]);
  useEffect(() => {
    localStorage.setItem("news_read_map", JSON.stringify(readMap));
  }, [readMap]);

  const unreadCount = useMemo(
    () => articles.reduce((acc, a) => acc + (readMap[a.url] ? 0 : 1), 0),
    [articles, readMap]
  );

  const hasMore = useMemo(
    () => articles.length < totalResults,
    [articles, totalResults]
  );

  // Use explicit search > active topic > none
  const effectiveQ = (q || activeTopic || "").trim();

  // --- Provider auto-detect ---
  const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;
  const ER_KEY = import.meta.env.VITE_EVENTREGISTRY_KEY; 
  const USE_EVENT_REGISTRY = !!ER_KEY;

  //  keep  NewsAPI backend proxy toggle for the fallback
  const USE_BACKEND_PROXY = !!import.meta.env.VITE_USE_NEWS_BACKEND;

  // Event Registry expects 3-letter language codes; “eng” is safe
  const erLang = "eng";

  // Map Event Registry article -> UI shape
  const mapER = (a) => ({
    title: a.title,
    url: a.url,
    urlToImage: a.image || null,
    source: { name: a.source?.title || "Source" },
    publishedAt: a.dateTimePub,
    description: a.body ? String(a.body).slice(0, 220) : "",
  });

  // Build request for current provider
  const buildRequest = ({ q, page, pageSize, country, language }) => {
    if (USE_EVENT_REGISTRY) {
      // Event Registry: POST with JSON body, apiKey in query string
      const url = `https://eventregistry.org/api/v1/article/getArticles?apiKey=${ER_KEY}`;

      // If searching, use keyword in title; otherwise category health
      const haveQuery = !!q;
      const query = haveQuery
        ? { keyword: q, keywordLoc: "title", lang: erLang }
        : { categoryUri: "dmoz/Health", lang: erLang };

      const body = {
        query: { $query: query, $filter: { forceMaxDataTimeWindow: "31" } }, // last 31 days
        resultType: "articles",
        articlesSortBy: "date",
        articlesCount: pageSize,
        articlesPage: page,
        articlesArticleBodyLen: -1,
      };

      return {
        provider: "ER",
        url,
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      };
    }

    // NewsAPI fallback (only if you later add a valid NewsAPI key)
    const devDirectUrl = q
      ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=${language}&pageSize=${pageSize}&page=${page}`
      : `https://newsapi.org/v2/top-headlines?category=health&country=${country}&pageSize=${pageSize}&page=${page}`;

    const backendUrl = q
      ? `${import.meta.env.VITE_API_BASE_URL}/api/news/search?q=${encodeURIComponent(q)}&pageSize=${pageSize}&page=${page}&language=${language}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/news/health?country=${country}&pageSize=${pageSize}&page=${page}`;

    const url = USE_BACKEND_PROXY ? backendUrl : devDirectUrl;

    return {
      provider: "NEWSAPI",
      url,
      options: USE_BACKEND_PROXY
        ? {}
        : { headers: { "X-Api-Key": NEWSAPI_KEY } }, // NewsAPI requires this header
    };
  };

  const fetchNews = async (opts = { append: false }) => {
    try {
      setError("");
      opts.append ? setLoadingMore(true) : setLoading(true);

      const req = buildRequest({
        q: effectiveQ,
        page,
        pageSize,
        country,
        language,
      });
      const res = await fetch(req.url, req.options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let list = [];
      let total = 0;

      if (req.provider === "ER") {
        const erList = Array.isArray(data?.articles?.results)
          ? data.articles.results
          : [];
        list = erList.map(mapER);
        total = data?.articles?.totalResults || list.length;
      } else {
        // NewsAPI shape
        list = Array.isArray(data.articles) ? data.articles : [];
        total = data.totalResults || list.length;
      }

      setTotalResults(total);
      setArticles((prev) => (opts.append ? [...prev, ...list] : list));
    } catch (e) {
      setError("Couldn’t load health news. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [effectiveQ, country]);

  // fetch on page/query change
  useEffect(() => {
    fetchNews({ append: page > 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, effectiveQ, country]);

  const onSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setActiveTopic(""); // clear topic filter when doing a search
    setQ((form.get("q") || "").trim());
  };

  // topics helpers
  const inputRef = useRef(null);
  const addTopic = () => {
    const t = topicInput.trim();
    if (!t) return;
    if (!topics.includes(t)) setTopics((prev) => [...prev, t]);
    setTopicInput("");
    inputRef.current?.focus();
  };
  const removeTopic = (t) => {
    setTopics((prev) => prev.filter((x) => x !== t));
    if (activeTopic === t) setActiveTopic("");
  };

  // read/unread toggle
  const toggleRead = (article) => {
    const id = article.url;
    setReadMap((m) => ({ ...m, [id]: !m[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Health News</h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-amber-500 text-white rounded-full px-2 py-0.5">
              {unreadCount} unread
            </span>
          )}
        </div>
        <form onSubmit={onSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            name="q"
            type="text"
            placeholder="Search topics (e.g. diabetes, cardiology)"
            className="w-full sm:w-72 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#00b39be6]"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded bg-[#00b39be6] text-white hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>

      {/* Topics row (non-breaking, optional UI) */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm border ${
              !activeTopic && !q ? "bg-[#00b39be6] text-white border-[#00b39be6]" : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setQ("");
              setActiveTopic("");
            }}
          >
            All
          </button>

          {topics.map((t) => (
            <div key={t} className="flex items-center">
              <button
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  activeTopic === t
                    ? "bg-[#00b39be6] text-white border-[#00b39be6]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setQ("");
                  setActiveTopic(t);
                }}
                title={`Filter by ${t}`}
              >
                {t}
              </button>
              <button
                className="ml-1 text-xs px-2 py-1 rounded-full border hover:bg-gray-50"
                onClick={() => removeTopic(t)}
                aria-label={`Remove topic ${t}`}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2 ml-2">
            <input
              ref={inputRef}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Add topic"
              className="h-9 border rounded px-2"
            />
            <button
              onClick={addTopic}
              className="h-9 px-3 rounded border bg-white hover:bg-gray-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border rounded overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 w-1/2" />
                <div className="h-3 bg-gray-200 w-4/5" />
                <div className="h-3 bg-gray-200 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="bg-white border rounded p-6 text-gray-600">No results. Try another query.</div>
      )}

      {/* Grid */}
      {!loading && !error && articles.length > 0 && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, idx) => {
              const isRead = !!readMap[a.url];
              return (
                <article
                  key={`${a.url}-${idx}`}
                  className={`bg-white border rounded overflow-hidden flex flex-col ${
                    isRead ? "opacity-80" : ""
                  }`}
                >
                  <img
                    src={a.urlToImage || PLACEHOLDER}
                    alt={a.title || "news image"}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>{a.source?.name || "Source"}</span>
                      <span>{a.publishedAt ? formatRelativeTime(a.publishedAt) : ""}</span>
                    </div>
                    <h3 className="font-medium leading-snug line-clamp-2">{a.title}</h3>
                    {a.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">{a.description}</p>
                    )}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-[#00b39be6] hover:underline"
                        onClick={() => toggleRead(a)}
                        title="Open & mark read"
                      >
                        Read full story →
                      </a>
                      <button
                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                        onClick={() => toggleRead(a)}
                        title={isRead ? "Mark as unread" : "Mark as read"}
                      >
                        {isRead ? "Unread" : "Read"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                disabled={loadingMore}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
