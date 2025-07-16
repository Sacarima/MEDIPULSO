import axios from 'axios'

export const reverseGeocode = async (req, res) => {
    const { lat, lon } = req.query;

    try {
        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                lat,
                lon,
                format: "json",
            },
            headers: {
                'User-Agent': 'medi-pulso 1.0 (support@medipulso.pl)',
            },
        })

        res.json(response.data)
    } catch (error) {
        res.status(500).json({ message: "Reverse geocoding failed", error: error.message })
    }
}

