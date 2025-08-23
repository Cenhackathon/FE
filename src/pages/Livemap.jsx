import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Livemap.css';
import Tmap from '../components/traffic/Tmap';
import { communityService } from '../services/communityService';

const Livemap = () => {
    const [posts, setPosts] = useState([]); // 교통혼잡도 top3
    const [prediction, setPrediction] = useState([]); // 예측 데이터
    const [alerts, setAlerts] = useState([]); // 실시간 알림
    const [popularPosts, setPopularPosts] = useState([]); // 인기게시물

    const getPosts = async () => {
        // 백엔드 보고 맞춰야함
        try {
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
    };

    // 인기게시물 로드 함수
    const loadPopularPosts = async () => {
        try {
            const data = await communityService.getPopularPosts();
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

    useEffect(() => {
        getPosts();
        loadPopularPosts(); // 인기게시물 로드 추가
    }, []);

    return (
        <div className="traffic-page-container">
            <div className="map-placeholder">
                <Tmap popularPosts={popularPosts} />
            </div>

            <div className="sidebar">
                <h3>🚦 교통 혼잡도 안내</h3>
                <ul className="legend-list"></ul>

                <h3>교통 혼잡도 TOP3</h3>
                <ul className="legend-list"></ul>
                <h3>예측 데이터</h3>
                <ul className="legend-list"></ul>

                <h3>실시간 알림</h3>
                <ul className="legend-list"></ul>

                <h3>🔥 인기 게시물 ({popularPosts.length})</h3>
                <ul className="legend-list popular-posts-list">
                    {popularPosts.length > 0 ? (
                        popularPosts.map((post, index) => (
                            <li key={post.id} className="popular-post-item">
                                <div className="post-rank">#{index + 1}</div>
                                <div className="post-info">
                                    <div className="post-title-small">{post.title}</div>
                                    <div className="post-meta">
                                        <span className="post-category">{post.category}</span>
                                        <span className="post-likes">👍 {post.likes}</span>
                                    </div>
                                    <div className="post-location">📍 {post.location}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="no-popular-posts-msg">인기 게시물이 없습니다</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Livemap;
