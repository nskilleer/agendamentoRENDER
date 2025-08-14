import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, isProfessional } = response.data;

            if (isProfessional) {
                localStorage.setItem('token', token);
                setAuthToken(token);
                alert('Login de profissional bem-sucedido!');
                navigate('/dashboard');
            } else {
                alert('Acesso restrito a profissionais.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Credenciais inválidas.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login de Profissional</h2>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-primary w-100">Entrar</button>
                    </form>
                    <p className="text-center mt-3">
                        Não tem uma conta? <Link to="/register">Registre-se.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}