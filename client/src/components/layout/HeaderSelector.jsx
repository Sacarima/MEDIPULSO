// HeaderSelector.jsx
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Header from "../Header";
import DoctorAppointmentHeader from "../appointment/DoctorAppointmentHeader";
import DataPrivacyHeader from "../DataPrivacyHeader";
import DoctorSignupConfirmationHeader from "../DoctorSignupConfirmationHeader";
import DoctorPublicProfileHeader from "../DoctorPublicProfileHeader";
import AccountHeaderPatient from "../AccountHeaderPatient";
import DoctorProfileCompletionHeader from "../doctor/DoctorProfileCompletionHeader";
//  Do NOT import DoctorProfileHeader or Sidebar here (sidebars are layout-only)

function HeaderSelector() {
  const { pathname } = useLocation();

     const isProfileCompletionRoute =
    pathname.startsWith("/doctor-profile-completion") ||
    pathname.startsWith("/doctor/complete-profile") ||
    pathname.startsWith("/complete-your-profile");

  const doctorState = useSelector((s) => s.doctor);
  const userState   = useSelector((s) => s.user);
  const adminState  = useSelector((s) => s.admin);

  // Strict checks
  const isDoctor = !!doctorState?.isLoggedIn && !!doctorState?.currentDoctor?._id;
  const isUser   = !!userState?.isLoggedIn;
  const isAdmin  = !!adminState?.isLoggedIn;

  // Route overrides (top headers)
  if (pathname.startsWith("/data-privacy")) return <DataPrivacyHeader />;
  if (pathname.startsWith("/doctor-signup-confirmation")) return <DoctorSignupConfirmationHeader />;

  // Public doctor pages: show public doctor header for guests/users/clinics
  const isPublicDoctorPage =
    pathname.startsWith("/search-results") ||
    pathname.startsWith("/profile-info/") ||
    pathname.startsWith("/ask-doctor") ||
    pathname.startsWith("/questions/");
   
  if (!isDoctor && isPublicDoctorPage) {
    return <DoctorPublicProfileHeader />;
  }

      const doctorLoggedIn = !!doctorState?.isLoggedIn;
       const NO_HEADER_PATHS_FOR_LOGGED_IN_DOCTOR = new Set([
         "/job-offers-for-doctor",
       ]);
     
       // If a doctor is logged in, suppress header on Job Offers page
       if (doctorLoggedIn && NO_HEADER_PATHS_FOR_LOGGED_IN_DOCTOR.has(pathname)) {
         return null;
       }
  if (doctorLoggedIn && pathname.startsWith("/job-offers-for-doctor")) return null;

  // If you have a *top* header for doctor-appointment pages, keep it here.
  // Otherwise remove this block.
  if (isDoctor && pathname.startsWith("/doctor-appointment")) {
    return <DoctorAppointmentHeader />;
  }

  // Patient top header
  if (isUser) {
    if (pathname.startsWith("/patient-profile")) return <AccountHeaderPatient />;
    return <Header />;
  }

  // Default public top header
  return <Header />;
}

export default HeaderSelector;
