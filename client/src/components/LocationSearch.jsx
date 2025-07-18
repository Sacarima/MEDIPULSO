
import { useState, useRef } from 'react'
import { StandaloneSearchBox } from '@react-google-maps/api'

// const libraries = ['places']
// const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const LocationSearch = ({isInvalid, value, onSelect, id, name }) => {
    const [searchBox, setSearchBox] = useState(null)
    //const [suggestedPlaces, setSuggestedPlaces] = useState([])
    const [selectedPlace, setSelectedPlace] = useState('')
    const searchBoxRef = useRef(null)

    const onLoad = (ref) => {
        setSearchBox(ref)
        searchBoxRef.current = ref
    }

    const onPlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces()
        if (places.length > 0) {
            const place = places[0] // Get the first suggested place
            const address = place.formatted_address
            setSelectedPlace(address)
           // setSuggestedPlaces([]) // Clear the suggested places after selection
        }
    }

    const handleInputChange = (e) => {
        // setSelectedPlace(e.target.value)
        // onSelect(e.target.value)
        const newValue = e.target.value
        setSelectedPlace(newValue)  // Update the input field with the typed value
        onSelect(newValue)
    }

    // if (loadError) {
    //     return <div>Error loading Google Maps API</div>
    // }

    // if (!isLoaded) {
    //     return <div>Loading...</div>
    // }

    return (
        <>
            <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged} ref={searchBoxRef}>
                <input
                    type="text"
                    placeholder="Enter city or location"
                    //className="w-full border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
                    className={`w-full opacity-70 text-left bg-[#fff]   h-[55px] border ${isInvalid ? 'border-red-600' : 'border-gray-300'} rounded-sm p-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={selectedPlace}
                    onChange={handleInputChange}
                />
            </StandaloneSearchBox>
            {/* <ul className=''>
                {suggestedPlaces.map((place, index) => (
                    <li key={index}>{place}</li>
                ))}
            </ul> */}
        </>
    )
}

export default LocationSearch
