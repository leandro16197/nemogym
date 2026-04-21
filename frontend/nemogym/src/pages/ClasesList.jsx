import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Edit3, Calendar as CalendarIcon, Loader2, Eye, X, AlertTriangle } from 'lucide-react';

function ClasesList() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClase, setSelectedClase] = useState(null);
  const [claseAEliminar, setClaseAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const { getToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchClases();
  }, []);

  useEffect(() => {
    if (location.state?.nuevaClase) {
      const nueva = location.state.nuevaClase;

      setClases(prev => {
        const existe = prev.find(c => c.id === nueva.id);

        if (existe) {
          return prev.map(c => c.id === nueva.id ? nueva : c);
        }

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

  const getNumeroDiaRelativo = (claseActual, index) => {
    const clasesDelMismoGenero = clases
      .slice(0, index + 1)
      .filter(c => c.genero === claseActual.genero);
    return clasesDelMismoGenero.length;
  };

  const confirmarEliminar = (clase) => {
    setClaseAEliminar(clase);
  };

  const cancelarEliminar = () => {
    setClaseAEliminar(null);
  };

  const eliminarClase = async () => {
    if (!claseAEliminar) return;

    setEliminando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clases/${claseAEliminar.id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${getToken()}` }
      });

      if (res.ok) {

        setClases(prev => prev.filter(c => c.id !== claseAEliminar.id));

        window.appCustom.smallBox('ok', 'Rutina eliminada con éxito', null, 3000);
        setClaseAEliminar(null);

      } else {
        const json = await res.json();
        window.appCustom.smallBox('nok', json.message || 'No se pudo eliminar', null, 4000);
      }

    } catch (err) {
      console.error(err);
      window.appCustom.smallBox('nok', 'Error de red al intentar eliminar', null, 4000);
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-full-container">
        <Loader2 className="spinner-icon" size={48} />
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="section-header-list">
        <div className="title-group">
          <CalendarIcon size={28} className="primary-color" />
          <h2 className="section-title">Gestión de Clases</h2>
        </div>
        <button className="clases-manager-btn-add" onClick={() => navigate('/clases/nueva')}>
          <Plus size={20} /> Nueva Rutina
        </button>
      </div>

      <div className="table-wrapper">
        <table className="routine-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Género</th>
              <th>Ejercicios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((c, index) => {
              const diaRelativo = getNumeroDiaRelativo(c, index);
              return (
                <tr key={c.id}>
                  <td><strong>DÍA {diaRelativo}</strong></td>
                  <td><span className={`badge ${c.genero.toLowerCase()}`}>{c.genero}</span></td>
                  <td>{c.ejercicios?.length || 0} ejercicios</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action-view"
                        onClick={() => setSelectedClase(c)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn-action-edit"
                        onClick={() => navigate(`/clases/editar/${c.id}`)}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="btn-action-delete"
                        onClick={() => confirmarEliminar(c)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {clases.length === 0 && (
          <p className="empty-state">No hay clases registradas aún.</p>
        )}
      </div>

      {selectedClase && (
        <div className="modal-overlay" onClick={() => setSelectedClase(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Día {getNumeroDiaRelativo(selectedClase, clases.indexOf(selectedClase))} — {selectedClase.genero}
              </h3>
              <button className="btn-close-modal" onClick={() => setSelectedClase(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {selectedClase.ejercicios?.map((ej, index) => (
                <div key={index}>
                  {ej.nombre} - {ej.repeticiones}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {claseAEliminar && (
        <div className="modal-overlay" onClick={cancelarEliminar}>
          <div className="modal-content modal-confirm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
              <button className="btn-close-modal" onClick={cancelarEliminar}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body modal-confirm-body">
              {/* Usamos la clase confirm-warning-icon para el color naranja/alerta */}
              <AlertTriangle size={48} className="confirm-warning-icon" />
              <p className="section-title" style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                ¿Estás seguro?
              </p>
              <p className="confirm-subtitle">
                Estás por eliminar la rutina de <strong>{claseAEliminar.genero}</strong>. 
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
              <button 
                className="btn-cancel" 
                onClick={cancelarEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={eliminarClase}
                disabled={eliminando}
              >
                {eliminando ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Eliminar Rutina
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClasesList;