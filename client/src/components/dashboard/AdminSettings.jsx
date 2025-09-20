// src/admin/AdminSettings.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  BiSolidShow,
  BiSolidHide,
  BiUser,
  BiShieldQuarter,
  BiBell,
  BiDevices,
  BiErrorAlt,
  BiLogOutCircle,
  BiSave,
  BiCloudUpload,
  BiCheckCircle,
} from "react-icons/bi";

const TABS = [
  { key: "profile", label: "Profile", icon: BiUser },
  { key: "security", label: "Security", icon: BiShieldQuarter },
  { key: "notifications", label: "Notifications", icon: BiBell },
  { key: "sessions", label: "Sessions", icon: BiDevices },
  { key: "danger", label: "Danger Zone", icon: BiErrorAlt },
];

const passwordStrength = (pwd = "") => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 4); // 0..4
};

const StrengthBar = ({ value }) => {
  const colors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-lime-400", "bg-emerald-500"];
  const labels = ["Very weak", "Weak", "Okay", "Good", "Strong"];
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="grid grid-cols-4 gap-1 w-40">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded ${i < value ? colors[value] : "bg-gray-200"}`}
            aria-hidden
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">{labels[value] || labels[0]}</span>
    </div>
  );
};

export default function AdminSettings() {
  const API = import.meta.env.VITE_API_BASE_URL;
  // Try to find the admin from your store; fall back to user (if admin is stored there)
  const admin =
    useSelector((s) => s?.admin?.currentAdmin) ||
    useSelector((s) => s?.user?.currentUser) ||
    null;

  const adminId = admin?._id || admin?.id; // handle either shape
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState({ type: "", msg: "" });

  // Profile form
  const [firstName, setFirstName] = useState(admin?.firstName || "");
  const [lastName, setLastName] = useState(admin?.lastName || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [phone, setPhone] = useState(admin?.phoneNumber || "");
  const [avatar, setAvatar] = useState(admin?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

  // Security form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);

  // Notifications (stored locally unless you add a backend preference model)
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  // Sessions (placeholder list; you can wire to real data later)
  const [sessions, setSessions] = useState([
    { id: "current", label: "This device", agent: navigator.userAgent, current: true },
  ]);

  useEffect(() => {
    setFirstName(admin?.firstName || "");
    setLastName(admin?.lastName || "");
    setEmail(admin?.email || "");
    setPhone(admin?.phoneNumber || "");
    setAvatar(admin?.avatar || "");
  }, [adminId]);

  const fileInputRef = useRef(null);
  const onPickAvatar = () => fileInputRef.current?.click();
  const onAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(f);
  };

  const toast = (type, msg) => {
    setBanner({ type, msg });
    setTimeout(() => setBanner({ type: "", msg: "" }), 3500);
  };

  const safeFetch = async (url, opts) => {
    try {
      const res = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...opts,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json().catch(() => ({}));
    } catch (e) {
      throw e;
    }
  };

  // NOTE: backend update route — reuses your existing user update controller:
  // PUT /api/user/update/:userId  (requires cookie auth)
  const saveProfile = async () => {
    if (!adminId) {
      toast("error", "Not signed in as admin.");
      return;
    }
    if (!email?.trim()) {
      toast("error", "Email is required.");
      return;
    }
    setSaving(true);
    try {
      // If you later add a real upload endpoint, send avatarFile there and get back a URL.
      const body = {
        email: email.trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        phoneNumber: phone?.trim(),
        ...(avatar ? { avatar } : {}),
      };

      await safeFetch(`${API}/api/user/update/${adminId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      toast("success", "Profile updated");
    } catch (e) {
      toast("error", "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password via same update route (your controller hashes if password present)
  const savePassword = async () => {
    if (!adminId) return toast("error", "Not signed in as admin.");
    if (!newPassword || newPassword.length < 6) {
      return toast("error", "New password must be at least 6 characters.");
    }
    if (newPassword !== confirm) {
      return toast("error", "Password confirmation does not match.");
    }
    setSaving(true);
    try {
      await safeFetch(`${API}/api/user/update/${adminId}`, {
        method: "PUT",
        body: JSON.stringify({ password: newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      toast("success", "Password updated");
    } catch (e) {
      toast("error", "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    // Persist in localStorage for now (until you add a backend preference model)
    const prefs = { notifEmail, notifSms, newsletter };
    localStorage.setItem("admin_prefs", JSON.stringify(prefs));
    toast("success", "Notification preferences saved");
  };

  const logoutEverywhere = async () => {
    try {
      await safeFetch(`${API}/api/admin/logout`, { method: "POST" });
      toast("success", "Logged out (this device).");
      // If you add revoke-all endpoint, call it here instead.
    } catch (e) {
      toast("error", "Failed to log out.");
    }
  };

  const DangerZone = () => (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
      <p className="text-sm text-red-700/80 mb-4">
        Be careful — these actions may affect your ability to access the admin.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={logoutEverywhere}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <BiLogOutCircle className="text-lg" />
          Log out this session
        </button>
        {/* Add 'revoke all sessions' when endpoint exists */}
      </div>
    </div>
  );

  const Header = () => (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Admin Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile, security and preferences.</p>
      </div>

      <div className="flex items-center gap-2">
        {saving ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            <BiSave className="animate-pulse" /> Saving…
          </span>
        ) : null}
        {banner.msg ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
              banner.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {banner.type === "success" ? <BiCheckCircle /> : <BiErrorAlt />}
            {banner.msg}
          </span>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Header />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Sidebar Tabs */}
        <aside className="md:col-span-3">
          <nav className="rounded-2xl border border-gray-200 bg-white p-2">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  activeTab === key
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`text-lg ${activeTab === key ? "text-blue-600" : "text-gray-500"}`} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-9">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Profile</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {avatar ? (
                      <img src={avatar} alt="Avatar preview" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={onPickAvatar}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <BiCloudUpload className="text-lg" />
                      Upload Avatar
                    </button>
                    <input
                      ref={fileInputRef}
                      onChange={onAvatarChange}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="mt-1 text-xs text-gray-500">JPG/PNG, up to 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First name</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="admin@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60"
                >
                  <BiSave className="text-lg" />
                  Save changes
                </button>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Security</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="••••••••"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      (Optional here — backend can require it if you prefer)
                    </p>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">New password</label>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-2 top-8 text-gray-500"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? <BiSolidHide className="text-xl" /> : <BiSolidShow className="text-xl" />}
                    </button>
                    <StrengthBar value={strength} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={savePassword}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60"
                >
                  <BiShieldQuarter className="text-lg" />
                  Update password
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Notifications</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <div>
                    <div className="text-sm font-medium text-gray-800">Email notifications</div>
                    <div className="text-xs text-gray-500">
                      Receive important alerts about system status and admin changes.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-blue-600"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <div>
                    <div className="text-sm font-medium text-gray-800">SMS notifications</div>
                    <div className="text-xs text-gray-500">
                      Get time-critical alerts by text (charges may apply).
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-blue-600"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <div>
                    <div className="text-sm font-medium text-gray-800">Monthly newsletter</div>
                    <div className="text-xs text-gray-500">
                      Tips, updates, and best practices delivered monthly.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-blue-600"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                  />
                </label>
              </div>

              <div className="mt-6">
                <button
                  onClick={saveNotifications}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                >
                  <BiSave className="text-lg" />
                  Save preferences
                </button>
              </div>
            </div>
          )}

          {/* SESSIONS */}
          {activeTab === "sessions" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Sessions</h2>
              <p className="mb-4 text-sm text-gray-500">
                Track signed-in devices. For a full “revoke all” flow, expose an admin endpoint and we’ll wire it here.
              </p>
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">{s.label}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[52ch]">{s.agent}</div>
                    </div>
                    {s.current ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                        Current
                      </span>
                    ) : (
                      <button className="text-sm text-red-600 hover:underline">Log out</button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button
                  onClick={logoutEverywhere}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <BiLogOutCircle className="text-lg" />
                  Log out this device
                </button>
              </div>
            </div>
          )}

          {/* DANGER */}
          {activeTab === "danger" && <DangerZone />}
        </section>
      </div>
    </div>
  );
}
