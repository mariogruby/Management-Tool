import React, { useState, useEffect } from 'react';
import authService from '../services/auth.js';

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const storeToken = (token) => {
        localStorage.setItem("authToken", token);
    };
    const authenticateUser = () => {
        const storedToken = localStorage.getItem("authToken");
    
        if (storedToken) {
            authService
            .verify()
            .then((response) => {
                const user = response.data;
                setIsLoggedIn(true);
                setIsLoading(false);
                setUser(user);
            })
            .catch((error) => {
                setIsLoggedIn(false);
                setIsLoading(false);
                setUser(null);
                console.error("Authentication error:", error);
            });
        } else {
            setIsLoggedIn(false);
            setIsLoading(false);
            setUser(null);
        }
    };
    

    const removeToken = () => {
        localStorage.removeItem("authToken");
    };

    const logOutUser = () => {
        removeToken();
        setIsLoggedIn(false);
        authenticateUser();
    };

    useEffect(() => {
        authenticateUser();
    }, []);

    return (
        <AuthContext.Provider
        value={{
        isLoggedIn,
        isLoading,
        user,
        setUser,
        storeToken,
        authenticateUser,
        logOutUser,
        }}
    >
        {props.children}
    </AuthContext.Provider>
    );
}
export { AuthProvider, AuthContext };