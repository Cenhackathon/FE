import React from "react";
import "../../styles/WeatherCard.css";

export default function WeatherCard({ data }) {
  return (
    <div className="weather-card">
      <h2 className="nowweather">현재 날씨</h2>
      <div className="weather">
        <img className="weatherpic" src="/weather1.png" />
        <div className="weatherinfo">
          <p className="temp">{data.temperature}°C</p>
          <p>체감 온도: 29°C</p>
          <p>UV 지수: {data.uvIndex}</p>
          <p>위험 수준: {data.riskLevel}</p>
        </div>
      </div>
    </div>
  );
}

