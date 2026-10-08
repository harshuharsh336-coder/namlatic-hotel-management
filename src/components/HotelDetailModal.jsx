import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDetailModal, openEditModal, openDeleteModal } from '../redux/hotelSlice';
import { openAddBookingModal } from '../redux/bookingSlice';
import HotelMap from './HotelMap';
import { X, MapPin, Star, DollarSign, ShieldCheck, Edit3, Trash2, CalendarCheck } from 'lucide-react';

export default function HotelDetailModal() {
  const dispatch = useDispatch();
  const { isDetailModalOpen, selectedHotel } = useSelector(state => state.hotels);

  if (!isDetailModalOpen || !selectedHotel) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container detail-modal">
        <button 
          className="close-modal-btn floating-close" 
          onClick={() => dispatch(closeDetailModal())}
        >
          <X size={22} />
        </button>

        <div className="detail-banner-hero">
          <img src={selectedHotel.image} alt={selectedHotel.title} className="detail-hero-img" />
          <div className="detail-hero-overlay">
            <span className="hero-price-chip">${selectedHotel.price} <small>/ night</small></span>
            <div className="hero-title-box">
              <h2>{selectedHotel.title}</h2>
              <div className="hero-location-sub">
                <MapPin size={16} />
                <span>{selectedHotel.locationName || `${selectedHotel.latitude}° N, ${selectedHotel.longitude}° E`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-body-grid">
          <div className="detail-left-info">
            <div className="detail-rating-card">
              <div className="rating-left">
                <span className="big-rating">{selectedHotel.rating}</span>
                <div className="stars-stack">
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(selectedHotel.rating) ? 'star-filled' : 'star-empty'} />
                    ))}
                  </div>
                  <span className="rating-desc">Guest Review Rating</span>
                </div>
              </div>

              <div className="badge-verified">
                <ShieldCheck size={18} />
                <span>Verified Stay Listing</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>About this Hotel</h3>
              <p className="detail-description">{selectedHotel.description}</p>
            </div>

            <div className="detail-section">
              <h3>Popular Amenities</h3>
              <div className="detail-amenities-tags">
                {selectedHotel.amenities && selectedHotel.amenities.map((item, idx) => (
                  <span key={idx} className="detail-amenity-pill">✓ {item}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Coordinates & Geolocation Data</h3>
              <div className="coordinates-info-box">
                <div>
                  <strong>Latitude:</strong> <code>{selectedHotel.latitude}</code>
                </div>
                <div>
                  <strong>Longitude:</strong> <code>{selectedHotel.longitude}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Right Map & Action Column */}
          <div className="detail-right-map-column">
            <div className="map-card-wrapper">
              <h3><MapPin size={18} /> Interactive Map Location</h3>
              <div className="detail-map-container">
                <HotelMap
                  latitude={selectedHotel.latitude}
                  longitude={selectedHotel.longitude}
                  title={selectedHotel.title}
                  locationName={selectedHotel.locationName}
                  price={selectedHotel.price}
                />
              </div>
            </div>

            <div className="detail-action-buttons">
              <button 
                className="btn-book-detail-hero"
                onClick={() => {
                  dispatch(closeDetailModal());
                  dispatch(openAddBookingModal(selectedHotel));
                }}
              >
                <CalendarCheck size={18} /> Book This Hotel Now
              </button>

              <button 
                className="btn-edit-detail"
                onClick={() => {
                  dispatch(closeDetailModal());
                  dispatch(openEditModal(selectedHotel));
                }}
              >
                <Edit3 size={16} /> Edit Hotel Listing
              </button>

              <button 
                className="btn-delete-detail"
                onClick={() => {
                  dispatch(closeDetailModal());
                  dispatch(openDeleteModal(selectedHotel.id));
                }}
              >
                <Trash2 size={16} /> Delete Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
