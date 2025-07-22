import { useEffect, useState } from "react";
import axios from "axios";

const LocationSearchFree = ({ onSelect, value, id, name }) => {
    const [location, setLocation] = useState(value || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    useEffect(() => {
        const fetchLocation = async (latitude, longitude) => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/location/reverse-geocode`, {
                    params: {
                        lat: latitude,
                        lon: longitude,
                    },
                });

                
                const city = response.data.address.city || response.data.address.town || response.data.address.village || "Unknown Location";
                setLocation(city);
                onSelect(city);
            } catch (error) {
                console.error("Failed to fetch location:", error);
                setError("Unable to detect location");
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchLocation(latitude, longitude);
                },
                (error) => {
                    console.warn("Location access denied by user:", error);
                    setError("Location access denied");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser");
        }
    }, []);

    return (
        <div>
            <input
                type="text"
                id={id}
                name={name}
                value={location}
                onChange={(e) => {
                    setLocation(e.target.value);
                    onSelect(e.target.value);
                }}
                placeholder={loading ? "Detecting location..." : "Enter city"}
                className="border-gray-200 border py-[13px] rounded w-full focus:outline-none "
            />
        </div>
    );
}

export default LocationSearchFree