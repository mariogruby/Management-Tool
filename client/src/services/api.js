import axios from 'axios';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
    };
    getProjects = () => { 
        return this.api.get('/projects');
    };
    getProjectById = (id) => {
        return this.api.get(`/project/${id}`);
    };
    addProject = (requestBody) => {
        return this.api.post('/project/', requestBody );
    };
    editProject = (id, requestBody) => {
        return this.api.put(`/project/${id}`, requestBody);
    };
    deleteProject = (id) => {
        return this.api.delete(`/project/${id}`);
    };
    addTask = (projectId, requestBody) => {
        return this.api.post(`/project/${projectId}/task`, requestBody);
    };
    getTask = (projectId, taskId) => {
        return this.api.get(`/project/${projectId}/task/${taskId}`);
    };
    editTask = (projectId, taskId, requestBody) => {
        return this.api.put(`/project/${projectId}/task/${taskId}`, requestBody);
    };
    deleteTask = (projectId, taskId) => {
        return this.api.delete(`/project/${projectId}/task/${taskId}`);
    };
    todo = (projectId, data) => {
        return this.api.put(`/project/${projectId}/todo`, data);
    };
};

const apiService = new ApiService();

export default apiService;

//clean code