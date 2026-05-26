import { useEffect, useState, useContext, useMemo } from 'react';
import { Dumbbell, Lock, CreditCard, Calendar, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RoutineTable from '../components/RoutineTable';
import AnnouncementsSidebar from '../components/AnnouncementsSidebar';
import SubscriptionAlert from '../components/SubscripcionAlerta';
function Dashboard() {
    const [clases, setClases] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAvisos, setLoadingAvisos] = useState(true);
    const { getToken, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const esStaff = useMemo(() => {
        const role = user?.role?.toUpperCase();
        return role === 'ADMIN' || role === 'COACH';
    }, [user]);

    const puedeVerRutina = user?.hasActivePlan || esStaff;

    useEffect(() => {
        if (!user) return;
        if (!puedeVerRutina) setLoading(false);
        
        const baseUrl = import.meta.env.VITE_API_URL;
        const token = getToken();
        if (!token) return;
        if (puedeVerRutina) {
            fetch(`${baseUrl}/clases`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (res.status === 403) throw new Error("403");
                return res.json();
            })
            .then(json => {
                const data = json.data || json || [];
                const filtradas = data.filter(c => c.genero?.toUpperCase() === user.genero?.toUpperCase());
                setClases(filtradas.sort((a, b) => a.dia - b.dia));
            })
            .catch(err => console.error("Error clases:", err))
            .finally(() => setLoading(false));
        }
        fetch(`${baseUrl}/avisos`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => setAvisos(json.data || json || []))
        .catch(err => console.error("Error avisos:", err))
        .finally(() => setLoadingAvisos(false));
    }, [user, getToken, puedeVerRutina]);

    if (loading) {
        return (
            <div className="loading-full-container">
                <Loader2 className="spinner-icon" size={48} />
                <p>Cargando planificación...</p>
            </div>
        );
    }
 
    const maxEjercicios = clases.length > 0 ? Math.max(...clases.map(c => c.ejercicios?.length || 0)) : 0;

    return (
        <div className="personalizadas-container">
            <div className="header-wrapper">
                <h2>
                    <div className="icon-box"><Dumbbell size={20} /></div>
                    Panel de Entrenamiento
                </h2>
                <p>Bienvenido, <strong>{user?.nombre}</strong>. Aquí tienes tu planificación para hoy.</p>
            </div>
                {user && !esStaff && user.hasActivePlan && user.diasRestantes <= 10 && (
                    <SubscriptionAlert diasRestantes={user.diasRestantes} />
                )}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
             

                <section className="main-routine-section">
                    <div className="list-card admin-socios-dark" style={{ padding: '20px' }}>
                        <div className="section-header-list" style={{ border: 'none', marginBottom: '20px', padding: 0 }}>
                            <div className="title-group">
                                <Calendar size={20} className="primary-color" />
                                <h3 className="section-title" style={{ fontSize: '1.2rem' }}>
                                    Rutina Semanal — {user?.genero}
                                    {esStaff && <span className="badge" style={{ marginLeft: '10px', background: '#f59e0b', color: '#000' }}>STAFF</span>}
                                </h3>
                            </div>
                        </div>

                        {!puedeVerRutina ? (
                            <div className="no-plan-container" style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid #334155' }}>
                                <Lock size={48} style={{ marginBottom: '16px', color: '#475569' }} />
                                <h3 style={{ color: '#f8fafc', marginBottom: '10px' }}>Contenido Bloqueado</h3>
                                <p style={{ color: '#94a3b8', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                                    Para acceder a tu planificación personalizada de <b>{user?.genero}</b>, necesitas una suscripción activa.
                                </p>
                                <button className="mbr-btn-submit" onClick={() => navigate('/membresias')} style={{ width: 'auto', padding: '12px 30px' }}>
                                    <CreditCard size={18} /> ACTIVAR MI PLAN
                                </button>
                            </div>
                        ) : (
                            clases.length > 0 ? (
                                <RoutineTable rutinas={clases} maxEjercicios={maxEjercicios} />
                            ) : (
                                <div className="no-results" style={{ padding: '40px' }}>
                                    No hay rutinas cargadas para tu género actualmente.
                                </div>
                            )
                        )}
                    </div>
                </section>

                <AnnouncementsSidebar avisos={avisos} loading={loadingAvisos} />
            </div>
        </div>
    );
}

export default Dashboard;