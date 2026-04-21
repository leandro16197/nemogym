import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Megaphone, Trash2, Plus, Loader2, Calendar } from 'lucide-react';

function AvisosList() {
  const [avisos, setAvisos] = useState([]);
  const [nuevoAviso, setNuevoAviso] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // 👇 nuevo
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [avisoAEliminar, setAvisoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const { getToken } = useContext(AuthContext);

  useEffect(() => {
    fetchAvisos();
  }, []);
console.log("getToken:", getToken());
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

  // 👇 abrir modal
  const confirmarEliminar = (aviso) => {
    setAvisoAEliminar(aviso);
    setOpenDeleteModal(true);
  };

  // 👇 eliminar real
  const handleEliminar = async () => {
    if (!avisoAEliminar) return;

    setEliminando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/avisos/${avisoAEliminar.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
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

  if (loading) {
    return (
      <div className="loading-full-container">
        <Loader2 className="spinner-icon" size={48} />
        <p>Cargando avisos...</p>
      </div>
    );
  }

  return (
    <div className="form-container">

      {/* HEADER */}
      <div className="section-header-list" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="title-group">
          <Megaphone size={28} className="primary-color" />
          <h2 className="section-title">Comunicados del Coach</h2>
        </div>

        <button className="clases-manager-btn-add" onClick={() => setOpenModal(true)}>
          <Plus size={18} /> Nuevo aviso
        </button>
      </div>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="routine-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Mensaje</th>
              <th style={{ width: '100px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {avisos.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <Calendar size={14} />
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleDateString()
                      : 'S/F'}
                  </div>
                </td>

                <td>{a.mensaje}</td>

                <td>
                  <button
                    onClick={() => confirmarEliminar(a)}
                    className="btn-action-delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR */}
      {openModal && (
        <div className="modal-overlay">
          <div className="modal-content">

            <div className="modal-header">
              <h3>Nuevo aviso</h3>
              <button className="btn-close-modal" onClick={() => setOpenModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCrear}>
              <textarea
                value={nuevoAviso}
                onChange={(e) => setNuevoAviso(e.target.value)}
                required
              />

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setOpenModal(false)}>
                  Cancelar
                </button>

                <button type="submit" className="clases-manager-btn-save" disabled={enviando}>
                  {enviando ? <Loader2 size={16} /> : <Plus size={16} />}
                  Publicar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 🔥 MODAL ELIMINAR */}
      {openDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">

            <div className="modal-header">
              <h3>Eliminar aviso</h3>
            </div>

            <div className="modal-confirm-body">
              <Trash2 size={40} className="confirm-warning-icon" />
              <p>¿Seguro que querés eliminar este aviso?</p>
              <span className="confirm-subtitle">
                Esta acción no se puede deshacer
              </span>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setOpenDeleteModal(false)}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                className="btn-confirm-delete"
                onClick={handleEliminar}
                disabled={eliminando}
              >
                {eliminando && <Loader2 size={14} />}
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AvisosList;