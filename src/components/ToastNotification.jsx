import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../redux/hotelSlice';
import { clearBookingToast } from '../redux/bookingSlice';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastNotification() {
  const dispatch = useDispatch();
  const hotelToast = useSelector(state => state.hotels.toast);
  const bookingToast = useSelector(state => state.bookings.bookingToast);

  const activeToast = bookingToast || hotelToast;

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        if (bookingToast) dispatch(clearBookingToast());
        if (hotelToast) dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, hotelToast, bookingToast, dispatch]);

  if (!activeToast) return null;

  const handleClose = () => {
    if (bookingToast) dispatch(clearBookingToast());
    if (hotelToast) dispatch(clearToast());
  };

  return (
    <div className={`toast-notification ${activeToast.type || 'success'}`}>
      <div className="toast-icon">
        {activeToast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <div className="toast-message">{activeToast.message}</div>
      <button className="toast-close-btn" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
}
