import React from "react";

export default function ShelterList({ shelters }) {
  return (
    <div style={{padding: "1rem"}}>
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
