import React, { useEffect, useState } from 'react';
import axios from "axios"
import '../styles/Livemap.css';
import Tmap from '../components/traffic/Tmap';

const Livemap = () => {
  const [posts, setPosts] = useState([]); // 교통혼잡도 top3
  const [prediction, setPrediction] = useState([]); // 예측 데이터
  const [alerts, setAlerts] = useState([]); // 실시간 알림

  const getPosts = async() => { // 백엔드 보고 맞춰야함
    try{
      const response = await axios.get('http://127.0.0.1:8000/');
      const data = response.data;
      console.log('응답완료');

      // api 명세서 보고 수정(.~~부분만 수정)
      // setPosts(data.posts || []);
      // setPrediction(data.prediction || []);
      // setAlerts(data.alerts || []);
      
    } catch (error) {
      console.log('에러: ', error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);
  
  return (
    <div className="traffic-page-container">
      <div className="map-placeholder">
        <Tmap />
      </div>

      <div className="sidebar">
        <h3>🚦 교통 혼잡도 안내</h3>
        <ul className="legend-list">

        </ul>

        <h3>교통 혼잡도 TOP3</h3>
        <ul className="legend-list">

        </ul>
        <h3>예측 데이터</h3>
        <ul className="legend-list">

        </ul>

        <h3>실시간 알림</h3>
        <ul className="legend-list">
        </ul>
      </div>
    </div>
  );
};

export default Livemap;