import React, { useState } from 'react';

export default function AppointmentForm({
    selectedService,
    selectedProfessional,
    selectedHour,
    availableHours,
    onBookingSubmit,
    onDateChange
}) {
    const [bookingForm, setBookingForm] = useState({ title: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onBookingSubmit(bookingForm.title, bookingForm.notes);
    };

    return (
        <div className="card">
            <div className="card-header">3. Agendar Horário</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Data</label>
                        <input
                            type="date"
                            className="form-control"
                            value={bookingForm.date}
                            onChange={onDateChange}
                            required
                        />
                    </div>
                    {availableHours.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">Horários Disponíveis</label>
                            <div className="d-flex flex-wrap gap-2">
                                {availableHours.map(hour => (
                                    <button
                                        key={hour.timestamp}
                                        type="button"
                                        className={`btn ${selectedHour === hour.timestamp ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => onHourSelect(hour.timestamp)}
                                    >
                                        {hour.time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Título do Agendamento</label>
                        <input
                            type="text"
                            className="form-control"
                            value={bookingForm.title}
                            onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Notas</label>
                        <textarea
                            className="form-control"
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={!selectedHour}>Confirmar Agendamento</button>
                </form>
            </div>
        </div>
    );
}