// client/src/pages/JobOffersForDoctors.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Stethoscope,
  GraduationCap,
  ArrowRight,
  List,
  Grid2x2,
} from "lucide-react";

// ✅ Flowbite React components
 import { Button, Badge, Card, Modal, Label, TextInput, Select, Checkbox } from "flowbite-react";

// -----------------------------
// helpers
// -----------------------------
function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Surgery",
  "Family Medicine",
  "Radiology",
  "Anesthesiology",
  "Psychiatry",
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Locum", "Internship"];
const EXPERIENCE_LEVELS = ["Resident", "Junior", "Mid", "Senior", "Consultant"];

// demo jobs (replace with API)
const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Cardiologist — Outpatient Clinic",
    company: "MediPulso Health Group",
    location: "Kraków, PL",
    remote: false,
    salaryMin: 18000,
    salaryMax: 26000,
    currency: "PLN",
    type: "Full-time",
    experience: "Senior",
    specialty: "Cardiology",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    tags: ["Outpatient", "Echo", "Stress Test"],
    logo: "https://api.iconify.design/ph/heart.straight.svg?color=%2300b39b",
  },
  {
    id: "job-2",
    title: "Pediatric Neurologist (Telehealth)",
    company: "Bright Minds Clinic",
    location: "Remote",
    remote: true,
    salaryMin: 14000,
    salaryMax: 22000,
    currency: "PLN",
    type: "Part-time",
    experience: "Mid",
    specialty: "Neurology",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    tags: ["Telemedicine", "EEG", "EMG"],
    logo: "https://api.iconify.design/ph/brain.svg?color=%2300b39b",
  },
  {
    id: "job-3",
    title: "Dermatologist — Aesthetic Focus",
    company: "Astra Derma",
    location: "Warszawa, PL",
    remote: false,
    salaryMin: 20000,
    salaryMax: 32000,
    currency: "PLN",
    type: "Contract",
    experience: "Senior",
    specialty: "Dermatology",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    tags: ["Laser", "Aesthetics", "MOHS"],
    logo: "https://api.iconify.design/ph/sparkle.svg?color=%2300b39b",
  },
  {
    id: "job-4",
    title: "Orthopedic Surgeon — Locum (Weekend)",
    company: "Vita Ortho Center",
    location: "Gdańsk, PL",
    remote: false,
    salaryMin: 5000,
    salaryMax: 7000,
    currency: "PLN",
    type: "Locum",
    experience: "Consultant",
    specialty: "Orthopedics",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    tags: ["Trauma", "Arthroscopy"],
    logo: "https://api.iconify.design/ph/bone.svg?color=%2300b39b",
  },
  {
    id: "job-5",
    title: "Family Medicine Physician — Community Clinic",
    company: "GreenCross Medical",
    location: "Łódź, PL",
    remote: false,
    salaryMin: 15000,
    salaryMax: 21000,
    currency: "PLN",
    type: "Full-time",
    experience: "Junior",
    specialty: "Family Medicine",
    postedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    tags: ["Primary Care", "Chronic Care"],
    logo: "https://api.iconify.design/ph/stethoscope.svg?color=%2300b39b",
  },
];

