import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CommunityPage.css';

function CommunityPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: '강남구 교통 상황 문의',
            content: '강남구 일대 교통 정체가 심한데 개선 방안이 있을까요?',
            author: '시민1234',
            time: '2분 전',
            likes: 15,
            comments: 3,
            category: '교통',
            location: '강남구 역삼동',
        },
        {
            id: 2,
            title: '도로 파손 신고합니다',
            content: '서초구 일대 도로에 큰 구멍이 생겼는데 빠른 수리 부탁드립니다.',
            author: '안전지킴이',
            time: '15분 전',
            likes: 28,
            comments: 7,
            category: '민원',
            location: '서초구 서초동',
        },
        {
            id: 3,
            title: '서울시 공원 정보 공유',
            content: '가족과 함께 갈 수 있는 좋은 공원 정보를 공유합니다.',
            author: '공원러버',
            time: '1시간 전',
            likes: 23,
            comments: 12,
            category: '지역정보',
            location: '한강공원 일대',
        },
    ]);

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

    const handleBack = () => {
        navigate('/');
    };

    const handleLocationTypeChange = (type) => {
        if (type === 'current') {
            setNewPost({ ...newPost, locationType: type, location: '현재 위치' });
        } else {
            setNewPost({ ...newPost, locationType: type, location: '' });
        }
    };

    const handleSubmitPost = (e) => {
        e.preventDefault();
        if (newPost.title && newPost.content && newPost.location) {
            const post = {
                id: posts.length + 1,
                title: newPost.title,
                content: newPost.content,
                author: '새로운사용자',
                time: '방금 전',
                likes: 0,
                comments: 0,
                category: newPost.category,
                location: newPost.location,
            };
            setPosts([post, ...posts]);
            setNewPost({ title: '', content: '', category: '교통', location: '', locationType: 'current' });
            setShowPostForm(false);
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
                <button className="new-post-btn" onClick={() => setShowPostForm(true)}>
                    + 새 글 작성
                </button>
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
                        {getSortedAndFilteredPosts().map((post) => (
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
                                        <button className="action-btn">👍 {post.likes}</button>
                                        <button className="action-btn">💬 {post.comments}</button>
                                        <button className="action-btn">📤 공유</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityPage;
