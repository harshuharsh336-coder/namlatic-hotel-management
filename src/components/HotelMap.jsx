import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icon issue in Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component to dynamically recenter map on lat/lng change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function HotelMap({ latitude, longitude, title, locationName, price }) {
  const lat = Number(latitude) || 12.9716;
  const lng = Number(longitude) || 77.5946;
  const position = [lat, lng];

  return (
    <div className="hotel-map-wrapper">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <ChangeView center={position} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="map-popup-content">
              <strong className="map-popup-title">{title}</strong>
              <p className="map-popup-location">📍 {locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}</p>
              {price && <p className="map-popup-price">${price} / night</p>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
