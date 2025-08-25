/*import { Map} from 'react-kakao-maps-sdk';
import "../../styles/MapView.css";

export default function MapView() {
  return (
    <Map 
      center={{ lat: 37.5962, lng: 127.0577 }} // 👈 한국외국어대학교 좌표로 변경
      style={{ width: '100%', height: '100%' }} // 👈 크기를 100%로 변경
      level={3} 
    />
  );
}*/

import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import axios from 'axios';

export default function MapView() {
  // 쉼터 데이터를 저장할 상태(state)를 만듭니다.
  const [shelters, setShelters] = useState([]);

  // useEffect를 사용해 컴포넌트가 처음 렌더링될 때 API를 호출합니다.
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        // 이전에 사용하셨던 API 주소로 GET 요청을 보냅니다.
        const response = await axios.get('http://openddm.store/shelter/list/');
        
        // API 응답으로 받은 데이터를 shelters 상태에 저장합니다.
        setShelters(response.data);
      } catch (error) {
        console.error("API 호출 에러:", error);
      }
    };

    fetchShelters();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 합니다.

  return (
    <Map 
      center={{ lat: 37.5744, lng: 127.0571 }} // 지도의 중심을 동대문구청 근처로 설정
      style={{ width: '100%', height: '100%' }}
      level={5} // 여러 마커를 잘 보이도록 레벨을 조정
    >
      {/* shelters 배열을 순회하며 각 쉼터 위치에 마커를 생성합니다. */}
      {shelters.map((shelter) => (
        <MapMarker
          key={shelter.index} // 각 마커를 구분하기 위한 고유 key
          position={{ lat: shelter.latitude, lng: shelter.longitude }}
          title={shelter.name} // 마커에 마우스를 올리면 쉼터 이름이 표시됩니다.
        />
      ))}
    </Map>
  );
}