// -----------------------------
// tiny components (Flowbite)
// -----------------------------
const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-[#e9fbf9]">
    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#00b39b]/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#00b39b]/10 blur-3xl" />

    <div className="container mx-auto px-4 py-14 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00b39b]/30 bg-white/70 px-3 py-1 text-sm backdrop-blur">
          <Stethoscope className="h-4 w-4 text-[#00b39b]" />
          <span className="text-gray-700">Job offers for doctors</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-gray-900 sm:text-5xl">
          Find your next <span className="text-[#00b39b]">care opportunity</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          Browse curated roles across hospitals, clinics, and telehealth providers. Filter by specialty, schedule,
          and compensation—apply in minutes.
        </p>

        <div className="mt-8 grid gap-3 sm:flex sm:items-center">
          <Button size="lg" className="h-11 rounded-2xl bg-[#00b39b] hover:bg-[#00a292]">
            <Search className="mr-2 h-4 w-4" /> Explore roles
          </Button>
          <Button color="light" size="lg" className="h-11 rounded-2xl">
            <Building2 className="mr-2 h-4 w-4" /> Post a job
          </Button>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {[
            { label: "Open roles", value: "2,300+" },
            { label: "Cities", value: "80+" },
            { label: "Avg. apply time", value: "3 min" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border bg-white p-4">
              <dt className="text-xs text-gray-500">{s.label}</dt>
              <dd className="text-xl font-semibold text-gray-900">{s.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  </section>
);

const FilterPill = ({ label, onRemove }) => (
  <Badge className="mr-2 mb-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 ring-1 ring-gray-200">
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <button aria-label={`Remove ${label}`} className="text-gray-400 hover:text-gray-700" onClick={onRemove}>
        ×
      </button>
    </div>
  </Badge>
);

const JobCard = ({ job, saved, onSave, view = "list" }) => (
  <Card className={`group relative transition hover:shadow-lg ${view === "grid" ? "h-full" : ""}`}>
    <div className="p-5">
      <div className="flex items-start gap-3">
        {/* logo */}
        <div className="mt-1 h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
          <img alt="logo" src={job.logo} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900">{job.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.company}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {timeAgo(job.postedAt)}</span>
          </div>
        </div>
        <button
          className="absolute right-3 top-3 rounded-full p-2 text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50"
          onClick={() => onSave(job.id)}
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? <BookmarkCheck className="h-5 w-5 text-[#00b39b]" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <Badge color="gray" className="rounded-full">
          <Briefcase className="mr-1 h-3.5 w-3.5" /> {job.type}
        </Badge>
        <Badge color="gray" className="rounded-full">
          <GraduationCap className="mr-1 h-3.5 w-3.5" /> {job.experience}
        </Badge>
        <Badge color="gray" className="rounded-full">
          <Stethoscope className="mr-1 h-3.5 w-3.5" /> {job.specialty}
        </Badge>
        <Badge color="gray" className="rounded-full">
          <DollarSign className="mr-1 h-3.5 w-3.5" /> {job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()} {job.currency}
        </Badge>
        {job.remote && <Badge color="gray" className="rounded-full">Remote</Badge>}
      </div>

      {job.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.map((t) => (
            <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{t}</span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex justify-between gap-2">
        <Button color="light" className="rounded-xl">View details</Button>
        <Button className="rounded-xl bg-[#00b39b] hover:bg-[#00a292]">
          Apply now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </Card>
);

const EmptyState = () => (
  <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center">
    <div className="mb-4 rounded-full bg-[#00b39b]/10 p-3">
      <Search className="h-6 w-6 text-[#00b39b]" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">No results match your filters</h3>
    <p className="mt-2 max-w-md text-sm text-gray-600">
      Try broadening your specialty, removing a filter, or clearing all to see more roles.
    </p>
  </div>
);

const Pagination = ({ page, totalPages, onPage }) => (
  <div className="mt-6 flex items-center justify-between">
    <p className="text-sm text-gray-600">
      Page <span className="font-medium text-gray-900">{page}</span> of {totalPages}
    </p>
    <div className="flex items-center gap-2">
      <Button color="light" className="rounded-xl" disabled={page === 1} onClick={() => onPage(page - 1)}>
        Previous
      </Button>
      <Button color="light" className="rounded-xl" disabled={page === totalPages} onClick={() => onPage(page + 1)}>
        Next
      </Button>
    </div>
  </div>
);

// -----------------------------
// Filters panel (Flowbite)
// -----------------------------
function FiltersPanel({
  query,
  setQuery,
  location,
  setLocation,
  selectedSpecialties,
  setSelectedSpecialties,
  selectedTypes,
  setSelectedTypes,
  experience,
  setExperience,
  salary,
  setSalary,
  remoteOnly,
  setRemoteOnly,
  onClearAll,
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search" value="Search" className="mb-2 block" />
        <TextInput
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. neurologist, clinic, procedure"
          className="rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="location" value="Location" className="mb-2 block" />
        <TextInput
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or Remote"
          className="rounded-xl"
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">Specialty</div>
        {/* Scroll area */}
        <div className="h-40 overflow-y-auto rounded-xl border p-2 pr-3">
          <div className="grid grid-cols-1 gap-2">
            {SPECIALTIES.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedSpecialties.includes(s)}
                  onChange={(e) =>
                    setSelectedSpecialties((prev) =>
                      e.target.checked ? [...prev, s] : prev.filter((x) => x !== s)
                    )
                  }
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">Employment type</div>
        <div className="grid grid-cols-1 gap-2">
          {EMPLOYMENT_TYPES.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={selectedTypes.includes(t)}
                onChange={(e) =>
                  setSelectedTypes((prev) =>
                    e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)
                  )
                }
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label value="Experience" className="mb-2 block" />
        <Select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="rounded-xl"
        >
          <option value="">Any</option>
          {EXPERIENCE_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
          <span>Salary range (PLN)</span>
          <span className="text-gray-500">
            {salary[0].toLocaleString()}–{salary[1].toLocaleString()}
          </span>
        </div>

        {/* Use two number inputs for min/max (Flowbite doesn't provide a dual-thumb range) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sal-min" value="Min" className="mb-1 block" />
            <TextInput
              id="sal-min"
              type="number"
              min={0}
              step={500}
              value={salary[0]}
              onChange={(e) =>
                setSalary(([_, max]) => [Math.min(Number(e.target.value) || 0, max), max])
              }
            />
          </div>
          <div>
            <Label htmlFor="sal-max" value="Max" className="mb-1 block" />
            <TextInput
              id="sal-max"
              type="number"
              min={0}
              step={500}
              value={salary[1]}
              onChange={(e) =>
                setSalary(([min, _]) => [min, Math.max(Number(e.target.value) || 0, min)])
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
          />
          Remote only
        </label>
        <Button color="light" onClick={onClearAll} className="text-gray-700">
          Clear all
        </Button>
      </div>
    </div>
  );
}

// -----------------------------
// main page
// -----------------------------
export default function JobOffersForDoctorsPage() {
  const [openFilters, setOpenFilters] = useState(false);

  // filters
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(["Full-time"]);
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState([0, 40000]); // [min, max]
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("list"); // list | grid

  // data
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem("savedJobs");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const t = setTimeout(() => {
      setJobs(MOCK_JOBS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("savedJobs", JSON.stringify(Array.from(saved)));
    } catch {}
  }, [saved]);

  const filtered = useMemo(() => {
    let list = [...jobs];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (location.trim()) {
      const lq = location.toLowerCase();
      list = list.filter((j) => j.location.toLowerCase().includes(lq));
    }

    if (selectedSpecialties.length) {
      list = list.filter((j) => selectedSpecialties.includes(j.specialty));
    }

    if (selectedTypes.length) {
      list = list.filter((j) => selectedTypes.includes(j.type));
    }

    if (experience) {
      list = list.filter((j) => j.experience === experience);
    }

    if (remoteOnly) {
      list = list.filter((j) => j.remote);
    }

    list = list.filter((j) => j.salaryMax >= salary[0] && j.salaryMin <= salary[1]);

    switch (sort) {
      case "salary":
        list.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }

    return list;
  }, [jobs, query, location, selectedSpecialties, selectedTypes, experience, salary, remoteOnly, sort]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const start = (pageClamped - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => setPage(1), [query, location, selectedSpecialties, selectedTypes, experience, salary, remoteOnly]);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setQuery("");
    setLocation("");
    setSelectedSpecialties([]);
    setSelectedTypes([]);
    setExperience("");
    setSalary([0, 40000]);
    setRemoteOnly(false);
  };

  const filterPills = [
    ...selectedSpecialties.map((s) => ({ key: `sp-${s}`, label: s, onRemove: () => setSelectedSpecialties((p) => p.filter((x) => x !== s)) })),
    ...selectedTypes.map((t) => ({ key: `ty-${t}`, label: t, onRemove: () => setSelectedTypes((p) => p.filter((x) => x !== t)) })),
    ...(experience ? [{ key: `ex-${experience}`, label: experience, onRemove: () => setExperience("") }] : []),
    ...(remoteOnly ? [{ key: `re-remote`, label: "Remote", onRemove: () => setRemoteOnly(false) }] : []),
    ...(location ? [{ key: `lo-${location}`, label: location, onRemove: () => setLocation("") }] : []),
  ];

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      {/* content */}
      <section className="container mx-auto px-4 pb-16">
        {/* top bar */}
        <div className="-mt-10 rounded-2xl border bg-white p-4 shadow-sm sm:-mt-14 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <TextInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roles, companies, or skills"
                  className="w-full rounded-xl pl-9"
                  aria-label="Search jobs"
                />
              </div>
              <div className="hidden md:block">
                <TextInput
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (city or remote)"
                  className="w-[280px] rounded-xl"
                  aria-label="Filter by location"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filters */}
              <Button color="light" className="rounded-xl md:hidden" onClick={() => setOpenFilters(true)}>
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>

              {/* View toggle (use Button.Group) */}
              <div className="hidden items-center gap-2 md:flex">
                <div className="inline-flex overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <Button
                    color={view === "list" ? "gray" : "light"}
                    onClick={() => setView("list")}
                    className={`${view === "list" ? "bg-gray-100" : ""} rounded-none`}
                  >
                    <List className="mr-2 h-4 w-4" /> List
                  </Button>
                  <Button
                    color={view === "grid" ? "gray" : "light"}
                    onClick={() => setView("grid")}
                    className={`${view === "grid" ? "bg-gray-100" : ""} rounded-none`}
                  >
                    <Grid2x2 className="mr-2 h-4 w-4" /> Grid
                  </Button>
                </div>

                <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-[170px] rounded-xl">
                  <option value="newest">Newest</option>
                  <option value="salary">Salary</option>
                </Select>
              </div>

              <Button className="rounded-xl bg-[#00b39b] hover:bg-[#00a292]">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>

          {/* active filter pills */}
          {filterPills.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center">
              {filterPills.map((p) => (
                <FilterPill key={p.key} label={p.label} onRemove={p.onRemove} />
              ))}
              <Button color="light" onClick={clearAll} className="ml-1 rounded-full text-gray-700">
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
          {/* desktop filters */}
          <aside className="hidden rounded-2xl border bg-white p-5 lg:block">
            <FiltersPanel
              query={query}
              setQuery={setQuery}
              location={location}
              setLocation={setLocation}
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              experience={experience}
              setExperience={setExperience}
              salary={salary}
              setSalary={setSalary}
              remoteOnly={remoteOnly}
              setRemoteOnly={setRemoteOnly}
              onClearAll={clearAll}
            />
          </aside>

          {/* results */}
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{visible.length}</span> of {filtered.length} roles
              </p>

              <div className="flex items-center gap-2 md:hidden">
                <div className="inline-flex overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <Button
                    color={view === "list" ? "gray" : "light"}
                    onClick={() => setView("list")}
                    className={`${view === "list" ? "bg-gray-100" : ""} rounded-none`}
                  >
                    <List className="mr-2 h-4 w-4" /> List
                  </Button>
                  <Button
                    color={view === "grid" ? "gray" : "light"}
                    onClick={() => setView("grid")}
                    className={`${view === "grid" ? "bg-gray-100" : ""} rounded-none`}
                  >
                    <Grid2x2 className="mr-2 h-4 w-4" /> Grid
                  </Button>
                </div>

                <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-[140px] rounded-xl">
                  <option value="newest">Newest</option>
                  <option value="salary">Salary</option>
                </Select>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {loading ? (
              <div className={`grid gap-4 ${view === "grid" ? "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border bg-white p-5">
                    <div className="mb-4 h-5 w-2/3 rounded bg-gray-200" />
                    <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
                    <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
                    <div className="mb-6 h-4 w-2/5 rounded bg-gray-200" />
                    <div className="h-9 w-full rounded-xl bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <EmptyState />
            ) : (
              <div className={`grid gap-4 ${view === "grid" ? "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {visible.map((job) => (
                  <JobCard key={job.id} job={job} saved={saved.has(job.id)} onSave={toggleSave} view={view} />
                ))}
              </div>
            )}

            {!loading && filtered.length > PAGE_SIZE && (
              <Pagination page={pageClamped} totalPages={totalPages} onPage={setPage} />
            )}
          </div>
        </div>

        {/* employer CTA */}
        <div className="mt-12 grid items-center gap-6 rounded-3xl border bg-[#f6fffd] p-6 sm:grid-cols-3 sm:p-10">
          <div className="sm:col-span-2">
            <h3 className="text-2xl font-semibold text-gray-900">Hiring doctors?</h3>
            <p className="mt-2 max-w-2xl text-gray-600">
              Post your role to reach verified specialists across Poland. Pay-as-you-go or bulk plans for clinics and hospitals.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Badge className="rounded-full bg-white text-gray-700 ring-1 ring-gray-200">ATS-friendly</Badge>
              <Badge className="rounded-full bg-white text-gray-700 ring-1 ring-gray-200">Candidate matching</Badge>
              <Badge className="rounded-full bg-white text-gray-700 ring-1 ring-gray-200">Featured placement</Badge>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <Button size="lg" className="rounded-2xl bg-[#00b39b] hover:bg-[#00a292]">
              <Building2 className="mr-2 h-4 w-4" /> Post a job
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile filters drawer */}
      <Modal open={openFilters} onClose={() => setOpenFilters(false)} position="right">
        <Modal.Header title="Filters" />
        <Modal.Items>
          <div className="mt-2">
            <FiltersPanel
              query={query}
              setQuery={setQuery}
              location={location}
              setLocation={setLocation}
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              experience={experience}
              setExperience={setExperience}
              salary={salary}
              setSalary={setSalary}
              remoteOnly={remoteOnly}
              setRemoteOnly={setRemoteOnly}
              onClearAll={clearAll}
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button color="light" onClick={() => setOpenFilters(false)}>Close</Button>
            <Button className="bg-[#00b39b] hover:bg-[#00a292]" onClick={() => setOpenFilters(false)}>
              Apply filters
            </Button>
          </div>
        </Modal.Items>
      </Modal>
    </main>
  );
}
