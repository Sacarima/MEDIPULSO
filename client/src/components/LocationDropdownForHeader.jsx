import { useState,  useEffect } from 'react'
import axios from 'axios'


const LocationDropdownForHeader = ({ value, id, onSelect, }) => {


    const [location, setLocation] = useState(value || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
      const fetchLocation = async (latitude, longitude) => {
          try {
              setLoading(true);
              const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                  params: {
                      lat: latitude,
                      lon: longitude,
                      format: "json",
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
  
    const handleSelect = (option) => {
      onSelect(option)
      setIsOpen(false)
    }
  
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
              className="border-none py-[10px] text-white bg-[#4db39b25] w-full focus:outline-none  placeholder:text-white"
          />
      </div>
  )
}

export default LocationDropdownForHeader
