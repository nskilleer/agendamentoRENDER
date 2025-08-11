import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';

export default function Dashboard() {
    const [list, setList] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setAuthToken(token);
        api.get('/appointments').then(r => setList(r.data)).catch(console.error);
    }, []);

    return (
        <div className="container mt-4">
            <h3>Agendamentos</h3>
            <ul className="list-group">
                {list.map(a => (
                    <li className="list-group-item" key={a._id}>
                        <strong>{a.title}</strong> — {new Date(a.date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
