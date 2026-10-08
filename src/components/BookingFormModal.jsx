import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeBookingFormModal, createBooking, updateBooking } from '../redux/bookingSlice';
import { X, Calendar, User, Mail, Phone, Building, DollarSign, Sparkles, FileText } from 'lucide-react';

export default function BookingFormModal() {
  const dispatch = useDispatch();
  const { isFormModalOpen, formMode, editingBooking, preselectedHotel } = useSelector(state => state.bookings);
  const { allHotels } = useSelector(state => state.hotels);

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomType, setRoomType] = useState('Deluxe Suite');
  const [specialRequests, setSpecialRequests] = useState('');
  const [status, setStatus] = useState('Confirmed');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isFormModalOpen) return;

    if (formMode === 'edit' && editingBooking) {
      setSelectedHotelId(editingBooking.hotelId || '');
      setGuestName(editingBooking.guestName || '');
      setGuestEmail(editingBooking.guestEmail || '');
      setGuestPhone(editingBooking.guestPhone || '');
      setCheckIn(editingBooking.checkIn || '');
      setCheckOut(editingBooking.checkOut || '');
      setGuestsCount(editingBooking.guestsCount || 2);
      setRoomType(editingBooking.roomType || 'Deluxe Suite');
      setSpecialRequests(editingBooking.specialRequests || '');
      setStatus(editingBooking.status || 'Confirmed');
    } else {
      // Add mode defaults
      const today = new Date().toISOString().split('T')[0];
      const next3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

      if (preselectedHotel) {
        setSelectedHotelId(preselectedHotel.id);
      } else if (allHotels && allHotels.length > 0) {
        setSelectedHotelId(allHotels[0].id);
      } else {
        setSelectedHotelId('');
      }

      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setCheckIn(today);
      setCheckOut(next3);
      setGuestsCount(2);
      setRoomType('Deluxe Suite');
      setSpecialRequests('');
      setStatus('Confirmed');
    }
    setErrors({});
  }, [isFormModalOpen, formMode, editingBooking, preselectedHotel, allHotels]);

  if (!isFormModalOpen) return null;

  // Selected hotel object
  const currentHotel = allHotels.find(h => String(h.id) === String(selectedHotelId)) || preselectedHotel || {
    id: 1,
    title: 'Grand Palace Resort & Spa',
    price: 320,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    locationName: 'Bengaluru, India'
  };

  // Calculate duration and total
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const calculatedNights = (!isNaN(dIn) && !isNaN(dOut) && dOut > dIn)
    ? Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24))
    : 1;

  const pricePerNight = currentHotel ? currentHotel.price : 150;
  const totalPrice = calculatedNights * pricePerNight;

  const validate = () => {
    const newErrors = {};

    if (!guestName.trim()) {
      newErrors.guestName = 'Guest full name is required.';
    }

    if (!guestEmail.trim()) {
      newErrors.guestEmail = 'Guest email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      newErrors.guestEmail = 'Please enter a valid email address.';
    }

    if (!checkIn) {
      newErrors.checkIn = 'Check-in date is required.';
    }

    if (!checkOut) {
      newErrors.checkOut = 'Check-out date is required.';
    } else if (new Date(checkOut) <= new Date(checkIn)) {
      newErrors.checkOut = 'Check-out date must be after check-in date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const bookingData = {
      hotelId: currentHotel.id,
      hotelTitle: currentHotel.title,
      hotelImage: currentHotel.image,
      hotelLocation: currentHotel.locationName || 'City Location',
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      checkIn,
      checkOut,
      nights: calculatedNights,
      guestsCount: Number(guestsCount),
      roomType,
      pricePerNight,
      totalPrice,
      specialRequests: specialRequests.trim(),
      status
    };

    if (formMode === 'add') {
      dispatch(createBooking(bookingData));
    } else {
      dispatch(updateBooking({ id: editingBooking.id, bookingData }));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container form-modal booking-modal-wide">
        <div className="modal-header bg-gradient-header">
          <div className="header-title">
            <Sparkles className="header-icon" size={20} />
            <h2>{formMode === 'add' ? 'Create Hotel Reservation' : 'Edit Booking Details'}</h2>
          </div>
          <button className="close-modal-btn" onClick={() => dispatch(closeBookingFormModal())}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Hotel Choice Card preview */}
          <div className="form-section hotel-picker-section">
            <label className="section-label"><Building size={16} /> Selected Hotel Stay *</label>
            <div className="hotel-select-preview-grid">
              <select
                className="form-select hotel-dropdown-select"
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
              >
                {allHotels.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.title} (${h.price}/night - {h.locationName || 'Location'})
                  </option>
                ))}
              </select>

              {currentHotel && (
                <div className="selected-hotel-mini-card">
                  <img src={currentHotel.image} alt={currentHotel.title} className="mini-thumb" />
                  <div className="mini-info">
                    <strong>{currentHotel.title}</strong>
                    <p>{currentHotel.locationName} • <span>${currentHotel.price}/night</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guest Information */}
          <div className="form-section">
            <label className="section-label"><User size={16} /> Guest Contact Information *</label>
            <div className="form-grid-3">
              <div className="form-field">
                <label>Guest Full Name *</label>
                <div className="input-with-icon">
                  <User size={15} className="input-icon" />
                  <input
                    type="text"
                    className={`form-input icon-padded ${errors.guestName ? 'error' : ''}`}
                    placeholder="e.g. Rahul Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
                {errors.guestName && <span className="error-text">{errors.guestName}</span>}
              </div>

              <div className="form-field">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={15} className="input-icon" />
                  <input
                    type="email"
                    className={`form-input icon-padded ${errors.guestEmail ? 'error' : ''}`}
                    placeholder="guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>
                {errors.guestEmail && <span className="error-text">{errors.guestEmail}</span>}
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={15} className="input-icon" />
                  <input
                    type="tel"
                    className="form-input icon-padded"
                    placeholder="+91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Duration Box */}
          <div className="dates-calculator-box">
            <div className="form-grid-3">
              <div className="form-field">
                <label><Calendar size={15} /> Check-In Date *</label>
                <input
                  type="date"
                  className={`form-input ${errors.checkIn ? 'error' : ''}`}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                {errors.checkIn && <span className="error-text">{errors.checkIn}</span>}
              </div>

              <div className="form-field">
                <label><Calendar size={15} /> Check-Out Date *</label>
                <input
                  type="date"
                  className={`form-input ${errors.checkOut ? 'error' : ''}`}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
                {errors.checkOut && <span className="error-text">{errors.checkOut}</span>}
              </div>

              <div className="form-field summary-calc-field">
                <label>Price & Nights Summary</label>
                <div className="live-price-pill">
                  <span><strong>{calculatedNights}</strong> Nights × ${pricePerNight}</span>
                  <span className="live-total">${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Details & Status */}
          <div className="form-grid-3">
            <div className="form-field">
              <label>Room Category</label>
              <select
                className="form-select"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Sea View">Executive Sea View</option>
                <option value="Royal Heritage Suite">Royal Heritage Suite</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>

            <div className="form-field">
              <label>Number of Guests</label>
              <select
                className="form-select"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests (Family)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Reservation Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Confirmed">✓ Confirmed</option>
                <option value="Pending">⏳ Pending Approval</option>
                <option value="Completed">★ Completed Stay</option>
                <option value="Cancelled">✕ Cancelled</option>
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div className="form-field">
            <label><FileText size={15} /> Special Requests / Notes</label>
            <textarea
              rows="2"
              className="form-textarea"
              placeholder="Airport transfer, high floor room, early check-in or dietary requests..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            ></textarea>
          </div>

          {/* Modal Footer Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => dispatch(closeBookingFormModal())}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit btn-submit-booking">
              {formMode === 'add' ? `Confirm & Reserve ($${totalPrice})` : 'Save Reservation Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
