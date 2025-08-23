import React, { useState, useEffect } from 'react';
import axios from 'axios';

/*export default function ShelterList({ shelters }) {
  return (
    <div style={{padding: "1rem"}}>
      <h2>인근 쉼터</h2>
      <ul>
        {shelters.map((shelter) => (
          <li key={shelter.id}>
            {shelter.name} - {shelter.distance}
          </li>
        ))}
      </ul>
    </div>
  );
}*/

const ShelterList = () => {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://openddm.store';

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
                {shelters.map((shelter, index) => (
                    <li
                        key={index}
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
        </div>
    );
};

export default ShelterList;
