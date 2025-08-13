import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import {app} from '/firebase'; // your initialized firebase app
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';


const AdminAddTreatment = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { currentAdmin } = useSelector((state) => state.admin);

  const [slug, setSlug] = useState('');
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [rowErrors, setRowErrors] = useState({}); // for sections and city pricing
  const [savingPricing, setSavingPricing] = useState(false);

  // locals for edits
  const [desc, setDesc] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [images, setImages] = useState([]);     // array of URLs
  const [newFiles, setNewFiles] = useState([]); // raw File objects

  const [sections, setSections] = useState([]); // [{title, content, type}]
  const [priceByCity, setPriceByCity] = useState([]); // [{city, clinicsCount, doctorsCount, minPrice}]

const [confirmDelete, setConfirmDelete] = useState({ open: false, imageUrl: null });


  // CONFIRMATION MODAL
  const openDeleteModal = (url) => {
    if (!treatment?._id) return toast.error("Load a treatment first");
    setConfirmDelete({ open: true, imageUrl: url });
  };
  
  const closeDeleteModal = () => {
    setConfirmDelete({ open: false, imageUrl: null });
  };


const handleConfirmDelete = async () => {
  try {
    const updatedImages = images.filter(img => img !== confirmDelete.imageUrl);

    const resp = await fetch(`${API_BASE_URL}/api/admin/treatments/${treatment._id}/images`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ images: updatedImages }),
      credentials: "include",
    });

    if (!resp.ok) throw new Error("Failed to delete image");

    setImages(updatedImages);
    toast.success("Image deleted");
  } catch (e) {
    toast.error(e.message);
  } finally {
    closeDeleteModal();
  }
};





  const token = localStorage.getItem('access_token');

  const fetchTreatment = async () => {
    if (!slug) return toast.error('Please enter a treatment slug first');
    
    try {
        setLoading(true);
        setFormError(null);

      const res = await fetch(`${API_BASE_URL}/api/treatments/slug/${slug}`);
      const data = await res.json();
      if (data?.success && data.treatment) {
        setTreatment(data.treatment);
        setDesc(data.treatment.description || '');
        setPriceRange(data.treatment.priceRange || '');
        setImages(Array.isArray(data.treatment.images) ? data.treatment.images : []);
        setSections(Array.isArray(data.treatment.sections) ? data.treatment.sections : []);
        setPriceByCity(Array.isArray(data.treatment.priceByCity) ? data.treatment.priceByCity : []);
      } else {
        toast.error(data?.message || 'Treatment not found');
        setTreatment(null);
      }
    } catch (e) {
      console.error(e);
      setFormError(e.message || 'Failed to fetch treatment');
        toast.error(e.message || 'Could not load treatment');
    } finally {
      setLoading(false);
    }
  };

  // ---- Upload new files to Firebase, get URLs, then merge with current images ----
  const handleUploadImages = async () => {
    if (!treatment?._id || !slug) return toast.error('Load a treatment first');
    if (!newFiles.length) return toast.error('Select images first');

    try {
        toast.loading('Uploading...', { id: 'upload' });

      const storage = getStorage(app);
      const uploadedUrls = [];
      for (const file of newFiles) {
        const filePath = `treatments/${slug}/${uuidv4()}-${file.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            () => {},
            (err) => reject(err),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedUrls.push(url);
              resolve();
            }
          );
        });
      }

      const newImages = [...images, ...uploadedUrls];

      const resp = await fetch(`${API_BASE_URL}/api/admin/treatments/${treatment._id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ images: newImages }),
        credentials: 'include',
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed to update images');
      setImages(data.treatment.images || newImages);
      setNewFiles([]);
      toast.success('Images updated!');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Upload failed');
    }
  };


  // ---- Delete a single image ----
