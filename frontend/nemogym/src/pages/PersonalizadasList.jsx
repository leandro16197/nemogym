import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, User as UserIcon, Loader2, CheckCircle, Mail } from 'lucide-react';

function PersonalizadasList() {
  const { getToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState([]);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'COACH';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {

      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/aptos-personalizada`, {
        headers: { 
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo obtener la lista de socios`);
      }

      const data = await res.json();
      console.log("Socios aptos recibidos:", data);
      
      setLista(Array.isArray(data) ? data : data.data || []);

    } catch (error) {
      console.error("Error al cargar socios:", error);
      setLista([]); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-full-container"><Loader2 className="spinner-icon" size={48} /></div>;

  return (
    <div className="clases-manager-container">
      <div className="section-header-list" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserIcon className="primary-color" /> 
          Socios con Plan Full (Aptos para Clase Personalizada)
        </h2>
      </div>

      <div className="table-wrapper">
        <table className="routine-table">
          <thead>
            <tr>
              <th>Nombre del Socio</th>
              <th>Email</th>
              <th>Estado Membresía</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length > 0 ? lista.map((socio) => (
              <tr key={socio.id}>
                <td style={{ fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon size={16} className="primary-color" />
                    {socio.name}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={14} /> {socio.email}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981' }}>
                    <CheckCircle size={14} /> {socio.nombrePlan || 'Full Active'}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="btn-save" 
                    onClick={() => navigate(`/clases-personalizadas/nueva?userId=${socio.id}`)}
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.85rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '5px' 
                    }}
                  >
                    <Plus size={16} /> Asignar Rutina
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No se encontraron socios con membresía Full activa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersonalizadasList;