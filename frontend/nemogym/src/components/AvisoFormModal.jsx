import React from 'react';
import { X, Loader2 } from 'lucide-react';

const AvisoFormModal = ({ isOpen, onClose, onSubmit, valor, setValor, enviando }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-dark-overlay" onClick={onClose}>
            <div className="modal-dark-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc' }}>Crear Comunicado</h3>
                    <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                </div>

                <form onSubmit={onSubmit} style={{ width: '100%' }}>
                    <div className="mbr-form-group">
                        <label style={{ color: '#94a3b8', marginBottom: '8px', display: 'block' }}>Mensaje del aviso</label>
                        <textarea
                            className="mbr-textarea"
                            placeholder="Escribe lo que quieres comunicar a tus socios..."
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            style={{ minHeight: '120px' }}
                            required
                        />
                    </div>

                    <div className="modal-dark-actions" style={{ marginTop: '20px' }}>
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="mbr-btn-submit" disabled={enviando} style={{ margin: 0, padding: '10px 20px' }}>
                            {enviando ? <Loader2 size={18} className="spinning" /> : 'Publicar Aviso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvisoFormModal;