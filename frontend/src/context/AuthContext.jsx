import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentProfile = async () => {
        try {
            const userData = await getProfile();
            setUser(userData);
        } catch (error) {
            console.warn("Session expired or invalid credentials:", error);
            logout();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                await fetchCurrentProfile();
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        const { access_token, user: userData } = data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password) => {
        const data = await registerUser(name, email, password);
        const { access_token, user: userData } = data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, refreshProfile: fetchCurrentProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
