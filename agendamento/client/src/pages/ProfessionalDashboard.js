// client/src/pages/ProfessionalDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfessionalDashboard() {
    const [clientLink, setClientLink] = useState('http://localhost:3000/prof_12345'); // Exemplo de link
    const [appointmentsToday, setAppointmentsToday] = useState([
        { id: 1, time: '09:00', clientName: 'João da Silva', serviceName: 'Corte de Cabelo' },
        { id: 2, time: '11:00', clientName: 'Maria Souza', serviceName: 'Manicure' },
    ]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(clientLink);
        alert('Link copiado!');
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Início</h1>

            {/* Card de Boas-Vindas */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Bem-vindo(a) de volta, Profissional!</h2>
                <p className="text-gray-500 mt-2">Aqui você pode ver um resumo do seu dia e gerenciar sua agenda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agendamentos do Dia */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Agendamentos de Hoje</h3>
                        <Link to="/appointments" className="text-blue-500 hover:underline">Ver todos</Link>
                    </div>
                    {appointmentsToday.length > 0 ? (
                        <ul className="space-y-4">
                            {appointmentsToday.map(appt => (
                                <li key={appt.id} className="border-b pb-2 last:border-b-0">
                                    <p className="font-medium text-gray-800">{appt.time} - {appt.clientName}</p>
                                    <p className="text-sm text-gray-500">{appt.serviceName}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Nenhum agendamento para hoje.</p>
                    )}
                </div>

                {/* Compartilhar Link */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Compartilhe o link de agendamento</h3>
                    <p className="text-gray-500 mb-4">Envie este link para seus clientes agendarem um horário com você.</p>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={clientLink}
                            readOnly
                            className="flex-1 p-2 border rounded-lg text-gray-700 bg-gray-50"
                        />
                        <button onClick={handleCopyLink} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}