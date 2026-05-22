import React from 'react';
import { X } from 'lucide-react';

const HistorialPagosModal = ({ isOpen, onClose, usuarioNombre, pagos }) => {
  if (!isOpen) return null;

  return (
    <div className="mbr-modal-overlay">
      <div className="mbr-modal-card" style={{ width: '500px' }}>
        <div className="mbr-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="mbr-modal-title">Historial de {usuarioNombre}</h2>
          <button className="mbr-modal-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <X size={24} />
          </button>
        </div>

        <div className="mbr-modal-body" style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
          {pagos && pagos.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr style={{ color: '#88aaff', textAlign: 'left', borderBottom: '1px solid #3b3f5c' }}>
                  <th style={{ padding: '10px' }}>Fecha</th>
                  <th style={{ padding: '10px' }}>Monto</th>
                  <th style={{ padding: '10px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #2a2d3c' }}>
                    <td style={{ padding: '10px' }}>
                        {pago.fechaCreacion ? pago.fechaCreacion.split('T')[0] : 'N/A'}
                    </td>
                    <td style={{ padding: '10px' }}>${pago.monto.toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                        <span style={{ 
                        color: pago.estado === 'APROBADO' ? '#4caf50' : '#ff9800',
                        fontWeight: 'bold' 
                        }}>
                        {pago.estado}
                        </span>
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
          ) : (
            <p style={{ color: '#d1d5db' }}>No hay registros de pagos para este usuario.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPagosModal;