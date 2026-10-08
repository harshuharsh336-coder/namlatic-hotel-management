import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteModal, deleteHotel } from '../redux/hotelSlice';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal() {
  const dispatch = useDispatch();
  const { isDeleteModalOpen, hotelToDeleteId } = useSelector(state => state.hotels);

  if (!isDeleteModalOpen || !hotelToDeleteId) return null;

  const handleDelete = () => {
    dispatch(deleteHotel(hotelToDeleteId));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container delete-modal">
        <div className="delete-modal-header">
          <div className="alert-icon-wrapper">
            <AlertTriangle size={24} className="alert-icon" />
          </div>
          <h3>Confirm Delete</h3>
          <button className="close-modal-btn" onClick={() => dispatch(closeDeleteModal())}>
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p>
            Are you sure you want to delete this hotel listing? This action will permanently remove the record from the list.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => dispatch(closeDeleteModal())}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={handleDelete}>
            <Trash2 size={16} /> Yes, Delete Hotel
          </button>
        </div>
      </div>
    </div>
  );
}
