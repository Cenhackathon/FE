import React from 'react';
import '../styles/TrafficPageStyles.css';
import traffictest from '../assets/traffictest.png'

const TrafficPage = () => {
  return (
    <div className="traffic-page-container">
      <div className="map-placeholder">
        <img src={traffictest} alt="지도 이미지" className="map-image" />
      </div>

      <div className="sidebar">
        <h3>🚦 교통 혼잡도 안내</h3>
        <ul className="legend-list">
          <li><span className="color-box red-box"></span> 매우 혼잡</li>
          <li><span className="color-box yellow-box"></span> 보통</li>
          <li><span className="color-box green-box"></span> 원활</li>
        </ul>

        <h3>교통 혼잡도 TOP3</h3>
        <ul className="legend-list">
          <li><span className=""></span> 1. 이문동</li>
          <li><span className=""></span> 2. 회기동</li>
          <li><span className=""></span> 3. 휘경동</li>
        </ul>

        <h3>예측 데이터</h3>
        <ul className="legend-list">
            <p className="prediction-text">도로 혼잡 예상 구간: 청량리역, 장안동 사거리</p>
        </ul>

        <h3>실시간 알림</h3>
        <ul className="legend-list">
            <div className="alert-box-red">
                🚨 회기동 사거리 차량 사고로 인한 정체
            </div>

            <div className="alert-box-yellow">
                 🚧 외대 앞 사거리 공사로 인한 정체
            </div>
        </ul>
      </div>
    </div>
  );
};

export default TrafficPage;