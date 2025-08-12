// client/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from '/pages/Login';
import Register from '/pages/Register';
import Dashboard from './pages/Dashboard'; // Dashboard do Profissional
import ClientDashboard from './pages/ClientDashboard'; // Novo dashboard do Cliente

function AppWrapper() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (token && userData) {
            setIsAuthenticated(true);
            setUserRole(userData.role);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);

    // Use useEffect para redirecionar o usuário após o estado ser definido
    useEffect(() => {
        if (isAuthenticated) {
            if (userRole === 'pro') {
                navigate('/dashboard-pro');
            } else {
                navigate('/dashboard-client');
            }
        }
    }, [isAuthenticated, userRole, navigate]);

    return (
        <div>
            <Routes>
                <Route path="/" element={isAuthenticated ? <AuthRedirect userRole={userRole} /> : <Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard-pro" element={<Dashboard />} />
                <Route path="/dashboard-client" element={<ClientDashboard />} />
            </Routes>
        </div>
    );
}

// Componente auxiliar para redirecionar com base no tipo de usuário
function AuthRedirect({ userRole }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (userRole === 'pro') {
            navigate('/dashboard-pro', { replace: true });
        } else {
            navigate('/dashboard-client', { replace: true });
        }
    }, [userRole, navigate]);
    return null;
}

export default function App() {
    return (
        <AppWrapper />
    );
}