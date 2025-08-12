import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showAgendaModal, setShowAgendaModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [services, setServices] = useState([]);

    const [scheduleForm, setScheduleForm] = useState({ dayOfWeek: 'Segunda', startTime: '', endTime: '' });
    const [serviceForm, setServiceForm] = useState({ name: '', duration: '', price: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!token || !userData || userData.role !== 'pro') {
            navigate('/login');
        } else {
            setUser(userData);
            setAuthToken(token);
        }
    }, [navigate]);

    const fetchSchedules = async () => {
        try {
            const response = await api.get('/appointments/schedules');
            setSchedules(response.data);
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await api.get('/appointments/services');
            setServices(response.data);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setAuthToken(null);
        navigate('/login');
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments/schedules', scheduleForm);
            setScheduleForm({ dayOfWeek: 'Segunda', startTime: '', endTime: '' });
            fetchSchedules();
        } catch (error) {
            console.error('Erro ao salvar horário:', error);
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments/services', serviceForm);
            setServiceForm({ name: '', duration: '', price: '' });
            fetchServices();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
        }
    };

    const handleCancelAppointment = async (id) => {
        try {
            await api.patch(`/appointments/${id}/cancel`);
            alert('Agendamento cancelado com sucesso!');
            fetchAppointments();
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            alert('Erro ao cancelar agendamento.');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand">Dashboard Profissional</span>
                    <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
                </div>
            </nav>

            <div className="container mt-4">
                {user && <h1>Bem-vindo, {user.name}!</h1>}
                <div className="d-flex gap-3">
                    <button className="btn btn-primary" onClick={() => { setShowAgendaModal(true); fetchAppointments(); }}>Ver Agenda</button>
                    <button className="btn btn-success" onClick={() => { setShowConfigModal(true); fetchSchedules(); fetchServices(); }}>Configurar</button>
                </div>
            </div>

            {showConfigModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Configurar Horários e Serviços</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfigModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4>Horários de Funcionamento</h4>
                                        <form onSubmit={handleScheduleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label">Dia da Semana</label>
                                                <select className="form-select" value={scheduleForm.dayOfWeek} onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })}>
                                                    <option value="Segunda">Segunda-feira</option>
                                                    <option value="Terça">Terça-feira</option>
                                                    <option value="Quarta">Quarta-feira</option>
                                                    <option value="Quinta">Quinta-feira</option>
                                                    <option value="Sexta">Sexta-feira</option>
                                                    <option value="Sábado">Sábado</option>
                                                    <option value="Domingo">Domingo</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Abertura</label>
                                                <input type="time" className="form-control" value={scheduleForm.startTime} onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Fechamento</label>
                                                <input type="time" className="form-control" value={scheduleForm.endTime} onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} required />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">Salvar</button>
                                        </form>
                                        <h5 className="mt-4">Horários Configurados</h5>
                                        <ul className="list-group mt-2">
                                            {schedules.map(s => <li key={s._id} className="list-group-item">{s.dayOfWeek}: {s.startTime} - {s.endTime}</li>)}
                                        </ul>
                                    </div>

                                    <div className="col-md-6">
                                        <h4>Serviços Oferecidos</h4>
                                        <form onSubmit={handleServiceSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label">Nome</label>
                                                <input type="text" className="form-control" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Duração (min)</label>
                                                <input type="number" className="form-control" value={serviceForm.duration} onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Preço (R$)</label>
                                                <input type="number" step="0.01" className="form-control" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} required />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">Adicionar</button>
                                        </form>
                                        <h5 className="mt-4">Serviços</h5>
                                        <ul className="list-group mt-2">
                                            {services.map(s => <li key={s._id} className="list-group-item">{s.name} - {s.duration} min - R$ {s.price}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAgendaModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agenda de Agendamentos</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAgendaModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {appointments.length === 0 ? (
                                    <p>Nenhum agendamento encontrado.</p>
                                ) : (
                                    <ul className="list-group">
                                        {appointments.map(ap => (
                                            <li key={ap._id} className="list-group-item">
                                                <p><strong>{ap.title}</strong> - {new Date(ap.date).toLocaleString('pt-BR')}</p>
                                                <p>Cliente: {ap.user.name} ({ap.user.email})</p>
                                                <p>Serviço: {ap.service.name}</p>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleCancelAppointment(ap._id)}>Cancelar</button>
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