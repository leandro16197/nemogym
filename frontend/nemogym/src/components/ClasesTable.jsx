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
                        <th style={{ textAlign: 'center' }}>DÍA / ORDEN</th>
                        <th style={{ textAlign: 'center' }}>GÉNERO</th>
                        <th style={{ textAlign: 'center' }}>CANT. EJERCICIOS</th>
                        <th style={{ textAlign: 'center' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {clases.length > 0 ? (
                        clases.map((c, index) => (
                            <tr key={c.id}>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="socio-name">DÍA {getNumeroDiaRelativo(c, index)}</div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge ${c.genero.toLowerCase()}`}>{c.genero}</span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="socio-email">
                                        {c.ejercicios?.length || 0} ejercicios
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
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
                            <td colSpan="4" className="no-results" style={{ textAlign: 'center' }}>No hay clases registradas aún.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClasesTable;