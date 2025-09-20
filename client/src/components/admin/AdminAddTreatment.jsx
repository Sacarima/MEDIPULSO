// // src/components/admin/AdminAddTreatment.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   FiHash,
//   FiLink2,
//   FiPlus,
//   FiSave,
//   FiTrash2,
//   FiRotateCcw,
//   FiImage,
//   FiMove,
//   FiEdit3,
//   FiType,
//   FiTag,
// } from "react-icons/fi";
// import { MdOutlineDragIndicator } from "react-icons/md";
// import axios from "axios";
// import { uploadTreatmentImages } from "../../lib/uploadTreatmentImages";

// const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7500").replace(/\/+$/, "");

// /** Utils */
// const slugify = (s = "") =>
//   s
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .slice(0, 80);

// const cx = (...classes) => classes.filter(Boolean).join(" ");

// /** Tag (specialties) input */
// function TagInput({ value = [], onChange, placeholder = "Add specialty and press Enter…" }) {
//   const [draft, setDraft] = useState("");

//   const commit = () => {
//     const t = draft.trim();
//     if (!t) return;
//     if (!value.includes(t)) onChange([...value, t]);
//     setDraft("");
//   };

//   return (
//     <div>
//       <div className="flex flex-wrap gap-2 mb-2">
//         {value.map((tag, i) => (
//           <span
//             key={`${tag}-${i}`}
//             className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700 text-sm"
//           >
//             <FiTag className="opacity-70" />
//             {tag}
//             <button
//               type="button"
//               onClick={() => onChange(value.filter((v) => v !== tag))}
//               className="text-emerald-700/70 hover:text-emerald-900"
//               aria-label={`Remove ${tag}`}
//             >
//               ×
//             </button>
//           </span>
//         ))}
//       </div>
//       <input
//         value={draft}
//         onChange={(e) => setDraft(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === ",") {
//             e.preventDefault();
//             commit();
//           }
//           if (e.key === "Backspace" && !draft && value.length) {
//             onChange(value.slice(0, -1));
//           }
//         }}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
//       />
//       <p className="mt-1 text-xs text-gray-500">Tip: Press Enter to add each specialty.</p>
//     </div>
//   );
// }

// /** Sections editor */
// function SectionsEditor({ sections = [], onChange }) {
//   const add = () => onChange([...(sections || []), { title: "", content: "" }]);
//   const remove = (idx) => onChange(sections.filter((_, i) => i !== idx));
//   const update = (idx, patch) => onChange(sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
//   const move = (from, to) => {
//     const next = [...sections];
//     const [spliced] = next.splice(from, 1);
//     next.splice(to, 0, spliced);
//     onChange(next);
//   };

//   return (
//     <div className="space-y-3">
//       {(sections || []).map((sec, idx) => (
//         <div key={idx} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 text-gray-500">
//               <MdOutlineDragIndicator className="text-xl" />
//               <span className="text-xs">Section {idx + 1}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-40"
//                 onClick={() => move(idx, idx - 1)}
//                 disabled={idx === 0}
//               >
//                 ↑
//               </button>
//               <button
//                 type="button"
//                 className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-40"
//                 onClick={() => move(idx, idx + 1)}
//                 disabled={idx === sections.length - 1}
//               >
//                 ↓
//               </button>
//               <button
//                 type="button"
//                 className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
//                 onClick={() => remove(idx)}
//               >
//                 <FiTrash2 /> Remove
//               </button>
//             </div>
//           </div>
//           <div className="mt-3 grid gap-2">
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
//               <input
//                 value={sec.title}
//                 onChange={(e) => update(idx, { title: e.target.value })}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                 placeholder="e.g., What is the procedure?"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
//               <textarea
//                 value={sec.content}
//                 onChange={(e) => update(idx, { content: e.target.value })}
//                 className="min-h-[96px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                 placeholder="Write the section details…"
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={add}
//         className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 hover:bg-emerald-100"
//       >
//         <FiPlus /> Add section
//       </button>
//     </div>
//   );
// }

// /** Images manager (URL + drag/drop/files -> Firebase upload + progress) */
// function ImagesManager({ images = [], onChange, slug, onUploadingChange }) {
//   const [url, setUrl] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [overallPct, setOverallPct] = useState(0);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     onUploadingChange?.(uploading);
//   }, [uploading, onUploadingChange]);

//   const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
//   const MAX_MB = 8;

//   const validateFiles = (list) =>
//     list.filter((f) => ALLOWED.includes(f.type) && f.size <= MAX_MB * 1024 * 1024);

