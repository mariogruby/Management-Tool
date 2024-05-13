import axios from 'axios';

class AuthService {
    constructor() {
        this.auth = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.auth.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
    };
    login = (requestBody) => {
        return this.auth.post("/login", requestBody);
    };
    signup = (requestBody) => {
        return this.auth.post("/signup", requestBody);
    };
    updateUser = (requestBody) => {
        return this.auth.put("/update", requestBody);
    };
    verify = () => {
        return this.auth.get("/verify");
    };
};

const authService = new AuthService();

export default authService;