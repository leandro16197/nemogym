import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Calendar, User, Clock, Trash2, Loader2 } from 'lucide-react';

function CustomClassesManager() {
  const { userId } = useParams(); 
  const { getToken, user: currentUser } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const isManagementMode = !userId; 

  useEffect(() => {
    fetchClasses();
  }, [userId]);

  const fetchClasses = async () => {
    try {
      const targetId = userId || 'all'; 
      const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-classes/${targetId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="section-header-list" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={28} className="primary-color" />
          <h2 className="section-title">
            {isManagementMode ? 'Gestión de Clases Personalizadas' : 'Mis Clases Personalizadas'}
          </h2>
        </div>
        
        {isManagementMode && (
          <button className="btn-save" onClick={() => setShowModal(true)}>
            <Plus size={20} /> <span>Asignar Clase</span>
          </button>
        )}
      </div>

      <div className="table-wrapper" style={{ marginTop: '20px' }}>
        <table className="routine-table">
          <thead>
            <tr>
              {isManagementMode && <th>Socio</th>}
              <th>Día</th>
              <th>Horario</th>
              <th>Entrenamiento / Nota</th>
              {isManagementMode && <th style={{ textAlign: 'center' }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {classes.map((item) => (
              <tr key={item.id}>
                {isManagementMode && (
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} /> {item.userName}
                    </div>
                  </td>
                )}
                <td>{item.diaSemana}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {item.hora}
                  </div>
                </td>
                <td>{item.descripcion}</td>
                {isManagementMode && (
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-action-delete" title="Quitar clase">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content filters-bar" style={{ background: '#0f172a', padding: '25px', borderRadius: '15px' }}>
             <h3>Asignar Nueva Clase</h3>
             <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button className="btn-save">Guardar</button>
                <button className="btn-action-view" onClick={() => setShowModal(false)}>Cancelar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomClassesManager;