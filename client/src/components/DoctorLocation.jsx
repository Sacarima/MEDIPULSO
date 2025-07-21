import { useState, useEffect } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import locationImage from '../assets/locationn.jpg'


const DoctorLocation = ({ address, isLoaded }) => {
    const [mapCenter, setMapCenter] = useState(null)
    const[error, setError] = useState(null)
   
    useEffect(() => {
        if(isLoaded && address) {
            geocodedAddress(address)
        }
    }, [isLoaded, address])

    const geocodedAddress = async (address) => {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location
                setMapCenter({ lat: location.lat(), lng: location.lng() })
            } else {
                setError('Unable to find the location for the given address.' + status)
            }
        })
    }

    const handleEnlargeMap = () => {
        const query = encodeURIComponent(address)
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
        window.open(mapsUrl, '_blank')
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <div className=" w-full ">
    
          {/* Right side: Small map view */}
          <div className="  h-52">
            {mapCenter ? (
              <>
                <GoogleMap
                  mapContainerClassName="w-full rounded-md"
                  center={mapCenter}
                  zoom={15}
                  options={{
                    disableDefaultUI: true,
                    gestureHandling: 'none',
                  }}
                >
                  <Marker position={mapCenter} />
                </GoogleMap>
                {/* Overlay to enlarge map */}
                <div
                  onClick={handleEnlargeMap}
                  className=" rounded-lg relative flex items-center justify-center bg-black bg-opacity-40 text-white font-bold cursor-pointer  hover:bg-opacity-50 transition duration-200"
                >
                  <span className='absolute bg-white text-gray-600 px-2 font-medium'>enlarge map</span>
                  <img className='w-48 h-48 rounded-lg ' src={locationImage} alt="location icon pinned on a map" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-start justify-center bg-gray-20">
                {error ? 
                    <p className="text-red-500">{error}</p> 
                        : 
                    <div className='flex items-center gap-2'>
                        <div className="flex items-center justify-center">
                            <div className="relative">
                                <div className="h-8 w-8 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                                <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                                </div>
                            </div>
                        </div>
                    <p>Locating address...</p>
                    </div>
                }
              </div>
            )}
          </div>
        </div>
      )
    }

export default DoctorLocation