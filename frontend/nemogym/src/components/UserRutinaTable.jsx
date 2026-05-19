import { Dumbbell } from 'lucide-react';

const UserRutinaTable = ({ rutinas: dataPlana }) => {

    const agruparPorDia = (lista) => {
        if (!lista || !Array.isArray(lista) || lista.length === 0) return [];
        
        const diasMap = lista.reduce((acc, ejercicio) => {
            const numDia = ejercicio.dia;
            if (!acc[numDia]) {
                acc[numDia] = {
                    dia: numDia,
                    ejercicios: []
                };
            }
            acc[numDia].ejercicios.push({
                nombre: ejercicio.nombre,
                repeticiones: ejercicio.repeticiones
            });
            return acc;
        }, {});

        return Object.values(diasMap).sort((a, b) => a.dia - b.dia);
    };

    const rutinasAgrupadas = agruparPorDia(dataPlana);

    const maxEjercicios = rutinasAgrupadas.length > 0 
        ? Math.max(...rutinasAgrupadas.map(r => r.ejercicios?.length || 0)) 
        : 0;
    if (!dataPlana || dataPlana.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                <Dumbbell size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>No hay ejercicios cargados para esta rutina.</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                display: 'table', 
                backgroundColor: '#0f172a',
                color: 'white',
                minWidth: '600px'
            }}>
                <thead>
                    <tr>
                        {rutinasAgrupadas.map((r) => (
                            <th key={r.dia} style={{ 
                                padding: '15px', 
                                border: '1px solid #1e293b', 
                                backgroundColor: '#1e293b',
                                color: '#38bdf8',
                                textAlign: 'center'
                            }}>
                                DÍA {r.dia}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(maxEjercicios)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {rutinasAgrupadas.map((diaData) => {
                                const ej = diaData.ejercicios?.[rowIndex];
                                return (
                                    <td key={diaData.dia} style={{ 
                                        padding: '12px', 
                                        border: '1px solid #1e293b',
                                        textAlign: 'center',
                                        verticalAlign: 'top'
                                    }}>
                                        {ej ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block' }}>
                                                    {ej.nombre}
                                                </span>
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                                    {ej.repeticiones} reps
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#334155' }}>-</span>
                                        )}
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

export default UserRutinaTable;