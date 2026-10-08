import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, Home, SlidersHorizontal } from 'lucide-react';

export default function BannerSection() {
  const totalItems = useSelector(state => state.hotels.totalItems);
  const searchTitle = useSelector(state => state.hotels.searchTitle);

  return (
    <section className="banner-section">
      <div className="container banner-container">
        {/* Breadcrumb Links */}
        <div className="breadcrumbs">
          <span className="crumb-item"><Home size={14} /> Home</span>
          <ChevronRight size={14} className="crumb-separator" />
          <span className="crumb-item">Hotels & Resorts</span>
          <ChevronRight size={14} className="crumb-separator" />
          <span className="crumb-item active">Search Results</span>
        </div>

        <div className="banner-header-content">
          <div>
            <h1 className="banner-title">Luxury Hotels & Stays</h1>
            <p className="banner-subtitle">
              Discover top-rated destinations, view interactive maps, and manage hotel listings effortlessy.
            </p>
          </div>
          <div className="banner-badge">
            <SlidersHorizontal size={16} />
            <span>{totalItems} Available Stays</span>
            {searchTitle && <span className="query-tag">"{searchTitle}"</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
