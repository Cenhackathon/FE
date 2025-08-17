import React, { useState } from 'react';
import '../../styles/AuthModal.css';

function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // 입력시 에러 메시지 초기화
    };

    const validateForm = () => {
        if (formData.password1 !== formData.password2) {
            setError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        if (formData.password1.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            // TODO: 백엔드 배포시 실제 API URL로 교체
            const baseUrl = 'http://127.0.0.1:8000';

            const response = await fetch(`${baseUrl}/api/auth/registration/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();

                // 회원가입 성공
                onRegisterSuccess();

                // 로그인 모달로 전환
                setFormData({ username: '', email: '', password1: '', password2: '' });
                onSwitchToLogin();

                alert('회원가입이 완료되었습니다. 로그인해주세요.');
            } else {
                const errorData = await response.json();
                setError(errorData.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Register error:', error);
            setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <div className="auth-modal-header">
                    <h2>회원가입</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">사용자명</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="사용자명을 입력하세요"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일을 입력하세요"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password1">비밀번호</label>
                        <input
                            type="password"
                            id="password1"
                            name="password1"
                            value={formData.password1}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요 (8자 이상)"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password2">비밀번호 확인</label>
                        <input
                            type="password"
                            id="password2"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        이미 계정이 있으신가요?{' '}
                        <button type="button" className="switch-auth-btn" onClick={onSwitchToLogin}>
                            로그인
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;
