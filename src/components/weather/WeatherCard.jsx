import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/WeatherCard.css';

const getWeatherImage = (condition) => {
    switch (condition) {
        case '맑음':
            return '/sunny.png';
        case '구름 많음':
        case '흐림':
            return '/cloudy.png';
        case '비':
        case '소나기':
            return '/rainy.png';
        case '눈':
            return '/snowy.png';
        default:
            return '/default.png';
    }
};

const WeatherCard = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://openddm.store';

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const token = localStorage.getItem('token'); // ✅ 로컬스토리지에서 토큰 꺼내오기
                if (!token) {
                    setError('로그인이 필요합니다.');
                    setLoading(false);
                    return;
                }

                const headers = {
                    Authorization: `Token ${token}`, 
                    // 👉 JWT라면: Authorization: `Bearer ${token}`
                };

                const [currentResponse, forecastResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/weather/forecast/?lat=${lat}&lon=${lon}`, { headers }),
                    axios.get(`${API_BASE_URL}/weather/forecast/?lat=${lat}&lon=${lon}`, { headers }),
                ]);

                setCurrentWeather(currentResponse.data);
                setForecast(forecastResponse.data);
                setError(null);
            } catch (err) {
                console.error('날씨 정보 호출 실패:', err);
                setError('날씨 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon);
                },
                (err) => {
                    console.error('위치 정보 가져오기 실패:', err);
                    setError('위치 정보가 차단되어 날씨를 불러올 수 없습니다.');
                    setLoading(false);
                }
            );
        } else {
            setError('위치 정보를 지원하지 않는 브라우저입니다.');
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div className="weather-container">날씨 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="weather-container error">{error}</div>;
    }

    const imageUrl = getWeatherImage(currentWeather.condition);

    return (
        <div className="weather-container">
            <div className="current-weather">
                <h3>📍 현재 날씨</h3>
                <div className="weather">
                    <img className="weatherpic" src={imageUrl} alt={currentWeather.condition} />
                    <div className="weatherinfo">
                        <p className="temp">{currentWeather.temperature}°C</p>
                        {/* API에 체감 온도 데이터가 없으므로 정적인 값을 사용 */}
                        <p>체감 온도: 29°C</p>
                        <p>UV 지수: {currentWeather.uv_index}</p>
                        <p>위험 수준: {currentWeather.heat_alert ? '높음' : '보통'}</p>
                    </div>
                </div>
            </div>

            <div className="forecast">
                <h3>📅 7일간의 날씨 예보</h3>
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <p><strong>{day.date}</strong></p>
                        <p>최고: {day.high}°C / 최저: {day.low}°C</p>
                        <p>상태: {day.condition}</p>
                        <p>강수량: {day.precipitation}mm</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherCard;
