import React from 'react';
import { useDispatch } from 'react-redux';
import { openEditModal, openDeleteModal, openDetailModal } from '../redux/hotelSlice';
import { openAddBookingModal } from '../redux/bookingSlice';
import { Star, MapPin, Edit3, Trash2, Eye, ShieldCheck, Tag, CalendarCheck } from 'lucide-react';

export default function HotelCard({ hotel, viewMode }) {
  const dispatch = useDispatch();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(Number(rating) || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={i < fullStars ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  // Price-a safe-a number-a maathura helper
  const safePrice = Number(hotel.price || 0).toFixed(2);
  const safeRating = Number(hotel.rating || 0).toFixed(1);

  if (viewMode === 'grid') {
    return (
      <div className="hotel-card grid-card">
        <div className="card-image-wrapper">
          <img src={hotel.image} alt={hotel.title} className="card-image" />
          <span className="price-tag-badge">${safePrice} <small>/ night</small></span>
          <div className="rating-top-badge">
            <Star size={12} className="star-filled" />
            <span>{safeRating}</span>
          </div>
        </div>

        <div className="card-body">
          <h3 className="card-title" onClick={() => dispatch(openDetailModal(hotel))}>
            {hotel.title}
          </h3>

          <div className="card-location">
            <MapPin size={14} className="location-icon" />
            <span>{hotel.locationName || `${hotel.latitude}°N, ${hotel.longitude}°E`}</span>
          </div>

          <p className="card-description-snippet">
            {hotel.description && hotel.description.length > 80
              ? `${hotel.description.substring(0, 80)}...`
              : hotel.description}
          </p>

          <div className="card-amenities-row">
            {hotel.amenities && hotel.amenities.slice(0, 3).map((item, idx) => (
              <span key={idx} className="amenity-chip">{item}</span>
            ))}
          </div>

          <div className="card-actions-row">
            <button
              className="btn-card-action book-btn"
              onClick={() => dispatch(openAddBookingModal(hotel))}
            >
              <CalendarCheck size={14} /> Book Stay
            </button>
            <button
              className="btn-card-action view-btn"
              onClick={() => dispatch(openDetailModal(hotel))}
            >
              <Eye size={14} /> Details
            </button>
            <button
              className="btn-icon-action edit-btn"
              onClick={() => dispatch(openEditModal(hotel))}
              title="Edit Hotel"
            >
              <Edit3 size={15} />
            </button>
            <button
              className="btn-icon-action delete-btn"
              onClick={() => dispatch(openDeleteModal(hotel.id))}
              title="Delete Hotel"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Horizontal / List View Card
  return (
    <div className="hotel-card list-card">
      <div className="list-image-container">
        <img src={hotel.image} alt={hotel.title} className="list-image" />
        <span className="free-shipping-tag">
          <ShieldCheck size={12} /> Best Price Guaranteed
        </span>
      </div>

      <div className="list-content-middle">
        <div className="list-title-row">
          <h3 className="list-title" onClick={() => dispatch(openDetailModal(hotel))}>
            {hotel.title}
          </h3>
        </div>

        <div className="list-rating-row">
          <div className="stars-wrapper">{renderStars(hotel.rating)}</div>
          <span className="rating-number">{safeRating}</span>
          <span className="reviews-count">(124 reviews)</span>
        </div>

        <div className="list-location-pill">
          <MapPin size={14} className="location-icon" />
          <span>{hotel.locationName || `${hotel.latitude}° N, ${hotel.longitude}° E`}</span>
        </div>

        <p className="list-description-snippet">{hotel.description}</p>

        <div className="list-amenities-row">
          {hotel.amenities && hotel.amenities.map((item, idx) => (
            <span key={idx} className="amenity-chip">{item}</span>
          ))}
        </div>
      </div>

      <div className="list-right-actions">
        <div className="price-display-block">
          <div className="price-amount">${safePrice}</div>
          <div className="price-sub">Free Cancellation</div>
        </div>

        <div className="list-buttons-group">
          <button
            className="btn-list-book"
            onClick={() => dispatch(openAddBookingModal(hotel))}
          >
            <CalendarCheck size={16} /> Book Now
          </button>

          <button
            className="btn-list-primary"
            onClick={() => dispatch(openDetailModal(hotel))}
          >
            <Eye size={15} /> Details
          </button>

          <div className="icon-buttons-pair">
            <button
              className="btn-list-secondary edit"
              onClick={() => dispatch(openEditModal(hotel))}
              title="Edit details"
            >
              <Edit3 size={15} /> Edit
            </button>
            <button
              className="btn-list-secondary delete"
              onClick={() => dispatch(openDeleteModal(hotel.id))}
              title="Delete listing"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}