const handleDeleteImage = async (url) => {
  if (!treatment?._id) return toast.error('Load a treatment first');
  const ok = window.confirm('Delete this image?');
  if (!ok) return;

  try {
    // optimistic UI
    const prev = images;
    setImages((curr) => curr.filter((u) => u !== url));

    const resp = await fetch(`${API_BASE_URL}/api/admin/treatments/${treatment._id}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ images: [url] }),
      credentials: 'include',
    });

    const data = await resp.json();
    if (!resp.ok) {
      setImages(prev); // rollback
      throw new Error(data?.message || 'Failed to delete image');
    }

    // server returns updated list (preferred)
    if (Array.isArray(data.images)) setImages(data.images);
    toast.success('Image deleted');
  } catch (e) {
    console.error(e);
    toast.error(e.message || 'Delete failed');
  }
};

// ---- Delete ALL images ----
const handleDeleteAllImages = async () => {
  if (!treatment?._id) return toast.error('Load a treatment first');
  const ok = window.confirm('Delete ALL images for this treatment?');
  if (!ok) return;

  try {
    // optimistic UI
    const prev = images;
    setImages([]);

    const resp = await fetch(`${API_BASE_URL}/api/admin/treatments/${treatment._id}/images/all`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });

    const data = await resp.json();
    if (!resp.ok) {
      setImages(prev); // rollback
      throw new Error(data?.message || 'Failed to clear images');
    }

    // server returns images: []
    if (Array.isArray(data.images)) setImages(data.images);
    toast.success('All images deleted');
  } catch (e) {
    console.error(e);
    toast.error(e.message || 'Delete failed');
  }
};


  // ---- Save basics: description & priceRange ----
  const handleSaveBasics = async () => {
    if (!treatment?._id) return toast.error('Load a treatment first');
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/treatments/${treatment._id}/basics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description: desc, priceRange }),
        credentials: 'include',
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed to update basics');
      toast.success('Basics updated!');
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };

  // ---- Save sections by SLUG ----
  const handleSaveSections = async () => {
    if (!slug) return toast.error('Load a treatment first');
    try {
      // ensure types default to 'default' if missing
      const cleanSections = sections.map(s => ({
        title: s.title?.trim() || '',
        content: s.content?.trim() || '',
        type: s.type || 'default',
      }));

      const resp = await fetch(`${API_BASE_URL}/api/admin/treatments/slug/${slug}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sections: cleanSections }),
        credentials: 'include',
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed to update sections');
      setSections(data.treatment.sections || cleanSections);
      toast.success('Sections updated!');
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };


// ---- Save price by city (uses slug route) ----

