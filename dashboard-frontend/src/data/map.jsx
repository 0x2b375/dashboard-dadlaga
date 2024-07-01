/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Icon } from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';

export default function Map({real}) {
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
    <div className={`max-md:m-5 m-5 overflow-auto ${!real && 'max-md:mt-24'}`}>
      <div className="w-full">
        <MapContainer center={[47.91885, 106.91760]} zoom={15} scrollWheelZoom={true}>
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
      </div>
    </div>
    
  );
}
