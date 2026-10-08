import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, setSortBy, setViewMode, openAddModal, resetFilters } from './redux/hotelSlice';
import Navbar from './components/Navbar';
import BannerSection from './components/BannerSection';
import SidebarFilter from './components/SidebarFilter';
import HotelCard from './components/HotelCard';
import Pagination from './components/Pagination';
import HotelFormModal from './components/HotelFormModal';
import HotelDetailModal from './components/HotelDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import BookingList from './components/BookingList';
import BookingFormModal from './components/BookingFormModal';
import BookingDetailModal from './components/BookingDetailModal';
import DeleteBookingModal from './components/DeleteBookingModal';

import ToastNotification from './components/ToastNotification';
import { LayoutList, LayoutGrid, PlusCircle, ArrowUpDown, Hotel, RefreshCw, Send, MapPin, Building2, Calendar } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const {
    displayedHotels,
    totalItems,
    sortBy,
    viewMode
  } = useSelector(state => state.hotels);

  const activeTab = useSelector(state => state.bookings.activeTab);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      <ToastNotification />

      {/* Top Navbar Header */}
      <Navbar />

      {/* Blue Banner Section matching sample screenshot */}
      <BannerSection />

      {/* Main Container */}
      <main className="main-content-area">
        {activeTab === 'hotels' ? (
          <div className="container app-grid-container">
            {/* Left Column: Sidebar Filters */}
            <div className="grid-sidebar">
              <SidebarFilter />
            </div>

            {/* Right Column: Hotel Listings */}
            <div className="grid-main-list">
              {/* Top Toolbar Bar */}
              <div className="list-top-toolbar">
                <div className="items-count-text">
                  <strong>{totalItems}</strong> {totalItems === 1 ? 'Hotel' : 'Hotels'} Found
                </div>

                <div className="toolbar-controls">
                  {/* Sort Dropdown */}
                  <div className="sort-wrapper">
                    <ArrowUpDown size={14} className="sort-icon" />
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => dispatch(setSortBy(e.target.value))}
                    >
                      <option value="default">Sort by: Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Guest Rating: High to Low</option>
                      <option value="title">Hotel Name (A-Z)</option>
                    </select>
                  </div>

                  {/* Grid / List View Toggle */}
                  <div className="view-mode-toggle">
                    <button
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => dispatch(setViewMode('list'))}
                      title="List View"
                    >
                      <LayoutList size={16} />
                    </button>
                    <button
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => dispatch(setViewMode('grid'))}
                      title="Grid View"
                    >
                      <LayoutGrid size={16} />
                    </button>
                  </div>

                  {/* Add Hotel Button */}
                  <button
                    className="btn-toolbar-add"
                    onClick={() => dispatch(openAddModal())}
                  >
                    <PlusCircle size={16} />
                    <span>+ Add Hotel</span>
                  </button>
                </div>
              </div>

              {/* List / Grid Display */}
              {displayedHotels.length > 0 ? (
                <div className={viewMode === 'grid' ? 'hotels-grid-layout' : 'hotels-list-layout'}>
                  {displayedHotels.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="empty-state-card">
                  <Hotel size={48} className="empty-icon" />
                  <h3>No Hotels Found</h3>
                  <p>No listings match your search criteria. Try adjusting or resetting your filters.</p>
                  <button className="btn-reset-empty" onClick={() => dispatch(resetFilters())}>
                    <RefreshCw size={16} /> Reset All Filters
                  </button>
                </div>
              )}

              {/* Pagination Component */}
              <Pagination />
            </div>
          </div>
        ) : (
          <div className="container bookings-main-view">
            <BookingList />
          </div>
        )}
      </main>

      {/* Hotel Modals */}
      <HotelFormModal />
      <HotelDetailModal />
      <DeleteConfirmModal />

      {/* Booking Modals */}
      <BookingFormModal />
      <BookingDetailModal />
      <DeleteBookingModal />

      {/* Footer */}
      <footer className="footer-section">
        <div className="container footer-top">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Building2 size={24} />
              <span>NamlaTech HotelHub</span>
            </div>
            <p className="footer-desc">
              Premier hotel management and booking platform. Discover best luxury stays with real-time location mapping.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Featured Hotels</a></li>
              <li><a href="#map">Interactive Maps</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support & Help</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#refunds">Cancellation Terms</a></li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4>Newsletter</h4>
            <p>Get exclusive travel deals and luxury hotel discounts straight to your inbox.</p>
            <div className="newsletter-box">
              <input type="email" placeholder="Your email address" />
              <button className="btn-newsletter">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-flex">
            <p>© 2026 HotelHub • NamlaTech India Private Limited. All rights reserved.</p>
            <div className="footer-bottom-links">
              <span>Privacy</span>
              <span>•</span>
              <span>Security</span>
              <span>•</span>
              <span>Sitemap</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

