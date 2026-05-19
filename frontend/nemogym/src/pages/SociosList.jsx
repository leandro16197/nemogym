import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Loader2, ChevronLeft, ChevronRight, Pencil, Trash2, AlertTriangle, Search, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SociosList() {
  const { getToken, user: currentUser } = useContext(AuthContext);
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

  useEffect(() => { fetchRoles(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchSocios(page); }, 400);
    return () => clearTimeout(timer);
  }, [page, search, genero, rolId]);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Error roles:", err); }
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
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" }
      });
      const json = await res.json();
      setSocios(json.data || []);
      setTotalPages(json.totalPages || 0);
    } catch (err) { console.error("Error socios:", err); }
    finally { setLoading(false); }
  };

  const handleAssignRole = async (userId, newRoleId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles/assign`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleId: newRoleId })
      });
      if (res.ok) {
        window.appCustom.smallBox('ok', 'Rol actualizado');
        fetchSocios(page, true);
      }
    } catch (err) { window.appCustom.smallBox('nok', 'Error de conexión'); }
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${socioAEliminar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        window.appCustom.smallBox('ok', 'Socio eliminado');
        setShowModal(false);
        fetchSocios(page, true);
      }
    } finally { setEliminando(false); }
  };

  return (
    <div className="personalizadas-container"> {/* Contenedor principal para margen y padding */}
      <div className="header-wrapper">
        <h2>
          <div className="icon-box"><Users size={20} /></div>
          Administración de Socios
        </h2>
        <p>Gestiona los permisos, perfiles y estados de los miembros del gimnasio.</p>
      </div>

      <div className="list-card admin-socios-dark">
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
            {search && <X size={16} className="clear-icon" onClick={() => setSearch('')} />}
          </div>

          <div className="filters-right-group" style={{ display: 'flex', gap: '10px' }}>
            <select value={genero} onChange={(e) => { setGenero(e.target.value); setPage(0); }}>
              <option value="">Géneros</option>
              <option value="HOMBRE">Hombre</option>
              <option value="MUJER">Mujer</option>
            </select>

            <select value={rolId} onChange={(e) => { setRolId(e.target.value); setPage(0); }}>
              <option value="">Todos los roles</option>
              {roles.map(rol => (
                <option key={rol.id} value={rol.id.toString()}>{rol.nombre || rol.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container-scroll">
          <table className="routine-table">
            <thead>
              <tr>
                <th>SOCIO</th>
                <th>EMAIL</th>
                <th>ROL</th>
                <th style={{ textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="no-results"><Loader2 className="spinning" /> Cargando...</td></tr>
              ) : socios.length > 0 ? (
                socios.map((s) => {
                  const userRoleName = Array.isArray(s.roles) ? s.roles[0] : null;
                  const matchingRole = roles.find(r => 
                    (r.name?.toUpperCase() === userRoleName?.toUpperCase()) || 
                    (r.nombre?.toUpperCase() === userRoleName?.toUpperCase())
                  );
                  return (
                    <tr key={s.id}>
                      <td><div className="socio-name">{s.name || '-'}</div></td>
                      <td>
                        <div className="socio-email">
                          <Mail size={14} /> {s.email}
                        </div>
                      </td>
                      <td>
                        <select
                          className="table-select-rol"
                          value={matchingRole ? matchingRole.id.toString() : ""}
                          onChange={(e) => handleAssignRole(s.id, e.target.value)}
                          disabled={currentUser?.id === s.id}
                        >
                          {roles.map(rol => (
                            <option key={rol.id} value={rol.id.toString()}>{rol.nombre || rol.name}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => navigate(`/admin/users/edit/${s.id}`)} className="btn-icon-edit" title="Editar">
                            <Pencil size={18} />
                          </button>
                          {currentUser?.id !== s.id && (
                            <button onClick={() => { setSocioAEliminar(s); setShowModal(true); }} className="btn-icon-delete" title="Eliminar">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="4" className="no-results">No se encontraron socios</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="info">Página {page + 1} de {totalPages || 1}</div>
          <div className="pagination-controls">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="page-btn">
              <ChevronLeft size={18} />
            </button>
            <span className="page-indicator">{page + 1}</span>
            <button disabled={page >= totalPages - 1 || totalPages === 0} onClick={() => setPage(p => p + 1)} className="page-btn">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Confirmación */}
      {showModal && (
        <div className="modal-dark-overlay">
          <div className="modal-dark-card">
            <AlertTriangle size={40} className="text-yellow-400" />
            <h3>¿Eliminar socio?</h3>
            <p>Estás a punto de eliminar a <strong>{socioAEliminar?.name}</strong>.</p>
            <div className="modal-dark-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmarEliminacion} disabled={eliminando}>
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SociosList;