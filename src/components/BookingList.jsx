import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookings,
  setStatusFilter,
  setBookingSearchQuery,
  openAddBookingModal,
  openEditBookingModal,
  openBookingDetailModal,
  openDeleteBookingModal
} from '../redux/bookingSlice';
import {
  Calendar,
  Search,
  PlusCircle,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  CheckCheck,
  User,
  Phone,
  Mail,
  Building,
  DollarSign
} from 'lucide-react';

export default function BookingList() {
  const dispatch = useDispatch();
  const {
    allBookings,
    displayedBookings,
    statusFilter,
    searchQuery,
    status
  } = useSelector(state => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Calculate summary metrics
  const totalBookings = allBookings.length;
  const confirmedCount = allBookings.filter(b => b.status === 'Confirmed').length;
  const pendingCount = allBookings.filter(b => b.status === 'Pending').length;
  const totalRevenue = allBookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const getStatusBadge = (bStatus) => {
    switch (bStatus) {
      case 'Confirmed':
        return (
          <span className="status-badge status-confirmed">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="status-badge status-pending">
            <Clock size={13} /> Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-badge status-cancelled">
            <XCircle size={13} /> Cancelled
          </span>
        );
      case 'Completed':
        return (
          <span className="status-badge status-completed">
            <CheckCheck size={13} /> Completed
          </span>
        );
      default:
        return <span className="status-badge">{bStatus}</span>;
    }
  };

  return (
    <div className="bookings-dashboard">
      {/* Header Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card shadow-sm">
          <div className="metric-icon bg-blue">
            <Calendar size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Reservations</span>
            <h3 className="metric-value">{totalBookings}</h3>
          </div>
        </div>

        <div className="metric-card shadow-sm">
          <div className="metric-icon bg-green">
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Confirmed Stays</span>
            <h3 className="metric-value">{confirmedCount}</h3>
          </div>
        </div>

        <div className="metric-card shadow-sm">
          <div className="metric-icon bg-orange">
            <Clock size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Pending Approval</span>
            <h3 className="metric-value">{pendingCount}</h3>
          </div>
        </div>

        <div className="metric-card shadow-sm">
          <div className="metric-icon bg-purple">
            <DollarSign size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Revenue</span>
            <h3 className="metric-value">${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="booking-toolbar">
        {/* Status Filter Tabs */}
        <div className="status-tabs">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${statusFilter === tab ? 'active' : ''}`}
              onClick={() => dispatch(setStatusFilter(tab))}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Add New Booking */}
        <div className="toolbar-right-group">
          <div className="booking-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search guest name, reference, email..."
              value={searchQuery}
              onChange={(e) => dispatch(setBookingSearchQuery(e.target.value))}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => dispatch(setBookingSearchQuery(''))}
              >
                ✕
              </button>
            )}
          </div>

          <button
            className="btn-create-booking"
            onClick={() => dispatch(openAddBookingModal())}
          >
            <PlusCircle size={16} />
            <span>+ New Reservation</span>
          </button>
        </div>
      </div>

      {/* Bookings List Cards */}
      {displayedBookings.length > 0 ? (
        <div className="bookings-list-container">
          {displayedBookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-card-left">
                <img src={b.hotelImage} alt={b.hotelTitle} className="booking-hotel-img" />
                <div className="booking-ref-tag">{b.bookingRef}</div>
              </div>

              <div className="booking-card-mid">
                <div className="booking-header-line">
                  <h3 className="booking-hotel-name" onClick={() => dispatch(openBookingDetailModal(b))}>
                    {b.hotelTitle}
                  </h3>
                  {getStatusBadge(b.status)}
                </div>

                <div className="booking-location-text">
                  <Building size={14} /> {b.hotelLocation} • <span className="room-type-text">{b.roomType}</span>
                </div>

                <div className="guest-info-row">
                  <span><User size={14} /> <strong>{b.guestName}</strong> ({b.guestsCount} {b.guestsCount === 1 ? 'Guest' : 'Guests'})</span>
                  <span><Mail size={14} /> {b.guestEmail}</span>
                  {b.guestPhone && <span><Phone size={14} /> {b.guestPhone}</span>}
                </div>

                <div className="dates-pill-row">
                  <div className="date-box">
                    <small>Check-In</small>
                    <strong>{b.checkIn}</strong>
                  </div>
                  <div className="arrow-sep">➔</div>
                  <div className="date-box">
                    <small>Check-Out</small>
                    <strong>{b.checkOut}</strong>
                  </div>
                  <span className="nights-badge">{b.nights} {b.nights === 1 ? 'Night' : 'Nights'}</span>
                </div>
              </div>

              <div className="booking-card-right">
                <div className="booking-price-block">
                  <small>Total Amount</small>
                  <div className="price-val">${b.totalPrice ? b.totalPrice.toFixed(2) : '0.00'}</div>
                  <small className="per-night-sub">${b.pricePerNight} / night</small>
                </div>

                <div className="booking-actions-group">
                  <button
                    className="btn-booking-action view"
                    onClick={() => dispatch(openBookingDetailModal(b))}
                    title="View Receipt & Details"
                  >
                    <Eye size={15} /> Details
                  </button>

                  <button
                    className="btn-booking-action edit"
                    onClick={() => dispatch(openEditBookingModal(b))}
                    title="Edit Reservation"
                  >
                    <Edit3 size={15} /> Edit
                  </button>

                  <button
                    className="btn-booking-action delete"
                    onClick={() => dispatch(openDeleteBookingModal(b.id))}
                    title="Cancel Booking"
                  >
                    <Trash2 size={15} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-bookings-card">
          <Calendar size={48} className="empty-icon" />
          <h3>No Reservations Found</h3>
          <p>No bookings match the current filter or search criteria.</p>
          <button
            className="btn-create-first"
            onClick={() => dispatch(openAddBookingModal())}
          >
            <PlusCircle size={16} /> Create First Reservation
          </button>
        </div>
      )}
    </div>
  );
}