//   const beginUpload = async (fileList) => {
//     const files = validateFiles(Array.from(fileList || []));
//     if (!files.length) {
//       alert(`Images must be JPG/PNG/WebP/AVIF and <= ${MAX_MB}MB each.`);
//       return;
//     }

//     setUploading(true);
//     setOverallPct(0);

//     try {
//       const urls = await uploadTreatmentImages(files, {
//         slug,
//         onOverallProgress: setOverallPct,
//       });
//       const merged = Array.from(new Set([...(images || []), ...urls]));
//       onChange(merged);
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Upload failed. Please try again.");
//     } finally {
//       setUploading(false);
//       setOverallPct(0);
//       if (inputRef.current) inputRef.current.value = "";
//     }
//   };

//   const addUrl = () => {
//     const u = url.trim();
//     if (!u) return;
//     try {
//       const ok = /^https?:\/\//i.test(u);
//       if (!ok) throw new Error("Invalid URL");
//       onChange([...(images || []), u]);
//       setUrl("");
//     } catch {
//       alert("Please paste a valid image URL that starts with http(s)://");
//     }
//   };

//   const move = (from, to) => {
//     const next = [...images];
//     const [spliced] = next.splice(from, 1);
//     next.splice(to, 0, spliced);
//     onChange(next);
//   };

//   const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

//   const onDrop = (e) => {
//     e.preventDefault();
//     if (uploading) return;
//     const files = e.dataTransfer?.files;
//     if (files?.length) beginUpload(files);
//   };

//   const onPick = (e) => {
//     if (uploading) return;
//     const files = e.target.files;
//     if (files?.length) beginUpload(files);
//   };

//   return (
//     <div className="space-y-3">
//       <div
//         className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center"
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={onDrop}
//       >
//         <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-white shadow">
//           <FiImage className="text-xl text-gray-500" />
//         </div>
//         <p className="text-sm text-gray-600">Drag & drop images here, or</p>
//         <div className="mt-3 flex items-center justify-center">
//           <button
//             type="button"
//             onClick={() => inputRef.current?.click()}
//             disabled={uploading}
//             className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
//           >
//             Upload files
//           </button>
//           <input
//             ref={inputRef}
//             type="file"
//             className="hidden"
//             multiple
//             accept="image/*"
//             onChange={onPick}
//           />
//         </div>

//         {/* Upload progress */}
//         {uploading && (
//           <div className="mt-4">
//             <div className="mb-1 text-xs text-gray-600">Uploading… {overallPct}%</div>
//             <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
//               <div className="h-full bg-emerald-500 transition-[width]" style={{ width: `${overallPct}%` }} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add by URL */}
//       <div className="flex gap-2">
//         <input
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           placeholder="https://… image URL"
//           className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
//         />
//         <button
//           type="button"
//           onClick={addUrl}
//           className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
//         >
//           <FiLink2 /> Add
//         </button>
//       </div>

//       {/* Gallery */}
//       {images?.length ? (
//         <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//           {images.map((src, i) => (
//             <li key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
//               <img src={src} alt="" className="h-32 w-full object-cover" />
//               <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
//                 <div className="flex items-center gap-1">
//                   <button
//                     type="button"
//                     onClick={() => move(i, i - 1)}
//                     disabled={i === 0 || uploading}
//                     className="rounded bg-white/80 px-2 py-1 text-xs disabled:opacity-40"
//                     title="Move left"
//                   >
//                     ←
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => move(i, i + 1)}
//                     disabled={i === images.length - 1 || uploading}
//                     className="rounded bg-white/80 px-2 py-1 text-xs disabled:opacity-40"
//                     title="Move right"
//                   >
//                     →
//                   </button>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => remove(i)}
//                   disabled={uploading}
//                   className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-60"
//                   title="Remove"
//                 >
//                   <FiTrash2 /> Remove
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-sm text-gray-500">No images yet.</p>
//       )}
//     </div>
//   );
// }

// /** Price by city table */
// function PriceByCity({ rows = [], onChange }) {
//   const add = () => onChange([...(rows || []), { city: "", clinicsCount: "", doctorsCount: "", minPrice: "" }]);
//   const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
//   const update = (idx, patch) => onChange(rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

