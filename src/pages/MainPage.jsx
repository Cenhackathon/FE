import { useNavigate } from "react-router-dom"
import React from 'react';
import '../styles/MainPage.css';

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="main-page">
            {/* Header with Navigation */}
            <header className="header">
                <div className="header-left">
                    <h1 className="title">Seoul AI 상황실</h1>
                </div>
                <nav className="nav-bar">
                    <button className="nav-btn">Dashboard</button>
                    <button className="nav-btn">Analytics</button>
                    <button className="nav-btn">Reports</button>
                    <button className="nav-btn">Settings</button>
                </nav>
            </header>

            {/* Main Dashboard Content */}
            <main className="dashboard">
                {/* Top Row - Map and Side Panels */}
                <div className="top-row">
                    {/* Map Section - Large */}
                    <section className="map-section">
                        <div className="section-header">
                            <h2>실시간 지도</h2>
                            <div className="section-controls">
                                <button className="control-btn">🔄</button>
                                <button className="control-btn">⚙️</button>
                            </div>
                        </div>
                        <div className="map-container">
                            <div className="map-placeholder">
                                <p>서울시 실시간 상황 지도</p>
                                <div className="map-indicators">
                                    <span className="indicator green">정상</span>
                                    <span className="indicator yellow">주의</span>
                                    <span className="indicator red">경고</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Side Panels */}
                    <aside className="side-panels">
                        {/* Chatbot Section */}
                        <section 
                            className="panel chatbot-panel"
                            style = {{ cursor: "pointer" }}
                            onClick={() => navigate("/chatbot")}
                        >
                            <div className="panel-header">
                                <h3>Chatbot</h3>
                                <div className="panel-controls">
                                    <button className="control-btn">💬</button>
                                </div>
                            </div>
                            <div className="panel-content">
                                <div className="chatbot-preview">
                                    <div className="chat-message bot">
                                        <span className="chat-avatar">🤖</span>
                                        <p>안녕하세요! 무엇을 도와드릴까요?</p>
                                    </div>
                                    <div className="chat-input-preview">
                                        <input type="text" placeholder="메시지를 입력하세요..." disabled />
                                        <button>전송</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Community Section */}
                        <section 
                            className="panel community-panel"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/community")}
                        >
                            <div className="panel-header">
                                <h3>Community</h3>
                                <div className="panel-controls">
                                    <button className="control-btn">👥</button>
                                </div>
                            </div>
                            <div className="panel-content">
                                <div className="community-preview">
                                    <div className="community-stats">
                                        <div className="stat">
                                            <span className="stat-number">24</span>
                                            <span className="stat-label">활성 사용자</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-number">156</span>
                                            <span className="stat-label">오늘 게시물</span>
                                        </div>
                                    </div>
                                    <div className="recent-posts">
                                        <div className="post-item">
                                            <span className="post-title">강남구 교통 상황 문의</span>
                                            <span className="post-time">2분 전</span>
                                        </div>
                                        <div className="post-item">
                                            <span className="post-title">날씨 예보 관련 질문</span>
                                            <span className="post-time">15분 전</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* Bottom Row - Three Cards */}
                <div className="bottom-row">

                    {/* Traffic Card */}
                    <section 
                        className="bottom-card traffic-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/traffic")}
                    >
                    <div className="card-header">
                        <h3>TRAFFIC</h3>
                    </div>

                    <div className="traffic-content">
                        <div className="traffic-left">
                            <div className="traffic-section-title">
                                <h4>교통 혼잡도 TOP3</h4>
                            </div>

                            <ol className="traffic-list">
                                <li className="traffic-item">1. 이문동 </li>
                                <li className="traffic-item">2. 회기동 </li>
                                <li className="traffic-item">3. 휘경동 </li>
                            </ol>
                        </div>

                        <div className="traffic-right">
                            <div className="traffic-section-title">
                                <h4>예측 데이터</h4>
                            </div>
                            <p className="prediction-text">도로 혼잡 예상 구간: 청량리역, 장안동 사거리</p>
                        </div>
                    </div>
                    </section>

                    {/* Weather Card */}
                    <section 
                        className="bottom-card weather-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/weather")}
                    >
                        <div className="card-header">
                            <h3>WEATHER</h3>
                        </div>
                        <div className="card-content">
                            <div className="weather-info">
                                <div className="temperature">
                                    <span className="temp-number">22</span>
                                    <span className="temp-unit">°C</span>
                                    <span className="weather-icon">☀️</span>
                                </div>
                                <div className="weather-details">
                                    <p className="feels-like">feels 9°C</p>
                                    <div className="shelter-info">
                                        <div className="shelter-item">
                                            <span className="shelter-icon">🏠</span>
                                            <span>Nearby Shelter</span>
                                        </div>
                                        <div className="shelter-item">
                                            <span className="shelter-icon">❄️</span>
                                            <span>Cooling Shelter</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default MainPage;
