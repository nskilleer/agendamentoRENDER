// client/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setAuthToken } from '../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' ou 'pro'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/register', { name, email, password, role });

            // Salva o token JWT e os dados do usuário no localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Configura o token para futuras requisições
            setAuthToken(response.data.token);

            // Redireciona para o dashboard
            navigate('/dashboard');
        } catch (err) {
            // Exibe a mensagem de erro do backend
            setError(err.response?.data?.error || 'Erro ao registrar. Tente novamente.');
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Registro</div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tipo de Usuário</label>
                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">Cliente</option>
                                        <option value="pro">Profissional</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-success w-100">Registrar</button>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <p>Já tem uma conta? <a href="/login">Faça login aqui</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}