//   return (
//     <div className="overflow-x-auto rounded-xl border border-gray-200">
//       <table className="min-w-full bg-white">
//         <thead className="bg-gray-50">
//           <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
//             <th className="px-3 py-3">City</th>
//             <th className="px-3 py-3">Clinics</th>
//             <th className="px-3 py-3">Doctors</th>
//             <th className="px-3 py-3">Min Price</th>
//             <th className="px-3 py-3"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {(rows || []).map((r, idx) => (
//             <tr key={idx} className="border-t">
//               <td className="px-3 py-2">
//                 <input
//                   value={r.city}
//                   onChange={(e) => update(idx, { city: e.target.value })}
//                   className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
//                   placeholder="e.g., Warsaw"
//                 />
//               </td>
//               <td className="px-3 py-2">
//                 <input
//                   value={r.clinicsCount}
//                   onChange={(e) => update(idx, { clinicsCount: e.target.value.replace(/\D/g, "") })}
//                   inputMode="numeric"
//                   className="w-28 rounded border border-gray-300 px-2 py-1 text-sm"
//                   placeholder="0"
//                 />
//               </td>
//               <td className="px-3 py-2">
//                 <input
//                   value={r.doctorsCount}
//                   onChange={(e) => update(idx, { doctorsCount: e.target.value.replace(/\D/g, "") })}
//                   inputMode="numeric"
//                   className="w-28 rounded border border-gray-300 px-2 py-1 text-sm"
//                   placeholder="0"
//                 />
//               </td>
//               <td className="px-3 py-2">
//                 <input
//                   value={r.minPrice}
//                   onChange={(e) => update(idx, { minPrice: e.target.value.replace(/[^\d.,]/g, "") })}
//                   className="w-32 rounded border border-gray-300 px-2 py-1 text-sm"
//                   placeholder="e.g., 199"
//                 />
//               </td>
//               <td className="px-3 py-2">
//                 <button
//                   type="button"
//                   onClick={() => remove(idx)}
//                   className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
//                 >
//                   <FiTrash2 /> Remove
//                 </button>
//               </td>
//             </tr>
//           ))}
//           <tr className="border-t">
//             <td colSpan={5} className="px-3 py-3">
//               <button
//                 type="button"
//                 onClick={add}
//                 className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 hover:bg-emerald-100"
//               >
//                 <FiPlus /> Add city row
//               </button>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /** Live preview card */
// function TreatmentPreview({ data }) {
//   const firstImage = data.images?.[0];
//   return (
//     <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//       {firstImage ? (
//         <img src={firstImage} alt="" className="h-40 w-full object-cover" />
//       ) : (
//         <div className="grid h-40 w-full place-items-center bg-gray-50 text-gray-400">
//           <FiImage className="text-3xl" />
//         </div>
//       )}
//       <div className="p-4 space-y-2">
//         <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-600">
//           <FiHash />
//           {data.slug || "slug-will-appear-here"}
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900">{data.name || "Treatment name"}</h3>
//         <p className="text-sm text-gray-600 line-clamp-3">{data.description || "Description…"}</p>
//         {data.priceRange && (
//           <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm">
//             <FiEdit3 className="opacity-70" />
//             {data.priceRange}
//           </div>
//         )}
//         {!!data.specialties?.length && (
//           <div className="mt-3 flex flex-wrap gap-2">
//             {data.specialties.slice(0, 6).map((s, i) => (
//               <span key={`${s}-${i}`} className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700">
//                 {s}
//               </span>
//             ))}
//             {data.specialties.length > 6 && (
//               <span className="text-xs text-gray-500">+{data.specialties.length - 6} more</span>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /** Main component */
// export default function AdminAddTreatment() {
//   const [autoSlug, setAutoSlug] = useState(true);
//   const [touched, setTouched] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isUploading, setIsUploading] = useState(false); // 🔐 prevent Save while files uploading
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     slug: "",
//     description: "",
//     priceRange: "",
//     images: [],
//     sections: [],
//     specialties: [],
//     priceByCity: [],
//   });

//   // auto-slug if user types name and slug empty/untouched
//   useEffect(() => {
//     if (!formData.slug && formData.name) {
//       setFormData((p) => ({ ...p, slug: slugify(formData.name) }));
//     }
//   }, [formData.name]); // eslint-disable-line

//   // auto-generate slug from name (when autoSlug enabled)
//   useEffect(() => {
//     if (!autoSlug) return;
//     setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
//   }, [formData.name, autoSlug]);

//   const setField = (name, value) => {
//     setTouched(true);
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // validation
//   const validate = (data) => {
//     const e = {};
//     if (!data.name?.trim()) e.name = "Name is required.";
//     if (!data.slug?.trim()) e.slug = "Slug is required.";
//     if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) e.slug = "Use a URL-friendly slug (lowercase, hyphens).";
//     if ((data.description || "").length > 2000) e.description = "Description is too long.";
//     return e;
//   };

//   useEffect(() => {
//     if (!touched) return;
//     setErrors(validate(formData));
//   }, [formData, touched]);

//   const reset = () => {
//     setTouched(false);
//     setErrors({});
//     setFormData({
//       name: "",
//       slug: "",
//       description: "",
//       priceRange: "",
//       images: [],
//       sections: [],
//       specialties: [],
//       priceByCity: [],
//     });
//     setAutoSlug(true);
//   };

