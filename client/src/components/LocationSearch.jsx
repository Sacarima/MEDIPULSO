
// import { useState, useRef } from 'react';
// import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

// const libraries = ['places'];
// const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const LocationSearch = () => {
//     const [searchBox, setSearchBox] = useState(null);
//     const [suggestedPlaces, setSuggestedPlaces] = useState([]);
//     const [selectedPlace, setSelectedPlace] = useState('');
//     const searchBoxRef = useRef(null);

//     const onLoad = (ref) => {
//         setSearchBox(ref);
//         searchBoxRef.current = ref;
//     };

//     const onPlacesChanged = () => {
//         const places = searchBoxRef.current.getPlaces();
//         if (places.length > 0) {
//             const place = places[0]; // Get the first suggested place
//             const address = place.formatted_address;
//             setSelectedPlace(address);
//             setSuggestedPlaces([]); // Clear the suggested places after selection
//         }
//     };

//     const handleInputChange = (e) => {
//         setSelectedPlace(e.target.value);
//     };

//     return (
//         <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
//             <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged} ref={searchBoxRef}>
//                 <input
//                     type="text"
//                     placeholder="Search for your location"
//                     className="w-full border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
//                     value={selectedPlace}
//                     onChange={handleInputChange}
//                 />
//             </StandaloneSearchBox>
//             <ul className=''>
//                 {suggestedPlaces.map((place, index) => (
//                     <li key={index}>{place}</li>
//                 ))}
//             </ul>
//         </LoadScript>
//     );
// };

// export default LocationSearch;





import { useState, useRef } from 'react';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationSearch = () => {
    const [searchBox, setSearchBox] = useState(null);
    const [suggestedPlaces, setSuggestedPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');
    const searchBoxRef = useRef(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
        libraries: libraries,
        id: 'google-map-script', // Ensure the script is uniquely identified
    });

    const onLoad = (ref) => {
        setSearchBox(ref);
        searchBoxRef.current = ref;
    };

    const onPlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places.length > 0) {
            const place = places[0]; // Get the first suggested place
            const address = place.formatted_address;
            setSelectedPlace(address);
            setSuggestedPlaces([]); // Clear the suggested places after selection
        }
    };

    const handleInputChange = (e) => {
        setSelectedPlace(e.target.value);
    };

    if (loadError) {
        return <div>Error loading Google Maps API</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged} ref={searchBoxRef}>
                <input
                    type="text"
                    placeholder="Search for your location"
                    className="w-full border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
                    value={selectedPlace}
                    onChange={handleInputChange}
                />
            </StandaloneSearchBox>
            <ul className=''>
                {suggestedPlaces.map((place, index) => (
                    <li key={index}>{place}</li>
                ))}
            </ul>
        </>
    );
};

export default LocationSearch;
