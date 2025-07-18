import React, { useState, useEffect } from 'react'


const PopularServiceTreatment = () => {
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:7500/api/services-treatment/services')
        const data = await response.json()
        setServices(data.services)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className=" mx-auto ">
      <h2 className="text-xl font-medium mb-4">Popular Services and Treatments</h2>
      <div className="flex flex-wrap -mx-">
        {services.length > 0 ? (
          services.map((service, index) => (
            <div key={index} className=" px- w-full sm:w-1/2 md:w-1/3 lg:w-1/6">
              <div className="bg-white p-  my-2">
                <span className="font-semibold hover:underline cursor-pointer">
                  {service.name}
                </span>
                <div className="flex flex-wrap mt-2">
                  {service.locations.reduce((result, location, i, array) => {
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
          <p className="w-full text-center">Loading services...</p>
        )}
      </div>
    </div>
  )
}

export default PopularServiceTreatment

