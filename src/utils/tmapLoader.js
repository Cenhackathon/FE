// T맵 스크립트 동적 로드 유틸리티
export const loadTmapScript = () => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있다면 즉시 resolve
    if (window.Tmapv2) {
      resolve(window.Tmapv2);
      return;
    }

    // 이미 스크립트 태그가 있다면 로드 완료를 기다림
    const existingScript = document.querySelector('script[src*="tmap/jsv2"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Tmapv2));
      existingScript.addEventListener('error', reject);
      return;
    }

    const TMAP_APP_KEY = process.env.REACT_APP_TMAP_API_KEY;
    
    if (!TMAP_APP_KEY || TMAP_APP_KEY === 'your_tmap_api_key_here') {
      reject(new Error('T맵 API 키가 설정되지 않았습니다.'));
      return;
    }

    // 새로운 스크립트 태그 생성
    const script = document.createElement('script');
    script.src = `https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${TMAP_APP_KEY}`;
    script.async = true;
    
    script.onload = () => {
      if (window.Tmapv2) {
        resolve(window.Tmapv2);
      } else {
        reject(new Error('T맵 라이브러리 로드 실패'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('T맵 스크립트 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};

// T맵 초기화 대기
export const waitForTmap = (maxWaitTime = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkTmap = () => {
      if (window.Tmapv2) {
        resolve(window.Tmapv2);
        return;
      }
      
      if (Date.now() - startTime > maxWaitTime) {
        reject(new Error('T맵 로드 타임아웃'));
        return;
      }
      
      setTimeout(checkTmap, 100);
    };
    
    checkTmap();
  });
};
