import React, { useState, useContext } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import HistorialPagosModal from './HistorialPagosModal';

export const PagosTable = ({ pagosPage, page, setPage, fetchPagos }) => {
    const { getToken } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    
    const [filtroNombre, setFiltroNombre] = useState('');

    const handleOpenHistorial = (pago) => {
        setSelectedUser(pago.usuario);
        setSelectedUserId(pago.usuarioId); 
        setIsModalOpen(true);
    };

    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltroNombre(valor);
        setPage(0); 
        fetchPagos(0, valor); 
    };

    return (
        <div className="list-card admin-socios-dark pagos-table" style={{ width: '100%' }}>
            <div className="table-controls" style={{ padding: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Últimos Pagos</h3>
                <div style={{ marginTop: '15px', paddingRight: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar usuario..." 
                        value={filtroNombre} 
                        onChange={handleSearch} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #3b3f5c', background: '#2a2d3c', color: '#fff', width: '100%', maxWidth: '300px' }} 
                    />
                </div>
            </div>

            <div className="table-container-scroll">
                <table className="routine-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {pagosPage?.content?.map((pago, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #2a2d3c' }}>
                                <td style={{ padding: '10px 20px', color: '#fff' }}>{pago.usuario}</td>
                                <td style={{ textAlign: 'center', padding: '10px 20px' }}>
                                    <button 
                                        onClick={() => handleOpenHistorial(pago)} 
                                        style={{ background: '#3b3f5c', border: 'none', borderRadius: '4px', color: '#d1d5db', padding: '8px', cursor: 'pointer' }}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-footer" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2a2d3c' }}>
                <span style={{ color: '#d1d5db' }}>Página {page + 1} de {pagosPage?.totalPages || 1}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        disabled={page === 0} 
                        onClick={() => { setPage(page - 1); fetchPagos(page - 1, filtroNombre); }}
                        style={{ padding: '5px 10px', cursor: 'pointer' }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button 
                        disabled={pagosPage?.last} 
                        onClick={() => { setPage(page + 1); fetchPagos(page + 1, filtroNombre); }}
                        style={{ padding: '5px 10px', cursor: 'pointer' }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <HistorialPagosModal isOpen={isModalOpen}  onClose={() => setIsModalOpen(false)}  usuarioId={selectedUserId}  usuarioNombre={selectedUser} />
        </div>
    );
};