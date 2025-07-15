

export  const getPopularCategories = (req, res) => {
    try {
        const popularCategories = [
            {
                name: "Gynecologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Orthopaedist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Psychologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Dentist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Psychiatrist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Dermatologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Surgeon",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Laryngologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Physiotherapist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Neurologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Eye doctor",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Pediatrician",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Urologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Cardiologist",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            },
            {
                name: "Dietician",
                locations: ["Online", "Krakow", "Wroclaw", "Warsaw", "Poznan"]
            }
        ]
        res.json({ popularCategories })
    } catch (error) {
        console.error('Failed to get popular categories:', error)
        res.status(500).json({ message: 'Failed to get services', error: error.message })
    }

}

