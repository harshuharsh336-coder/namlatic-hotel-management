import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeFormModal, addHotel, updateHotel } from '../redux/hotelSlice';
import { X, Upload, MapPin, DollarSign, Image as ImageIcon, Sparkles, Navigation } from 'lucide-react';

export default function HotelFormModal() {
  const dispatch = useDispatch();
  const { isFormModalOpen, formMode, editingHotel } = useSelector(state => state.hotels);

  // Form Field States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [rating, setRating] = useState(4.5);
  const [amenitiesInput, setAmenitiesInput] = useState('WiFi, Pool, Spa');
  
  // Image Upload & Preview States
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Validation Error States
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingHotel && formMode === 'edit') {
      setTitle(editingHotel.title || '');
      setDescription(editingHotel.description || '');
      setPrice(editingHotel.price || '');
      setLatitude(editingHotel.latitude !== undefined ? editingHotel.latitude : '');
      setLongitude(editingHotel.longitude !== undefined ? editingHotel.longitude : '');
      setLocationName(editingHotel.locationName || '');
      setRating(editingHotel.rating || 4.5);
      setAmenitiesInput(editingHotel.amenities ? editingHotel.amenities.join(', ') : 'WiFi, Pool');
      setImageUrl(editingHotel.image || '');
      setPreviewUrl(editingHotel.image || '');
      setImageFile(null);
    } else {
      // Reset form for add mode
      setTitle('');
      setDescription('');
      setPrice('');
      setLatitude('');
      setLongitude('');
      setLocationName('');
      setRating(4.5);
      setAmenitiesInput('WiFi, Pool, Spa, Ocean View');
      setImageUrl('');
      setPreviewUrl('');
      setImageFile(null);
    }
    setErrors({});
  }, [editingHotel, formMode, isFormModalOpen]);

  if (!isFormModalOpen) return null;

  // Handle Image File Upload change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle image URL input change
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    if (!imageFile) {
      setPreviewUrl(val);
    }
  };

  // Geolocation API auto-fill
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4));
          setLongitude(position.coords.longitude.toFixed(4));
          if (!locationName) setLocationName('My Current Location');
        },
        (error) => {
          alert('Could not retrieve geolocation: ' + error.message);
        }
      );
    } else {
      alert('Geolocation API is not supported by your browser.');
    }
  };

  // Field validation
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Hotel title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid positive price amount.';
    }

    if (latitude === '' || isNaN(latitude)) {
      newErrors.latitude = 'Valid latitude coordinate is required.';
    } else if (Number(latitude) < -90 || Number(latitude) > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90.';
    }

    if (longitude === '' || isNaN(longitude)) {
      newErrors.longitude = 'Valid longitude coordinate is required.';
    } else if (Number(longitude) < -180 || Number(longitude) > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('locationName', locationName.trim() || 'Prime City Location');
    formData.append('rating', rating);

    const amenitiesArr = amenitiesInput.split(',').map(s => s.trim()).filter(Boolean);
    formData.append('amenities', amenitiesArr.join(','));

    if (imageFile) {
      formData.append('imageFile', imageFile);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    } else {
      formData.append('imageUrl', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');
    }

    if (formMode === 'add') {
      dispatch(addHotel(formData));
    } else {
      dispatch(updateHotel({ id: editingHotel.id, formData }));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container form-modal">
        <div className="modal-header">
          <div className="header-title">
            <Sparkles className="header-icon" size={20} />
            <h2>{formMode === 'add' ? 'Add New Hotel Listing' : 'Edit Hotel Details'}</h2>
          </div>
          <button className="close-modal-btn" onClick={() => dispatch(closeFormModal())}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Image Upload Feature with Live Preview */}
          <div className="form-section">
            <label className="section-label">Hotel Image & Preview</label>
            <div className="image-upload-box">
              <div className="image-preview-wrapper">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                ) : (
                  <div className="no-preview">
                    <ImageIcon size={32} />
                    <span>No Image Selected</span>
                  </div>
                )}
              </div>

              <div className="upload-controls">
                <label className="btn-file-upload">
                  <Upload size={16} /> Choose File
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                <span className="or-text">or enter image URL:</span>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/hotel.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
              </div>
            </div>
          </div>

          {/* Title & Price */}
          <div className="form-grid-2">
            <div className="form-field">
              <label>Hotel Title / Name *</label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Seaside Deluxe Resort"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-field">
              <label>Price per Night ($) *</label>
              <div className="input-with-icon">
                <DollarSign size={16} className="input-icon" />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  className={`form-input icon-padded ${errors.price ? 'error' : ''}`}
                  placeholder="250.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <label>Description *</label>
            <textarea
              rows="3"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe the hotel atmosphere, suites, features, and dining options..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* Location & Coordinates */}
          <div className="location-box">
            <div className="location-box-header">
              <label><MapPin size={16} /> Location & Map Coordinates *</label>
              <button
                type="button"
                className="btn-geolocation"
                onClick={handleGetLocation}
                title="Detect location using Browser Geolocation API"
              >
                <Navigation size={14} /> Detect My Location
              </button>
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Location City / State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Goa, India"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Latitude *</label>
                <input
                  type="number"
                  step="any"
                  className={`form-input ${errors.latitude ? 'error' : ''}`}
                  placeholder="e.g. 15.2993"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
                {errors.latitude && <span className="error-text">{errors.latitude}</span>}
              </div>

              <div className="form-field">
                <label>Longitude *</label>
                <input
                  type="number"
                  step="any"
                  className={`form-input ${errors.longitude ? 'error' : ''}`}
                  placeholder="e.g. 74.1240"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
                {errors.longitude && <span className="error-text">{errors.longitude}</span>}
              </div>
            </div>
          </div>

          {/* Amenities & Rating */}
          <div className="form-grid-2">
            <div className="form-field">
              <label>Amenities (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="WiFi, Pool, Spa, Ocean View"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Rating (1 to 5 Stars)</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">5.0 ★★★★★ Exceptional</option>
                <option value="4.8">4.8 ★★★★★ Superb</option>
                <option value="4.5">4.5 ★★★★☆ Excellent</option>
                <option value="4.0">4.0 ★★★★☆ Very Good</option>
                <option value="3.5">3.5 ★★★☆☆ Good</option>
              </select>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => dispatch(closeFormModal())}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {formMode === 'add' ? 'Create Hotel Listing' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
