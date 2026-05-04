import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Loader2, ChevronLeft, ChevronRight, Pencil, Trash2, AlertTriangle, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SociosList() {
  const { getToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState('');
  const [genero, setGenero] = useState('');
  const [rolId, setRolId] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [socioAEliminar, setSocioAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSocios(page);
    }, 400);
    return () => clearTimeout(timer);
  }, [page, search, genero, rolId]);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

  const fetchSocios = async (pageNumber, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/admin/users`);
      url.searchParams.append('page', pageNumber);
      url.searchParams.append('size', 10);
      if (search) url.searchParams.append('search', search);
      if (genero) url.searchParams.append('genero', genero);
      if (rolId) url.searchParams.append('roleId', rolId);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json"
        }
      });
      const json = await res.json();
      setSocios(json.data || []);
      setTotalPages(json.totalPages || 0);
    } catch (err) {
      console.error("Error cargando socios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId, newRoleId) => {
    if (!newRoleId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, roleId: newRoleId })
      });

      if (res.ok) {
        window.appCustom.smallBox('ok', 'Rol actualizado correctamente');
        fetchSocios(page, true);
      } else {
        window.appCustom.smallBox('nok', 'Error al asignar el rol');
      }
    } catch (err) {
      window.appCustom.smallBox('nok', 'Error de conexión');
    }
  };

  const limpiarFiltros = () => {
    setSearch(''); setGenero(''); setRolId(''); setPage(0);
  };

  const abrirConfirmacion = (socio) => {
    setSocioAEliminar(socio);
    setShowModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!socioAEliminar) return;
    setEliminando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${socioAEliminar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        window.appCustom.smallBox('ok', 'Socio eliminado correctamente');
        setShowModal(false);
        fetchSocios(page, true);
      }
    } catch (err) {
      window.appCustom.smallBox('nok', 'Error al eliminar');
    } finally {
      setEliminando(false);
    }
  };

  if (loading && socios.length === 0 && !search && !genero && !rolId) {
    return (
      <div className="loading-full-container">
        <Loader2 className="spinner-icon" size={48} />
        <p>Cargando socios...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="section-header-list" style={{ marginBottom: '15px' }}>
        <div className="title-group">
          <Users size={28} className="primary-color" />
          <h2 className="section-title">Socios</h2>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="minimal-input"
          />
          {search && <X size={14} className="clear-icon" onClick={() => setSearch('')} />}
        </div>

        <select className="minimal-select" value={genero} onChange={(e) => { setGenero(e.target.value); setPage(0); }}>
          <option value="">Todos los géneros</option>
          <option value="HOMBRE">Hombre</option>
          <option value="MUJER">Mujer</option>
          <option value="OTRO">Otro</option>
        </select>

        <select className="minimal-select" value={rolId} onChange={(e) => { setRolId(e.target.value); setPage(0); }}>
          <option value="">Todos los roles</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id.toString()}>{rol.nombre || rol.name}</option>
          ))}
        </select>

        {(search || genero || rolId) && <button className="btn-text-only" onClick={limpiarFiltros}>Limpiar</button>}
      </div>

      <div className="table-wrapper">
        <table className="routine-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {socios.length > 0 ? (
              socios.map((s) => {
                // TRADUCCIÓN DE NOMBRE DE ROL A ID
                // Buscamos el string (ej: "ADMIN") dentro de nuestra lista de objetos de roles
                const userRoleName = Array.isArray(s.roles) ? s.roles[0] : null;
                const matchingRole = roles.find(r => 
                  (r.name?.toUpperCase() === userRoleName?.toUpperCase()) || 
                  (r.nombre?.toUpperCase() === userRoleName?.toUpperCase())
                );
                
                // Si encontramos el rol, usamos su ID, si no, string vacío
                const currentRoleId = matchingRole ? matchingRole.id.toString() : "";

                return (
                  <tr key={s.id}>
                    <td>{s.name || '-'}</td>
                    <td>{s.email}</td>
                    <td>
                      <select
                        className="minimal-select"
                        style={{ padding: '4px 8px', width: 'auto' }}
                        value={currentRoleId}
                        onChange={(e) => handleAssignRole(s.id, e.target.value)}
                        disabled={user?.id === s.id}
                      >
                        <option value="" disabled>Seleccionar Rol</option>
                        {roles.map(rol => (
                          <option key={rol.id} value={rol.id.toString()}>
                            {rol.nombre || rol.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button onClick={() => navigate(`/admin/users/edit/${s.id}`)} className="btn-action-view">
                        <Pencil size={18} />
                      </button>
                      {user?.id !== s.id && (
                        <button onClick={() => abrirConfirmacion(s)} className="btn-action-delete">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4" className="empty-state">No se encontraron socios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0} className="btn-action-view">
          <ChevronLeft size={18} />
        </button>
        <span>Página {page + 1} de {totalPages || 1}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1 || totalPages === 0} className="btn-action-view">
          <ChevronRight size={18} />
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-warning"><AlertTriangle size={48} color="#ef4444" /></div>
            <h3>¿Eliminar socio?</h3>
            <p>Estás a punto de eliminar a <strong>{socioAEliminar?.name || socioAEliminar?.email}</strong>.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)} disabled={eliminando}>Cancelar</button>
              <button className="btn-confirm-delete" onClick={confirmarEliminacion} disabled={eliminando}>
                {eliminando ? <Loader2 className="spinner-icon" size={18} /> : "Eliminar Socio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SociosList;