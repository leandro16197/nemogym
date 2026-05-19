import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, eliminando, titulo, mensaje }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-dark-overlay">
            <div className="modal-dark-card">
                <AlertTriangle size={40} style={{ color: '#f59e0b', marginBottom: '15px' }} />
                <h3>{titulo || '¿Estás seguro?'}</h3>
                <p>{mensaje || 'Esta acción no se puede deshacer.'}</p>
                <div className="modal-dark-actions">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn-danger" onClick={onConfirm} disabled={eliminando}>
                        {eliminando ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;