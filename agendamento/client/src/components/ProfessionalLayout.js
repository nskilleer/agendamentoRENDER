// client/src/components/ProfessionalLayout.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/api';

export default function ProfessionalLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar (Menu) */}
            <aside
                className={`bg-blue-800 text-white w-64 p-6 space-y-6 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative absolute z-50`}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">AgendaFácil</h2>
                    <button
                        className="text-white md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <nav>
                    <Link to="/dashboard" className="nav-link-pro">
                        <i className="fas fa-home mr-2"></i> Início
                    </Link>
                    <Link to="/appointments" className="nav-link-pro">
                        <i className="fas fa-calendar-alt mr-2"></i> Agenda do Dia
                    </Link>
                    <Link to="/calendar" className="nav-link-pro">
                        <i className="fas fa-calendar-days mr-2"></i> Calendário
                    </Link>
                    <Link to="/clients" className="nav-link-pro">
                        <i className="fas fa-users mr-2"></i> Ver Clientes
                    </Link>
                    <Link to="/settings" className="nav-link-pro">
                        <i className="fas fa-cog mr-2"></i> Configurações
                    </Link>
                    <button onClick={handleLogout} className="nav-link-pro w-full text-left mt-8">
                        <i className="fas fa-sign-out-alt mr-2"></i> Sair
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6 md:hidden">
                    <h1 className="text-xl font-bold text-blue-800">AgendaFácil</h1>
                    <button
                        className="text-blue-800"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </header>
                {children}
            </main>
        </div>
    );
}