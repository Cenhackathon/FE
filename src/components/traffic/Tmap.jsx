import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Tmap = ({ popularPosts = [], currentLocation = null, alerts = [] }) => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const initialized = useRef(false);
    const polylineRef = useRef([]);
    const markersRef = useRef([]);
    const currentLocationMarkerRef = useRef(null);
    const alertMarkersRef = useRef([]);
    const [trafficVisible, setTrafficVisible] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(true);

    // Polyline 생성/갱신 함수
    const fetchTraffic = useCallback(async () => {
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
    }, [mapRef, trafficVisible]);

    // 알림에 따라 마커 추가
    const addAlertMarkers = useCallback(() => {
        if(!mapRef.current || !window.Tmapv2) return;

        // 기존 알림 마커 제거
        alertMarkersRef.current.forEach(marker => marker.setMap(null));
        alertMarkersRef.current = [];

        // 알림에 따라 마커 추가
        alerts.forEach(alert => {
            if(alert.coordinates && alert.coordinates.length === 2){
                const [lon, lat] = alert.coordinates;
                const marker = new window.Tmapv2.Marker({
                    position: new window.Tmapv2.LatLng(lat, lon),
                    map: mapRef.current,
                    title: alert.message || alert.name,
                });
                alertMarkersRef.current.push(marker);
            }
        });
    }, [alerts]);

    // 인기게시물 마커 생성/갱신 함수
    const updatePopularPostMarkers = () => {
        console.log('updatePopularPostMarkers 호출:', {
            mapRef: !!mapRef.current,
            popularPostsCount: popularPosts.length,
            popularPosts,
        });

        if (!mapRef.current) {
            console.log('지도 참조 없음, 마커 업데이트 중단');
            return;
        }

        // 기존 마커들 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
        console.log('기존 인기게시물 마커들 제거 완료');

        // 새로운 마커들 추가
        popularPosts.forEach((post, index) => {
            console.log(`인기게시물 ${index + 1} 처리:`, post);
            if (post.latitude && post.longitude) {
                console.log(`마커 생성 중: ${post.title} at (${post.latitude}, ${post.longitude})`);

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
                console.log(`마커 생성 완료: ${post.title}`, marker);
            } else {
                console.log(`마커 생성 실패 - 좌표 없음: ${post.title}`, {
                    latitude: post.latitude,
                    longitude: post.longitude,
                });
            }
        });

        console.log(`총 ${markersRef.current.length}개의 인기게시물 마커 생성됨`);
    };

    // 현재 위치 마커 업데이트
    const updateCurrentLocationMarker = () => {
        console.log('updateCurrentLocationMarker 호출:', {
            mapRef: !!mapRef.current,
            currentLocation,
        });

        if (!mapRef.current || !currentLocation || currentLocation.loading) {
            console.log('마커 업데이트 조건 미충족');
            return;
        }

        // 기존 현재 위치 마커 제거
        if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setMap(null);
            console.log('기존 마커 제거됨');
        }

        // 에러가 있으면 기본 위치 사용, 없으면 현재 위치 사용
        const markerPosition = currentLocation.error
            ? new window.Tmapv2.LatLng(37.5979, 127.0595) // 기본 위치
            : new window.Tmapv2.LatLng(currentLocation.latitude, currentLocation.longitude);

        const markerTitle = currentLocation.error ? '기본 위치 (한국외국어대학교)' : '현재 위치';
        const markerColor = currentLocation.error ? '#dc3545' : '#4285F4'; // 에러시 빨간색, 정상시 파란색

        console.log('마커 생성 중:', { markerTitle, markerColor, position: markerPosition });

        // 새로운 현재 위치 마커 추가 (기본 마커 사용)
        const marker = new window.Tmapv2.Marker({
            position: markerPosition,
            map: mapRef.current,
            title: markerTitle,
        });

        currentLocationMarkerRef.current = marker;
        console.log('새 마커 생성 완료:', marker);

        // 지도 중심을 마커 위치로 이동 (부드러운 이동)
        mapRef.current.panTo(markerPosition);
    };

    // 지도 초기화
    useEffect(() => {
        if (!window.Tmapv2 || initialized.current) return;

        console.log('지도 초기화 시작');

        // 기본 중심 위치 (한국외국어대학교)
        const initialCenter = new window.Tmapv2.LatLng(37.5979, 127.0595);

        const map = new window.Tmapv2.Map('mapDiv', {
            center: initialCenter,
            width: '100%',
            height: '100%',
            zoom: 14,
        });
        mapRef.current = map;
        initialized.current = true;

        console.log('지도 생성 완료:', map);

        // 기본 테스트 마커 추가 (한국외국어대학교)
        const testMarker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(37.5979, 127.0595),
            map: map,
            title: '한국외국어대학교 (테스트 마커)',
        });
        console.log('테스트 마커 추가됨:', testMarker);

        // 약간의 지연 후 마커들 추가 (지도 렌더링 완료 대기)
        setTimeout(() => {
            fetchTraffic();
            updatePopularPostMarkers();
            updateCurrentLocationMarker();
            addAlertMarkers();
        }, 100);

        let interval;
        if (autoUpdate) interval = setInterval(fetchTraffic, 180000);

        return () => clearInterval(interval);
    }, [autoUpdate, fetchTraffic]);

    // currentLocation이 변경될 때마다 현재 위치 마커 업데이트
    useEffect(() => {
        if (mapRef.current) {
            updateCurrentLocationMarker();
        }
    }, [currentLocation]);

    // popularPosts가 변경될 때마다 마커 업데이트
    useEffect(() => {
        updatePopularPostMarkers();
    }, [popularPosts]);

    // alerts가 변경될 때마다 알림 마커 업데이트
    useEffect(() => {
        if (mapRef.current) {
            addAlertMarkers();
        }
    }, [addAlertMarkers]);

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
    }, [fetchTraffic]);

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