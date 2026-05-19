import React from 'react';

const RoutineTable = ({ rutinas, maxEjercicios }) => {
    return (
        <div className="table-container-scroll" style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <table className="routine-table">
                <thead>
                    <tr>
                        {rutinas.map((r, index) => (
                            <th key={index} style={{ textAlign: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>DÍA {r.dia || index + 1}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(maxEjercicios)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {rutinas.map((clase, colIndex) => {
                                const ej = clase.ejercicios?.[rowIndex];
                                return (
                                    <td key={colIndex} style={{ verticalAlign: 'middle', padding: '16px 12px', textAlign: 'center' }}>
                                        {ej ? (
                                            <div className="cell-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <div className="socio-name" style={{ fontSize: '0.95rem', fontWeight: '500', color: '#f8fafc', lineHeight: '1.2' }}>
                                                    {ej.nombre}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: '700' }}>
                                                        {ej.repeticiones}
                                                    </span>
                                                    <span style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase' }}>reps</span>
                                                </div>
                                            </div>
                                        ) : <span style={{ color: '#1e293b' }}>-</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoutineTable;