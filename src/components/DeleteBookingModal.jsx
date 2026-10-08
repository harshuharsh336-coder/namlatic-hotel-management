import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteBookingModal, deleteBooking } from '../redux/bookingSlice';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteBookingModal() {
  const dispatch = useDispatch();
  const { isDeleteModalOpen, bookingToDeleteId, allBookings } = useSelector(state => state.bookings);

  if (!isDeleteModalOpen || !bookingToDeleteId) return null;

  const targetBooking = allBookings.find(b => b.id === bookingToDeleteId);

  const handleDelete = () => {
    dispatch(deleteBooking(bookingToDeleteId));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container delete-modal">
        <div className="delete-modal-header">
          <div className="alert-icon-wrapper">
            <AlertTriangle size={24} className="alert-icon" />
          </div>
          <h3>Confirm Cancellation</h3>
          <button className="close-modal-btn" onClick={() => dispatch(closeDeleteBookingModal())}>
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p>
            Are you sure you want to cancel and delete reservation{' '}
            <strong>{targetBooking ? targetBooking.bookingRef : ''}</strong>
            {targetBooking ? ` for ${targetBooking.guestName}` : ''}?
          </p>
          <p className="delete-warning-text">
            This action cannot be undone and will remove the record from your reservations database.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => dispatch(closeDeleteBookingModal())}>
            Keep Reservation
          </button>
          <button className="btn-confirm-delete" onClick={handleDelete}>
            <Trash2 size={16} /> Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
