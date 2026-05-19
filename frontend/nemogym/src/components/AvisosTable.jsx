import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';

const AvisosTable = ({ avisos, onEliminar }) => {
    return (
        <div className="table-container-scroll">
            <table className="routine-table">
                <thead>
                    <tr>
                        <th style={{ width: '150px' }}>FECHA</th>
                        <th>MENSAJE</th>
                        <th style={{ textAlign: 'right', width: '100px' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {avisos.length > 0 ? (
                        avisos.map((a) => (
                            <tr key={a.id}>
                                <td>
                                    <div className="socio-email" style={{ color: '#94a3b8' }}>
                                        <Calendar size={14} style={{ marginRight: '6px' }} />
                                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'S/F'}
                                    </div>
                                </td>
                                <td>
                                    <div className="socio-name" style={{ whiteSpace: 'normal', lineHeight: '1.5' }}>
                                        {a.mensaje}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => onEliminar(a)}
                                            className="btn-icon-delete"
                                            title="Eliminar comunicado"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-results">No hay avisos publicados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AvisosTable;