import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/bookings';

const initialSampleBookings = [
  {
    id: 101,
    bookingRef: 'BK-2026-8941',
    hotelId: 1,
    hotelTitle: 'Grand Palace Resort & Spa',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    hotelLocation: 'Bengaluru, India',
    guestName: 'Rahul Sharma',
    guestEmail: 'rahul.sharma@example.com',
    guestPhone: '+91 98765 43210',
    checkIn: '2026-10-10',
    checkOut: '2026-10-15',
    nights: 5,
    guestsCount: 2,
    roomType: 'Deluxe Suite',
    pricePerNight: 320,
    totalPrice: 1600,
    specialRequests: 'High floor room with balcony and pool view requested.',
    status: 'Confirmed',
    createdAt: '2026-10-01T10:30:00Z'
  },
  {
    id: 102,
    bookingRef: 'BK-2026-7312',
    hotelId: 2,
    hotelTitle: 'Ocean Palm Beach Boutique',
    hotelImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    hotelLocation: 'Goa, India',
    guestName: 'Ananya Roy',
    guestEmail: 'ananya.roy@example.com',
    guestPhone: '+91 91234 56789',
    checkIn: '2026-10-18',
    checkOut: '2026-10-21',
    nights: 3,
    guestsCount: 1,
    roomType: 'Executive Sea View',
    pricePerNight: 185,
    totalPrice: 555,
    specialRequests: 'Late check-in around 8 PM.',
    status: 'Pending',
    createdAt: '2026-10-02T14:15:00Z'
  },
  {
    id: 103,
    bookingRef: 'BK-2026-4409',
    hotelId: 3,
    hotelTitle: 'Heritage Royal Palace',
    hotelImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    hotelLocation: 'Jaipur, India',
    guestName: 'Vikramaditya Singh',
    guestEmail: 'vikram.singh@example.com',
    guestPhone: '+91 99887 76655',
    checkIn: '2026-11-05',
    checkOut: '2026-11-09',
    nights: 4,
    guestsCount: 3,
    roomType: 'Royal Heritage Suite',
    pricePerNight: 260,
    totalPrice: 1040,
    specialRequests: 'Airport pickup service needed.',
    status: 'Confirmed',
    createdAt: '2026-10-03T09:00:00Z'
  },
  {
    id: 104,
    bookingRef: 'BK-2026-1823',
    hotelId: 4,
    hotelTitle: 'Misty Mountains Eco Lodge',
    hotelImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    hotelLocation: 'Munnar, India',
    guestName: 'Priya Nair',
    guestEmail: 'priya.nair@example.com',
    guestPhone: '+91 94455 66778',
    checkIn: '2026-09-20',
    checkOut: '2026-09-23',
    nights: 3,
    guestsCount: 2,
    roomType: 'Mountain View Chalet',
    pricePerNight: 140,
    totalPrice: 420,
    specialRequests: 'Vegetarian meals preferred.',
    status: 'Completed',
    createdAt: '2026-09-15T11:20:00Z'
  }
];

// Async Thunks
export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (params = {}) => {
  try {
    const urlParams = new URLSearchParams();
    if (params.status && params.status !== 'All') urlParams.append('status', params.status);
    if (params.search) urlParams.append('search', params.search);

    const res = await fetch(`${API_URL}?${urlParams.toString()}`);
    if (!res.ok) throw new Error('API server unavailable');
    const data = await res.json();
    return data;
  } catch (err) {
    return { isFallback: true, params };
  }
});

export const createBooking = createAsyncThunk('bookings/createBooking', async (bookingData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    const data = await res.json();
    return data.data;
  } catch (err) {
    // Offline fallback creation
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))) || 1;
    const perNight = parseFloat(bookingData.pricePerNight) || 150;
    const refSuffix = Math.floor(1000 + Math.random() * 9000);

    return {
      id: Date.now(),
      bookingRef: `BK-2026-${refSuffix}`,
      hotelId: bookingData.hotelId,
      hotelTitle: bookingData.hotelTitle || 'Selected Hotel',
      hotelImage: bookingData.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      hotelLocation: bookingData.hotelLocation || 'City Location',
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone || '',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights,
      guestsCount: bookingData.guestsCount || 1,
      roomType: bookingData.roomType || 'Standard Room',
      pricePerNight: perNight,
      totalPrice: nights * perNight,
      specialRequests: bookingData.specialRequests || '',
      status: bookingData.status || 'Confirmed',
      createdAt: new Date().toISOString()
    };
  }
});

