import React, { useState, useEffect, useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { StatCard } from '../components/StatsCards';
import { PagosTable } from '../components/PagosTable';

const Reportes = () => {
    const [metricas, setMetricas] = useState(null);
    const [pagosPage, setPagosPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const { getToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchMetricas = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reportes/metricas`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                if (!res.ok) throw new Error("Error cargando métricas");
                const data = await res.json();
                setMetricas(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchMetricas();
    }, [getToken]);

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reportes/ultimos-pagos?page=${page}&size=5`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                if (!res.ok) throw new Error("Error cargando pagos");
                const data = await res.json();
                setPagosPage(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPagos();
    }, [getToken, page]);

    if (loading && !metricas) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error-alert"><h3>❌ Error</h3><p>{error}</p></div>;
    if (!metricas || !pagosPage) return null;

    const dataMembresias = [
        { name: 'Basic', value: metricas.totalBasic || 0 },
        { name: 'Full', value: metricas.totalFull || 0 },
    ];
    const COLORS = ['#50a8be', '#f0c66d'];

    return (
        <div className="reportes-container">
            <h1>Dashboard de Gestión</h1>
            
            <div className="stats-grid">
                <StatCard title="Ingresos" value={`$ ${metricas.montoTotalRecaudado?.toLocaleString()}`} />
                <StatCard title="Total Transacciones" value={metricas.totalPagos} />
                <StatCard title="Aprobados" value={metricas.totalAprobados} color="#22c55e" />
                <StatCard title="Rechazados" value={metricas.totalRechazados} color="#ef4444" />
                <StatCard title="Pendientes" value={metricas.totalPendientes} color="#0a698f" />
            </div>

            <div className="dashboard-bottom reportes-bottom">
                <div className="chart-container">
                    <h3>Distribución de Membresías</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={dataMembresias} dataKey="value" nameKey="name" outerRadius={70} label>
                                {dataMembresias.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <PagosTable pagosPage={pagosPage} page={page} setPage={setPage} />
            </div>
        </div>
    );
};

export default Reportes;