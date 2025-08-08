/*import React from 'react';

export default function WeatherPage() {
    return (
        <div className="weather-page">
            <h1>Weather</h1>
            <div className="temperature">
                <h2>동대문구 기온</h2>
                <p>30.9</p>
                <p>체감(30.9)</p>
                <p>자외선 지수</p>
                <p>일사량</p>
                <p>지면 온도</p>
            </div>
            <div className="shelter">
                <h2>동대문구 쉼터 추천</h2>
                <p></p>
            </div>
        </div>
    );
}*/

import React from "react";
import WeatherCard from "../components/weather/WeatherCard";
import MapView from "../components/weather/MapView";
import ShelterList from "../components/weather/ShelterList";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
      
      <WeatherCard data={mockWeather} />

      
      <MapView />

      
      <ShelterList shelters={mockShelters} />
    </div>
  );
}


