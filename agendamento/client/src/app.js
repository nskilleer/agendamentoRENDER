import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout e Componentes
import ProfessionalLayout from './components/ProfessionalLayout';

// Páginas de Autenticação
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas do Profissional (conteúdo a ser renderizado dentro do Layout)
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar';
import Clients from './pages/Clients';
import Settings from './pages/Settings';

// Páginas Públicas
import ClientBooking from './pages/ClientBooking';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Protegidas do Profissional, usando o Layout */}
        <Route path="/dashboard" element={<ProfessionalLayout><ProfessionalDashboard /></ProfessionalLayout>} />
        <Route path="/appointments" element={<ProfessionalLayout><Appointments /></ProfessionalLayout>} />
        <Route path="/calendar" element={<ProfessionalLayout><Calendar /></ProfessionalLayout>} />
        <Route path="/clients" element={<ProfessionalLayout><Clients /></ProfessionalLayout>} />
        <Route path="/settings" element={<ProfessionalLayout><Settings /></ProfessionalLayout>} />

        {/* Rota Pública para o Cliente */}
        <Route path="/:professionalId" element={<ClientBooking />} />
      </Routes>
    </div>
  );
}

export default App;