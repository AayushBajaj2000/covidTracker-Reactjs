import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";
import React from "react";
import "./Popup.css";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
  return sortedData;
};

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup style={{ backgroundColor: "blue" }}>
        <div className="popup">
          <div
            className="popup__flag"
            style={{
              backgroundImage: `url(${country.countryInfo.flag})`,
            }}
          />
          <div className="popup__name">
            <strong>{country.country}</strong>
          </div>
          <div className="popup__cases">
            <strong>Cases: </strong> {numeral(country.cases).format("0,0")}
          </div>
          <div className="popup__recovered">
            <strong>Recovered: </strong>
            {numeral(country.recovered).format("0,0")}
          </div>
          <div className="popup__deaths">
            <strong>Deaths: </strong>
            {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : `+0`;
