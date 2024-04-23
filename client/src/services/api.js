import axios from 'axios'

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
                console.log("Token JWT adjuntado a la solicitud:", storedToken);
            }
            return config;
        });
    }
    login = (requestBody) => {
        return this.api.post("/auth/login", requestBody);
    };

    signup = (requestBody) => {
        return this.api.post("/auth/signup", requestBody);
    };

    verify = () => {
        return this.api.get("/auth/verify");
    };
}

const apiService = new ApiService();

export default apiService;
