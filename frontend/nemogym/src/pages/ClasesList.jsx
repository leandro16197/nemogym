import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import ClasesTable from '../components/ClasesTable';
import ClaseDetailModal from '../components/ClaseDetailModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'; 

function ClasesList() {
    const [clases, setClases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClase, setSelectedClase] = useState(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [claseAEliminar, setClaseAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const { getToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => { fetchClases(); }, []);

    useEffect(() => {
        if (location.state?.nuevaClase) {
            const nueva = location.state.nuevaClase;
            setClases(prev => {
                const existe = prev.find(c => c.id === nueva.id);
                if (existe) return prev.map(c => c.id === nueva.id ? nueva : c);
                return [nueva, ...prev];
            });
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const fetchClases = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/clases/admin`, {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            const json = await res.json();
            const dataOrdenada = (json.data || []).sort((a, b) => {
                if (a.genero < b.genero) return -1;
                if (a.genero > b.genero) return 1;
                return a.id - b.id;
            });
            setClases(dataOrdenada);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async () => {
        if (!claseAEliminar) return;
        setEliminando(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/clases/${claseAEliminar.id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            if (res.ok) {
                setClases(prev => prev.filter(c => c.id !== claseAEliminar.id));
                window.appCustom.smallBox('ok', 'Rutina eliminada con éxito');
                setClaseAEliminar(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setEliminando(false);
        }
    };

    if (loading) return (
        <div className="loading-full-container">
            <Loader2 className="spinner-icon" size={48} />
            <p>Cargando información...</p>
        </div>
    );

    return (
        <div className="personalizadas-container">
            <div className="header-wrapper">
                <h2>
                    <div className="icon-box"><CalendarIcon size={20} /></div>
                    Gestión de Clases y Rutinas
                </h2>
                <p>Administra las rutinas diarias divididas por género.</p>
                
                <button className="clases-manager-btn-add" onClick={() => navigate('/clases/nueva')} style={{ marginTop: '15px' }}>
                    <Plus size={20} /> Nueva Rutina
                </button>
            </div>

            <div className="list-card admin-socios-dark">
                <ClasesTable 
                    clases={clases}
                    onView={(clase, dia) => {
                        setSelectedClase(clase);
                        setDiaSeleccionado(dia);
                    }}
                    onEdit={(id) => navigate(`/clases/editar/${id}`)}
                    onDelete={(clase) => setClaseAEliminar(clase)}
                />
            </div>

            {/* Modales */}
            <ClaseDetailModal 
                clase={selectedClase} 
                diaRelativo={diaSeleccionado}
                onClose={() => setSelectedClase(null)} 
            />

            <ConfirmDeleteModal 
                isOpen={!!claseAEliminar}
                onClose={() => setClaseAEliminar(null)}
                onConfirm={handleEliminar}
                eliminando={eliminando}
                titulo="¿Eliminar rutina?"
                mensaje={`Estás por borrar la rutina de ${claseAEliminar?.genero}. Esta acción es irreversible.`}
            />
        </div>
    );
}

export default ClasesList;