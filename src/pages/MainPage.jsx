import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tmap from '../components/traffic/Tmap';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import { communityService } from '../services/communityService';
import '../styles/MainPage.css';

function MainPage() {
    const navigate = useNavigate();
    const [popularPosts, setPopularPosts] = useState([]);

    // 인증 관련 상태
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleLivemapClick = () => {
        navigate('/livemap');
    };

    const handleCommunityClick = () => {
        // localStorage 상태 확인 후 이동
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        console.log('🚀 커뮤니티로 이동 - 인증 상태 확인:');
        console.log('   - token exists:', !!token);
        console.log('   - username:', username);
        console.log('   - isAuthenticated:', isAuthenticated);

        // localStorage 저장이 완료되었는지 확인 후 이동
        setTimeout(() => {
            navigate('/community');
        }, 50); // 50ms 지연으로 localStorage 저장 완료 보장
    };

    const handleChatbotClick = () => {
        navigate('/chatbot');
    };

    const handleWeatherClick = () => {
        navigate('/weather');
    };

    // 컴포넌트 마운트시 로그인 상태 확인 및 인기게시물 로드
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        console.log('🏠 메인페이지 마운트 - 인증 상태 확인:');
        console.log('   - localStorage token:', token ? 'Present' : 'Missing');
        console.log('   - localStorage username:', username);

        if (token && username && token !== 'undefined' && token !== 'null') {
            console.log('✅ 메인페이지 로그인 상태 복원 성공');
            setIsAuthenticated(true);
            setCurrentUser({ username, token });
        } else {
            console.log('❌ 메인페이지 로그인 상태 없음');
            setIsAuthenticated(false);
            setCurrentUser(null);
        }

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

    // 인증 관련 핸들러
    const handleLoginSuccess = (userData) => {
        console.log('🔐 메인페이지 로그인 성공:', userData);

        // localStorage에 확실히 저장
        localStorage.setItem('token', userData.token);
        localStorage.setItem('username', userData.username);

        console.log('💾 localStorage 저장 완료:');
        console.log('   - token:', localStorage.getItem('token'));
        console.log('   - username:', localStorage.getItem('username'));

        setIsAuthenticated(true);
        setCurrentUser(userData);
        setShowLoginModal(false);

        // storage 이벤트 트리거 (다른 탭/창 동기화)
        window.dispatchEvent(
            new StorageEvent('storage', {
                key: 'token',
                newValue: userData.token,
                storageArea: localStorage,
            })
        );
    };

    const handleRegisterSuccess = () => {
        // 회원가입 성공 후 로직 (필요시 추가)
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');

            if (token) {
                // 백엔드에 로그아웃 요청
                const baseUrl = 'https://openddm.store';
                await fetch(`${baseUrl}/accounts/logout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('로그아웃 요청 실패:', error);
            // 실패해도 로컬 로그아웃은 진행
        } finally {
            // 로컬 저장소 정리 및 상태 초기화
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setIsAuthenticated(false);
            setCurrentUser(null);

            console.log('🚪 로그아웃 완료 - storage 이벤트 트리거');
            // storage 이벤트 트리거 (다른 탭/창 동기화)
            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: 'token',
                    newValue: null,
                    storageArea: localStorage,
                })
            );
        }
    };

    const handleSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const handleSwitchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    return (
        <div className="main-page">
            {/* Header with Navigation */}
            <header className="header">
                <h1 className="title">동대문을 열어라!</h1>
                <div className="auth-section">
                    {isAuthenticated ? (
                        <div className="user-info">
                            <span className="welcome-text">안녕하세요, {currentUser?.username}님</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                                로그인
                            </button>
                            <button className="register-btn" onClick={() => setShowRegisterModal(true)}>
                                회원가입
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Dashboard Content */}
            <main className="dashboard">
                {/* Top Row - Map and Side Panels */}
                <div className="top-row">
                    {/* Map Section - Large */}
                    <section className="map-section">
                        <div className="section-header" onClick={handleLivemapClick} style={{ cursor: 'pointer' }}>
                            <h2>실시간 지도</h2>
                        </div>
                        <div className="map-container">
                            <Tmap mapId="mainmapDiv" popularPosts={popularPosts} />
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

            {/* 인증 모달들 */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={handleSwitchToRegister}
                onLoginSuccess={handleLoginSuccess}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={handleSwitchToLogin}
                onRegisterSuccess={handleRegisterSuccess}
            />
        </div>
    );
}

export default MainPage;
