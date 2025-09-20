// src/components/public/MedicalTreatment.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  MdOutlineStarBorder,
  MdOutlineStarPurple500,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { FiExternalLink, FiImage, FiX, FiAlertCircle } from "react-icons/fi";
import axios from "axios";
import { io } from "socket.io-client";
import Footer from "./Footer";

const THEME = "#00c3a5";

function StarRating({ avg = 0, size = "text-xl" }) {
  const full = Math.floor(Number(avg) || 0);
  const empty = Math.max(0, 5 - full);
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <MdOutlineStarPurple500 key={`f-${i}`} className={`${size}`} style={{ color: THEME }} />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <MdOutlineStarBorder key={`e-${i}`} className={`${size}`} style={{ color: THEME }} />
      ))}
    </div>
  );
}

function PillNav({ sections }) {
  // sections: [{id, label, exists}]
  const visible = sections.filter((s) => s.exists);
  if (!visible.length) return null;

  return (
    <div className="sticky top-0 z-20 -mx-4 sm:mx-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-4 py-3">
          {visible.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:border-gray-300 hover:shadow-sm"
              style={{ scrollMarginTop: "80px" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageLightbox({ images = [], index = 0, onClose, onPrev, onNext }) {
  if (!images.length) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full p-2 bg-white/10 text-white hover:bg-white/20"
      >
        <FiX className="text-2xl" />
      </button>
      <div className="max-w-6xl w-full">
        <div className="relative">
          <img
            src={images[index]}
            alt=""
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={onNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {index + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse">
      <div className="h-8 w-2/3 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 h-64 rounded-lg bg-gray-200" />
        <div className="h-64 rounded-lg bg-gray-200" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-4/5 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function MedicalTreatment() {
  const { slug } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [treatmentData, setTreatmentData] = useState(null);
  const [treatment, setTreatment] = useState(null);
  const [doctorRatings, setDoctorRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState({});
  const [err, setErr] = useState(null);

  // gallery
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const scrollTopRef = useRef(null);

  const handleDoctorProfile = (doctor) => {
    // keep your existing behavior (full load to /profile-info/:id)
    window.location.href = `/profile-info/${doctor._id}`;
  };

  const handleToggleFAQ = (index) => {
    setOpenFAQ((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    let alive = true;
    const API_URL = `${API_BASE_URL}`.trim().replace(/\/$/, "");
    const SOCKET_URL = API_URL;

    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/treatments/slug/${slug}`);
        const t = data?.treatment ?? data ?? null;
        if (alive) {
          setTreatment(t);
          setTreatmentData(data);

          // Load reviews for doctors
          if (data?.doctors?.length) {
            const reviewPromises = data.doctors.map(async (doc) => {
              try {
                const reviewRes = await axios.get(`${API_URL}/api/reviews/${doc._id}`);
                const list = Array.isArray(reviewRes.data) ? reviewRes.data : [];
                const total = list.length;
                const avg =
                  total > 0 ? list.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total : 0;
                return { doctorId: doc._id, avgRating: avg, totalReviews: total };
              } catch {
                return { doctorId: doc._id, avgRating: 0, totalReviews: 0 };
              }
            });
            const reviews = await Promise.all(reviewPromises);
            if (alive) {
              const map = {};
              reviews.forEach((r) => (map[r.doctorId] = r));
              setDoctorRatings(map);
            }
          }
        }
      } catch (e) {
        if (alive) setErr("Failed to load treatment");
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // socket for live image updates
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("joinTreatment", slug);
    });

    socket.on("treatment:imagesUpdated", (payload) => {
      if (payload?.slug === slug && Array.isArray(payload.images)) {
        setTreatment((prev) => (prev ? { ...prev, images: payload.images } : prev));
        setTreatmentData((prev) =>
          prev?.treatment
            ? { ...prev, treatment: { ...prev.treatment, images: payload.images } }
            : prev
        );
      }
    });

    return () => {
      alive = false;
      socket.emit("leaveTreatment", slug);
      socket.disconnect();
    };
  }, [slug, API_BASE_URL]);

  const groupedSections = useMemo(() => {
    const g = { default: [], benefit: [], step: [], candidate: [], risk: [], faq: [] };
    if (treatment?.sections?.length) {
      for (const sec of treatment.sections) {
        const type = (sec?.type || "default").toLowerCase();
        if (g[type]) g[type].push(sec);
        else g.default.push(sec);
      }
    }
    return g;
  }, [treatment?.sections]);

  const specialties = useMemo(() => {
    const list = Array.isArray(treatment?.specialties) ? treatment.specialties : [];
    return list.map((s) => (typeof s === "string" ? s : s?.name || "")).filter(Boolean);
  }, [treatment?.specialties]);

  const hasImages = Array.isArray(treatment?.images) && treatment.images.length > 0;

  const sectionsForNav = [
    { id: "overview", label: "Overview", exists: Boolean(treatment?.name) },
    { id: "gallery", label: "Images", exists: hasImages },
    { id: "benefits", label: "Benefits", exists: groupedSections.benefit.length > 0 },
    { id: "steps", label: "Steps", exists: groupedSections.step.length > 0 },
    { id: "candidates", label: "Candidates", exists: groupedSections.candidate.length > 0 },
    { id: "risks", label: "Risks", exists: groupedSections.risk.length > 0 },
    { id: "faqs", label: "FAQs", exists: groupedSections.faq.length > 0 },
    { id: "pricing", label: "Pricing by City", exists: Array.isArray(treatment?.priceByCity) && treatment.priceByCity.length > 0 },
    { id: "specialists", label: "Specialists", exists: Array.isArray(treatmentData?.doctors) && treatmentData.doctors.length > 0 },
  ];

  const openLightbox = (i) => {
    setGalleryIndex(i);
    setGalleryOpen(true);
  };
  const closeLightbox = () => setGalleryOpen(false);
  const prevImage = () =>
    setGalleryIndex((i) => (i <= 0 ? (treatment.images.length - 1) : i - 1));
  const nextImage = () =>
    setGalleryIndex((i) => (i >= treatment.images.length - 1 ? 0 : i + 1));

  if (loading) return <Skeleton />;
  if (err) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-start gap-3">
          <FiAlertCircle className="text-xl shrink-0" />
          <div>
            <div className="font-semibold">Something went wrong</div>
            <p className="text-sm opacity-90">{err}</p>
          </div>
        </div>
      </div>
    );
  }
  if (!treatmentData?.treatment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-gray-600">
        No treatment found.
      </div>
    );
  }

  const imgs = hasImages ? [...treatment.images].reverse() : [];

  return (
    <div className="bg-white">
      {/* Section pills */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6">
        <PillNav sections={sectionsForNav} />
      </div>

      {/* HERO / OVERVIEW */}
      <section id="overview" ref={scrollTopRef} className="mx-auto max-w-6xl px-4 pt-6 sm:pt-10">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <span
              className="inline-flex w-fit items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${THEME}15`, color: THEME, borderColor: `${THEME}33` }}
            >
              Treatment
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {treatmentData.treatment.name}
            </h1>
            {treatment?.priceRange && (
              <div className="text-sm">
                <span className="rounded-full border px-2 py-0.5" style={{ borderColor: `${THEME}55`, color: THEME }}>
                  {treatment.priceRange}
                </span>
              </div>
            )}
          </div>

          {treatmentData.treatment.description && (
            <p className="max-w-3xl text-gray-700 leading-relaxed">
              {treatmentData.treatment.description}
            </p>
          )}

          {!!specialties.length && (
            <div className="flex flex-wrap gap-2">
              {specialties.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 pt-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Treatment Images</h2>
        {hasImages ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Featured */}
            <div className="md:col-span-2 relative group">
              <img
                src={imgs[0]}
                alt={`${treatment.name} photo 1`}
                loading="lazy"
                className="h-full max-h-[640px] w-full rounded-lg object-cover"
                onClick={() => openLightbox(0)}
              />
              <button
                onClick={() => openLightbox(0)}
                className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                View
              </button>
            </div>

            {/* Stacked 2 */}
            <div className="flex flex-col gap-4">
              {imgs[1] && (
                <img
                  src={imgs[1]}
                  alt={`${treatment.name} photo 2`}
                  loading="lazy"
                  className="h-[calc(50%-0.5rem)] max-h-[315px] w-full rounded-lg object-cover"
                  onClick={() => openLightbox(1)}
                />
              )}
              {imgs[2] && (
                <img
                  src={imgs[2]}
                  alt={`${treatment.name} photo 3`}
                  loading="lazy"
                  className="h-[calc(50%-0.5rem)] max-h-[315px] w-full rounded-lg object-cover"
                  onClick={() => openLightbox(2)}
                />
              )}
            </div>

            {/* Rest */}
            {imgs.length > 3 && (
              <div className="md:col-span-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {imgs.slice(3).map((src, i) => {
                    const idx = i + 3;
                    return (
                      <div key={`more-${idx}`} className="relative group">
                        <img
                          src={src}
                          alt={`${treatment.name} photo ${idx + 1}`}
                          loading="lazy"
                          className="h-40 w-full rounded-lg object-cover"
                          onClick={() => openLightbox(idx)}
                        />
                        <button
                          onClick={() => openLightbox(idx)}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center rounded-lg bg-black/20 text-white"
                          aria-label="Open image"
                        >
                          <FiImage className="text-2xl" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid place-items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-500">
            No images available for this treatment.
          </div>
        )}
      </section>

      {/* CONTENT SECTIONS */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Benefits */}
            {groupedSections.benefit.length > 0 && (
              <div id="benefits">
                <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                <ul className="ml-5 list-disc text-gray-700 space-y-1">
                  {groupedSections.benefit.map((item) => (
                    <li key={item._id || item.title}>{item.content}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            {groupedSections.step.length > 0 && (
              <div id="steps" className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Procedure Steps</h3>
                <ol className="ml-5 list-decimal whitespace-pre-line text-gray-700 space-y-1">
                  {groupedSections.step.map((item) => (
                    <li key={item._id || item.title}>{item.content}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Candidates */}
            {groupedSections.candidate.length > 0 && (
              <div id="candidates" className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Who Can Benefit?</h3>
                <div className="space-y-3 text-gray-700">
                  {groupedSections.candidate.map((item) => (
                    <div key={item._id || item.title}>
                      {!!item.title && <h4 className="font-medium">{item.title}</h4>}
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {groupedSections.risk.length > 0 && (
              <div id="risks" className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Risks</h3>
                <div className="space-y-3 text-gray-700">
                  {groupedSections.risk.map((item) => (
                    <div key={item._id || item.title}>
                      {!!item.title && <h4 className="font-medium">{item.title}</h4>}
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Default */}
            {groupedSections.default.length > 0 && (
              <div className="mt-8">
                {groupedSections.default.map((item) => (
                  <div key={item._id || item.title} className="mb-5 text-gray-700">
                    {!!item.title && (
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    )}
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ */}
            {groupedSections.faq.length > 0 && (
              <div id="faqs" className="mt-10">
                <h3 className="text-xl font-semibold">Frequently asked questions</h3>
                <div className="mt-4 rounded-lg border">
                  {groupedSections.faq.map((faq, index) => (
                    <div key={faq._id || index} className="border-t first:border-t-0">
                      <button
                        className="flex w-full items-center justify-between gap-2 px-4 py-4 text-left hover:bg-gray-50"
                        onClick={() => handleToggleFAQ(index)}
                        aria-expanded={!!openFAQ[index]}
                        aria-controls={`faq-panel-${index}`}
                      >
                        <span
                          className={`text-sm ${
                            openFAQ[index] ? "text-gray-500" : "text-gray-700"
                          }`}
                        >
                          {faq.title}
                        </span>
                        <MdKeyboardArrowUp
                          className={`text-xl text-gray-400 transition-transform ${
                            openFAQ[index] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFAQ[index] && (
                        <div id={`faq-panel-${index}`} className="px-4 pb-4 text-sm text-gray-700">
                          {faq.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDE INFO */}
          <aside className="lg:col-span-4 space-y-6">
            {treatment?.priceRange && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">Typical price range</div>
                <div className="mt-1 text-lg font-semibold" style={{ color: THEME }}>
                  {treatment.priceRange}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  This is an indicative range; final pricing may vary by clinic, city, and case.
                </p>
              </div>
            )}

            {!!specialties.length && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Related specialties</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {specialties.map((label, i) => (
                    <span
                      key={`${label}-${i}`}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* PRICING BY CITY */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 pt-8">
        <h3 className="text-xl font-semibold">Service price by city</h3>
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {treatment?.priceByCity?.length ? (
            <table className="min-w-full">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Clinics</th>
                  <th className="px-4 py-3">Doctors</th>
                  <th className="px-4 py-3">From</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {treatment.priceByCity.map((c, i) => (
                  <tr key={`${c.city}-${i}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium underline underline-offset-2">{c.city}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.clinicsCount}</td>
                    <td className="px-4 py-3 text-gray-700">{c.doctorsCount}</td>
                    <td className="px-4 py-3 font-medium">{c.minPrice} PLN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-gray-500">No pricing data available.</div>
          )}
        </div>
      </section>

      {/* RECOMMENDED SPECIALISTS */}
      <section id="specialists" className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <h3 className="text-xl sm:text-2xl font-semibold">
          {treatmentData.treatment.name}: recommended specialists & clinics
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(treatmentData?.doctors || []).map((doc) => {
            const ratingInfo = doctorRatings[doc._id] || { avgRating: 0, totalReviews: 0 };
            return (
              <div
                key={doc._id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={doc.profilePicture || "/default-doc.jpg"}
                  alt={`${doc.firstName} ${doc.lastName}`}
                  className="h-20 w-20 rounded-lg object-cover border"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="font-semibold">
                    Dr. {doc.firstName} {doc.lastName}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating avg={ratingInfo.avgRating} />
                    <span className="text-xs text-gray-600">
                      {ratingInfo.totalReviews}{" "}
                      {ratingInfo.totalReviews === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDoctorProfile(doc)}
                  className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400"
                  title="Show profile"
                >
                  <FiExternalLink /> Show profile
                </button>
              </div>
            );
          })}
          {(treatmentData?.doctors?.length ?? 0) === 0 && (
            <div className="col-span-full rounded-xl border border-gray-200 bg-white p-4 text-gray-600">
              No recommended specialists yet.
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {galleryOpen && (
        <ImageLightbox
          images={imgs}
          index={galleryIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      {/* FOOTER */}
      <div className="bg-[#f7f9fa] px-4 py-6 mt-8">
        <Footer />
      </div>
    </div>
  );
}
