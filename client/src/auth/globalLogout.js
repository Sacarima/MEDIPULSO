// Central place to purge persisted state and optionally dispatch slice resets.

import { persistor, store } from '../redux/store';
import { useDispatch } from 'react-redux';
import { postLogout } from '../api/authApi';
import { logoutUserSuccess } from '../redux/user/userSlice';
import { logoutAdminSuccess } from '../redux/admin/adminSlice';
import { logoutDoctorSuccess } from '../redux/doctor/doctorSlice';
import { logoutClinicSuccess } from '../redux/clinic/clinicSlice';



export async function globalLogout({ redirect, navigate, reason = 'expired' } = {}) {
    const dispatch = useDispatch();
  try { await postLogout(); } catch { /* ignore */ }

  // Dispatch your slice-specific clears if you have them:
    try { store.dispatch(logoutUserSuccess()); } catch {}
    try { store.dispatch(logoutAdminSuccess()); } catch {}
    try { store.dispatch(logoutDoctorSuccess()); } catch {}
    try { store.dispatch(logoutClinicSuccess()); } catch {}

  try { await persistor.purge(); } catch {}

  // As a safety net, nuke persisted root if any remains (doesn't hurt if unused)
  try { localStorage.removeItem('persist:root'); } catch {}

  // Optionally you can also refresh the page if you prefer a clean slate:
  if (navigate && redirect) {
    navigate(redirect, { replace: true, state: { reason } });
  } else if (redirect) {
    window.location.assign(redirect);
  }
}
