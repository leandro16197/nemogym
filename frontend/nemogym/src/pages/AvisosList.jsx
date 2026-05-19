import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Megaphone, Plus, Loader2 } from 'lucide-react';
import AvisoFormModal from '../components/AvisoFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AvisosTable from '../components/AvisosTable';

function AvisosList() {
    const [avisos, setAvisos] = useState([]);
    const [nuevoAviso, setNuevoAviso] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [avisoAEliminar, setAvisoAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const { getToken } = useContext(AuthContext);

    useEffect(() => { fetchAvisos(); }, []);

    const fetchAvisos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/avisos`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json"
                }
            });
            const data = await res.json();
            setAvisos(data.data || data || []);
        } catch (err) {
            console.error("Error al cargar avisos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nuevoAviso.trim()) return;
        setEnviando(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/avisos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ mensaje: nuevoAviso })
            });

            if (res.ok) {
                const nuevo = await res.json();
                setAvisos(prev => [nuevo, ...prev]);
                setNuevoAviso("");
                setOpenModal(false);
                window.appCustom.smallBox('ok', 'Aviso publicado correctamente');
            }
        } catch (err) {
            window.appCustom.smallBox('nok', 'Error de red');
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async () => {
        if (!avisoAEliminar) return;
        setEliminando(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/avisos/${avisoAEliminar.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            if (res.ok) {
                setAvisos(prev => prev.filter(a => a.id !== avisoAEliminar.id));
                window.appCustom.smallBox('ok', 'Aviso eliminado');
            }
        } catch {
            window.appCustom.smallBox('nok', 'Error al eliminar');
        } finally {
            setEliminando(false);
            setOpenDeleteModal(false);
            setAvisoAEliminar(null);
        }
    };

    if (loading) return (
        <div className="loading-full-container">
            <Loader2 className="spinner-icon" size={48} />
            <p>Cargando avisos...</p>
        </div>
    );

    return (
        <div className="personalizadas-container">
            <div className="header-wrapper">
                <h2>
                    <div className="icon-box"><Megaphone size={20} /></div>
                    Comunicados del Coach
                </h2>
                <p>Publica avisos importantes para los socios.</p>
                <button className="clases-manager-btn-add" onClick={() => setOpenModal(true)} style={{ marginTop: '15px' }}>
                    <Plus size={18} /> Nuevo aviso
                </button>
            </div>

            <div className="list-card admin-socios-dark">
                <AvisosTable 
                    avisos={avisos} 
                    onEliminar={(aviso) => {
                        setAvisoAEliminar(aviso);
                        setOpenDeleteModal(true);
                    }} 
                />
            </div>

            <AvisoFormModal isOpen={openModal}onClose={() => setOpenModal(false)}onSubmit={handleCrear}valor={nuevoAviso}setValor={setNuevoAviso}enviando={enviando}/>

            <ConfirmDeleteModal isOpen={openDeleteModal}onClose={() => setOpenDeleteModal(false)}onConfirm={handleEliminar}eliminando={eliminando}titulo="¿Eliminar comunicado?"mensaje="El mensaje será quitado del panel de todos los socios." />
        </div>
    );
}

export default AvisosList;