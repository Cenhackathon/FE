import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tmap = ({ popularPosts = [] }) => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const initialized = useRef(false);
    const polylineRef = useRef([]);
    const markersRef = useRef([]);
    const [trafficVisible, setTrafficVisible] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(true);

    // Polyline 생성/갱신 함수
    const fetchTraffic = async () => {
        if (!mapRef.current) return;

        try {
            const TMAP_APP_KEY = process.env.REACT_APP_TMAP_API_KEY;

            // URLSearchParams를 사용해 쿼리 파라미터 구성
            const url = new URL('https://apis.openapi.sk.com/tmap/traffic');
            url.searchParams.append('version', '1');
            url.searchParams.append('reqCoordType', 'WGS84GEO');
            url.searchParams.append('resCoordType', 'WGS84GEO');
            url.searchParams.append('zoomLevel', mapRef.current.getZoom().toString());
            url.searchParams.append('trafficType', 'AUTO');
            url.searchParams.append('centerLon', '127.0595');
            url.searchParams.append('centerLat', '37.5979');
            url.searchParams.append('appKey', TMAP_APP_KEY);

            const res = await fetch(url.toString());
            const data = await res.json();

            const features = data.features || [];

            polylineRef.current.forEach((p) => p.setMap(null));
            polylineRef.current = [];

            if (!trafficVisible) return; // 교통 OFF면 그리지 않고 종료

            const bounds = new window.Tmapv2.LatLngBounds();

            features.forEach((feature) => {
                if (feature.geometry.type !== 'LineString') return;

                const path = feature.geometry.coordinates.map(([lon, lat]) => new window.Tmapv2.LatLng(lat, lon));
                path.forEach((p) => bounds.extend(p));

                const congestion = feature.properties.congestion || 0;
                let lineColor = '#61AB25'; // 원활
                if (congestion === 2) lineColor = '#FFFF00';
                else if (congestion === 3) lineColor = '#E87506';
                else if (congestion === 4) lineColor = '#D61125';

                const polyline = new window.Tmapv2.Polyline({
                    path,
                    strokeColor: lineColor,
                    strokeWeight: 3,
                    map: mapRef.current,
                });

                polylineRef.current.push(polyline);
            });
        } catch (e) {
            console.error('교통 API 오류:', e);
        }
    };

    // 인기게시물 마커 생성/갱신 함수
    const updatePopularPostMarkers = () => {
        if (!mapRef.current) return;

        // 기존 마커들 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // 새로운 마커들 추가
        popularPosts.forEach((post, index) => {
            if (post.latitude && post.longitude) {
                const marker = new window.Tmapv2.Marker({
                    position: new window.Tmapv2.LatLng(post.latitude, post.longitude),
                    map: mapRef.current,
                    title: `🔥 인기 #${index + 1}: ${post.title}`,
                    icon: {
                        url: 'https://api.iconify.design/emojione:fire.svg?width=32&height=32',
                        size: new window.Tmapv2.Size(32, 32),
                        anchor: new window.Tmapv2.Point(16, 32),
                    },
                });

                // 마커 클릭 시 정보창 표시
                const infoWindow = new window.Tmapv2.InfoWindow({
                    position: new window.Tmapv2.LatLng(post.latitude, post.longitude),
                    content: `
                        <div style="padding: 12px; min-width: 220px; font-family: 'Segoe UI', sans-serif;">
                            <h4 style="margin: 0 0 8px 0; color: #ff6b6b; font-size: 14px;">🔥 인기 게시물 #${
                                index + 1
                            }</h4>
                            <p style="margin: 0 0 6px 0; font-weight: bold; font-size: 13px; line-height: 1.3;">${
                                post.title
                            }</p>
                            <p style="margin: 0 0 6px 0; font-size: 11px; color: #666;">${post.category} | ${
                        post.author
                    }</p>
                            <p style="margin: 0 0 6px 0; font-size: 11px;">📍 ${post.location || '위치 정보 없음'}</p>
                            <p style="margin: 0 0 10px 0; font-size: 11px;">👍 ${post.likes} | 💬 ${post.comments} | ${
                        post.time
                    }</p>
                            <button 
                                onclick="window.dispatchEvent(new CustomEvent('navigateToPost', { detail: { postId: ${
                                    post.id
                                } } }))"
                                style="
                                    width: 100%; 
                                    padding: 6px 12px; 
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    color: white; 
                                    border: none; 
                                    border-radius: 6px; 
                                    font-size: 12px; 
                                    font-weight: 500; 
                                    cursor: pointer;
                                    transition: opacity 0.2s ease;
                                "
                                onmouseover="this.style.opacity='0.8'"
                                onmouseout="this.style.opacity='1'"
                            >
                                📄 게시물 상세보기
                            </button>
                        </div>
                    `,
                    type: 2,
                    map: null, // 초기에는 숨김
                });

                marker.addListener('click', () => {
                    infoWindow.setMap(mapRef.current);
                });

                // 지도 클릭 시 정보창 닫기
                mapRef.current.addListener('click', () => {
                    infoWindow.setMap(null);
                });

                markersRef.current.push(marker);
            }
        });
    };

    // 지도 초기화
    useEffect(() => {
        if (!window.Tmapv2 || initialized.current) return;

        const map = new window.Tmapv2.Map('mapDiv', {
            center: new window.Tmapv2.LatLng(37.5979, 127.0595),
            width: '100%',
            height: '100%',
            zoom: 15,
        });
        mapRef.current = map;
        initialized.current = true;

        new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(37.5979, 127.0595),
            map,
            title: '한국외국어대학교',
        });

        fetchTraffic();
        updatePopularPostMarkers();

        let interval;
        if (autoUpdate) interval = setInterval(fetchTraffic, 180000);

        return () => clearInterval(interval);
    }, []);

    // popularPosts가 변경될 때마다 마커 업데이트
    useEffect(() => {
        updatePopularPostMarkers();
    }, [popularPosts]);

    // 게시물 상세페이지 이동 이벤트 리스너
    useEffect(() => {
        const handleNavigateToPost = (event) => {
            const { postId } = event.detail;
            navigate(`/community/${postId}`);
        };

        window.addEventListener('navigateToPost', handleNavigateToPost);

        return () => {
            window.removeEventListener('navigateToPost', handleNavigateToPost);
        };
    }, [navigate]);

    // trafficVisible 변경 시 새로 Polyline 그리기
    useEffect(() => {
        fetchTraffic();
    }, [trafficVisible]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div id="mapDiv" style={{ width: '100%', height: '100%' }} />
            <div className="top-right-buttons">
                <button className="top-right-button" onClick={() => setTrafficVisible((prev) => !prev)}>
                    {trafficVisible ? '교통 OFF' : '교통 ON'}
                </button>
                <button className="top-right-button" onClick={() => setAutoUpdate((prev) => !prev)}>
                    {autoUpdate ? '자동 갱신 OFF' : '자동 갱신 ON'}
                </button>
            </div>
        </div>
    );
};

export default Tmap;
