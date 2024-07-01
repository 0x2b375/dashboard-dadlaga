/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ position, action, selectedDevice, setPosition, setSelectedDevice }) => {
  const handleMapClick = (e) => {
    if (action !== 'map') {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setSelectedDevice((prev) => ({
        ...prev,
        device_user_geolocation_latitude: lat,
        device_user_geolocation_longitude: lng,
      }));
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click: handleMapClick,
    });

    return selectedDevice ? (
      <Marker position={position}>
        {action === 'map' && (
          <Popup>
            Хэрэглэгчийн ID: {selectedDevice.device_user_id}
            <br />
            Өргөрөг: {selectedDevice.device_user_geolocation_latitude}
            <br />
            Уртраг: {selectedDevice.device_user_geolocation_longitude}
          </Popup>
        )}
      </Marker>
    ) : null;
  };

  return (
    <Box mt={2} height="500px">
      <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </Box>
  );
};

export default MapComponent;
