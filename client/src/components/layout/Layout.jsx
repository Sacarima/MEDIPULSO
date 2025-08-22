
// Layout.jsx
import HeaderSelector from "./HeaderSelector";
import DoctorProfileHeader from "../DoctorProfileHeader";
import Sidebar from "../dashboard/Sidebar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { EnsureDoctorDashboardProvider } from "../context/DoctorDashboardContext";
import AppShellSkeleton from "../loaders/AppShellSkeleton";

function Layout({ children, hideHeader = false }) {
  const { pathname } = useLocation();

  const isPersistReady = useSelector((s) => s?._persist?.rehydrated);
  const doctorState = useSelector((s) => s.doctor);
  const adminState  = useSelector((s) => s.admin);

  const isDoctor = !!doctorState?.isLoggedIn && !!doctorState?.currentDoctor?._id;
  const isAdmin  = !!adminState?.isLoggedIn;

  const isDataPrivacy = pathname.startsWith("/data-privacy");
  const isJobOffers   = pathname.startsWith("/job-offers-for-doctors");

  const isProfileCompletionRoute =
    pathname.startsWith("/doctor-profile-completion") ||
    pathname.startsWith("/doctor/complete-profile") ||
    pathname.startsWith("/complete-your-profile");

  if (!isPersistReady) {
    return <AppShellSkeleton sidebar={isDoctor || isAdmin} />;
  }

  const useDoctorLayout = !hideHeader && isDoctor && !isDataPrivacy && !isJobOffers && !isProfileCompletionRoute;
  const useAdminLayout  = !hideHeader && isAdmin;

  // NEW: also hide the top HeaderSelector on completion routes
  const showTopHeader = !hideHeader && !isProfileCompletionRoute;

  return (
    <EnsureDoctorDashboardProvider>
      {useDoctorLayout || useAdminLayout ? (
        <div className="flex min-h-screen flex-col lg:flex-row bg-[#eef4fd]">
          {useDoctorLayout ? <DoctorProfileHeader /> : <Sidebar />}
          <section className="flex-1 w-full mx-w-screen-2xl m-auto px- sm:px- lg:px-">
            {children}
          </section>
        </div>
      ) : (
        <>
          {showTopHeader && <HeaderSelector />}
          <main>{children}</main>
        </>
      )}
    </EnsureDoctorDashboardProvider>
  );
}

export default Layout;

