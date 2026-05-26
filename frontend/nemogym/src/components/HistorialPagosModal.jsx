import React, { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const HistorialPagosModal = ({ isOpen, onClose, usuarioId, usuarioNombre }) => {
  const { getToken } = useContext(AuthContext);
  const [pagos, setPagos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const limpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
  };

  const handleClose = () => {
    limpiarFiltros();
    onClose();
  };

  const cargarHistorial = async () => {
    if (!usuarioId) return;

    try {
      let url = `${import.meta.env.VITE_API_URL}/api/reportes/historial/${usuarioId}`;
      
      const params = new URLSearchParams();
      if (fechaInicio) params.append('fechaInicio', `${fechaInicio}T00:00:00`);
      if (fechaFin) params.append('fechaFin', `${fechaFin}T23:59:59`);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (res.ok) {
        const data = await res.json();
        setPagos(data);
      } else {
        setPagos([]);
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setPagos([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      cargarHistorial();
    }
  }, [isOpen, fechaInicio, fechaFin, usuarioId]);

  if (!isOpen) return null;

  return (
    <div className="mbr-modal-overlay">
      <div className="mbr-modal-card" style={{ width: '600px', background: '#1a1d2e', padding: '20px', borderRadius: '8px' }}>
        <div className="mbr-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 className="mbr-modal-title" style={{ color: '#fff', fontSize: '1.2rem' }}>Historial de {usuarioNombre}</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <X size={24} />
          </button>
        </div>

        <div className="date-filter-container" style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <label className="date-label" style={{ color: '#fff' }}>Desde:</label>
          <input type="date" className="date-input" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <label className="date-label" style={{ color: '#fff' }}>Hasta:</label>
          <input type="date" className="date-input" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <button onClick={limpiarFiltros} className="btn-clear-filters" title="Borrar filtros" style={{ cursor: 'pointer' }}>
            Limpiar
          </button>
        </div>

        <div className="mbr-modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {pagos && pagos.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr style={{ color: '#88aaff', borderBottom: '1px solid #3b3f5c' }}>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Fecha</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Plan</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Monto</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago, index) => {
                  const esRechazado = pago.estado?.includes('RECHAZO');
                  
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #2a2d3c' }}>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{formatearFecha(pago.fechaCreacion)}</td>
                      
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: '0.9rem' }}>
                        {pago.nombreMembresia || 'Sin plan'}
                      </td>
                      
                      <td style={{ padding: '10px', textAlign: 'center' }}>${pago.monto?.toLocaleString()}</td>
                      
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{ 
                          color: esRechazado ? '#f44336' : (pago.estado === 'APROBADO' ? '#4caf50' : '#ff9800'), 
                          fontWeight: 'bold' 
                        }}>
                          {esRechazado ? 'RECHAZADO' : pago.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#d1d5db', textAlign: 'center', marginTop: '20px' }}>No hay registros en el rango seleccionado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPagosModal;