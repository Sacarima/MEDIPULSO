import React from "react";
import useMediaQuery from "../hooks/useMediaQuery";

const item = (isActive) =>
  `px-4 py-2 w-full text-left cursor-pointer hover:bg-gray-100 ${
    isActive ? "bg-gray-00 font-medium border-b-[1.5px] border-[#00b39be6]" : ""
  }`;

const Badge = ({ children, title }) => (
  <span
    aria-label={title}
    title={title}
    className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] px-2 h-5 text-xs rounded-full bg-amber-500 text-white"
  >
    {children}
  </span>
);

export default function ProfileInfoNavigation({
  active,
  onChange = () => {},
  counts = {},
  countsLoading = false,
}) {
  const isAboveSmallScreens = useMediaQuery("(min-width: 640px)");
  const pending = counts?.pending ?? 0;

  // Auto-detect key scheme
  const namespaced = !!active?.startsWith?.("profile/");

  // Helpers to compare & emit the right key without breaking old routes
  const k = {
    edit: namespaced ? "profile/edit" : "profile",
    public: namespaced ? "profile/public" : "public-profile",
    addresses: namespaced ? "profile/addresses" : "addresses",
    channels: namespaced ? "profile/channels" : "channels",
    stats: namespaced ? "profile/stats" : "stats",
    promotions: namespaced ? "profile/promotions" : "promotions",
    certificates: namespaced ? "profile/certificates" : "certificates",
    appointments: "appointments", // stays top-level in both
  };

  const isActive = (key) => active === key;

  return (
    <aside className="hidden md:block">
      <div className="sm:sticky sm:top-0 flex flex-col h-screen bg-white text-[1rem] w-1/4 min-w-[10rem] max-w-[16rem]">
        <ul className="py-4 space-y-1">
          {/* Profile group */}
          <li className="px-4 py-2">
            <div className="text-gray-800 mb-1">Profile</div>
            <ul className={`ml-2 ${!isAboveSmallScreens && "hidden"}`}>
              <li>
                <button type="button" className={item(isActive(k.edit))} onClick={() => onChange(k.edit)}>
                  Edit Profile
                </button>
              </li>
              <li>
                <button type="button" className={item(isActive(k.public))} onClick={() => onChange(k.public)}>
                  Public profile
                </button>
              </li>
              <li>
                <button type="button" className={item(isActive(k.addresses))} onClick={() => onChange(k.addresses)}>
                  Addresses
                </button>
              </li>
            </ul>
          </li>

          {/* Appointments + badge */}
          <li>
            <button
              type="button"
              className={`${item(isActive(k.appointments))} flex items-center justify-between`}
              onClick={() => onChange(k.appointments)}
            >
              <span>Appointments</span>
              {counts
                ? countsLoading
                  ? <span className="ml-2 text-xs text-gray-400">…</span>
                  : pending > 0 && <Badge title="Pending appointments">{pending}</Badge>
                : null}
            </button>
          </li>

          <li>
            <button type="button" className={item(isActive(k.channels))} onClick={() => onChange(k.channels)}>
              Appointment channels
            </button>
          </li>
          <li>
            <button type="button" className={item(isActive(k.stats))} onClick={() => onChange(k.stats)}>
              Profile statistics
            </button>
          </li>
          <li>
            <button type="button" className={item(isActive(k.promotions))} onClick={() => onChange(k.promotions)}>
              Promotions
            </button>
          </li>
          <li>
            <button type="button" className={item(isActive(k.certificates))} onClick={() => onChange(k.certificates)}>
              Certificates
            </button>
          </li>
        </ul>

        <div className="mt-auto bg-[#00b39be6] p-1 w-full rounded">
          <button
            type="button"
            className="w-full cursor-pointer bg-white text-[#00b39be6] py-2 rounded text-sm font-medium"
          >
            Discover Medi Pulso Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
