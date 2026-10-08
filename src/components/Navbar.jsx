import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTitle, openAddModal } from '../redux/hotelSlice';
import { setActiveTab, openAddBookingModal } from '../redux/bookingSlice';
import { Building2, Search, PlusCircle, Heart, Bookmark, User, Calendar, Hotel } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const searchTitle = useSelector(state => state.hotels.searchTitle);
  const allHotels = useSelector(state => state.hotels.allHotels);
  const activeTab = useSelector(state => state.bookings.activeTab);
  const bookingsCount = useSelector(state => state.bookings.allBookings.length);

  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <header className="main-navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => dispatch(setActiveTab('hotels'))} style={{ cursor: 'pointer' }}>
          <div className="logo-badge">
            <Building2 className="logo-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-primary">NamlaTic</span>
            <span className="brand-sub">HotelHub</span>
          </div>
        </div>

        {/* View Switcher Navigation Tabs */}
        <nav className="nav-main-tabs">
          <button
            className={`nav-tab-item ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('hotels'))}
          >
            <Hotel size={16} />
            <span>Explore Hotels</span>
          </button>
          <button
            className={`nav-tab-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('bookings'))}
          >
            <Calendar size={16} />
            <span>Reservations</span>
            {bookingsCount > 0 && <span className="nav-badge-pill">{bookingsCount}</span>}
          </button>
        </nav>

        {/* Search Bar in Navbar with Autocomplete Suggestions */}
        {activeTab === 'hotels' && (
          <div className="nav-search-wrapper" onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowSuggestions(false);
            }
          }}>
            <div className="nav-search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search hotel names (e.g. Grand Palace, Misty...)"
                value={searchTitle}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  dispatch(setSearchTitle(e.target.value));
                  setShowSuggestions(true);
                }}
              />
              {searchTitle && (
                <button className="clear-search-btn" onClick={() => dispatch(setSearchTitle(''))}>
                  ✕
                </button>
              )}
            </div>

            {/* Example Hotel Autocomplete Suggestions Dropdown */}
            {showSuggestions && (
              <div className="search-suggestions-dropdown">
                <div className="suggestions-header">
                  <span>Suggested Hotel Names</span>
                  <small>Click to filter</small>
                </div>
                <div className="suggestions-list">
                  {allHotels
                    .filter(h => !searchTitle.trim() || h.title.toLowerCase().includes(searchTitle.toLowerCase()) || h.locationName.toLowerCase().includes(searchTitle.toLowerCase()))
                    .map(h => (
                      <div
                        key={h.id}
                        className="suggestion-item"
                        onMouseDown={() => {
                          dispatch(setSearchTitle(h.title));
                          setShowSuggestions(false);
                        }}
                      >
                        <img src={h.image} alt={h.title} className="suggestion-thumb" />
                        <div className="suggestion-info">
                          <strong className="suggestion-title">{h.title}</strong>
                          <span className="suggestion-sub">{h.locationName} • <strong>${h.price}</strong>/night</span>
                        </div>
                        <span className="suggestion-badge">${h.price}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions & User Links */}
        <div className="nav-actions">
          {activeTab === 'hotels' ? (
            <button 
              className="btn-add-hotel"
              onClick={() => dispatch(openAddModal())}
            >
              <PlusCircle size={18} />
              <span>Add Hotel</span>
            </button>
          ) : (
            <button 
              className="btn-add-hotel btn-add-booking-nav"
              onClick={() => dispatch(openAddBookingModal())}
            >
              <PlusCircle size={18} />
              <span>+ New Booking</span>
            </button>
          )}

          <div className="nav-user-links">
            <button className="user-profile-btn">
              <User size={18} />
              <span>Admin Account</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