//   const canSave = useMemo(() => {
//     const e = validate(formData);
//     return Object.keys(e).length === 0 && !saving && !isUploading;
//   }, [formData, saving, isUploading]);

//   const handleSave = async () => {
//     setTouched(true);
//     const e = validate(formData);
//     setErrors(e);
//     if (Object.keys(e).length) return;

//     try {
//       setSaving(true);
//       await axios.post(`${API_BASE}/api/treatments`, formData, { withCredentials: true });
//       alert("Treatment saved.");
//       // reset(); // optional
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Failed to save treatment.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Add Treatment</h1>
//           <p className="text-sm text-gray-500">Create and configure a new treatment with sections, media, specialties and pricing.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={reset}
//             className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//           >
//             <FiRotateCcw /> Reset
//           </button>
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={!canSave}
//             className={cx(
//               "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-white",
//               canSave ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-400 cursor-not-allowed"
//             )}
//             title={isUploading ? "Please wait for uploads to finish" : undefined}
//           >
//             <FiSave /> {saving ? "Saving…" : "Save"}
//           </button>
//         </div>
//       </div>

//       {/* Content grid */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
//         {/* Form */}
//         <div className="lg:col-span-8 space-y-6">
//           {/* Basics */}
//           <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
//               <FiType /> Basics
//             </h2>

//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Treatment name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={(e) => setField("name", e.target.value)}
//                   className={cx(
//                     "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
//                     errors.name ? "border-red-300 focus:ring-red-300" : "border-gray-300 focus:ring-emerald-400"
//                   )}
//                   placeholder="e.g., Dental Implant"
//                 />
//                 {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
//               </div>

//               <div className="sm:col-span-2">
//                 <div className="flex items-center justify-between">
//                   <label className="mb-1 block text-sm font-medium text-gray-700">Slug (URL)</label>
//                   <label className="flex items-center gap-2 text-xs text-gray-600">
//                     <input type="checkbox" checked={autoSlug} onChange={(e) => setAutoSlug(e.target.checked)} /> Auto generate from name
//                   </label>
//                 </div>
//                 <div className="relative">
//                   <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
//                     <FiHash />
//                   </span>
//                   <input
//                     type="text"
//                     name="slug"
//                     value={formData.slug}
//                     onChange={(e) => setField("slug", autoSlug ? slugify(e.target.value) : e.target.value)}
//                     disabled={autoSlug}
//                     className={cx(
//                       "w-full rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2",
//                       autoSlug ? "bg-gray-50 text-gray-500" : "bg-white",
//                       errors.slug ? "border-red-300 focus:ring-red-300" : "border-gray-300 focus:ring-emerald-400"
//                     )}
//                     placeholder="dental-implant"
//                   />
//                 </div>
//                 {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Description <span className="text-xs text-gray-400">(max 2000 chars)</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={(e) => setField("description", e.target.value)}
//                   className={cx(
//                     "min-h-[120px] w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
//                     errors.description ? "border-red-300 focus:ring-red-300" : "border-gray-300 focus:ring-emerald-400"
//                   )}
//                   placeholder="Short overview shown on the treatment page."
//                 />
//                 <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
//                   <span>{formData.description.length} / 2000</span>
//                   {errors.description && <span className="text-red-600">{errors.description}</span>}
//                 </div>
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="mb-1 block text-sm font-medium text-gray-700">Price range (text)</label>
//                 <input
//                   type="text"
//                   name="priceRange"
//                   value={formData.priceRange}
//                   onChange={(e) => setField("priceRange", e.target.value)}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   placeholder="e.g., 199–999 PLN"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Specialties */}
//           <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
//               <FiTag /> Specialties
//             </h2>
//             <TagInput value={formData.specialties} onChange={(val) => setField("specialties", val)} />
//           </section>

//           {/* Sections */}
//           <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
//               <FiEdit3 /> Content sections
//             </h2>
//             <SectionsEditor sections={formData.sections} onChange={(val) => setField("sections", val)} />
//           </section>

//           {/* Images */}
//           <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
//               <FiImage /> Images
//             </h2>
//             <ImagesManager
//               images={formData.images}
//               onChange={(val) => setField("images", val)}
//               slug={formData.slug}
//               onUploadingChange={setIsUploading}
//             />
//             <p className="mt-2 text-xs text-gray-500">JPEG/PNG/WebP/AVIF up to 8MB. Drag & drop, pick files, or paste a direct URL.</p>
//           </section>

