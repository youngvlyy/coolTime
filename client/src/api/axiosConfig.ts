import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 공통 prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  (error) => {
    // 예상된 404 무시
    if (error.response?.status === 404) {
      console.warn("예상된 404 (새 유저 생성 필요) → 무시");
      return Promise.resolve({ data: null }); //에러가 아니라 null로 바꿈
    }

    // 다른 에러는 콘솔 출력
    console.error("Axios 에러:", error);
    return Promise.reject(error);
  }
);

export default api;
