import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Livemap.css';
import Tmap from '../components/traffic/Tmap';
import { communityService } from '../services/communityService';

const Livemap = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]); // 교통혼잡도 top3
    const [prediction, setPrediction] = useState([]); // 예측 데이터
    const [alerts, setAlerts] = useState([]); // 실시간 알림
    const [popularPosts, setPopularPosts] = useState([]); // 인기게시물

    // 좌표를 행정동으로 변환, 실패 시 기본값 사용
    const getAddressName = useCallback(async (lon, lat) => {
        const TMAP_APP_KEY = process.env.REACT_APP_TMAP_API_KEY;
        const url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${lat}&lon=${lon}&coordType=WGS84GEO`;

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { appKey: TMAP_APP_KEY },
            });
            const data = await res.json();
            return data.addressInfo?.legalDong || data.addressInfo?.roadName || '알 수 없는 지역';
        } catch (err) {
            console.error('주소 변환 에러:', err);
            return '알 수 없는 지역';
        }
    }, []);

    const getPosts = useCallback(async () => {
        try {
            const TMAP_APP_KEY = process.env.REACT_APP_TMAP_API_KEY;
            const tmapUrl = `https://apis.openapi.sk.com/tmap/traffic?version=1&reqCoordType=WGS84GEO&resCoordType=WGS84GEO&trafficType=AUTO&centerLon=127.0595&centerLat=37.5979&zoomLevel=15`;
            const tmapResponse = await fetch(tmapUrl, {
                method: 'GET',
                headers: { appKey: TMAP_APP_KEY },
            });

            if (!tmapResponse.ok) throw new Error(`HTTP error! status: ${tmapResponse.status}`);

            const tmapData = await tmapResponse.json();
            const features = tmapData.features || [];

            const usedRoads = new Set();
            const topPosts = [];

            // 반복하며 중복 도로 제거, top3 확보
            for (const feature of features
                .filter((f) => f.geometry.type === 'LineString' && f.properties.congestion)
                .sort((a, b) => b.properties.congestion - a.properties.congestion)) {
                if (topPosts.length >= 3) break;

                const props = feature.properties;
                const coords = feature.geometry.coordinates;
                const [lon, lat] = coords[0];

                let roadName = '도로명 정보 없음';
                if (props.name) roadName = props.name.split('/')[0];
                else if (props.routeNo) roadName = `도로 번호 ${props.routeNo}`;
                else if (props.linkId) roadName = `도로 ID ${props.linkId}`;

                if (usedRoads.has(roadName)) continue; // 이미 나온 도로는 건너뛰기

                const areaName = await getAddressName(lon, lat);

                const congestionLevel =
                    {
                        1: '원활',
                        2: '서행',
                        3: '지체',
                        4: '정체',
                    }[props.congestion] || '정보 없음';

                topPosts.push({
                    name: `${roadName} (${areaName}) - ${congestionLevel}`,
                });
                usedRoads.add(roadName);
            }

            setPosts(topPosts);

            // 실시간 알림 백엔드 호출
            const response = await axios.get('http://127.0.0.1:8000/');
            const data = response.data;
            const newAlerts = data.posts
                .filter((post) => post.isAccidentNode === 'Y')
                .map((post) => ({
                    type: 'Y',
                    message: post.description,
                    traffictype: post.accidentUppercode,
                    coordinates: post.coordinates,
                }));
            setAlerts(newAlerts);

            setPrediction(data.prediction || []);
        } catch (error) {
            console.log('에러: ', error);
        }
    }, [getAddressName]);

    // 인기게시물 로드 함수
    const loadPopularPosts = useCallback(async () => {
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
    }, []);

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

    const handleBack = () => navigate('/');

    useEffect(() => {
        getPosts();
        loadPopularPosts(); // 인기게시물 로드 추가
    }, [getPosts, loadPopularPosts]);

    return (
        <div className="traffic-page-container">
            <header className="traffic-header">
                <div className="header-left">
                    <button className="back-btn" onClick={handleBack}>
                        ← 돌아가기
                    </button>
                    <h1 className="page-title">LiveMap</h1>
                </div>
            </header>

            <div className="map-placeholder">
                <Tmap popularPosts={popularPosts} alerts={alerts} />
            </div>

            <div className="sidebar">
                <h3>교통 혼잡도 TOP3</h3>
                <ul className="legend-list">
                    {posts.map((post, index) => (
                        <li key={index}>{`${index + 1}. ${post.name}`}</li>
                    ))}
                </ul>

                <h3>예측 데이터</h3>
                <ul className="legend-list">
                    <p className="prediction-text">도로 혼잡 예상 구간: {prediction.join(', ')}</p>
                </ul>

                <h3>실시간 알림</h3>
                <ul className="legend-list">
                    {alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={
                                alert.type === 'Y' && (alert.traffictype === 'A' || alert.traffictype === 'D')
                                    ? 'alert-box-red'
                                    : 'alert-box-yellow'
                            }
                        >
                            {alert.type === 'Y' && (alert.traffictype === 'A' || alert.traffictype === 'D')
                                ? '🚨 '
                                : '🚧 '}
                            {alert.message}
                        </div>
                    ))}
                </ul>

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