export const updateBooking = createAsyncThunk('bookings/updateBooking', async ({ id, bookingData }) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to update booking');
    const data = await res.json();
    return data.data;
  } catch (err) {
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))) || 1;
    const perNight = parseFloat(bookingData.pricePerNight) || 150;

    return {
      id,
      ...bookingData,
      nights,
      totalPrice: nights * perNight
    };
  }
});

export const deleteBooking = createAsyncThunk('bookings/deleteBooking', async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete booking');
    return id;
  } catch (err) {
    return id;
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    allBookings: initialSampleBookings,
    displayedBookings: initialSampleBookings,
    selectedBooking: null,
    status: 'idle',
    error: null,
    statusFilter: 'All', // 'All', 'Confirmed', 'Pending', 'Cancelled', 'Completed'
    searchQuery: '',
    activeTab: 'hotels', // 'hotels' | 'bookings'

    // Form Modal States
    isFormModalOpen: false,
    formMode: 'add', // 'add' | 'edit'
    editingBooking: null,
    preselectedHotel: null,

    // Detail & Delete Modals
    isDetailModalOpen: false,
    isDeleteModalOpen: false,
    bookingToDeleteId: null,

    // Notification toast
    bookingToast: null
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      bookingSlice.caseReducers.applyLocalBookingFilters(state);
    },
    setBookingSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      bookingSlice.caseReducers.applyLocalBookingFilters(state);
    },
    openAddBookingModal: (state, action) => {
      state.formMode = 'add';
      state.editingBooking = null;
      state.preselectedHotel = action.payload || null;
      state.isFormModalOpen = true;
    },
    openEditBookingModal: (state, action) => {
      state.formMode = 'edit';
      state.editingBooking = action.payload;
      state.preselectedHotel = null;
      state.isFormModalOpen = true;
    },
    closeBookingFormModal: (state) => {
      state.isFormModalOpen = false;
      state.editingBooking = null;
      state.preselectedHotel = null;
    },
    openBookingDetailModal: (state, action) => {
      state.selectedBooking = action.payload;
      state.isDetailModalOpen = true;
    },
    closeBookingDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.selectedBooking = null;
    },
    openDeleteBookingModal: (state, action) => {
      state.bookingToDeleteId = action.payload;
      state.isDeleteModalOpen = true;
    },
    closeDeleteBookingModal: (state) => {
      state.isDeleteModalOpen = false;
      state.bookingToDeleteId = null;
    },
    clearBookingToast: (state) => {
      state.bookingToast = null;
    },
    applyLocalBookingFilters: (state) => {
      let filtered = [...state.allBookings];

      if (state.statusFilter && state.statusFilter !== 'All') {
        filtered = filtered.filter(b => b.status.toLowerCase() === state.statusFilter.toLowerCase());
      }

      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(b =>
          b.guestName.toLowerCase().includes(q) ||
          b.hotelTitle.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q)
        );
      }

      state.displayedBookings = filtered;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && !action.payload.isFallback && action.payload.data) {
          state.allBookings = action.payload.data;
          bookingSlice.caseReducers.applyLocalBookingFilters(state);
        } else {
          bookingSlice.caseReducers.applyLocalBookingFilters(state);
        }
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.allBookings.unshift(action.payload);
        state.isFormModalOpen = false;
        state.preselectedHotel = null;
        state.bookingToast = { type: 'success', message: `Reservation created! Ref: ${action.payload.bookingRef}` };
        bookingSlice.caseReducers.applyLocalBookingFilters(state);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.allBookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.allBookings[index] = action.payload;
        }
        state.isFormModalOpen = false;
        state.editingBooking = null;
        state.bookingToast = { type: 'success', message: `Booking ${action.payload.bookingRef} updated successfully!` };
        bookingSlice.caseReducers.applyLocalBookingFilters(state);
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.allBookings = state.allBookings.filter(b => b.id !== action.payload);
        state.isDeleteModalOpen = false;
        state.bookingToDeleteId = null;
        state.bookingToast = { type: 'success', message: 'Booking reservation cancelled/deleted.' };
        bookingSlice.caseReducers.applyLocalBookingFilters(state);
      });
  }
});

export const {
  setActiveTab,
  setStatusFilter,
  setBookingSearchQuery,
  openAddBookingModal,
  openEditBookingModal,
  closeBookingFormModal,
  openBookingDetailModal,
  closeBookingDetailModal,
  openDeleteBookingModal,
  closeDeleteBookingModal,
  clearBookingToast
} = bookingSlice.actions;

export default bookingSlice.reducer;
