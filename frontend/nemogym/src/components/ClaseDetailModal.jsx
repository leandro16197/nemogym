import React from 'react';
import { X } from 'lucide-react';

const ClaseDetailModal = ({ clase, onClose, diaRelativo }) => {
    if (!clase) return null;

    return (
        <div className="modal-dark-overlay" onClick={onClose}>
            <div className="modal-dark-card" style={{ maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc' }}>
                        Día {diaRelativo} — {clase.genero}
                    </h3>
                    <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                </div>
                <div className="modal-body" style={{ width: '100%' }}>
                    <div className="ejercicios-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {clase.ejercicios?.map((ej, index) => (
                            <div key={index} style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                                <strong style={{ color: '#e2e8f0' }}>{ej.nombre}</strong>
                                <p style={{ margin: '5px 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    {ej.repeticiones}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaseDetailModal;