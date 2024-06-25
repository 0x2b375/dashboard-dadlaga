/* eslint-disable no-unused-vars */
import { Icon } from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';

export default function Map() {
  const [markers, setMarkers] = useState([]);
  const [data, setData] = useState([]);
  const markerUrl = 'marker.png';

  const customIcon = new Icon({
    iconUrl: markerUrl,
    iconSize: [38, 38]
  });

  useEffect(() => {
    axios.post('http://localhost:3001/api/devices')
      .then(response => {
        
        const devices = response.data.body;
        const newMarkers = devices
          .filter(device => device.device_user_geolocation_latitude != null && device.device_user_geolocation_longitude != null)
          .map(device => ({
            lat: device.device_user_geolocation_latitude,
            lng: device.device_user_geolocation_longitude,
            user: device.device_user_id,
          }));
        setMarkers(newMarkers);
        setData(devices);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }, []);

  return (
    <MapContainer center={[47.92262, 106.92618]} zoom={14} scrollWheelZoom={true} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
              Хэрэглэгч: {marker.user}
              <br />
              Өргөрөг: {marker.lat}, Уртраг: {marker.lng}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