//           {/* Pricing by city */}
//           <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
//               <FiMove /> Price by city
//             </h2>
//             <PriceByCity rows={formData.priceByCity} onChange={(val) => setField("priceByCity", val)} />
//           </section>
//         </div>

//         {/* Preview */}
//         <div className="lg:col-span-4">
//           <TreatmentPreview data={formData} />
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/admin/AdminAddTreatment.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiHash,
  FiLink2,
  FiPlus,
  FiSave,
  FiTrash2,
  FiRotateCcw,
  FiImage,
  FiMove,
  FiEdit3,
  FiType,
  FiTag,
  FiUploadCloud,
  FiSearch,
} from "react-icons/fi";
import { MdOutlineDragIndicator } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// Firebase upload
import { app } from "/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// ────────────────────────────────────────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────────────────────────────────────────
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7500").replace(/\/+$/, "");

// ────────────────────────────────────────────────────────────────────────────────
// UTILS
// ────────────────────────────────────────────────────────────────────────────────
const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const cx = (...classes) => classes.filter(Boolean).join(" ");

// ────────────────────────────────────────────────────────────────────────────────
// TAG INPUT
// ────────────────────────────────────────────────────────────────────────────────
function TagInput({ value = [], onChange, placeholder = "Add specialty and press Enter…" }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700 text-sm"
          >
            <FiTag className="opacity-70" />
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== tag))}
              className="text-emerald-700/70 hover:text-emerald-900"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Tip: Press Enter to add each specialty. <span className="text-amber-600">Note:</span> saving specialties is not wired on the backend yet.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// SECTIONS EDITOR
