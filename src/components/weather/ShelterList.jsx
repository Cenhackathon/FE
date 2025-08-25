import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShelterList = () => {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://openddm.store';

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4

    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/shelter/list/`);
                setShelters(response.data);
            } catch (err) {
                setError('쉼터 목록을 불러오는 데 실패했습니다.');
                console.error('API 호출 에러:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchShelters();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = shelters.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(shelters.length / itemsPerPage);


    if (loading) {
        return <div>📋 쉼터 목록을 불러오는 중...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (shelters.length === 0) {
        return <div>등록된 쉼터가 없습니다.</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>🌐 무더위 쉼터</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {currentItems.map((shelter, index) => (
                    <li
                        key={shelter.index}
                        style={{ border: '1px solid #eee', marginBottom: '10px', padding: '10px', borderRadius: '4px' }}
                    >
                        <strong>{shelter.name}</strong> ({shelter.category2})
                        <br />
                        주소: {shelter.road_address}
                        <br />
                        수용 인원: {shelter.capacity}명
                    </li>
                ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        style={{ fontWeight: currentPage === number ? 'bold' : 'normal' }}
                    >
                        {number}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default ShelterList;
