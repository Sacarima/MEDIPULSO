import useMediaQuery from "../hooks/useMediaQuery";
import { useDoctorDashboard } from "./context/DoctorDashboardContext";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {ROUTES } from "../config/routes";


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

// removed these props  active, if it breaaks this is the starting point
//  onChange = () => {},

export default function ProfileInfoNavigation({
  counts = {},
  countsLoading = false,
}) {
  const { active, setActive } = useDoctorDashboard();
  const isAboveSmallScreens = useMediaQuery("(min-width: 640px)");
  const pending = counts?.pending ?? 0;
  const { currentDoctor } = useSelector((state) => state.doctor);


  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const PROFILE_INFO_ROUTE = ROUTES?.doctor?.profileInfo ?? "/doctor-profile-info";

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
    appointments: namespaced ? "profile/appointments" : "appointments", // stays top-level in both
    profileReviews: namespaced ? "profile/reviews" : "profile-reviews",
    plans: namespaced ? "profile/plans" : "plans",
    appointmentChannel: namespaced ? "profile/channel" : "profile-channel"
    // appointmentPanel: 
  };

   const isActive = (key) => active === key;


  // --- helpers: push tab to URL & sync from URL ---
  const toProfileWithTab = (tabKey) => {
    const enc = encodeURIComponent(tabKey);
    if (location.pathname !== PROFILE_INFO_ROUTE) {
      navigate(`${PROFILE_INFO_ROUTE}?tab=${enc}`);
    } else {
      // replace to avoid history spam when already on the page
      navigate(`${PROFILE_INFO_ROUTE}?tab=${enc}`, { replace: true });
    }
  };

  const go = (tabKey) => {
    if (!tabKey) return;
    if (active !== tabKey) setActive(tabKey);
    toProfileWithTab(tabKey);
  };

  // When URL’s ?tab changes on /doctor-profile-info, sync it into local state
  useEffect(() => {
    if (location.pathname !== PROFILE_INFO_ROUTE) return;
    const raw = searchParams.get("tab");
    if (!raw) return;
    const decoded = decodeURIComponent(raw);
    if (decoded && decoded !== active) {
      setActive(decoded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // If we land on profile page without ?tab, write current active into URL
  useEffect(() => {
    if (location.pathname !== PROFILE_INFO_ROUTE) return;
    const hasTab = searchParams.get("tab");
    if (!hasTab && active) {
      const enc = encodeURIComponent(active);
      navigate(`${PROFILE_INFO_ROUTE}?tab=${enc}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);


  return (
    <aside className="hidden md:block">
      <div className="sm:sticky sm:top-0 flex flex-col h-screen bg-white text-[1rem] p-2">
        <ul className="py-4 space-y-1">
          {/* Profile group */}
          <li className="px-4 py-2">
            <div className="text-gray-800 mb-1">Profile</div>
            <ul className={`ml-2 ${!isAboveSmallScreens && "hidden"}`}>
              <li>
                <button 
                  type="button" 
                  className={item(isActive(k.edit))} 
                  onClick={() => go(k.edit)}
                >
                  Edit Profile
                </button>
              </li>
              <li>
                <Link to={`/profile-info/${currentDoctor._id}`}>
                  <button
                    type="button"
                    className={item(isActive(k.public))}
                    onClick={() => go(k.public)}
                  >
                    Public profile
                  </button>
                </Link>
              </li>
              <li>
                <button type="button" className={item(isActive(k.addresses))} onClick={() => go(k.addresses)}>
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
              onClick={() => go(k.appointments)}
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
            <button type="button" className={item(isActive(k.appointmentChannel))} onClick={() => go(k.appointmentChannel)}>
              Appointment channels
            </button>
          </li>
          <li>
            <button type="button" className={item(isActive(k.profileReviews))} onClick={() => go(k.profileReviews)}>
              Profile reviews
            </button>
          </li>
          <li>
            <button type="button" className={item(isActive(k.promotions))} onClick={() => go(k.promotions)}>
              Promotions
            </button>
          </li>
          <li>
            <button type="button" className={item(isActive(k.certificates))} onClick={() => go(k.certificates)}>
              Certificates
            </button>
          </li>
        </ul>

        <div className="mt-auto bg-[#00b39be6] p-1 w-full rounded">
          <button
            type="button"
            className="w-full cursor-pointer bg-white text-[#00b39be6] py-2 rounded text-sm font-medium"
            onClick={() => setActive(k.plans)}
          >
            Discover Medi Pulso Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
