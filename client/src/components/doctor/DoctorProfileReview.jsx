import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ────────────────────────────────────────────────────────────
// Small UI helpers
// ────────────────────────────────────────────────────────────
function Star({ filled }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${filled ? "fill-[#00c3a5]" : "fill-gray-300"}`}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.967 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 0 0-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.88 8.72c-.783-.57-.379-1.81.588-1.81H6.93a1 1 0 0 0 .951-.69l1.168-3.292Z" />
    </svg>
  );
}

function StarRating({ value = 0 }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < v} />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, max }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-sm text-gray-600">{stars}★</span>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, #00c3a5 0%, rgba(0,195,165,0.6) 100%)",
          }}
        />
      </div>
      <span className="w-10 text-sm text-gray-600 text-right">{count}</span>
    </div>
  );
}

function SkeletonReviewCard() {
  return (
    <div className="rounded-xl border p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="mt-2 h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-3 h-3 w-5/6 bg-gray-200 rounded" />
      <div className="mt-2 h-3 w-2/3 bg-gray-200 rounded" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────
export default function DoctorProfileReview({ doctorId: propDoctorId, pageSize = 5 }) {
  const { currentDoctor } = useSelector((s) => s.doctor);
  const doctorId = propDoctorId || currentDoctor?._id;

  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [selectedStars, setSelectedStars] = useState([]); // e.g., [5,4]
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "highest" | "lowest"
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!doctorId) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${doctorId}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load reviews");
        if (!ignore) {
          setAllReviews(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!ignore) setErr(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [doctorId]);

  // Derived stats
  const stats = useMemo(() => {
    const total = allReviews.length;
    const byStar = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of allReviews) {
      const s = Number(r.rating) || 0;
      if (s >= 1 && s <= 5) byStar[s] += 1;
      sum += s;
    }
    const avg = total ? sum / total : 0;
    return { total, avg, byStar };
  }, [allReviews]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let arr = [...allReviews];

    if (selectedStars.length) {
      arr = arr.filter((r) => selectedStars.includes(Number(r.rating)));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((r) => {
        const author =
          (r.user?.firstName || "") + " " + (r.user?.lastName || "");
        return (
          (r.comment || "").toLowerCase().includes(q) ||
          author.toLowerCase().includes(q)
        );
      });
    }

    if (sortBy === "newest") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "highest") {
      arr.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "lowest") {
      arr.sort((a, b) => Number(a.rating) - Number(b.rating));
    }

    return arr;
  }, [allReviews, selectedStars, search, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  useEffect(() => {
    // reset to page 1 when filters/search change
    setPage(1);
  }, [search, selectedStars.join(","), sortBy, pageSize]);

  const toggleStar = (s) => {
    setSelectedStars((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  // UI
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header / Summary */}
      <section className="rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div
          className="px-6 py-6 sm:px-8"
          style={{
            background:
              "radial-gradient(120% 120% at -10% -10%, #00c3a5 0%, rgba(0,195,165,0.15) 60%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Profile reviews
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                See what patients say about your care.
              </p>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-gray-900 leading-none">
                {stats.avg ? stats.avg.toFixed(1) : "—"}
              </div>
              <div className="pb-1">
                <StarRating value={stats.avg || 0} />
                <div className="mt-1 text-xs text-gray-600">
                  {stats.total} review{stats.total === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[5, 4, 3, 2, 1].map((s) => (
              <RatingBar
                key={s}
                stars={s}
                count={stats.byStar[s] || 0}
                max={stats.total || 0}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 sm:px-8 py-4 border-t bg-white">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
                placeholder="Search reviews (comment or author)…"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[5, 4, 3, 2, 1].map((s) => {
                const active = selectedStars.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStar(s)}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm border transition ${
                      active
                        ? "border-[#00c3a5] text-[#00c3a5] bg-[#00c3a5]/10"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    title={`Filter ${s} star`}
                  >
                    {s}★
                  </button>
                );
              })}
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest rated</option>
                <option value="lowest">Lowest rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews list */}
      <section className="mt-6 space-y-3">
        {loading ? (
          <>
            <SkeletonReviewCard />
            <SkeletonReviewCard />
            <SkeletonReviewCard />
          </>
        ) : err ? (
          <div className="rounded-xl border bg-red-50 text-red-700 p-4">
            {err}
          </div>
        ) : paged.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
            No reviews match your filters.
          </div>
        ) : (
          paged.map((r) => (
            <article
              key={r._id}
              className="rounded-xl border bg-white p-4 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {(r.user?.firstName?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {(r.user?.firstName || "Patient") +
                        " " +
                        (r.user?.lastName || "")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(new Date(r.createdAt))}
                    </div>
                  </div>
                </div>
                <StarRating value={Number(r.rating) || 0} />
              </div>

              <p className="mt-3 text-gray-700 leading-relaxed">{r.comment}</p>
            </article>
          ))
        )}
      </section>

      {/* Pagination */}
      {!loading && !err && filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <strong>
              {(pageSafe - 1) * pageSize + 1}-
              {Math.min(pageSafe * pageSize, filtered.length)}
            </strong>{" "}
            of <strong>{filtered.length}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page <strong>{pageSafe}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
