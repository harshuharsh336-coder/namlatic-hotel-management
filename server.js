import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Set up static uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'hotel-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Database path & Initial seed data
const dbFile = path.join(__dirname, 'hotels.json');
const initialHotels = [
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

async function readData() {
  const result = await pool.query(
    'SELECT * FROM hotels ORDER BY id'
  );

  return result.rows;
}

function writeData(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Create hotels table and insert sample hotels
async function initializeHotels() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hotels (
      id BIGINT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      rating NUMERIC(2,1),
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      location_name TEXT,
      image TEXT,
      amenities JSONB
    )
  `);

  for (const hotel of initialHotels) {
    await pool.query(
      `INSERT INTO hotels
       (id, title, description, price, rating, latitude, longitude,
        location_name, image, amenities)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [
        hotel.id,
        hotel.title,
        hotel.description,
        hotel.price,
        hotel.rating,
        hotel.latitude,
        hotel.longitude,
        hotel.locationName,
        hotel.image,
        JSON.stringify(hotel.amenities)
      ]
    );
  }

  console.log("Hotel data initialized!");
}

// GET /api/hotels with search title, price filter, pagination
app.get('/api/hotels', async (req, res) => {
  let hotels = await readData();

  console.log(Array.isArray(hotels), hotels);

  const { title, minPrice, maxPrice, page = 1, limit = 4 } = req.query;

  // Search filter
  if (title) {
    const query = title.toLowerCase();
    hotels = hotels.filter(h => h.title.toLowerCase().includes(query) || h.description.toLowerCase().includes(query));
  }

  // Price Range filter
  if (minPrice !== undefined && minPrice !== '') {
    hotels = hotels.filter(h => Number(h.price) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    hotels = hotels.filter(h => Number(h.price) <= Number(maxPrice));
  }

  const total = hotels.length;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedHotels = hotels.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: paginatedHotels
  });
});

// GET /api/hotels/:id
app.get('/api/hotels/:id', (req, res) => {
  const hotels = readData();
  const hotel = hotels.find(h => h.id === parseInt(req.params.id, 10));
  if (!hotel) {
    return res.status(404).json({ success: false, message: 'Hotel not found' });
  }
  res.json({ success: true, data: hotel });
});

// POST /api/hotels - Add new hotel (Multer + validation)
app.post('/api/hotels', upload.single('imageFile'), async (req, res) => {
  const { title, description, price, latitude, longitude, imageUrl, locationName } = req.body;

  // Validation
  if (!title || !description || !price || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields (title, description, price, latitude, longitude).' });
  }

  let finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  if (req.file) {
    finalImageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  }

  
  const newHotel = {
    id: Math.floor(Date.now() / 1000),
    title: title.trim(),
    description: description.trim(),
    price: parseFloat(price),
    rating: parseFloat(req.body.rating) || 4.5,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    locationName: locationName || 'Custom Location',
    image: finalImageUrl,
    amenities: req.body.amenities ? (Array.isArray(req.body.amenities) ? req.body.amenities : req.body.amenities.split(',').map(s => s.trim())) : ['WiFi', 'Pool']
  };

  const result = await pool.query(
  `INSERT INTO hotels
   (id, title, description, price, rating, latitude, longitude, location_name, image, amenities)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
   RETURNING *`,
  [
    newHotel.id,
    newHotel.title,
    newHotel.description,
    newHotel.price,
    newHotel.rating,
    newHotel.latitude,
    newHotel.longitude,
    newHotel.locationName,
    newHotel.image,
    JSON.stringify(newHotel.amenities)
  ]
);


  res.status(201).json({
    success: true,
    message: 'Hotel record created successfully!',
    data: newHotel
  });
});

// PUT /api/hotels/:id - Edit existing hotel
app.put('/api/hotels/:id', upload.single('imageFile'), (req, res) => {
  const hotelId = parseInt(req.params.id, 10);
  let hotels = readData();
  const index = hotels.findIndex(h => h.id === hotelId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Hotel not found' });
  }

  const existing = hotels[index];
  const { title, description, price, latitude, longitude, imageUrl, locationName } = req.body;

  let finalImageUrl = existing.image;
  if (req.file) {
    finalImageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  } else if (imageUrl) {
    finalImageUrl = imageUrl;
  }

  const updatedHotel = {
    ...existing,
    title: title ? title.trim() : existing.title,
    description: description ? description.trim() : existing.description,
    price: price !== undefined ? parseFloat(price) : existing.price,
    rating: req.body.rating ? parseFloat(req.body.rating) : existing.rating,
    latitude: latitude !== undefined ? parseFloat(latitude) : existing.latitude,
    longitude: longitude !== undefined ? parseFloat(longitude) : existing.longitude,
    locationName: locationName || existing.locationName,
    image: finalImageUrl,
    amenities: req.body.amenities ? (Array.isArray(req.body.amenities) ? req.body.amenities : req.body.amenities.split(',').map(s => s.trim())) : existing.amenities
  };

  hotels[index] = updatedHotel;
  writeData(hotels);

  res.json({
    success: true,
    message: 'Hotel updated successfully!',
    data: updatedHotel
  });
});

// DELETE /api/hotels/:id
app.delete('/api/hotels/:id', (req, res) => {
  const hotelId = parseInt(req.params.id, 10);
  let hotels = readData();
  const exists = hotels.some(h => h.id === hotelId);

  if (!exists) {
    return res.status(404).json({ success: false, message: 'Hotel not found' });
  }

  hotels = hotels.filter(h => h.id !== hotelId);
  writeData(hotels);

  res.json({
    success: true,
    message: 'Hotel deleted successfully!'
  });
});

