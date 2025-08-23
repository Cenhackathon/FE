import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tmap from '../components/traffic/Tmap';
import { communityService } from '../services/communityService';
import '../styles/MainPage.css';

function MainPage() {
    const navigate = useNavigate();
    const [popularPosts, setPopularPosts] = useState([]);

    const handleLivemapClick = () => {
        navigate('/livemap');
    };

    const handleCommunityClick = () => {
        navigate('/community');
    };

    const handleChatbotClick = () => {
        navigate('/chatbot');
    };

    const handleWeatherClick = () => {
        navigate('/weather');
    };

    // 컴포넌트 마운트시 인기게시물 로드
    useEffect(() => {
        loadPopularPosts();
    }, []);

    // 인기 게시물 로드 함수
    const loadPopularPosts = async () => {
        try {
            const data = await communityService.getPopularPosts();
            // 상위 2개만 가져오기
            const transformedPosts = data.slice(0, 2).map((post) => ({
                id: post.post_id,
                title: post.title,
                content: post.content,
                author: post.author,
                time: formatTime(post.created_at),
                likes: post.likes,
                comments: post.comments?.length || 0,
                category: getCategoryUIValue(post.category),
                latitude: post.latitude,
                longitude: post.longitude,
                location: post.location,
            }));
            setPopularPosts(transformedPosts);
        } catch (error) {
            console.error('인기 게시물 로드 실패:', error);
            // 실패시 빈 배열로 설정
            setPopularPosts([]);
        }
    };

    // 시간 포맷팅 함수
    const formatTime = (dateString) => {
        const now = new Date();
        const postTime = new Date(dateString);
        const diffMs = now - postTime;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`;
        return `${Math.floor(diffMins / 1440)}일 전`;
    };

    // 카테고리 API값을 UI값으로 변환
    const getCategoryUIValue = (apiCategory) => {
        const map = { general: '교통', emergency: '민원', notice: '지역정보' };
        return map[apiCategory] || '교통';
    };

    return (
        <div className="main-page">
            {/* Header with Navigation */}
            <header className="header">
                <h1 className="title">Seoul AI 상황실</h1>
            </header>

            {/* Main Dashboard Content */}
            <main className="dashboard">
                {/* Top Row - Map and Side Panels */}
                <div className="top-row">
                    {/* Map Section - Large */}
                    <section className="map-section">
                        <div className="section-header" onClick={handleLivemapClick} style={{ cursor: 'pointer' }}>
                            <h2>실시간 지도</h2>
                            <div className="section-controls">
                                <button className="control-btn">🔄</button>
                                <button className="control-btn">⚙️</button>
                            </div>
                        </div>
                        <div className="map-container">
                            <Tmap popularPosts={popularPosts} />
                        </div>
                    </section>

                    {/* Right Side Panels */}
                    <aside className="side-panels">
                        {/* Chatbot Section */}

                        <section
                            className="panel chatbot-panel"
                            onClick={handleChatbotClick}
                            style={{ cursor: 'pointer' }}
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
                            onClick={handleCommunityClick}
                            style={{ cursor: 'pointer' }}
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
                                            <span className="stat-number">{popularPosts.length}</span>
                                            <span className="stat-label">인기 게시물</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-number">
                                                {popularPosts.reduce((sum, post) => sum + post.likes, 0)}
                                            </span>
                                            <span className="stat-label">총 좋아요</span>
                                        </div>
                                    </div>
                                    <div className="recent-posts">
                                        {popularPosts.length > 0 ? (
                                            popularPosts.map((post, index) => (
                                                <div key={post.id} className="post-item">
                                                    <span className="post-title">
                                                        #{index + 1} {post.title}
                                                    </span>
                                                    <span className="post-time">{post.time}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="post-item">
                                                <span className="post-title">아직 인기 게시물이 없습니다</span>
                                                <span className="post-time">-</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* Bottom Row - Two Cards*/}
                <div className="bottom-row">
                    {/* Traffic Card / bottom-card traffic-card*/}
                    <section
                        className="panel chatbot-panel"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/traffic')}
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
                                    <h4>혼잡 예상 구간</h4>
                                </div>
                                <p className="prediction-text">청량리역, 장안동 사거리</p>
                            </div>
                        </div>
                    </section>

                    {/* Weather Card */}
                    <section
                        className="bottom-card weather-card"
                        onClick={handleWeatherClick}
                        style={{ cursor: 'pointer' }}
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
