// 커뮤니티 API 서비스

const BASE_URL = 'http://127.0.0.1:8000';

export const communityService = {
    // 게시글 목록 조회
    getPosts: async () => {
        // API 호출 로직
    },

    // 게시글 상세 조회
    getPostDetail: async (id) => {
        // API 호출 로직
    },

    // 게시글 작성
    createPost: async (postData) => {
        // API 호출 로직
    },

    // 게시글 수정
    updatePost: async (id, postData) => {
        // API 호출 로직
    },

    // 게시글 삭제
    deletePost: async (id) => {
        // API 호출 로직
    },

    // 인기 게시물 조회 (좋아요 10개 이상)
    getPopularPosts: async () => {
        try {
            const response = await fetch(`${BASE_URL}/mainpage/pop/`);
            if (!response.ok) {
                throw new Error('인기 게시물 조회 실패');
            }
            return await response.json();
        } catch (error) {
            console.error('인기 게시물 조회 오류:', error);
            throw error;
        }
    },
};
