import React from "react";

export default function ShelterList({ shelters }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>인근 쉼터</h2>
      <ul>
        {shelters.map((shelter) => (
          <li key={shelter.id}>
            {shelter.name} - {shelter.distance}
          </li>
        ))}
      </ul>
    </div>
  );
}