const handleSavePricing = async () => {
  if (!treatment?.slug) {
    toast.error('Load a treatment first');
    return;
  }

  // clear previous errors
  setFormError(null);
  setRowErrors({});

  // field validation with inline messages
  const newRowErrors = {};
  priceByCity.forEach((row, idx) => {
    const errs = {};
    if (!row.city?.trim()) errs.city = 'City is required';
    if (row.minPrice !== undefined && row.minPrice !== null && row.minPrice !== '') {
      const n = Number(row.minPrice);
      if (Number.isNaN(n)) errs.minPrice = 'Min price must be a number';
      if (n < 0) errs.minPrice = 'Min price cannot be negative';
    }
    if (Object.keys(errs).length) newRowErrors[idx] = errs;
  });

  if (Object.keys(newRowErrors).length) {
    setRowErrors(newRowErrors);
    toast.error('Please fix the highlighted fields');
    return;
  }

  try {
    setSavingPricing(true);

    const resp = await fetch(
      `${API_BASE_URL}/api/admin/treatments/slug/${treatment.slug}/city-pricing`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceByCity }),
        credentials: 'include',
      }
    );

    // robust JSON guard
    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server did not return JSON (status ${resp.status}).`);
    }

    if (!resp.ok) {
      throw new Error(data?.message || 'Failed to update pricing');
    }

    setPriceByCity(data.treatment?.priceByCity || priceByCity);
    toast.success('Pricing updated');
  } catch (e) {
    console.error('handleSavePricing error:', e);
    setFormError(e.message || 'Something went wrong');
    toast.error('Could not save pricing');
  } finally {
    setSavingPricing(false);
  }
};




  // Helpers to edit lists
  const addSection = () => setSections(prev => ([...prev, { title: '', content: '', type: 'default' }]));
  const removeSection = (i) => setSections(prev => prev.filter((_, idx) => idx !== i));
  const updateSection = (i, key, val) =>
    setSections(prev => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  const addCityRow = () => setPriceByCity(prev => ([...prev, { city: '', clinicsCount: 0, doctorsCount: 0, minPrice: 0 }]));
  const removeCityRow = (i) => setPriceByCity(prev => prev.filter((_, idx) => idx !== i));
  const updateCityRow = (i, key, val) =>
    setPriceByCity(prev => prev.map((r, idx) => (idx === i ? { ...r, [key]: key === 'city' ? val : Number(val) } : r)));

  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Treatment</h2>

      {/* Load by slug */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="treatment slug (e.g., teeth-whitening)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border px-3 py-2 rounded w-96"
        />
        <button onClick={fetchTreatment} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>

      {!treatment ? (
        <p className="text-gray-600">Load a treatment to edit.</p>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Basics</h3>
            <div className="grid gap-3">
              <label className="block">
                <span className="text-sm">Description</span>
                <textarea
                  className="border w-full rounded px-3 py-2"
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm">Price Range (display text)</span>
                <input
                  className="border w-full rounded px-3 py-2"
                  placeholder="e.g., 803 PLN - 856 PLN"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
              </label>
              <button onClick={handleSaveBasics} className="bg-green-600 text-white px-4 py-2 rounded w-fit">
                Save Basics
              </button>
            </div>
          </div>

          {/* treatment Images upload */}
            <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Images</h3>

            <div className="flex flex-wrap items-center gap-3 mb-3">
                <input
                type="file"
                multiple
                onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
                />
                <button
                onClick={handleUploadImages}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                Upload & Save
                </button>

                {images?.length > 0 && (
                <button
                    onClick={handleDeleteAllImages}
                    className="bg-red-600 text-white px-4 py-2 rounded ml-auto"
                >
                    Delete all
                </button>
                )}
            </div>

            {images?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((url, i) => (
                    <div key={i} className="border rounded p-2 flex flex-col">
                    <img src={url} alt={`img-${i}`} className="w-full h-32 object-cover rounded" />
                    <div className="text-[10px] text-gray-500 break-all mt-1 line-clamp-2">{url}</div>
                    <button
                        onClick={() => openDeleteModal(url)}
                        className="mt-2 bg-red-500 text-white text-sm px-3 py-1 rounded self-end"
                    >
                        Delete
                    </button>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-600">No images yet.</p>
            )}
            </div>

            {/* Delete confirmation modal */}
            {confirmDelete.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Delete Image?</h2>
                <img src={confirmDelete.imageUrl} alt="preview" className="w-full h-40 object-cover rounded mb-4" />
                <p className="text-gray-600 mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
                </div>
            </div>
            )}



            {/* Sections */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Sections</h3>
            <button onClick={addSection} className="mb-3 bg-gray-800 text-white px-3 py-1 rounded">
              + Add Section
            </button>
            <div className="space-y-3">
              {sections.map((s, i) => (
                <div key={i} className="border rounded p-3">
                  <div className="flex gap-3">
                    <input
                      className="border rounded px-2 py-1 flex-1"
                      placeholder="Title"
                      value={s.title}
                      onChange={(e) => updateSection(i, 'title', e.target.value)}
                    />
                    <select
                      className="border rounded px-2 py-1"
                      value={s.type || 'default'}
                      onChange={(e) => updateSection(i, 'type', e.target.value)}
                    >
                      <option value="default">default</option>
                      <option value="step">step</option>
                      <option value="faq">faq</option>
                      <option value="benefit">benefit</option>
                      <option value="risk">risk</option>
                      <option value="candidate">candidate</option>
                    </select>
                  </div>
                  <textarea
                    className="border rounded w-full px-2 py-1 mt-2"
                    rows={3}
                    placeholder="Content"
                    value={s.content}
                    onChange={(e) => updateSection(i, 'content', e.target.value)}
                  />
                  <button onClick={() => removeSection(i)} className="mt-2 text-red-600">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSaveSections} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
              Save Sections
            </button>
          </div>

            {/* City-specific pricing */}
            {formError && (
                <div className="mb-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {formError}
                </div>
            )}


          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Price by City</h3>
            <button onClick={addCityRow} className="mb-3 bg-gray-800 text-white px-3 py-1 rounded">
              + Add City Row
            </button>
            <div className="space-y-3">
              {priceByCity.map((row, i) => (
                <div key={i} className="border rounded p-3 grid md:grid-cols-4 gap-3">
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="City"
                    value={row.city}
                    onChange={(e) => updateCityRow(i, 'city', e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1"
                    type="number"
                    placeholder="Clinics Count"
                    value={row.clinicsCount ?? ''}
                    onChange={(e) => updateCityRow(i, 'clinicsCount', e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1"
                    type="number"
                    placeholder="Doctors Count"
                    value={row.doctorsCount ?? ''}
                    onChange={(e) => updateCityRow(i, 'doctorsCount', e.target.value)}
                  />
                  <input
                    className="border rounded px-2 py-1"
                    type="number"
                    placeholder="Min Price"
                    value={row.minPrice ?? ''}
                    onChange={(e) => updateCityRow(i, 'minPrice', e.target.value)}
                  />
                  <button onClick={() => removeCityRow(i)} className="text-red-600">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button 
                type='button' 
                disabled={savingPricing}
                onClick={handleSavePricing} 
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                >
                {savingPricing ? 'Saving...' : 'Save City Pricing'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAddTreatment;

