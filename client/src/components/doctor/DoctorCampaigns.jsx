import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiDownload,
  FiTarget,
  FiCalendar,
  FiTrendingUp,
  FiMoreVertical,
  FiPlay,
  FiPause,
  FiTrash,
} from "react-icons/fi";

// Small helpers
const fmtMoney = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : "—");
const fmtInt = (n) => (typeof n === "number" ? n.toLocaleString() : "—");
const todayISO = () => new Date().toISOString().slice(0, 10);

const statusColor = (status) =>
  status === "Active"
    ? "bg-emerald-50 text-emerald-700"
    : status === "Paused"
    ? "bg-amber-50 text-amber-700"
    : "bg-gray-100 text-gray-600";

// Minimal inline sparkline (no external libs)
function Sparkline({ points = [] }) {
  const w = 120, h = 40;
  const max = Math.max(1, ...points);
  const min = Math.min(0, ...points);
  const range = Math.max(1, max - min);
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const path = points
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke="currentColor" className="text-[#00b39be6]" strokeWidth="2" />
    </svg>
  );
}

function NewCampaignModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    objective: "Increase bookings",
    channel: "Search",
    startDate: todayISO(),
    endDate: "",
    dailyBudget: 10,
    totalBudget: 150,
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, startDate: todayISO() }));
    }
  }, [open]);

  if (!open) return null;
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name.includes("Budget") ? Number(value) : value }));
  };
  const valid =
    form.name.trim() &&
    form.startDate &&
    form.dailyBudget > 0 &&
    form.totalBudget >= form.dailyBudget;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Create campaign</h3>
          <p className="text-sm text-gray-500">Set a goal, budget and dates. You can edit later.</p>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. September Boost"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Objective</label>
              <select className="w-full border rounded px-3 py-2" name="objective" value={form.objective} onChange={onChange}>
                <option>Increase bookings</option>
                <option>Drive profile views</option>
                <option>Promote reviews</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Channel</label>
              <select className="w-full border rounded px-3 py-2" name="channel" value={form.channel} onChange={onChange}>
                <option>Search</option>
                <option>Social</option>
                <option>Email</option>
                <option>Display</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start date</label>
              <input className="w-full border rounded px-3 py-2" type="date" name="startDate" value={form.startDate} onChange={onChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End date (optional)</label>
              <input className="w-full border rounded px-3 py-2" type="date" name="endDate" value={form.endDate} onChange={onChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Daily budget</label>
              <input className="w-full border rounded px-3 py-2" type="number" min="1" step="1" name="dailyBudget" value={form.dailyBudget} onChange={onChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total budget</label>
              <input className="w-full border rounded px-3 py-2" type="number" min={form.dailyBudget} step="1" name="totalBudget" value={form.totalBudget} onChange={onChange} />
            </div>
          </div>
        </div>

        <div className="p-5 border-t flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onCreate(form)}
            disabled={!valid}
            className="px-4 py-2 rounded bg-[#00b39be6] text-white disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ c, onToggle, onDelete }) {
  const spentPct = Math.min(100, Math.round(((c.spent || 0) / Math.max(1, c.totalBudget || 1)) * 100));
  const ctr = c.impressions ? ((c.clicks || 0) / c.impressions) * 100 : 0;
  const cpl = c.leads ? (c.spent || 0) / c.leads : null;

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{c.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
          </div>
          <div className="mt-1 text-sm text-gray-600 flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <FiTarget /> {c.objective}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiCalendar /> {c.startDate} {c.endDate ? `→ ${c.endDate}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiTrendingUp /> {c.channel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(c.id, c.status !== "Active")}
            className="px-3 py-1.5 text-sm rounded border hover:bg-gray-50 inline-flex items-center gap-2"
            title={c.status === "Active" ? "Pause" : "Resume"}
          >
            {c.status === "Active" ? <><FiPause /> Pause</> : <><FiPlay /> Resume</>}
          </button>
          <div className="relative">
            <button className="p-2 rounded hover:bg-gray-50" title="More">
              <FiMoreVertical />
            </button>
            {/* simple delete shortcut */}
            <button
              onClick={() => onDelete(c.id)}
              className="ml-1 p-2 rounded hover:bg-red-50 text-red-600"
              title="Delete campaign"
            >
              <FiTrash />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Metric label="Impressions" value={fmtInt(c.impressions)} />
        <Metric label="Clicks" value={fmtInt(c.clicks)} />
        <Metric label="CTR" value={`${ctr.toFixed(1)}%`} />
        <Metric label="Leads" value={fmtInt(c.leads)} />
        <Metric label="Cost/Lead" value={cpl == null ? "—" : fmtMoney(cpl)} />
      </div>

      {/* Spend progress */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>Spend</span>
          <span>
            {fmtMoney(c.spent)} / {fmtMoney(c.totalBudget)}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded">
          <div className="h-2 rounded bg-[#00b39be6]" style={{ width: `${spentPct}%` }} />
        </div>
      </div>

      {/* Trend */}
      <div className="px-4 pb-4">
        <div className="bg-gray-50 border rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Last 14 days clicks</div>
          <Sparkline points={c.trend || []} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

/**
 * DoctorCampaigns
 * Props (all optional):
 * - doctorId?: string
 * - campaigns?: array (if you fetch yourself)
 * - onCreate?: (partial) => Promise<created>
 * - onToggle?: (id, nextActive:boolean) => Promise<void>
 * - onDelete?: (id) => Promise<void>
 *
 * If no props provided, it uses localStorage for persistence.
 */
export default function DoctorCampaigns({
  doctorId,
  campaigns: campaignsProp,
  onCreate,
  onToggle,
  onDelete,
}) {
  const storageKey = useMemo(
    () => `mp_campaigns_${doctorId || "anon"}`,
    [doctorId]
  );
  const [openModal, setOpenModal] = useState(false);
  const [campaigns, setCampaigns] = useState(() => {
    if (campaignsProp) return campaignsProp;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    // seed example
    return [
      {
        id: crypto.randomUUID(),
        name: "September Boost",
        objective: "Increase bookings",
        channel: "Search",
        startDate: todayISO(),
        endDate: "",
        dailyBudget: 15,
        totalBudget: 200,
        spent: 48.5,
        impressions: 9200,
        clicks: 380,
        leads: 21,
        status: "Active",
        trend: [2, 4, 3, 6, 8, 7, 9, 6, 10, 12, 9, 8, 11, 13],
      },
      {
        id: crypto.randomUUID(),
        name: "Summer Reviews",
        objective: "Promote reviews",
        channel: "Email",
        startDate: "2025-06-01",
        endDate: "2025-07-01",
        dailyBudget: 5,
        totalBudget: 120,
        spent: 120,
        impressions: 3100,
        clicks: 140,
        leads: 16,
        status: "Ended",
        trend: [1, 2, 1, 3, 3, 2, 2, 1, 2, 2, 1, 1, 1, 0],
      },
    ];
  });

  // persist only if unmanaged
  useEffect(() => {
    if (!campaignsProp) {
      localStorage.setItem(storageKey, JSON.stringify(campaigns));
    }
  }, [campaigns, campaignsProp, storageKey]);

  const activeCount = campaigns.filter((c) => c.status === "Active").length;

  const handleCreate = async (data) => {
    const base = {
      id: crypto.randomUUID(),
      spent: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      trend: Array.from({ length: 14 }, () => 0),
    };
    const start = new Date(data.startDate);
    const end = data.endDate ? new Date(data.endDate) : null;
    const now = new Date();
    let status = "Active";
    if (end && end < now) status = "Ended";
    if (start > now) status = "Paused"; // not started yet

    const newCamp = { ...base, ...data, status };
    if (onCreate) {
      const created = await onCreate(newCamp);
      setOpenModal(false);
      return created;
    }
    setCampaigns((s) => [newCamp, ...s]);
    setOpenModal(false);
  };

  const handleToggle = async (id, nextActive) => {
    if (onToggle) return onToggle(id, nextActive);
    setCampaigns((s) =>
      s.map((c) =>
        c.id === id ? { ...c, status: nextActive ? "Active" : "Paused" } : c
      )
    );
  };

  const handleDelete = async (id) => {
    if (onDelete) return onDelete(id);
    setCampaigns((s) => s.filter((c) => c.id !== id));
  };

  const exportCSV = () => {
    const headers = [
      "id",
      "name",
      "status",
      "objective",
      "channel",
      "startDate",
      "endDate",
      "dailyBudget",
      "totalBudget",
      "spent",
      "impressions",
      "clicks",
      "leads",
    ];
    const rows = campaigns.map((c) =>
      headers
        .map((h) => (c[h] == null ? "" : String(c[h]).replace(/"/g, '""')))
        .map((v) => `"${v}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-gray-600">
            Create and manage promotional campaigns to boost your profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded border hover:bg-gray-50 inline-flex items-center gap-2"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            onClick={() => setOpenModal(true)}
            className="px-3 py-2 rounded bg-[#00b39be6] text-white inline-flex items-center gap-2 hover:opacity-90"
          >
            <FiPlus /> New campaign
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <SummaryTile label="Active campaigns" value={activeCount} />
        <SummaryTile
          label="Total spend (all time)"
          value={fmtMoney(
            campaigns.reduce((acc, c) => acc + (c.spent || 0), 0)
          )}
        />
        <SummaryTile
          label="Total leads (all time)"
          value={fmtInt(campaigns.reduce((acc, c) => acc + (c.leads || 0), 0))}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaigns.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
            No campaigns yet. Click <b>New campaign</b> to get started.
          </div>
        ) : (
          campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              c={c}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <NewCampaignModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
