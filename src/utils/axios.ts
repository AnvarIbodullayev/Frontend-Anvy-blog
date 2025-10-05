import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
        // 1-usul: AxiosHeaders methodlarini ishlatish
        config.headers = config.headers ?? {};
        (config.headers as any)["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh_token = Cookies.get("refresh_token");
            if (refresh_token) {
                try {
                    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, { refresh_token });
                    Cookies.set("access_token", res.data.access_token);

                    (originalRequest.headers as any)['Authorization'] = `Bearer ${res.data.access_token}`;
                    return axios(originalRequest);
                } catch (err) {
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    window.location.href = "/signin";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
