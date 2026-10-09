import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://namlatic-hotel-management.onrender.com/api/hotels';

const initialSampleHotels = [
  {
    id: 1,
    title: 'Grand Palace Resort & Spa',
    description: 'Experience luxury living with private beach access, infinity pool, and world-class fine dining.',
    price: 320,
    rating: 4.9,
    latitude: 12.9716,
    longitude: 77.5946,
    locationName: 'Bengaluru, India',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    amenities: ['Pool', 'Spa', 'WiFi', 'Ocean View', 'Breakfast']
  },
  {
    id: 2,
    title: 'Ocean Palm Beach Boutique',
    description: 'Charming seaside hotel featuring panoramic sunset ocean views, private balconies and fresh seafood.',
    price: 185,
    rating: 4.7,
    latitude: 15.2993,
    longitude: 74.124,
    locationName: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Ocean View', 'WiFi', 'Bar', 'Beach Access']
  },
  {
    id: 3,
    title: 'Heritage Royal Palace',
    description: 'Historic royal architectural retreat with opulent suite rooms, cultural performances, and traditional cuisine.',
    price: 260,
    rating: 4.8,
    latitude: 26.9124,
    longitude: 75.7873,
    locationName: 'Jaipur, India',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Heritage', 'WiFi', 'Pool', 'Restaurant']
  },
  {
    id: 4,
    title: 'Misty Mountains Eco Lodge',
    description: 'Serene mountain eco-resort nestled amidst lush pine forest with fireplace suites and trekking tours.',
    price: 140,
    rating: 4.6,
    latitude: 10.0889,
    longitude: 77.0595,
    locationName: 'Munnar, India',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    amenities: ['Trekking', 'WiFi', 'Fireplace', 'Mountain View']
  },
  {
    id: 5,
    title: 'Skyline Metropolis Hotel',
    description: 'Modern luxury business hotel located in central downtown with rooftop lounge and high-speed executive facilities.',
    price: 210,
    rating: 4.5,
    latitude: 19.076,
    longitude: 72.8777,
    locationName: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    amenities: ['Gym', 'WiFi', 'Rooftop Bar', 'Business Lounge']
  },
  {
    id: 6,
    title: 'Lakeside Serenity Suites',
    description: 'Peaceful lakefront resort featuring scenic boathouse views, outdoor infinity Jacuzzi, and organic dining.',
    price: 195,
    rating: 4.8,
    latitude: 24.5854,
    longitude: 73.7125,
    locationName: 'Udaipur, India',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    amenities: ['Lake View', 'Jacuzzi', 'WiFi', 'Organic Food']
  }
];

export const fetchHotels = createAsyncThunk('hotels/fetchHotels', async (params = {}) => {
  try {
    const urlParams = new URLSearchParams();
    if (params.title) urlParams.append('title', params.title);
    if (params.minPrice) urlParams.append('minPrice', params.minPrice);
    if (params.maxPrice) urlParams.append('maxPrice', params.maxPrice);
    if (params.page) urlParams.append('page', params.page);
    if (params.limit) urlParams.append('limit', params.limit || 4);
    const res = await fetch(`${API_URL}?${urlParams.toString()}`);
    if (!res.ok) throw new Error('API server unavailable');
    const data = await res.json();
    return data;
  } catch (err) {
    return { isFallback: true, params };
  }
});

export const addHotel = createAsyncThunk('hotels/addHotel', async (formData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to create hotel');
    const data = await res.json();
    return data.data;
  } catch (err) {
    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const latitude = parseFloat(formData.get('latitude'));
    const longitude = parseFloat(formData.get('longitude'));
    const imageUrl = formData.get('imageUrl') || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    return {
      id: Date.now(),
      title,
      description,
      price: isNaN(price)? 0 : price,
      rating: 4.5,
      latitude: isNaN(latitude)? 12.9716 : latitude,
      longitude: isNaN(longitude)? 77.5946 : longitude,
      locationName: 'Custom Location',
      image: imageUrl,
      amenities: ['WiFi', 'Pool']
    };
  }
});

