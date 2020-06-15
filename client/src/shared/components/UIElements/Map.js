import React from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

import { mapStyles } from "./MapStyles";

import "./Map.css";

const libraries = ["places"];
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
};

const Map = ({ zoom, center, className, style }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading map";

  return (
    <div className={`map ${className}`} style={style}>
      <GoogleMap
        mapContainerClassName={`map ${className}`}
        center={center}
        zoom={zoom}
        options={options}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default Map;
