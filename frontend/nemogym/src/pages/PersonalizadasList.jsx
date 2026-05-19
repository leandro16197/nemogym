import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User as UserIcon, Loader2, Star } from 'lucide-react';
import ModalAsignarRutina from '../components/ModalAsignarRutina';
import UserRutinaTable from '../components/UserRutinaTable'; 
import AdminSocioList from '../components/AdminSocioList';   

function PersonalizadasList() {
    const { getToken, user: currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null);

    const isAdminOrCoach = currentUser?.role === 'ADMIN' || currentUser?.role === 'COACH';

    const fetchData = useCallback(async (isSilent = false) => {
        if (!isSilent) {
            setLoading(true);
            setData([]);
        }

        const endpoint = isAdminOrCoach 
            ? `/admin/users/aptos-personalizada` 
            : `/coach/clases-personalizadas/${currentUser?.id}`;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            const result = await res.json();
            const finalData = Array.isArray(result) ? result : (result.data || []);
            
            if (isAdminOrCoach) {
                setData(finalData);
            } else {
                setData([...finalData].sort((a, b) => a.dia - b.dia));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            if (!isSilent) setData([]);
        } finally { 
            setLoading(false); 
        }
    }, [isAdminOrCoach, currentUser?.id, getToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return (
        <div className="loading-full-container">
            <Loader2 className="spinner-icon" size={48} />
            <p style={{marginTop: '10px', color: '#94a3b8'}}>Actualizando información...</p>
        </div>
    );

    return (
        <div className="personalizadas-container">
            <div className="header-wrapper">
                <h2>
                    <div className="icon-box">
                        {isAdminOrCoach ? <UserIcon size={20} /> : <Star size={20} className="text-yellow-400" />}
                    </div>
                    {isAdminOrCoach ? 'Gestión de Clases' : 'Mi Entrenamiento'}
                </h2>
                <p>
                    {isAdminOrCoach 
                        ? 'Asigna y modifica rutinas para socios con Plan Full.' 
                        : 'Tu plan de entrenamiento personalizado por el Coach.'}
                </p>
            </div>

            {isAdminOrCoach ? (
                <AdminSocioList socios={data} onGestionar={setSelectedUser} />
            ) : (
                <UserRutinaTable rutinas={data} />
            )}

            {selectedUser && (
                <ModalAsignarRutina 
                    socio={selectedUser} 
                    getToken={getToken}
                    onClose={() => setSelectedUser(null)}
                    onSuccess={(isSilentUpdate = false) => {
                        if (isSilentUpdate) {
                            fetchData(true); 
                        } else {
  
                            setSelectedUser(null);
                            fetchData();
                        }
                    }}
                />
            )}
        </div>
    );
}

export default PersonalizadasList;