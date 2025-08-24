import React from "react";
import WeatherCard from "../components/weather/WeatherCard";
import MapView from "../components/weather/MapView";
import ShelterList from "../components/weather/ShelterList";
import "../styles/WeatherPage.css";

export default function WeatherPage() {
  const mockWeather = {
    temperature: 27.6,
    uvIndex: 8,
    riskLevel: "위험"
  };

  const mockShelters = [
    { id: 1, name: "무더위 쉼터 A", distance: "200m" },
    { id: 2, name: "도서관 쉼터 B", distance: "500m" }
  ];

  return (
    <div className="weatherpage">
    <header className="weather-header">
                <div className="header-left">
                    <h1 className="title">Seoul AI Weather</h1>
                </div>
    </header>

    <div className="weather-page-container">
      <div className="main-content">
        <div className="map-view-section">
          <MapView />
        </div>
      
        <div className="side-panel">
          <div className="top-card">
            <WeatherCard data={mockWeather} />
          </div>
          <div className="bottom-list">
            <ShelterList shelters={mockShelters} />
          </div>
        </div>
      </div>
    </div> 
    </div> 
  );
}


