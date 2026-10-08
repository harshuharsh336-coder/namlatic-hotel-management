import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeBookingDetailModal, openEditBookingModal, openDeleteBookingModal } from '../redux/bookingSlice';
import HotelMap from './HotelMap';
import { X, Calendar, User, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2, Clock, XCircle, CheckCheck, Edit3, Trash2, Printer } from 'lucide-react';

export default function BookingDetailModal() {
  const dispatch = useDispatch();
  const { isDetailModalOpen, selectedBooking } = useSelector(state => state.bookings);
  const { allHotels } = useSelector(state => state.hotels);

  if (!isDetailModalOpen || !selectedBooking) return null;

  // Match hotel geolocation if available
  const associatedHotel = allHotels.find(h => String(h.id) === String(selectedBooking.hotelId)) || {
    latitude: 12.9716,
    longitude: 77.5946
  };

  const getStatusBadge = (bStatus) => {
    switch (bStatus) {
      case 'Confirmed':
        return <span className="status-badge status-confirmed"><CheckCircle2 size={13} /> Confirmed</span>;
      case 'Pending':
        return <span className="status-badge status-pending"><Clock size={13} /> Pending Approval</span>;
      case 'Cancelled':
        return <span className="status-badge status-cancelled"><XCircle size={13} /> Cancelled</span>;
      case 'Completed':
        return <span className="status-badge status-completed"><CheckCheck size={13} /> Completed</span>;
      default:
        return <span className="status-badge">{bStatus}</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container detail-modal booking-detail-view">
        <button
          className="close-modal-btn floating-close"
          onClick={() => dispatch(closeBookingDetailModal())}
        >
          <X size={22} />
        </button>

        {/* Hero banner */}
        <div className="detail-banner-hero">
          <img src={selectedBooking.hotelImage} alt={selectedBooking.hotelTitle} className="detail-hero-img" />
          <div className="detail-hero-overlay">
            <div className="hero-top-tags">
              <span className="hero-booking-ref">{selectedBooking.bookingRef}</span>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="hero-title-box">
              <h2>{selectedBooking.hotelTitle}</h2>
              <div className="hero-location-sub">
                <MapPin size={16} />
                <span>{selectedBooking.hotelLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main detail layout */}
        <div className="detail-body-grid">
          <div className="detail-left-info">
            {/* Voucher Receipt Box */}
            <div className="voucher-card shadow-sm">
              <div className="voucher-header">
                <h3><ShieldCheck size={18} /> Official Reservation Voucher</h3>
                <span className="voucher-status-chip">{selectedBooking.status}</span>
              </div>

              <div className="voucher-row-grid">
                <div className="voucher-field">
                  <small><User size={13} /> Primary Guest</small>
                  <strong>{selectedBooking.guestName}</strong>
                </div>

                <div className="voucher-field">
                  <small><Mail size={13} /> Email</small>
                  <strong>{selectedBooking.guestEmail}</strong>
                </div>

                {selectedBooking.guestPhone && (
                  <div className="voucher-field">
                    <small><Phone size={13} /> Phone</small>
                    <strong>{selectedBooking.guestPhone}</strong>
                  </div>
                )}

                <div className="voucher-field">
                  <small><Building size={13} /> Room Category</small>
                  <strong>{selectedBooking.roomType}</strong>
                </div>

                <div className="voucher-field">
                  <small>Guests Count</small>
                  <strong>{selectedBooking.guestsCount} Guest(s)</strong>
                </div>

                <div className="voucher-field">
                  <small>Created Date</small>
                  <strong>{selectedBooking.createdAt ? selectedBooking.createdAt.substring(0, 10) : '2026-10-01'}</strong>
                </div>
              </div>

              {/* Dates Box */}
              <div className="voucher-dates-banner">
                <div className="v-date">
                  <span>CHECK-IN</span>
                  <strong>{selectedBooking.checkIn}</strong>
                </div>
                <div className="v-nights-pill">{selectedBooking.nights} Night(s)</div>
                <div className="v-date text-right">
                  <span>CHECK-OUT</span>
                  <strong>{selectedBooking.checkOut}</strong>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div className="voucher-requests">
                  <small>Special Requests / Instructions:</small>
                  <p>"{selectedBooking.specialRequests}"</p>
                </div>
              )}
            </div>

            {/* Financial Invoice Breakdown */}
            <div className="detail-section invoice-section">
              <h3>Payment & Billing Details</h3>
              <div className="invoice-table">
                <div className="invoice-row">
                  <span>Room Rate (${selectedBooking.pricePerNight} × {selectedBooking.nights} nights)</span>
                  <strong>${(selectedBooking.pricePerNight * selectedBooking.nights).toFixed(2)}</strong>
                </div>
                <div className="invoice-row">
                  <span>Taxes & Service Fees (Included)</span>
                  <strong>$0.00</strong>
                </div>
                <div className="invoice-row total-row">
                  <span>Total Amount Paid</span>
                  <span className="total-amount">${selectedBooking.totalPrice ? selectedBooking.totalPrice.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Map & Actions Column */}
          <div className="detail-right-map-column">
            <div className="map-card-wrapper">
              <h3><MapPin size={18} /> Hotel Location Map</h3>
              <div className="detail-map-container">
                <HotelMap
                  latitude={associatedHotel.latitude || 12.9716}
                  longitude={associatedHotel.longitude || 77.5946}
                  title={selectedBooking.hotelTitle}
                  locationName={selectedBooking.hotelLocation}
                  price={selectedBooking.pricePerNight}
                />
              </div>
            </div>

            <div className="detail-action-buttons">
              <button
                className="btn-edit-detail"
                onClick={() => {
                  dispatch(closeBookingDetailModal());
                  dispatch(openEditBookingModal(selectedBooking));
                }}
              >
                <Edit3 size={16} /> Edit Reservation
              </button>
              
              <button
                className="btn-print-voucher"
                onClick={handlePrint}
              >
                <Printer size={16} /> Print Voucher
              </button>

              <button
                className="btn-delete-detail"
                onClick={() => {
                  dispatch(closeBookingDetailModal());
                  dispatch(openDeleteBookingModal(selectedBooking.id));
                }}
              >
                <Trash2 size={16} /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
