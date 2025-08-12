import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import AppointmentForm from '../components/AppointmentForm'; // Importa o novo componente

export default function ClientDashboard() {
    const [user, setUser] = useState(null);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!token || !userData || userData.role !== 'user') {
            navigate('/login');
        } else {
            setUser(userData);
            setAuthToken(token);
            fetchServices();
            fetchMyAppointments();
            fetchProfessionals();
        }
    }, [navigate]);

    const fetchServices = async () => {
        try {
            const response = await api.get('/public/services');
            setServices(response.data);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    };

    const fetchProfessionals = async () => {
        try {
            const response = await api.get('/public/professionals');
            setProfessionals(response.data);
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error);
        }
    };

    const fetchAvailableHours = async (professionalId, date) => {
        try {
            const response = await api.get(`/public/available-hours?professionalId=${professionalId}&date=${date}`);
            setAvailableHours(response.data);
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
            setAvailableHours([]);
        }
    };

    const fetchMyAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Erro ao buscar meus agendamentos:', error);
        }
    };

    const handleBookingSubmit = async (title, notes) => {
        if (!selectedService || !selectedProfessional || !selectedHour) {
            alert('Por favor, selecione um serviço, profissional e horário.');
            return;
        }
        try {
            const appointmentDate = new Date(selectedHour);

            const newAppointment = {
                title: title,
                date: appointmentDate.toISOString(),
                notes: notes,
                professionalId: selectedProfessional._id,
                serviceId: selectedService._id
            };
            await api.post('/appointments', newAppointment);
            alert('Agendamento criado com sucesso!');

            setSelectedService(null);
            setSelectedProfessional(null);
            setSelectedDate('');
            setSelectedHour('');
            setAvailableHours([]);
            fetchMyAppointments();
        } catch (error) {
            console.error('Erro ao agendar:', error);
            alert('Erro ao criar agendamento. Tente novamente.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setAuthToken(null);
        navigate('/login');
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        if (selectedProfessional) {
            fetchAvailableHours(selectedProfessional._id, newDate);
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand">Dashboard do Cliente</span>
                    <div className="d-flex gap-2">
                        <button className="btn btn-info" onClick={() => setShowAppointmentsModal(true)}>Meus Agendamentos</button>
                        <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {user && <h1>Bem-vindo, {user.name}!</h1>}
                <p className="lead">Selecione um serviço e um horário para agendar.</p>

                <div className="card mb-4">
                    <div className="card-header">1. Selecione um Serviço</div>
                    <div className="card-body">
                        <div className="d-flex flex-wrap gap-2">
                            {services.length === 0 ? (
                                <p>Nenhum serviço disponível no momento.</p>
                            ) : (
                                services.map(service => (
                                    <button
                                        key={service._id}
                                        className={`btn ${selectedService?._id === service._id ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSelectedService(service)}
                                    >
                                        {service.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {selectedService && (
                    <div className="card mb-4">
                        <div className="card-header">2. Selecione um Profissional</div>
                        <div className="card-body">
                            {professionals.length === 0 ? (
                                <p>Nenhum profissional disponível.</p>
                            ) : (
                                <div className="d-flex flex-wrap gap-2">
                                    {professionals.map(prof => (
                                        <button
                                            key={prof._id}
                                            className={`btn ${selectedProfessional?._id === prof._id ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setSelectedProfessional(prof)}
                                        >
                                            {prof.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedProfessional && (
                    <AppointmentForm
                        selectedService={selectedService}
                        selectedProfessional={selectedProfessional}
                        selectedHour={selectedHour}
                        availableHours={availableHours}
                        onBookingSubmit={handleBookingSubmit}
                        onDateChange={handleDateChange}
                        onHourSelect={setSelectedHour}
                    />
                )}
            </div>

            {showAppointmentsModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Meus Agendamentos</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAppointmentsModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {appointments.length === 0 ? (
                                    <p>Você não tem agendamentos.</p>
                                ) : (
                                    <ul className="list-group">
                                        {appointments.map(ap => (
                                            <li key={ap._id} className="list-group-item">
                                                <p><strong>{ap.title}</strong></p>
                                                <p>Data: {new Date(ap.date).toLocaleString()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}