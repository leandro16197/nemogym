import React, { useState, useContext } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import HistorialPagosModal from './HistorialPagosModal';

export const PagosTable = ({ pagosPage, page, setPage }) => {
    const { getToken } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [historial, setHistorial] = useState([]);

    const handleOpenHistorial = async (pago) => {
        setSelectedUser(pago.usuario);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reportes/historial/${pago.usuarioId}`, {
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json' 
                }
            });

            if (!response.ok) throw new Error("Error al obtener historial");
            
            const data = await response.json();
            
            const formattedData = data.map(item => ({
                fechaCreacion: item.fechaCreacion, 
                monto: item.monto,                
                estado: item.estado               
            }));
            
            setHistorial(formattedData);
            setIsModalOpen(true);
        } catch (err) {
            alert("No se pudo cargar el historial: " + err.message);
        }
    };

    return (
        <div className="list-card admin-socios-dark pagos-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <div className="table-controls" style={{ padding: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Últimos Pagos</h3>
            </div>

            <div className="table-container-scroll">
                <table className="routine-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px 20px', fontSize: '14px', color: '#88aaff', textTransform: 'uppercase' }}>Usuario</th>
                            <th style={{ textAlign: 'center', padding: '10px 20px', fontSize: '14px', color: '#88aaff', textTransform: 'uppercase' }}>Historial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagosPage.content?.map((pago, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #2a2d3c' }}>
                                <td style={{ textAlign: 'left', padding: '10px 20px', fontSize: '16px' }}>
                                    <div className="socio-name" style={{ padding: '10px 0' }}>{pago.usuario}</div>
                                </td>
                                <td style={{ textAlign: 'center', padding: '10px 20px' }}>
                                    <button 
                                        className="btn-historial" 
                                        style={{ background: '#3b3f5c', border: 'none', borderRadius: '4px', color: '#d1d5db', padding: '8px', cursor: 'pointer' }} 
                                        onClick={() => handleOpenHistorial(pago)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-footer" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2a2d3c' }}>
                <div className="info" style={{ fontSize: '14px', color: '#d1d5db' }}>Página {page + 1} de {pagosPage.totalPages || 1}</div>
                <div className="pagination-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="page-btn" style={{ background: '#191b28', border: '1px solid #3b3f5c', borderRadius: '4px', color: '#d1d5db', padding: '6px 12px', cursor: 'pointer', opacity: page === 0 ? 0.5 : 1 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft size={18} />
                    </button>
                    <span className="page-indicator" style={{ background: '#3b3f5c', borderRadius: '4px', color: '#fff', padding: '6px 12px', fontSize: '14px', fontWeight: '700' }}>{page + 1}</span>
                    <button className="page-btn" style={{ background: '#191b28', border: '1px solid #3b3f5c', borderRadius: '4px', color: '#d1d5db', padding: '6px 12px', cursor: 'pointer', opacity: pagosPage.last ? 0.5 : 1 }} disabled={pagosPage.last} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <HistorialPagosModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                usuarioNombre={selectedUser} 
                pagos={historial} 
            />
        </div>
    );
};