export const updateHotel = createAsyncThunk('hotels/updateHotel', async ({ id, formData }) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to update hotel');
    const data = await res.json();
    return data.data;
  } catch (err) {
    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const latitude = parseFloat(formData.get('latitude'));
    const longitude = parseFloat(formData.get('longitude'));
    const imageUrl = formData.get('imageUrl');
    return {
      id,
      title,
      description,
      price,
      rating: 4.8,
      latitude,
      longitude,
      image: imageUrl,
      locationName: 'Updated Location',
      amenities: ['WiFi', 'Pool', 'Spa']
    };
  }
});

export const deleteHotel = createAsyncThunk('hotels/deleteHotel', async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete hotel');
    return id;
  } catch (err) {
    return id;
  }
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    allHotels: initialSampleHotels,
    displayedHotels: initialSampleHotels.slice(0, 4),
    selectedHotel: null,
    status: 'idle',
    error: null,
    searchTitle: '',
    minPrice: '',
    maxPrice: '',
    selectedRating: null,
    selectedAmenities: [],
    sortBy: 'default',
    currentPage: 1,
    itemsPerPage: 4,
    totalPages: Math.ceil(initialSampleHotels.length / 4),
    totalItems: initialSampleHotels.length,
    viewMode: 'list',
    activeBudgetCategory: 'all',
    isFormModalOpen: false,
    formMode: 'add',
    editingHotel: null,
    isDetailModalOpen: false,
    isDeleteModalOpen: false,
    hotelToDeleteId: null,
    toast: null
  },
  reducers: {
    setSearchTitle: (state, action) => {
      state.searchTitle = action.payload;
      state.currentPage = 1;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
      state.activeBudgetCategory = 'custom';
      state.currentPage = 1;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
      state.activeBudgetCategory = 'custom';
      state.currentPage = 1;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setBudgetPreset: (state, action) => {
      const cat = action.payload;
      state.activeBudgetCategory = cat;
      state.currentPage = 1;
      if (cat === 'budget') {
        state.minPrice = '';
        state.maxPrice = '190';
      } else if (cat === 'mid') {
        state.minPrice = '190';
        state.maxPrice = '270';
      } else if (cat === 'luxury') {
        state.minPrice = '270';
        state.maxPrice = '';
      } else {
        state.minPrice = '';
        state.maxPrice = '';
      }
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setSelectedRating: (state, action) => {
      state.selectedRating = action.payload;
      state.currentPage = 1;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    toggleAmenity: (state, action) => {
      const amenity = action.payload;
      if (state.selectedAmenities.includes(amenity)) {
        state.selectedAmenities = state.selectedAmenities.filter(a => a!== amenity);
      } else {
        state.selectedAmenities.push(amenity);
      }
      state.currentPage = 1;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    resetFilters: (state) => {
      state.searchTitle = '';
      state.minPrice = '';
      state.maxPrice = '';
      state.activeBudgetCategory = 'all';
      state.selectedRating = null;
      state.selectedAmenities = [];
      state.sortBy = 'default';
      state.currentPage = 1;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      hotelSlice.caseReducers.applyLocalFilters(state);
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    openAddModal: (state) => {
      state.formMode = 'add';
      state.editingHotel = null;
      state.isFormModalOpen = true;
    },
    openEditModal: (state, action) => {
      state.formMode = 'edit';
      state.editingHotel = action.payload;
      state.isFormModalOpen = true;
    },
    closeFormModal: (state) => {
      state.isFormModalOpen = false;
      state.editingHotel = null;
    },
    openDetailModal: (state, action) => {
      state.selectedHotel = action.payload;
      state.isDetailModalOpen = true;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.selectedHotel = null;
    },
    openDeleteModal: (state, action) => {
      state.hotelToDeleteId = action.payload;
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.hotelToDeleteId = null;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    applyLocalFilters: (state) => {
      let filtered = [...state.allHotels];
      if (state.searchTitle.trim()) {
        const query = state.searchTitle.toLowerCase().trim();
        filtered = filtered.filter(h =>
          h.title.toLowerCase().includes(query) ||
          h.description.toLowerCase().includes(query)
        );
      }
      if (state.minPrice!== '' &&!isNaN(state.minPrice)) {
        filtered = filtered.filter(h => h.price >= Number(state.minPrice));
      }
      if (state.maxPrice!== '' &&!isNaN(state.maxPrice)) {
        filtered = filtered.filter(h => h.price <= Number(state.maxPrice));
      }
      if (state.selectedRating) {
        filtered = filtered.filter(h => Math.floor(h.rating) >= state.selectedRating);
      }
      if (state.selectedAmenities.length > 0) {
        filtered = filtered.filter(h =>
          state.selectedAmenities.every(amenity => h.amenities && h.amenities.includes(amenity))
        );
      }
      if (state.sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (state.sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (state.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (state.sortBy === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
      state.totalItems = filtered.length;
      state.totalPages = Math.ceil(filtered.length / state.itemsPerPage) || 1;
      if (state.currentPage > state.totalPages) {
        state.currentPage = state.totalPages;
      }
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      state.displayedHotels = filtered.slice(startIndex, startIndex + state.itemsPerPage);
    }
  },
  extraReducers: (builder) => {
    builder
     .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading';
      })
     
.addCase(fetchHotels.fulfilled, (state, action) => {
  state.status = 'succeeded';

  if (action.payload && !action.payload.isFallback && action.payload.data) {
    state.allHotels = action.payload.data;
  }

  hotelSlice.caseReducers.applyLocalFilters(state);
})
.addCase(fetchHotels.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.error.message;
  hotelSlice.caseReducers.applyLocalFilters(state);
})
     .addCase(addHotel.fulfilled, (state, action) => {
        state.allHotels.unshift(action.payload);
        state.isFormModalOpen = false;
        // FIX: Page 1 ku kondu varuvom, filter reset pannuvom
        state.currentPage = 1;
        state.searchTitle = '';
        state.minPrice = '';
        state.maxPrice = '';
        state.activeBudgetCategory = 'all';
        state.selectedRating = null;
        state.selectedAmenities = [];
        state.toast = { type: 'success', message: 'Hotel listing added successfully!' };
        hotelSlice.caseReducers.applyLocalFilters(state);
      })
     .addCase(updateHotel.fulfilled, (state, action) => {
        const index = state.allHotels.findIndex(h => h.id === action.payload.id);
        if (index!== -1) {
          state.allHotels[index] = action.payload;
        }
        state.isFormModalOpen = false;
        state.editingHotel = null;
        state.toast = { type: 'success', message: 'Hotel listing updated successfully!' };
        hotelSlice.caseReducers.applyLocalFilters(state);
      })
     .addCase(deleteHotel.fulfilled, (state, action) => {
        state.allHotels = state.allHotels.filter(h => h.id!== action.payload);
        state.isDeleteModalOpen = false;
        state.hotelToDeleteId = null;
        state.toast = { type: 'success', message: 'Hotel listing deleted successfully!' };
        hotelSlice.caseReducers.applyLocalFilters(state);
      });
  }
});

export const {
  setSearchTitle,
  setMinPrice,
  setMaxPrice,
  setBudgetPreset,
  setSelectedRating,
  toggleAmenity,
  setSortBy,
  resetFilters,
  setCurrentPage,
  setViewMode,
  openAddModal,
  openEditModal,
  closeFormModal,
  openDetailModal,
  closeDetailModal,
  openDeleteModal,
  closeDeleteModal,
  showToast,
  clearToast
} = hotelSlice.actions;

export default hotelSlice.reducer;