// ==========================================
// BOOKINGS CRUD ENDPOINTS & SEED DATA
// ==========================================
const bookingsDbFile = path.join(__dirname, 'bookings.json');
const initialBookings = [
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

function readBookingsData() {
  if (!fs.existsSync(bookingsDbFile)) {
    fs.writeFileSync(bookingsDbFile, JSON.stringify(initialBookings, null, 2));
    return initialBookings;
  }
  try {
    const data = fs.readFileSync(bookingsDbFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return initialBookings;
  }
}

function writeBookingsData(data) {
  fs.writeFileSync(bookingsDbFile, JSON.stringify(data, null, 2));
}

// GET /api/bookings (Filter by status, search guest/hotel name, page)
app.get('/api/bookings', (req, res) => {
  let bookings = readBookingsData();
  const { status, search, hotelId } = req.query;

  if (status && status !== 'All') {
    bookings = bookings.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }

  if (hotelId) {
    bookings = bookings.filter(b => b.hotelId === parseInt(hotelId, 10));
  }

  if (search) {
    const q = search.toLowerCase();
    bookings = bookings.filter(b => 
      b.guestName.toLowerCase().includes(q) ||
      b.hotelTitle.toLowerCase().includes(q) ||
      b.bookingRef.toLowerCase().includes(q) ||
      b.guestEmail.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: bookings.length,
    data: bookings
  });
});

// GET /api/bookings/:id
app.get('/api/bookings/:id', (req, res) => {
  const bookings = readBookingsData();
  const booking = bookings.find(b => b.id === parseInt(req.params.id, 10));
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

// POST /api/bookings (Create reservation)
app.post('/api/bookings', (req, res) => {
  const {
    hotelId,
    hotelTitle,
    hotelImage,
    hotelLocation,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    roomType,
    pricePerNight,
    specialRequests,
    status
  } = req.body;

  if (!guestName || !guestEmail || !checkIn || !checkOut || !hotelId) {
    return res.status(400).json({ success: false, message: 'Missing required booking details (guestName, guestEmail, dates, hotel).' });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffTime) ? 1 : diffTime;

  const perNight = parseFloat(pricePerNight) || 150;
  const totalPrice = nights * perNight;

  const refSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `BK-2026-${refSuffix}`;

  const bookings = readBookingsData();
  const newBooking = {
    id: Date.now(),
    bookingRef,
    hotelId: parseInt(hotelId, 10),
    hotelTitle: hotelTitle || 'Hotel Reservation',
    hotelImage: hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    hotelLocation: hotelLocation || 'City Location',
    guestName: guestName.trim(),
    guestEmail: guestEmail.trim(),
    guestPhone: guestPhone ? guestPhone.trim() : '',
    checkIn,
    checkOut,
    nights,
    guestsCount: parseInt(guestsCount, 10) || 1,
    roomType: roomType || 'Standard Room',
    pricePerNight: perNight,
    totalPrice,
    specialRequests: specialRequests ? specialRequests.trim() : '',
    status: status || 'Confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  writeBookingsData(bookings);

  res.status(201).json({
    success: true,
    message: `Booking created successfully! Reference Code: ${bookingRef}`,
    data: newBooking
  });
});

// PUT /api/bookings/:id (Update reservation)
app.put('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  let bookings = readBookingsData();
  const index = bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const existing = bookings[index];
  const {
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    guestsCount,
    roomType,
    pricePerNight,
    specialRequests,
    status
  } = req.body;

  const finalCheckIn = checkIn || existing.checkIn;
  const finalCheckOut = checkOut || existing.checkOut;

  const checkInDate = new Date(finalCheckIn);
  const checkOutDate = new Date(finalCheckOut);
  const diffTime = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffTime) ? existing.nights : diffTime;

  const perNight = pricePerNight !== undefined ? parseFloat(pricePerNight) : existing.pricePerNight;
  const totalPrice = nights * perNight;

  const updatedBooking = {
    ...existing,
    guestName: guestName ? guestName.trim() : existing.guestName,
    guestEmail: guestEmail ? guestEmail.trim() : existing.guestEmail,
    guestPhone: guestPhone !== undefined ? guestPhone.trim() : existing.guestPhone,
    checkIn: finalCheckIn,
    checkOut: finalCheckOut,
    nights,
    guestsCount: guestsCount ? parseInt(guestsCount, 10) : existing.guestsCount,
    roomType: roomType || existing.roomType,
    pricePerNight: perNight,
    totalPrice,
    specialRequests: specialRequests !== undefined ? specialRequests.trim() : existing.specialRequests,
    status: status || existing.status
  };

  bookings[index] = updatedBooking;
  writeBookingsData(bookings);

  res.json({
    success: true,
    message: 'Booking updated successfully!',
    data: updatedBooking
  });
});

// DELETE /api/bookings/:id (Cancel/Delete reservation)
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  let bookings = readBookingsData();
  const exists = bookings.some(b => b.id === bookingId);

  if (!exists) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  bookings = bookings.filter(b => b.id !== bookingId);
  writeBookingsData(bookings);

  res.json({
    success: true,
    message: 'Booking cancelled and deleted successfully!'
  });
});


initializeHotels()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
  });

