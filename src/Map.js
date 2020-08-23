import React from "react";
import "./Map.css";
import { Map as LefletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./util";

function Map({ countries, center, casesType, zoom }) {
  return (
    <div className="map">
      <LefletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> 
          contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LefletMap>
    </div>
  );
}

export default Map;
