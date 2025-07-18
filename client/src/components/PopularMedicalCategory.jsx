import React, {useState, useEffect} from 'react'

const PopularMedicalCategory = ()  => {
    const [ popularCategories, setPopularCategories ] = useState([])

    useEffect(() => {
        const fetchPopularCategories = async () => {
            try {
                const response = await fetch('http://localhost:7500/api/categories/popular-categories')
                const data = await response.json()
                setPopularCategories(data.popularCategories)
            } catch (error) {
                console.error('Error fetching popular categories:', error)
            }
        }


        fetchPopularCategories()
    }, [])


  return (
    <div>
        <h2 className="text-xl font-medium mb-4">Popular Medical Categories</h2>
        <div className="flex flex-wrap -mx-">
            {popularCategories.length > 0 ? (
                popularCategories.map((category, index) => (
                    <div key={index} className=" px- w-full sm:w-1/2 md:w-1/3 lg:w-1/6">
                        <div className="bg-white p-  my-2">
                            <span className="font-semibold hover:underline cursor-pointer">
                                {category.name}
                            </span>
                            <div className="flex flex-wrap mt-2">
                                {category.locations.reduce((result, location, i, array) => {
                                    if (i % 2 === 0) {
                                        result.push(array.slice(i, i + 2))
                                    }
                                    return result
                                }, []).map((locationGroup, idx) => (
                                    <div key={idx} className="w-full flex gap-2">
                                        {locationGroup.map((loc, locIdx) => (
                                            <p key={locIdx} className="text-blue-500 hover:underline py-1 cursor-pointer">
                                                {loc}{locIdx < locationGroup.length - 1 ? ',' : ''}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="w-full text-center">Loading categories...</p>
            )}
        </div>
    </div>
  )
}

export default PopularMedicalCategory