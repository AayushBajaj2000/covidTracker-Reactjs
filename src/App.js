import React, { useEffect, useState } from "react";
import "./App.css";
import requests from "./requests";
import axios from "./axios";
import Cards from "./Cards";
import Map from "./Map";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setCountry] = useState("Worldwide");
  const [result, setResult] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 16.342, lng: 23.0012 });
  const [mapZoom, setMapZoom] = useState(2);
  const [casesType, setCasesType] = useState("cases");

  const fetchData = async () => {
    const result = await axios.get(requests.fetchAll);
    setResult(result.data);
  };

  const fetchCountries = async () => {
    const result = await axios.get(requests.fetchCountries);
    const countries = result.data.map((item) => ({
      name: item.country,
      value: item.countryInfo.iso2,
    }));
    const tableData = result.data.map((item) => ({
      name: item.country,
      cases: item.active,
    }));
    const sortedData = sortData(tableData);
    setTableData(sortedData);
    setMapCountries(result.data);
    setCountries(countries);
  };

  useEffect(() => {
    fetchCountries();
    fetchData();
  }, []);

  const handleChange = async (e) => {
    let country = e.target.value;
    //Set the country to the country that we selected

    const url =
      country === "Worldwide"
        ? requests.fetchAll
        : `${requests.fetchCountries}/${country}`;

    //Then to change the values on the page set the result to the countries result
    const result = await axios.get(url);
    const data = result.data;
    setResult(data);
    setCountry(country);

    if (country === "Worldwide") {
      setMapCenter([16.342, 23.0012]);
      setMapZoom(2);
    } else {
      setMapCenter([
        data.countryInfo?.lat ? data.countryInfo.lat : 16.342,
        data.countryInfo?.long ? data.countryInfo.long : 23.0012,
      ]);
      setMapZoom(4);
    }
  };

  return (
    <div className="App">
      <div className="app__left">
        {/* The header for the app */}
        <div className="app__header">
          <h1 className="header__heading">COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              className="header__select"
              variant="outlined"
              value={selectedCountry}
              onChange={handleChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* All the Cards with information */}
        <div className="app__stats">
          <Cards
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title={"Coronavirus Cases"}
            cases={prettyPrintStat(result?.todayCases)}
            totalCases={prettyPrintStat(result?.cases)}
          />
          <Cards
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title={"Recovered"}
            cases={prettyPrintStat(result?.todayRecovered)}
            totalCases={prettyPrintStat(result?.recovered)}
          />
          <Cards
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title={"Deaths"}
            cases={prettyPrintStat(result?.todayDeaths)}
            totalCases={prettyPrintStat(result?.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent className="right__content">
          <h3>Live Cases By country</h3>
          {/* Table */}
          <Table countries={tableData} />
          {/* Graph */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
