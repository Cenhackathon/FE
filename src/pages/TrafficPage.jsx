import React, { useEffect, useState } from 'react';
import axios from "axios"
import '../styles/TrafficPageStyles.css';
import Tmap from '../components/traffic/Tmap';

const TrafficPage = () => {
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
          <li><span className="color-box red-box"></span> 정체</li>
          <li><span className="color-box orange-box"></span> 지체</li>
          <li><span className="color-box yellow-box"></span> 서행</li>
          <li><span className="color-box green-box"></span> 원활</li>
        </ul>

        <h3>교통 혼잡도 TOP3</h3>
        <ul className="legend-list">
          {posts.map((post, index) => (
            <li key={index}>
              {`${index + 1}. `}{post.location} {/*>>>>여기 백엔드 주소에 따라 바뀌어야함*/}
            </li>
          ))}
          {/* <li>
            1. 이문동(주소)
          </li>
          <li>
            2. 회기동(주소)
          </li>
          <li>
            3. 휘경동(주소)
          </li> */}
        </ul>

        <h3>예측 데이터</h3>
        <ul className="legend-list">
            <p className="prediction-text">
              도로 혼잡 예상 구간: 청량리역, 장안동 사거리(주소) {prediction.join(', ')}
            </p>
        </ul>

        <h3>실시간 알림</h3>
        <ul className="legend-list">
          {alerts.map((alert, index) => (
            <div 
            key = {index} 
            className = {alert.type === 'warning' ? "alert-box-red" : "alert-box-yellow"}>
              {alert.type === 'warning' ? "🚨 " : "🚧 "}
              {alert.message}
            </div>
          ))}  {/* 백주소에 맞게 변환 */}
            {/* <div className="alert-box-red">
                🚨 회기동 사거리 차량 사고로 인한 정체(주소)
            </div>
            <div className="alert-box-yellow">
                 🚧 외대 앞 사거리 공사로 인한 정체(주소)
            </div> */}
        </ul>
      </div>
    </div>
  );
};

export default TrafficPage;