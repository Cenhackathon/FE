import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import TrafficPage from '../pages/TrafficPage';
import WeatherPage from '../pages/WeatherPage';
import CommunityPage from '../pages/CommunityPage';
import ChatbotPage from '../pages/ChatbotPage';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/traffic" element={<TrafficPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
    );
}

export default AppRouter;
