import React from "react";

export default function WeatherCard({ data }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>현재 날씨</h2>
      <p>기온: {data.temperature}°C</p>
      <p>체감 온도: </p>
      <p>UV 지수: {data.uvIndex}</p>
      <p>위험 수준: {data.riskLevel}</p>
    </div>
  );
}

