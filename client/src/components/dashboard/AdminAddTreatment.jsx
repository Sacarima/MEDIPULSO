import React, { useState, useEffect } from 'react';


const AdminAddTreatment = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    priceRange: "",
    images: [],
    sections: [],
    specialties: [],
    priceByCity: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Newer Treatment</h2>

      {/* NAME */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Treatment Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* SLUG */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Slug (URL-friendly)</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        ></textarea>
      </div>

      {/* PRICE RANGE */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Price Range</label>
        <input
          type="text"
          name="priceRange"
          value={formData.priceRange}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Buttons (will hook later) */}
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button className="bg-gray-300 px-4 py-2 rounded">Reset</button>
      </div>
    </div>
  );
};

export default AdminAddTreatment
