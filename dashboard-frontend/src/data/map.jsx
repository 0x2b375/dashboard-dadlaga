/* eslint-disable no-unused-vars */
import { Icon, marker } from "leaflet";
import React, {useState} from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents  } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'

export default function Map() {
  const [markers, setMarkers] = useState([]);
  const markerUrl = '../../public/marker.png'

  const customIcon = new Icon({
    iconUrl: markerUrl,
    iconSize: [38,38] 
  })

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
      },
    });
    return null;
  }


  return (
    <MapContainer center={[47.92262, 106.92618]} zoom={20} scrollWheelZoom={true} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
            <Popup>
              {marker.lat}, {marker.lng}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <AddMarkerOnClick />
    </MapContainer>
  );
}