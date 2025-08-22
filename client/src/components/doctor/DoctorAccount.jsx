import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FiEdit2, FiLogOut, FiUser, FiPhone, FiMail, FiShield, FiEye, FiEyeOff  } from "react-icons/fi";
import { toast }  from "react-hot-toast";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";

import {
  updateDoctorStart,
  updateDoctorSuccess,
  updateDoctorFailure,
  clearDoctorError,
  logoutDoctorStart,
  logoutDoctorSuccess,
  logoutDoctorFailure,
  deleteDoctorStart,
  deleteDoctorSuccess,
  deleteDoctorFailure,
} from "../../redux/doctor/doctorSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DoctorAccount() {
  const dispatch = useDispatch();
  const { currentDoctor, loading, error } = useSelector((s) => s.doctor);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdVisible, setPwdVisible] = useState({
  current: false, next: false, confirm: false,
});
const [pwdLoading, setPwdLoading] = useState(false);
const [pwdError, setPwdError] = useState(null);
const [pwdSuccess, setPwdSuccess] = useState(null);
  // modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // Controlled form state

  const requestDelete = () => setDeleteOpen(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
 
  });

  const togglePwdVis = (k) =>
  setPwdVisible((p) => ({ ...p, [k]: !p[k] }));

  const validatePasswords = () => {
    if (!pwd.current || !pwd.next || !pwd.confirm) return "All fields are required.";
    if (pwd.next.length < 6) return "New password must be at least 6 characters.";
    if (pwd.next !== pwd.confirm) return "New password and confirmation do not match.";
    if (pwd.next === pwd.current) return "New password must be different from current password.";
    return null;
  };

  const [successMsg, setSuccessMsg] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(clearDoctorError());
  }, [dispatch]);

  useEffect(() => {
    if (currentDoctor) {
      setFormData({
        firstName: currentDoctor.firstName || "",
        lastName: currentDoctor.lastName || "",
        phoneNumber: currentDoctor.phoneNumber || "",
        email: currentDoctor.email || "",
      });
    }
  }, [currentDoctor]);

  const fullName = useMemo(() => {
    if (!currentDoctor) return "";
    const f = currentDoctor.firstName || "";
    const l = currentDoctor.lastName || "";
    return [f, l].filter(Boolean).join(" ");
  }, [currentDoctor]);

  const handleChange = (e) => {
    setSuccessMsg(null);
    setLocalError(null);
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setLocalError(null);

    if (!currentDoctor?._id) {
      toast.error("Missing doctor ID.");
      return;
    }

    try {
      dispatch(updateDoctorStart());
      const token = localStorage.getItem("access_token"); // using same token name as your patient page
      const res = await fetch(`${API_BASE_URL}/api/doctor-form/update/${currentDoctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateDoctorFailure(data?.message || "Update failed"));
        toast.error(data?.message || "Update failed");
      } else {
        dispatch(updateDoctorSuccess(data));
        toast.success("Your profile information was updated successfully.");
      }
    } catch (err) {
      dispatch(updateDoctorFailure(err.message));
      setLocalError(err.message);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!currentDoctor?._id) {
      toast.error("Missing doctor ID.");
      return;
    }

  try {
    dispatch(deleteDoctorStart());
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/api/doctor-form/${currentDoctor._id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(deleteDoctorFailure(data?.message || "Failed to delete account"));
    } else {
      // success: clear state & redirect
      dispatch(deleteDoctorSuccess());
      localStorage.removeItem("access_token");
      window.location.href = "/"; // or /goodbye
    }
  } catch (e) {
    dispatch(deleteDoctorFailure(e.message));
  }
};


const handleChangePassword = async (e) => {
  e.preventDefault();

  const v = validatePasswords();
  if (v) {
    toast.error(v);
    return;
  }
  if (!currentDoctor?._id) {
    toast.error("Missing doctor ID.");
    return;
  }

  try {
    setPwdLoading(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/api/doctor-form/${currentDoctor._id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        currentPassword: pwd.current,
        newPassword: pwd.next,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.message || "Failed to change password.");
    } else {
      toast.success("Password updated successfully.");
      setPwd({ current: "", next: "", confirm: "" });
    }
  } catch (err) {
    toast.error(err.message || "Something went wrong.");
  } finally {
    setPwdLoading(false);
  }
};


  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/doctors/logout`, {
        method: "POST",
        credentials: "include",
      });
      // You likely already have a logout action—if so, dispatch it here.
      // e.g., dispatch(doctorLogoutSuccess())
      // Or redirect to login:
      window.location.href = "/login";
    } catch (_) {
      // Silent
    }
  };


  if (!currentDoctor) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading your account…</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Page Hero */}
      <section className="bg-gradient-radial"
        style={{
            background: "radial-gradient(circle at top left, #00c3a5 0%, #06b6d4 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-semibold">
                {fullName?.[0]?.toUpperCase() || "D"}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{fullName || "Doctor"}</h1>
                <p className="text-white/90 text-sm">
                  {currentDoctor?.medicalCategory || "Specialist"} • {currentDoctor?.city || "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/profile-info/${currentDoctor._id}`}
                className="rounded-xl bg-white text-gray-800 px-4 py-2 text-sm font-medium shadow hover:shadow-md transition"
              >
                View public profile
              </Link>
              <Link
                to="/doctor-appointment"
                className="rounded-xl bg-white/15 px-4 py-2 text-sm font-medium border border-white/30 hover:bg-white/20 transition"
              >
                Manage availability
              </Link>
              <Button color="light" onClick={handleLogout} className="!rounded-xl !bg-white/15 border border-white/30 hover:!bg-white/20">
                <FiLogOut className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 -mt-8 pb-16">
        <div className="rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-lg font-semibold">Account Settings</h2>
              <p className="text-sm text-gray-500">Update your basic information.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <FiEdit2 />
              <span>Edit mode</span>
            </div>
          </div>

          {/* Card body */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1 relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g., Anna"
                  />
                  <FiUser className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g., Kowalska"
                  />
                  <FiUser className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1 relative">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+48 123 456 789"
                  />
                  <FiPhone className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@clinic.com"
                  />
                  <FiMail className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Security */}
<div className="rounded-2xl border p-4 bg-gray-50">
  <div className="flex items-center gap-2 text-gray-700">
    <FiShield />
    <h3 className="font-medium">Security</h3>
  </div>
  <p className="text-sm text-gray-500 mt-1">
    Change your password. Minimum 6 characters.
  </p>

  <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
    {/* Current password */}
    <div>
      <label className="block text-sm font-medium text-gray-700" htmlFor="pwd-current">
        Current password
      </label>
      <div className="relative mt-1">
        <input
          id="pwd-current"
          type={pwdVisible.current ? "text" : "password"}
          className="w-full rounded-xl border-gray-300 pr-10 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
          value={pwd.current}
          onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => togglePwdVis("current")}
          className="absolute right-3 top-2.5 text-gray-500"
          aria-label={pwdVisible.current ? "Hide current password" : "Show current password"}
        >
          {pwdVisible.current ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>

    {/* New password */}
    <div>
      <label className="block text-sm font-medium text-gray-700" htmlFor="pwd-new">
        New password
      </label>
      <div className="relative mt-1">
        <input
          id="pwd-new"
          type={pwdVisible.next ? "text" : "password"}
          className="w-full rounded-xl border-gray-300 pr-10 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
          value={pwd.next}
          onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
          autoComplete="new-password"
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => togglePwdVis("next")}
          className="absolute right-3 top-2.5 text-gray-500"
          aria-label={pwdVisible.next ? "Hide new password" : "Show new password"}
        >
          {pwdVisible.next ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Use at least 6 characters. Avoid reusing old passwords.
      </p>
    </div>

        {/* Confirm password */}
        <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="pwd-confirm">
            Confirm new password
        </label>
        <div className="relative mt-1">
            <input
            id="pwd-confirm"
            type={pwdVisible.confirm ? "text" : "password"}
            className="w-full rounded-xl border-gray-300 pr-10 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
            value={pwd.confirm}
            onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
            autoComplete="new-password"
            required
            minLength={6}
            />
            <button
            type="button"
            onClick={() => togglePwdVis("confirm")}
            className="absolute right-3 top-2.5 text-gray-500"
            aria-label={pwdVisible.confirm ? "Hide confirm password" : "Show confirm password"}
            >
            {pwdVisible.confirm ? <FiEyeOff /> : <FiEye />}
            </button>
        </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
        <Button type="submit" disabled={pwdLoading} className="!rounded-xl !bg-[#00c3a5] hover:!bg-[#00b39b]">
            {pwdLoading ? "Updating…" : "Update password"}
        </Button>
        <button
            type="button"
            className="rounded-xl px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50"
            onClick={() => {
            setPwd({ current: "", next: "", confirm: "" });
            setPwdError(null);
            setPwdSuccess(null);
            }}
            disabled={pwdLoading}
        >
            Reset
        </button>
        </div>
    </form>
    </div>


            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-white font-medium hover:bg-teal-700 transition disabled:opacity-60"
                >
                  {loading ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentDoctor) return;
                    setFormData({
                      firstName: currentDoctor.firstName || "",
                      lastName: currentDoctor.lastName || "",
                      phoneNumber: currentDoctor.phoneNumber || "",
                      email: currentDoctor.email || "",
                    });
                    setSuccessMsg(null);
                    setLocalError(null);
                  }}
                  className="rounded-xl px-4 py-2 font-medium border border-gray-300 hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              </div>

              {/* Danger zone preview - disabled */}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-red-300 text-red-500 opacity-60"
                title="Add delete route to enable"
                onClick={requestDelete}
                disabled={loading}
              >
                <HiOutlineExclamationCircle /> Delete my account
              </button>

              <ConfirmDeleteModal
                open={deleteOpen}
                title="Delete your account?"
                message="Your appointments will not be canceled automatically. This deletion cannot be undone."
                confirmText="Delete account"
                cancelText="Keep account"
                loading={deleting}
                onConfirm={handleDeleteDoctor}
                onClose={() => setDeleteOpen(false)}
            />
            </div>

          </form>
        </div>

        {/* Quick links row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/doctor/doctor-profile-completion"
            className="rounded-2xl border bg-white p-4 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Profile</div>
            <div className="text-base font-semibold">Complete your profile</div>
            <p className="text-sm text-gray-500 mt-1">
              Finish certificates, services, prices & availability.
            </p>
          </Link>
          <Link
            to="/doctor-profile-info?tab=calendar"
            className="rounded-2xl border bg-white p-4 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Calendar</div>
            <div className="text-base font-semibold">Manage availability</div>
            <p className="text-sm text-gray-500 mt-1">
              Add or remove your time slots.
            </p>
          </Link>
          <Link
            to={`/profile-info/${currentDoctor._id}`}
            className="rounded-2xl border bg-white p-4 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Public</div>
            <div className="text-base font-semibold">Preview public profile</div>
            <p className="text-sm text-gray-500 mt-1">
              See how patients view your profile.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
