// import { useDispatch } from "react-redux"
// import { useNavigate } from "react-router-dom"
// import { logoutUserSuccess } from "../redux/user/userSlice"
// import { logoutDoctorSuccess } from "../redux/doctor/doctorSlice"
// import { logoutClinicSuccess } from "../redux/clinic/clinicSlice"
// import { logoutAdminSuccess } from "../redux/admin/adminSlice"
// import { resetAdminState } from "../redux/admin/adminSlice"
// import { resetDoctorState } from "../redux/doctor/doctorSlice"
// import { resetClinicState } from "../redux/clinic/clinicSlice"
// import { resetUserState } from "../redux/user/userSlice"

// // This Higher Order Component (HOC) wraps a component and provides a logout function
// // that can be used to log out users based on their roles (admin, doctor, clinic, or user).
// // It handles the logout process by calling the appropriate API endpoint and clearing the Redux store state.
// // After a successful logout, it redirects the user to the login page.
// // Usage: Wrap your component with `WithLogout` to get access to the `handleLogout` function as a prop.
// // Example: export default WithLogout(MyComponent);
// const WithLogout = (WrappedComponent) => {
//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

//     return (props) => {
//         const dispatch = useDispatch()
//         const navigate = useNavigate()

//         const handleLogout = async (role) => {
//             try {
//                 // Define logout route based on the user role
//                 let logoutRoute;
                
//                 if (role === 'admin') {
//                     logoutRoute = `${API_BASE_URL}/api/admin/logout`;  // Admin logout route
//                 } else if (role === 'doctor') {
//                     logoutRoute = `${API_BASE_URL}/api/doctor/logout`;
//                 } else if (role === 'clinic') {
//                     logoutRoute = `${API_BASE_URL}/api/clinic/logout`;
//                 } else {
//                     logoutRoute = `${API_BASE_URL}/api/user/logout`;
//                 }

//                 // Call the logout API for the appropriate route
//                 const response = await fetch(logoutRoute, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     credentials: 'include',  // Include credentials for logout
//                 })

//                 if (response.ok) {
//                     // Clear user from the Redux store based on role
//                     if (role === 'admin') {
//                         dispatch(logoutAdminSuccess())
//                     } else if (role === 'doctor') {
//                         dispatch(logoutDoctorSuccess())
//                     } else if (role === 'clinic') {
//                         dispatch(logoutClinicSuccess())
//                     } else {
//                         dispatch(logoutUserSuccess())
//                     }

//                     dispatch(resetAdminState())
//                     dispatch(resetDoctorState())
//                     dispatch(resetClinicState())
//                     dispatch(resetUserState())

//                     // Redirect to the login page after successful logout
//                     navigate('/login')
//                 } else {
//                     const errorData = await response.json()
//                     console.error('Logout failed:', errorData.message)
//                 }
//             } catch (error) {
//                 console.error('Error logging out:', error)
//             }
//         }

//         return <WrappedComponent {...props} handleLogout={handleLogout} />
//     }
// }

// export default WithLogout


// WithLogout.jsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutUserSuccess, resetUserState } from "../redux/user/userSlice";
import { logoutDoctorSuccess, resetDoctorState } from "../redux/doctor/doctorSlice";
import { logoutClinicSuccess, resetClinicState } from "../redux/clinic/clinicSlice";
import { logoutAdminSuccess, resetAdminState } from "../redux/admin/adminSlice";

const WithLogout = (WrappedComponent) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // tiny helper for cross-tab broadcast (mirrors SessionManager channel name)
  const postLogoutBroadcast = () => {
    try {
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel("auth_channel");
        bc.postMessage({ type: "logout", reason: "manual" });
        bc.close();
      } else {
        // fallback to storage event
        localStorage.setItem("__auth_broadcast__", JSON.stringify({ type: "logout", reason: "manual", t: Date.now() }));
        setTimeout(() => localStorage.removeItem("__auth_broadcast__"), 0);
      }
    } catch {}
  };

  return (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async (role) => {
      // Prefer unified endpoint; fall back to role-specific if you’re still serving them
      const unified = `${API_BASE_URL}/api/auth/logout`;
      const byRole =
        role === "admin"  ? `${API_BASE_URL}/api/admin/logout`  :
        role === "doctor" ? `${API_BASE_URL}/api/doctor/logout` :
        role === "clinic" ? `${API_BASE_URL}/api/clinic/logout` :
                            `${API_BASE_URL}/api/user/logout`;

      // Try unified first; if it 404s, use the role route
      let ok = false;
      try {
        let res = await fetch(unified, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.ok || res.status === 401) ok = true; // idempotent: 401 means already logged out
        else if (res.status === 404) {
          // legacy path
          res = await fetch(byRole, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          ok = res.ok || res.status === 401;
        }
      } catch {
        // network error: still proceed to clear client state
        ok = true;
      }

      // Broadcast to other tabs so they clear immediately too
      postLogoutBroadcast();

      // Clear Redux by role (keeps your current behavior)
      try {
        if (role === "admin")       dispatch(logoutAdminSuccess());
        else if (role === "doctor") dispatch(logoutDoctorSuccess());
        else if (role === "clinic") dispatch(logoutClinicSuccess());
        else                        dispatch(logoutUserSuccess());

        dispatch(resetAdminState());
        dispatch(resetDoctorState());
        dispatch(resetClinicState());
        dispatch(resetUserState());
      } catch {}

      // Also nuke persisted root as a safety net (harmless if you’re already purging elsewhere)
      try { localStorage.removeItem("persist:root"); } catch {}

      // Navigate to login regardless of server response
      navigate("/login");
    };

    return <WrappedComponent {...props} handleLogout={handleLogout} />;
  };
};

export default WithLogout;