// ────────────────────────────────────────────────────────────────────────────────
function SectionsEditor({ sections = [], onChange }) {
  const add = () => onChange([...(sections || []), { title: "", content: "", type: "default" }]);
  const remove = (idx) => onChange(sections.filter((_, i) => i !== idx));
  const update = (idx, patch) =>
    onChange(sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  const move = (from, to) => {
    const next = [...sections];
    const [spliced] = next.splice(from, 1);
    next.splice(to, 0, spliced);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {(sections || []).map((sec, idx) => (
        <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-500">
              <MdOutlineDragIndicator className="text-xl" />
              <span className="text-xs">Section {idx + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-40"
                onClick={() => move(idx, idx - 1)}
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-40"
                onClick={() => move(idx, idx + 1)}
                disabled={idx === sections.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                onClick={() => remove(idx)}
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                value={sec.title}
                onChange={(e) => update(idx, { title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., What is the procedure?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={sec.content}
                onChange={(e) => update(idx, { content: e.target.value })}
                className="min-h-[96px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Write the section details…"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={sec.type || "default"}
                onChange={(e) => update(idx, { type: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="default">default</option>
                <option value="benefit">benefit</option>
                <option value="risk">risk</option>
                <option value="step">step</option>
                <option value="candidate">candidate</option>
                <option value="faq">faq</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 hover:bg-emerald-100"
      >
        <FiPlus /> Add section
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
/** Images manager (URLs + reorder + remove). Save persists on "Save All" or
 * use the toolbar upload to Firebase then merges URLs and you can Save All.
 */
// ────────────────────────────────────────────────────────────────────────────────
function ImagesManager({ images = [], onChange, onServerRemove }) {
  const [url, setUrl] = useState("");

  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    onChange([...(images || []), u]);
    setUrl("");
  };

  const move = (from, to) => {
    if (to < 0 || to > images.length - 1) return;
    const next = [...images];
    const [spliced] = next.splice(from, 1);
    next.splice(to, 0, spliced);
    onChange(next);
  };

  const remove = async (idx) => {
    const src = images[idx];
    // if server remove function exists, delegate; else local-only
    if (onServerRemove) {
      await onServerRemove(src);
    } else {
      onChange(images.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="space-y-3">
      {/* Add by URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <FiLink2 />
          </span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… image URL"
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          <FiLink2 /> Add
        </button>
      </div>

      {images?.length ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <li key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white">
              <img src={src} alt="" className="h-32 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    className="rounded bg-white/80 px-2 py-1 text-xs disabled:opacity-40"
                    title="Move left"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === images.length - 1}
                    className="rounded bg-white/80 px-2 py-1 text-xs disabled:opacity-40"
                    title="Move right"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white"
                  title="Remove"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No images yet.</p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// PRICE BY CITY
// ────────────────────────────────────────────────────────────────────────────────
function PriceByCity({ rows = [], onChange }) {
  const add = () =>
    onChange([...(rows || []), { city: "", clinicsCount: "", doctorsCount: "", minPrice: "" }]);
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const update = (idx, patch) => onChange(rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="px-3 py-3">City</th>
            <th className="px-3 py-3">Clinics</th>
            <th className="px-3 py-3">Doctors</th>
            <th className="px-3 py-3">Min Price</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {(rows || []).map((r, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-3 py-2">
                <input
                  value={r.city}
                  onChange={(e) => update(idx, { city: e.target.value })}
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  placeholder="e.g., Warsaw"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  value={r.clinicsCount}
                  onChange={(e) => update(idx, { clinicsCount: e.target.value.replace(/\D/g, "") })}
                  inputMode="numeric"
                  className="w-28 rounded border border-gray-300 px-2 py-1 text-sm"
                  placeholder="0"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  value={r.doctorsCount}
                  onChange={(e) => update(idx, { doctorsCount: e.target.value.replace(/\D/g, "") })}
                  inputMode="numeric"
                  className="w-28 rounded border border-gray-300 px-2 py-1 text-sm"
                  placeholder="0"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  value={r.minPrice}
                  onChange={(e) => update(idx, { minPrice: e.target.value.replace(/[^\d.,]/g, "") })}
                  className="w-32 rounded border border-gray-300 px-2 py-1 text-sm"
                  placeholder="e.g., 199"
                />
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                >
                  <FiTrash2 /> Remove
                </button>
              </td>
            </tr>
          ))}
          <tr className="border-t">
            <td colSpan={5} className="px-3 py-3">
              <button
                type="button"
                onClick={add}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 hover:bg-emerald-100"
              >
                <FiPlus /> Add city row
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// LIVE PREVIEW
// ────────────────────────────────────────────────────────────────────────────────
function TreatmentPreview({ data }) {
  const firstImage = data.images?.[0];
  return (
    <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {firstImage ? (
        <img src={firstImage} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 w-full place-items-center bg-gray-50 text-gray-400">
          <FiImage className="text-3xl" />
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-600">
          <FiHash />
          {data.slug || "slug-will-appear-here"}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{data.name || "Treatment name"}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{data.description || "Description…"}</p>
        {data.priceRange && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm">
            <FiEdit3 className="opacity-70" />
            {data.priceRange}
          </div>
        )}
       {!!data.specialties?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.specialties.slice(0, 6).map((s, i) => {
              const label = typeof s === "string" ? s : s?.name || "";
              return (
                <span
                  key={s._id || `${label}-${i}`}
                  className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700"
                >
                  {label}
                </span>
              );
            })}
            {data.specialties.length > 6 && (
              <span className="text-xs text-gray-500">+{data.specialties.length - 6} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────────────────────────────────────────
export default function AdminAddTreatment() {
  const { currentAdmin } = useSelector((s) => s.admin || {});
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // form + state
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState({});

  // editable model
  const [formData, setFormData] = useState({
    // read-only fields after load
    name: "",
    slug: "",
    // editable
    description: "",
    priceRange: "",
    images: [],
    sections: [],
    specialties: [],
    priceByCity: [],
  });

  // slug to load
  const [lookupSlug, setLookupSlug] = useState("");
  const [loadedTreatment, setLoadedTreatment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

  // local files for upload
  const [newFiles, setNewFiles] = useState([]);

  // ── VALIDATION
  const validate = (data) => {
    const e = {};
    if (!data.slug?.trim()) e.slug = "Slug is required (load an existing treatment).";
    if ((data.description || "").length > 2000) e.description = "Description is too long.";
    return e;
  };

  useEffect(() => {
    if (!touched) return;
    setErrors(validate(formData));
  }, [formData, touched]);

  const setField = (name, value) => {
    setTouched(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setTouched(false);
    setErrors({});
    setFormData({
      name: "",
      slug: "",
      description: "",
      priceRange: "",
      images: [],
      sections: [],
      specialties: [],
      priceByCity: [],
    });
    setLoadedTreatment(null);
    setNewFiles([]);
  };

  // ── LOAD TREATMENT BY SLUG
  const fetchTreatment = async () => {
    const slug = lookupSlug.trim();
    if (!slug) {
      toast.error("Please enter a slug");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/treatments/slug/${encodeURIComponent(slug)}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.treatment) {
        throw new Error(data?.message || "Treatment not found");
      }

      const t = data.treatment;
      setLoadedTreatment(t);
      setFormData({
        name: t.name || "",
        slug: t.slug || "",
        description: t.description || "",
        priceRange: t.priceRange || "",
        images: Array.isArray(t.images) ? t.images : [],
        sections: Array.isArray(t.sections) ? t.sections : [],
        specialties: Array.isArray(t.specialties)
          ? t.specialties.map((s) => (typeof s === "string" ? s : s.name || ""))
          : [],
        priceByCity: Array.isArray(t.priceByCity) ? t.priceByCity : [],
      });
      toast.success(`Loaded "${t.name}"`);
    } catch (e) {
      console.error(e);
      reset();
      toast.error(e.message || "Failed to load treatment");
    } finally {
      setLoading(false);
    }
  };

  // ── FILE PICK + UPLOAD
  const handlePickImages = (e) => {
    const list = Array.from(e.target.files || []);
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const maxMB = 8;

    const valid = list.filter((f) => {
      const okType = allowed.includes(f.type);
      const okSize = f.size <= maxMB * 1024 * 1024;
      return okType && okSize;
    });

    if (valid.length !== list.length) {
      toast("Some files were skipped (type/size).", { icon: "⚠️" });
    }
    setNewFiles(valid);
  };

  const uploadNewFilesToFirebase = async () => {
    if (!loadedTreatment?._id || !formData.slug) {
      toast.error("Load a treatment first");
      return [];
    }
    if (!newFiles.length) {
      toast.error("Select images first");
      return [];
    }

    const storage = getStorage(app);
    const uploaded = [];

    await toast.promise(
      (async () => {
        for (const file of newFiles) {
          const path = `treatments/${formData.slug}/${uuidv4()}-${file.name}`;
          const storageRef = ref(storage, path);
          await new Promise((resolve, reject) => {
            const task = uploadBytesResumable(storageRef, file);
            task.on(
              "state_changed",
              () => {},
              (err) => reject(err),
              async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                uploaded.push(url);
                resolve();
              }
            );
          });
        }
      })(),
      { loading: "Uploading…", success: "Uploaded", error: "Upload failed" }
    );

    return uploaded;
  };

  // ── SERVER UPDATERS
  const saveBasics = async () => {
    const res = await fetch(`${API_BASE}/api/admin/treatments/${loadedTreatment._id}/basics`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ description: formData.description, priceRange: formData.priceRange }),
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update basics");
    return json;
  };

  const saveSections = async () => {
    const sections = (formData.sections || []).map((s) => ({
      title: s.title?.trim() || "",
      content: s.content?.trim() || "",
      type: s.type || "default",
    }));
    const res = await fetch(
      `${API_BASE}/api/admin/treatments/slug/${encodeURIComponent(formData.slug)}/sections`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sections }),
        credentials: "include",
      }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update sections");
    return json;
  };

  const savePricing = async () => {
    const res = await fetch(
      `${API_BASE}/api/admin/treatments/slug/${encodeURIComponent(formData.slug)}/city-pricing`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ priceByCity: formData.priceByCity || [] }),
        credentials: "include",
      }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update pricing");
    return json;
  };

  const replaceImages = async (imagesArr) => {
    const res = await fetch(`${API_BASE}/api/admin/treatments/${loadedTreatment._id}/images`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ images: imagesArr }),
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to update images");
    return json;
  };

  const deleteOneImage = async (url) => {
    const res = await fetch(`${API_BASE}/api/admin/treatments/${loadedTreatment._id}/images`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ images: [url] }),
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to delete image");
    return json;
  };

  const deleteAllImages = async () => {
    const res = await fetch(`${API_BASE}/api/admin/treatments/${loadedTreatment._id}/images/all`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to clear images");
    return json;
  };

  // ── SAVE ALL (big green button)
  const canSaveAll = useMemo(() => {
    const e = validate(formData);
    return Object.keys(e).length === 0 && !!loadedTreatment?._id && !savingAll;
  }, [formData, loadedTreatment, savingAll]);

  const handleSaveAll = async () => {
    setTouched(true);
    const e = validate(formData);
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the errors first");
      return;
    }
    if (!loadedTreatment?._id) {
      toast.error("Load a treatment first");
      return;
    }

    try {
      setSavingAll(true);

      // 1) Upload any new files first (merge to local state)
      if (newFiles.length) {
        const uploadedUrls = await uploadNewFilesToFirebase();
        if (uploadedUrls.length) {
          setFormData((p) => ({ ...p, images: [...(p.images || []), ...uploadedUrls] }));
        }
      }

      // 2) Persist all sections in a friendly order
      await toast.promise(saveBasics(), {
        loading: "Saving basics…",
        success: "Basics saved",
        error: (err) => err?.message || "Failed to save basics",
      });

      await toast.promise(saveSections(), {
        loading: "Saving sections…",
        success: "Sections saved",
        error: (err) => err?.message || "Failed to save sections",
      });

      await toast.promise(savePricing(), {
        loading: "Saving pricing…",
        success: "Pricing saved",
        error: (err) => err?.message || "Failed to save pricing",
      });

      await toast.promise(replaceImages(formData.images || []), {
        loading: "Saving images…",
        success: "Images saved",
        error: (err) => err?.message || "Failed to save images",
      });

      setNewFiles([]);
      toast.success("All changes saved");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Save failed");
    } finally {
      setSavingAll(false);
    }
  };

  // ── IMAGE toolbar helpers
  const handleServerRemoveImage = async (url) => {
    if (!loadedTreatment?._id) {
      // fallback: local only
      setField(
        "images",
        (formData.images || []).filter((u) => u !== url)
      );
      return;
    }
    const ok = window.confirm("Delete this image?");
    if (!ok) return;

    try {
      const prev = formData.images || [];
      setField(
        "images",
        prev.filter((u) => u !== url)
      ); // optimistic

      const { images: serverImages } = await deleteOneImage(url);
      if (Array.isArray(serverImages)) {
        setField("images", serverImages);
      }
      toast.success("Image deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
      // no rollback here because Save All will replace anyway; feel free to add rollback if you prefer
    }
  };

  const handleServerDeleteAll = async () => {
    if (!loadedTreatment?._id) return toast.error("Load a treatment first");
    const ok = window.confirm("Delete ALL images for this treatment?");
    if (!ok) return;

    try {
      const prev = formData.images || [];
      setField("images", []); // optimistic
      const { images: serverImages } = await deleteAllImages();
      if (Array.isArray(serverImages)) setField("images", serverImages);
      toast.success("All images deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  // ── VIEW
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Update Treatment</h1>
          <p className="text-sm text-gray-500">
            Load an existing treatment by slug, then edit basics, sections, images and city pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiRotateCcw /> Reset
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={!canSaveAll}
            className={cx(
              "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-white",
              canSaveAll ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-400 cursor-not-allowed"
            )}
          >
            <FiSave /> {savingAll ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {/* Slug loader */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Enter existing treatment slug (e.g., teeth-whitening)"
              value={lookupSlug}
              onChange={(e) => setLookupSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <button
            type="button"
            onClick={fetchTreatment}
            disabled={loading || !lookupSlug.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load"}
          </button>
        </div>
      </div>

      {/* Content grid */}
      {!loadedTreatment ? (
        <div className="text-gray-500">Load a treatment to begin editing.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Basics */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <FiType /> Basics
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      disabled
                      className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <FiHash />
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        disabled
                        className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description <span className="text-xs text-gray-400">(max 2000 chars)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className={cx(
                      "min-h-[120px] w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
                      errors.description ? "border-red-300 focus:ring-red-300" : "border-gray-300 focus:ring-emerald-400"
                    )}
                    placeholder="Short overview shown on the treatment page."
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{formData.description.length} / 2000</span>
                    {errors.description && <span className="text-red-600">{errors.description}</span>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price range (text)</label>
                  <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={(e) => setField("priceRange", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="e.g., 199–999 PLN"
                  />
                </div>
              </div>
            </section>

            {/* Specialties (kept for UX parity; not persisted here) */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <FiTag /> Specialties
              </h2>
              <TagInput
                value={formData.specialties}
                onChange={(val) => setField("specialties", val)}
              />
            </section>

            {/* Sections */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <FiEdit3 /> Content sections
              </h2>
              <SectionsEditor
                sections={formData.sections}
                onChange={(val) => setField("sections", val)}
              />
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <FiImage /> Images
              </h2>

              {/* Upload toolbar */}
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                  <FiUploadCloud />
                  <span>Select files</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePickImages}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={async () => {
                    const uploaded = await uploadNewFilesToFirebase();
                    if (uploaded.length) {
                      setField("images", [...(formData.images || []), ...uploaded]);
                      setNewFiles([]);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                  disabled={!newFiles.length}
                >
                  <FiUploadCloud /> Upload & Add
                </button>

                <button
                  type="button"
                  onClick={handleServerDeleteAll}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  <FiTrash2 /> Delete All
                </button>

                {newFiles.length > 0 && (
                  <span className="text-xs text-gray-500">{newFiles.length} file(s) selected</span>
                )}
              </div>

              <ImagesManager
                images={formData.images}
                onChange={(val) => setField("images", val)}
                onServerRemove={handleServerRemoveImage}
              />
              <p className="mt-2 text-xs text-gray-500">
                Drag to reorder (using ← →). Added URLs or uploaded files are saved when you press <b>Save All</b>.
              </p>
            </section>

            {/* Pricing by city */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <FiMove /> Price by city
              </h2>
              <PriceByCity
                rows={formData.priceByCity}
                onChange={(val) => setField("priceByCity", val)}
              />
            </section>
          </div>

          {/* Preview */}
          <div className="lg:col-span-4">
            <TreatmentPreview data={formData} />
          </div>
        </div>
      )}
    </div>
  );
}
