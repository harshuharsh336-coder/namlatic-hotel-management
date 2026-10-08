import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchTitle,
  setMinPrice,
  setMaxPrice,
  setBudgetPreset,
  setSelectedRating,
  toggleAmenity,
  resetFilters
} from '../redux/hotelSlice';
import { Filter, RotateCcw, Star, DollarSign, Search, CheckSquare, Tag, PiggyBank } from 'lucide-react';

export default function SidebarFilter() {
  const dispatch = useDispatch();
  const {
    searchTitle,
    minPrice,
    maxPrice,
    activeBudgetCategory,
    selectedRating,
    selectedAmenities,
    allHotels
  } = useSelector(state => state.hotels);

  const availableAmenities = ['Pool', 'Spa', 'WiFi', 'Ocean View', 'Breakfast', 'Trekking', 'Jacuzzi'];

  // Example hotel names for instant selection
  const exampleHotels = [
    'Grand Palace',
    'Ocean Palm',
    'Heritage Royal',
    'Misty Mountains',
    'Skyline Metropolis',
    'Lakeside Serenity'
  ];

  return (
    <aside className="sidebar-filter-card">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filters & Budget</h3>
        </div>
        <button 
          className="btn-reset-filters" 
          onClick={() => dispatch(resetFilters())}
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Hotel Name Search with Example Chips */}
      <div className="filter-group">
        <label className="filter-label">
          <Search size={15} /> Search Hotel Name
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="e.g. Grand Palace, Misty..."
          value={searchTitle}
          onChange={(e) => dispatch(setSearchTitle(e.target.value))}
        />

        {/* Quick Example Hotel Chips */}
        <div className="example-hotels-wrapper">
          <span className="example-label"><Tag size={12} /> Example Hotels:</span>
          <div className="example-chips-container">
            {exampleHotels.map(name => (
              <button
                key={name}
                type="button"
                className={`example-chip ${searchTitle === name ? 'active' : ''}`}
                onClick={() => dispatch(setSearchTitle(searchTitle === name ? '' : name))}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Selector Category Pills */}
      <div className="filter-group budget-category-group">
        <label className="filter-label">
          <PiggyBank size={15} /> Select Budget Category
        </label>
        <div className="budget-pills-grid">
          <button
            type="button"
            className={`budget-pill ${activeBudgetCategory === 'all' ? 'active' : ''}`}
            onClick={() => dispatch(setBudgetPreset('all'))}
          >
            All Prices
          </button>
          <button
            type="button"
            className={`budget-pill budget-green ${activeBudgetCategory === 'budget' ? 'active' : ''}`}
            onClick={() => dispatch(setBudgetPreset('budget'))}
          >
            Budget (&lt; $190)
          </button>
          <button
            type="button"
            className={`budget-pill budget-blue ${activeBudgetCategory === 'mid' ? 'active' : ''}`}
            onClick={() => dispatch(setBudgetPreset('mid'))}
          >
            Mid-Range ($190-$270)
          </button>
          <button
            type="button"
            className={`budget-pill budget-purple ${activeBudgetCategory === 'luxury' ? 'active' : ''}`}
            onClick={() => dispatch(setBudgetPreset('luxury'))}
          >
            Luxury ($270+)
          </button>
        </div>
      </div>

      {/* Custom Price Range Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <DollarSign size={15} /> Custom Price Range ($/night)
        </label>
        
        <div className="price-inputs-row">
          <div className="price-input-wrapper">
            <span className="unit">$</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => dispatch(setMinPrice(e.target.value))}
            />
          </div>
          <span className="dash">-</span>
          <div className="price-input-wrapper">
            <span className="unit">$</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => dispatch(setMaxPrice(e.target.value))}
            />
          </div>
        </div>

        {/* Quick Amount Selector Slider */}
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={maxPrice || 500}
          onChange={(e) => dispatch(setMaxPrice(e.target.value))}
          className="price-slider"
        />
        <div className="range-marks">
          <span onClick={() => dispatch(setMaxPrice('150'))} style={{ cursor: 'pointer' }}>$150</span>
          <span onClick={() => dispatch(setMaxPrice('250'))} style={{ cursor: 'pointer' }}>$250</span>
          <span onClick={() => dispatch(setMaxPrice('500'))} style={{ cursor: 'pointer' }}>$500+</span>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <Star size={15} /> Star Rating
        </label>
        <div className="rating-options">
          {[5, 4, 3, 2].map((stars) => (
            <button
              key={stars}
              type="button"
              className={`rating-pill ${selectedRating === stars ? 'active' : ''}`}
              onClick={() => dispatch(setSelectedRating(selectedRating === stars ? null : stars))}
            >
              <span>{stars}</span>
              <Star size={12} className="star-filled" />
              <span className="plus-sign">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <CheckSquare size={15} /> Amenities
        </label>
        <div className="amenities-list">
          {availableAmenities.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label key={amenity} className="amenity-checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => dispatch(toggleAmenity(amenity))}
                />
                <span className="checkbox-custom"></span>
                <span className="amenity-name">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
