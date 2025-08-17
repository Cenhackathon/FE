import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import '../styles/CommunityPage.css';

function CommunityPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: '교통',
        location: '',
        locationType: 'current', // 'current' or 'search'
    });

    const [showPostForm, setShowPostForm] = useState(false);
    const [sortBy, setSortBy] = useState('latest'); // 'latest' or 'likes'
    const [activeCategory, setActiveCategory] = useState('전체');

    // 인증 관련 상태
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // 컴포넌트 마운트시 로그인 상태 확인 및 게시물 로드
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token && username) {
            setIsAuthenticated(true);
            setCurrentUser({ username, token });
        }

        // 게시물 목록 로드
        loadPosts();
    }, []);

    // 정렬이나 카테고리가 변경될 때 게시물 다시 로드
    useEffect(() => {
        loadPosts();
    }, [sortBy, activeCategory]);

    // 게시물 목록 로드 함수
    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const baseUrl = 'http://127.0.0.1:8000';
            const orderBy = sortBy === 'latest' ? 'created_at' : 'likes'; // API 명세에 맞는 정렬 파라미터
            const categoryParam = activeCategory === '전체' ? '' : `/${getCategoryAPIValue(activeCategory)}`;

            const response = await fetch(`${baseUrl}/community/list/${orderBy}${categoryParam}/`);

            if (response.ok) {
                const data = await response.json();
                // API 응답 데이터를 UI 형태로 변환
                const transformedPosts = data.map((post) => ({
                    id: post.post_id,
                    title: post.title,
                    content: post.content,
                    author: post.author,
                    time: formatTime(post.created_at),
                    likes: post.likes,
                    comments: post.comments?.length || 0,
                    category: getCategoryUIValue(post.category),
                    location: post.location,
                    latitude: post.latitude,
                    longitude: post.longitude,
                    images: post.image_url ? [post.image_url] : [],
                }));
                setPosts(transformedPosts);
            } else {
                throw new Error('게시물 로드 실패');
            }
        } catch (error) {
            console.error('게시물 로드 실패:', error);
            setError('게시물을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 UI값을 API값으로 변환
    const getCategoryAPIValue = (uiCategory) => {
        const map = { 교통: 'general', 민원: 'emergency', 지역정보: 'notice' };
        return map[uiCategory] || 'general';
    };

    // 카테고리 API값을 UI값으로 변환
    const getCategoryUIValue = (apiCategory) => {
        const map = { general: '교통', emergency: '민원', notice: '지역정보' };
        return map[apiCategory] || '교통';
    };

    // 좋아요 토글 함수
    const handleLikeToggle = async (postId) => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            setShowLoginModal(true);
            return;
        }

        try {
            const baseUrl = 'http://127.0.0.1:8000';
            const response = await fetch(`${baseUrl}/community/${postId}/likes`, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${currentUser?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // 좋아요 처리 후 게시물 목록 새로고침
                await loadPosts();
            } else {
                throw new Error('좋아요 처리 실패');
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            alert('좋아요 처리에 실패했습니다.');
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
    const handleBack = () => {
        navigate('/');
    };

    // 인증 관련 핸들러
    const handleNewPostClick = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        } else {
            setShowPostForm(true);
        }
    };

    const handleLoginSuccess = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);
        setShowLoginModal(false);
        setShowPostForm(true); // 로그인 성공 후 바로 글쓰기 폼 열기
    };

    const handleRegisterSuccess = () => {
        // 회원가입 성공 후 로직 (필요시 추가)
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setShowPostForm(false);
    };

    const handleSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const handleSwitchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleLocationTypeChange = (type) => {
        if (type === 'current') {
            setNewPost({ ...newPost, locationType: type, location: '현재 위치' });
        } else {
            setNewPost({ ...newPost, locationType: type, location: '' });
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content || !newPost.location) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            setShowLoginModal(true);
            return;
        }

        try {
            // TODO: 백엔드 배포시 실제 API URL로 교체
            const baseUrl = 'http://127.0.0.1:8000';

            // API 명세서에 따른 카테고리 매핑
            const categoryMap = {
                교통: 'general',
                민원: 'emergency',
                지역정보: 'notice',
            };

            const postData = {
                title: newPost.title,
                content: newPost.content,
                category: categoryMap[newPost.category] || 'general',
                latitude: 37.5665, // TODO: 실제 위치 정보로 교체
                longitude: 126.978, // TODO: 실제 위치 정보로 교체
                location: newPost.location,
            };

            const response = await fetch(`${baseUrl}/community/upload/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${currentUser?.token}`,
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                // 게시물 작성 성공 후 목록 새로고침
                await loadPosts();
                setNewPost({
                    title: '',
                    content: '',
                    category: '교통',
                    location: '',
                    locationType: 'current',
                    images: [],
                    imagePreviewUrls: [],
                });
                setShowPostForm(false);
                alert('게시물이 성공적으로 작성되었습니다!');
            } else {
                const errorData = await response.json();
                alert(errorData.message || '게시물 작성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Post creation error:', error);
            alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    // 게시물 정렬 및 필터링 함수
    const getSortedAndFilteredPosts = () => {
        let filteredPosts = posts;

        // 카테고리 필터링
        if (activeCategory !== '전체') {
            filteredPosts = posts.filter((post) => post.category === activeCategory);
        }

        // 정렬
        if (sortBy === 'latest') {
            // 최신순 정렬 (시간 기준)
            filteredPosts.sort((a, b) => {
                const timeValues = {
                    '방금 전': 0,
                    '2분 전': 2,
                    '15분 전': 15,
                    '1시간 전': 60,
                };
                return (timeValues[a.time] || 0) - (timeValues[b.time] || 0);
            });
        } else if (sortBy === 'likes') {
            // 좋아요순 정렬
            filteredPosts.sort((a, b) => b.likes - a.likes);
        }

        return filteredPosts;
    };

    return (
        <div className="community-page">
            {/* Header */}
            <header className="community-header">
                <div className="header-left">
                    <button className="back-btn" onClick={handleBack}>
                        ← 돌아가기
                    </button>
                    <h1 className="page-title">Seoul AI 커뮤니티</h1>
                </div>
                <div className="header-right">
                    {isAuthenticated ? (
                        <div className="user-info">
                            <span className="welcome-text">안녕하세요, {currentUser?.username}님</span>
                            <button className="new-post-btn" onClick={handleNewPostClick}>
                                + 새 글 작성
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                                로그인
                            </button>
                            <button className="new-post-btn" onClick={handleNewPostClick}>
                                + 새 글 작성
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="community-content">
                {/* Statistics Section */}
                <div className="community-stats-section">
                    <div className="stat-card">
                        <span className="stat-number">152</span>
                        <span className="stat-label">전체 게시물</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">47</span>
                        <span className="stat-label">활성 사용자</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">23</span>
                        <span className="stat-label">오늘 작성</span>
                    </div>
                </div>

                {/* Post Form Modal */}
                {showPostForm && (
                    <div className="post-form-overlay">
                        <div className="post-form-modal">
                            <div className="modal-header">
                                <h3>새 글 작성</h3>
                                <button className="close-btn" onClick={() => setShowPostForm(false)}>
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleSubmitPost}>
                                <div className="form-group">
                                    <label>카테고리</label>
                                    <select
                                        value={newPost.category}
                                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                    >
                                        <option value="교통">교통</option>
                                        <option value="민원">민원</option>
                                        <option value="지역정보">지역정보</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>제목</label>
                                    <input
                                        type="text"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        placeholder="제목을 입력하세요"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>내용</label>
                                    <textarea
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        placeholder="내용을 입력하세요"
                                        rows="5"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>위치</label>
                                    <div className="location-selector">
                                        <div className="location-type-buttons">
                                            <button
                                                type="button"
                                                className={`location-type-btn ${
                                                    newPost.locationType === 'current' ? 'active' : ''
                                                }`}
                                                onClick={() => handleLocationTypeChange('current')}
                                            >
                                                📍 현재위치
                                            </button>
                                            <button
                                                type="button"
                                                className={`location-type-btn ${
                                                    newPost.locationType === 'search' ? 'active' : ''
                                                }`}
                                                onClick={() => handleLocationTypeChange('search')}
                                            >
                                                🔍 찾기
                                            </button>
                                        </div>
                                        {newPost.locationType === 'search' && (
                                            <input
                                                type="text"
                                                value={newPost.location}
                                                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                                                placeholder="위치를 입력하세요 (예: 강남구 역삼동)"
                                                required
                                            />
                                        )}
                                        {newPost.locationType === 'current' && (
                                            <div className="current-location">
                                                <span>📍 현재 위치</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowPostForm(false)}>
                                        취소
                                    </button>
                                    <button type="submit">작성하기</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                <div className="posts-section">
                    <div className="section-header">
                        <h2>최근 게시물</h2>
                        <div className="header-controls">
                            <div className="sort-controls">
                                <button
                                    className={`sort-btn ${sortBy === 'latest' ? 'active' : ''}`}
                                    onClick={() => setSortBy('latest')}
                                >
                                    최신순
                                </button>
                                <button
                                    className={`sort-btn ${sortBy === 'likes' ? 'active' : ''}`}
                                    onClick={() => setSortBy('likes')}
                                >
                                    좋아요순
                                </button>
                            </div>
                            <div className="filter-tabs">
                                <button
                                    className={`tab ${activeCategory === '전체' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('전체')}
                                >
                                    전체
                                </button>
                                <button
                                    className={`tab ${activeCategory === '교통' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('교통')}
                                >
                                    교통
                                </button>
                                <button
                                    className={`tab ${activeCategory === '민원' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('민원')}
                                >
                                    민원
                                </button>
                                <button
                                    className={`tab ${activeCategory === '지역정보' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('지역정보')}
                                >
                                    지역정보
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="posts-list">
                        {loading ? (
                            <div className="loading-state">
                                <p>게시물을 불러오는 중...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <p>{error}</p>
                                <button onClick={loadPosts}>다시 시도</button>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="empty-state">
                                <p>등록된 게시물이 없습니다.</p>
                            </div>
                        ) : (
                            getSortedAndFilteredPosts().map((post) => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <span className={`category-tag ${post.category}`}>{post.category}</span>
                                        <span className="post-time">{post.time}</span>
                                    </div>
                                    <h3 className="post-title">{post.title}</h3>
                                    <p className="post-content">{post.content}</p>
                                    <div className="post-location">📍 {post.location}</div>
                                    <div className="post-footer">
                                        <div className="post-author">
                                            <span className="author-icon">👤</span>
                                            <span className="author-name">{post.author}</span>
                                        </div>
                                        <div className="post-actions">
                                            <button className="action-btn" onClick={() => handleLikeToggle(post.id)}>
                                                👍 {post.likes || 0}
                                            </button>
                                            <button className="action-btn">💬 {post.comments || 0}</button>
                                            <button className="action-btn">📤 공유</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

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

export default CommunityPage;
