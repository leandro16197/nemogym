import { useEffect, useState, useContext } from 'react';
import { Dumbbell, Megaphone, Loader2, Lock, CreditCard } from 'lucide-react'; 
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

function Dashboard() {
    const [clases, setClases] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAvisos, setLoadingAvisos] = useState(true);

    const { getToken, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        if (!user.hasActivePlan) {
            setLoading(false);
        }

        const baseUrl = import.meta.env.VITE_API_URL;
        const token = getToken();
        if (!token) return;


        if (user.hasActivePlan) {
            fetch(`${baseUrl}/clases`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (res.status === 403) {

                    throw new Error("403");
                }
                return res.json();
            })
            .then(json => {
                const filtradas = (json.data || []).filter(
                    c => c.genero?.toUpperCase() === user.genero?.toUpperCase()
                );
                setClases(filtradas.sort((a, b) => a.dia - b.dia));
            })
            .catch(err => console.error("Error clases:", err))
            .finally(() => setLoading(false));
        }

  
        fetch(`${baseUrl}/avisos`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => {
            setAvisos(json.data || json || []);
        })
        .catch(err => console.error("Error avisos:", err))
        .finally(() => setLoadingAvisos(false));

    }, [user, getToken, logout]);

    if (loading) {
        return (
            <div className="loading-full-container">
                <Loader2 className="spinner-icon" size={48} />
                <p>Cargando planificación...</p>
            </div>
        );
    }

    const maxEjercicios = clases.length > 0
        ? Math.max(...clases.map(c => c.ejercicios?.length || 0))
        : 0;

    const renderTable = (rutinas) => (
        <div className="routine-container">
            <div className="table-wrapper">
                <table className="routine-table">
                    <thead>
                        <tr>
                            {rutinas.map((r, index) => (
                                <th key={index} style={{ color: r.color }}>
                                    DÍA {r.dia || index + 1}
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
                                        <td key={colIndex}>
                                            {ej ? (
                                                <div className="cell-content">
                                                    <span className="ej-name">{ej.nombre}</span>
                                                    <span className="ej-reps">{ej.repeticiones} reps</span>
                                                </div>
                                            ) : (
                                                <span className="empty-cell">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="content-area">
            <div className="dashboard-grid">
                
                <section className="main-content">
                    <div className="section-header">
                        <Dumbbell size={24} className="primary-color" />
                        <h2>Planificación Semanal</h2>
                    </div>
                    {!user?.hasActivePlan ? (
                        <div className="no-plan-container" style={{
                            padding: '40px',
                            textAlign: 'center',
                            background: 'rgba(0,0,0,0.05)',
                            borderRadius: '12px',
                            border: '2px dashed #ccc'
                        }}>
                            <Lock size={48} style={{ marginBottom: '16px', color: '#666' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Contenido Bloqueado</h3>
                            <p style={{ marginBottom: '20px', color: '#555' }}>
                                No tienes una membresía activa para ver las rutinas de <b>{user?.genero}</b>. 
                                Adquiere un plan para desbloquear tu entrenamiento semanal.
                            </p>
                            <button 
                                onClick={() => navigate('/membresias')}
                                className="buy-plan-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    margin: '0 auto',
                                    padding: '12px 24px',
                                    backgroundColor: '#e31e24', 
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                <CreditCard size={20} />
                                VER MEMBRESÍAS
                            </button>
                        </div>
                    ) : (
                        clases.length > 0 ? (
                            renderTable(clases)
                        ) : (
                            <div className="no-data">
                                No hay rutinas cargadas para el género: {user?.genero}
                            </div>
                        )
                    )}
                </section>

                <aside className="announcements-sidebar">
                    <div className="section-header">
                        <Megaphone size={20} className="accent-color" />
                        <h2>Avisos del Coach</h2>
                    </div>

                    {loadingAvisos ? (
                        <div style={{ padding: '10px' }}>
                            <Loader2 className="spinner-icon" size={20} />
                        </div>
                    ) : avisos.length > 0 ? (
                        avisos.slice(0, 3).map((a) => (
                            <div key={a.id} className="announcement-card">
                                <div className="announcement-date">
                                    {a.createdAt
                                        ? new Date(a.createdAt).toLocaleDateString()
                                        : 'HOY'}
                                </div>
                                <p className="announcement-text">{a.mensaje}</p>
                            </div>
                        ))
                    ) : (
                        <div className="announcement-card" style={{ opacity: 0.6 }}>
                            <p className="announcement-text">No hay avisos por el momento.</p>
                        </div>
                    )}
                </aside>

            </div>
        </div>
    );
}

export default Dashboard;