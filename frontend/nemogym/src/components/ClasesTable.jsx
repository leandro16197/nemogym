import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';

const ClasesTable = ({ clases, onView, onEdit, onDelete }) => {
    
    const getNumeroDiaRelativo = (claseActual, index) => {
        const clasesDelMismoGenero = clases
            .slice(0, index + 1)
            .filter(c => c.genero === claseActual.genero);
        return clasesDelMismoGenero.length;
    };

    return (
        <div className="table-container-scroll">
            <table className="routine-table">
                <thead>
                    <tr>
                        <th>DÍA / ORDEN</th>
                        <th>GÉNERO</th>
                        <th>CANT. EJERCICIOS</th>
                        <th style={{ textAlign: 'right' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {clases.length > 0 ? (
                        clases.map((c, index) => (
                            <tr key={c.id}>
                                <td>
                                    <div className="socio-name">DÍA {getNumeroDiaRelativo(c, index)}</div>
                                </td>
                                <td>
                                    <span className={`badge ${c.genero.toLowerCase()}`}>{c.genero}</span>
                                </td>
                                <td>
                                    <div className="socio-email">
                                        {c.ejercicios?.length || 0} ejercicios registrados
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button 
                                            className="btn-icon-view" 
                                            title="Ver detalle"
                                            onClick={() => onView(c, getNumeroDiaRelativo(c, index))}
                                            style={{ 
                                                background: 'rgba(59, 130, 246, 0.15)', 
                                                color: '#60a5fa', 
                                                border: 'none',
                                                padding: '8px', 
                                                borderRadius: '8px', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            // Agregamos un efecto hover simple
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
                                            >
                                            <Eye size={18} />
                                            </button>
                                        <button className="btn-icon-edit" onClick={() => onEdit(c.id)}>
                                            <Edit3 size={18} />
                                        </button>
                                        <button className="btn-icon-delete" onClick={() => onDelete(c)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-results">No hay clases registradas aún.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClasesTable;