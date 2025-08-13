import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalClinics: 0,
        totalAppointments: 0,
        totalTreatments: 0,
        totalReviews: 0,
    });

    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
                    },
                    credentials: 'include', // Include credentials for authentication
                });

                const data = await res.json();
                if (res.ok) {
                    setDashboardData(data.data);  // Set the dashboard data
                } else {
                    console.error('Error fetching dashboard data:', data.message);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-8">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Display only the first 3 doctors */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Total Doctors</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.totalDoctors}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Total Clinics</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.totalClinics}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold text-gray-700">Total Appointments</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.totalAppointments}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
