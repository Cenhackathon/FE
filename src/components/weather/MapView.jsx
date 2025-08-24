import { Map} from 'react-kakao-maps-sdk';
import "../../styles/MapView.css";

export default function MapView() {
  return (
    <Map 
      center={{ lat: 37.5962, lng: 127.0577 }} // 👈 한국외국어대학교 좌표로 변경
      style={{ width: '100%', height: '100%' }} // 👈 크기를 100%로 변경
      level={3} 
    />
  );
}








  /*return (
    <div className="map-container">
      <Map center={{ lat: 33.450701, lng: 126.570667 }} className="map-area" level={4}>

      </Map>
    </div>
  )
}*/

/*export default function MapView() {
  useEffect(() => {
     // 👈 카카오맵 JavaScript 키 입력
    const KAKAO_MAP_APP_KEY = process.env.REACT_APP_KAKAO_API_KEY;

    
        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                initMap();
            } else {
                const script = document.createElement('script');
                script.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`;
                script.onload = () => {
                    window.kakao.maps.load(() => {
                        initMap();
                    });
                };
                document.head.appendChild(script);
            }
        };

        const initMap = () => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
              center: new window.kakao.maps.LatLng(37.5962, 127.0577), 
              level: 3,
            };

            new window.kakao.maps.Map(mapContainer, mapOption);
        };

        loadKakaoMap();
    },[]);

    return (
        <div className="map-container">
        <div id="map" className="map-area"
            ></div>
        </div>
    );
};*/





/*export default function MapView() {
  const position = {
    lat: 37.5962, // 위도
    lng: 127.0577, // 경도
  };

  return (
    <div className="map-container">
      <Map
        center={position}
        className="map-area" // CSS 클래스 이름 적용
        level={3}
      >
        {/* 지도에 마커를 표시하고 싶다면 MapMarker를 사용하세요 */
        /*<MapMarker position={position} />
      </Map>
    </div>
  );
}*/



/*export default function MapView() {
  useEffect(() => {
    // API 키를 .env 파일에서 불러옵니다.
    const KAKAO_MAP_APP_KEY = process.env.REACT_APP_KAKAO_API_KEY;
    
    const initMap = () => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5962, 127.0577),
        level: 3,
      };
      new window.kakao.maps.Map(mapContainer, mapOption);
    };

    // --- 스크립트 로딩 로직 ---
    
    // 1. 이미 카카오맵 스크립트가 로드되었는지 확인합니다.
    if (window.kakao && window.kakao.maps) {
      // 이미 로드되었다면 즉시 지도를 초기화합니다.
      initMap();
    } else {
      // 2. 스크립트가 로드되지 않았다면, 새로운 스크립트 태그를 생성합니다.
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`;
      document.head.appendChild(script);

      // 3. 스크립트 로드가 완료되면 실행될 콜백 함수를 등록합니다.
      script.onload = () => {
        // 4. (가장 중요!) 스크립트가 로드된 후, 카카오맵 API가 모든 기능을 준비할 때까지 기다리는 함수입니다.
        window.kakao.maps.load(() => {
          // 모든 기능이 준비되면 지도를 초기화합니다.
          initMap();
        });
      };
    }
  }, []); // useEffect가 처음 한 번만 실행되도록 빈 배열을 전달합니다.

  return (
    <div className="map-container">
      <div id="map" className="map-area"></div>
    </div>
  );
}*/