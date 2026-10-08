import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../redux/hotelSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  const dispatch = useDispatch();
  const { currentPage, totalPages, totalItems, itemsPerPage, displayedHotels } = useSelector(
    state => state.hotels
  );

  if (totalPages <= 1 && totalItems === 0) return null;

  const startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        Showing <span>{startRange}</span> to <span>{endRange}</span> of <span>{totalItems}</span> hotels
      </div>

      <div className="pagination-controls">
        <button
          className="page-nav-btn"
          disabled={currentPage === 1}
          onClick={() => dispatch(setCurrentPage(currentPage - 1))}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <div className="page-numbers-list">
          {getPageNumbers().map(num => (
            <button
              key={num}
              className={`page-num-btn ${num === currentPage ? 'active' : ''}`}
              onClick={() => dispatch(setCurrentPage(num))}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          className="page-nav-btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => dispatch(setCurrentPage(currentPage + 1))}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
