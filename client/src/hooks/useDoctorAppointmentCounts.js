import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function useDoctorAppointmentCounts(doctorId) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [counts, setCounts] = useState({ pending: 0 });
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`, {
        withCredentials: true,
      });
      const items = res.data.appointments || [];
      const pending = items.filter(a => a.status === "pending").length;
      setCounts({ pending });
    } finally {
      setLoading(false);
    }
  }, [doctorId, API_BASE_URL]);

  useEffect(() => { refetch(); }, [refetch]);

  return { counts, loading, refetch };
}
