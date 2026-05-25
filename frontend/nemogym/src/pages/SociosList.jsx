import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, ChevronLeft, ChevronRight, Search, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SociosTable } from '../components/SociosTable';

function SociosList() {
  const { getToken, user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [membresias, setMembresias] = useState([]);
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
    fetchMembresias(); 
  }, []);

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

  const fetchMembresias = async () => {
    try {
      // Endpoint corregido a /membresias
      const res = await fetch(`${import.meta.env.VITE_API_URL}/membresias`, { 
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setMembresias(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Error membresías:", err); }
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

  const handleAssignMembresia = async (userId, newMembresiaId) => {
    try {
      // Endpoint corregido a /membresias/assign
      const res = await fetch(`${import.meta.env.VITE_API_URL}/membresias/assign`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, membresiaId: newMembresiaId })
      });
      if (res.ok) { 
        window.appCustom.smallBox('ok', 'Membresía actualizada'); 
        fetchSocios(page, true); 
      } else {
        window.appCustom.smallBox('nok', 'Error al asignar');
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
    <div className="personalizadas-container">
      <div className="header-wrapper">
        <h2><div className="icon-box"><Users size={20} /></div> Administración de Socios</h2>
      </div>

      <div className="list-card admin-socios-dark">
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Buscar..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
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
              {roles.map(rol => <option key={rol.id} value={rol.id}>{rol.nombre || rol.name}</option>)}
            </select>
          </div>
        </div>

        <SociosTable 
          loading={loading}
          socios={socios}
          roles={roles}
          planes={membresias}
          currentUser={currentUser}
          onEdit={(s) => navigate(`/admin/users/edit/${s.id}`)}
          onDelete={(s) => { setSocioAEliminar(s); setShowModal(true); }}
          onRoleChange={handleAssignRole}
          onPlanChange={handleAssignMembresia}
        />

        <div className="table-footer">
          <div className="info">Página {page + 1} de {totalPages || 1}</div>
          <div className="pagination-controls">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="page-btn"><ChevronLeft size={18} /></button>
            <span className="page-indicator">{page + 1}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="page-btn"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-dark-overlay">
          <div className="modal-dark-card">
            <AlertTriangle size={40} className="text-yellow-400" />
            <h3>¿Eliminar socio?</h3>
            <p>Estás a punto de eliminar a <strong>{socioAEliminar?.name}</strong>.</p>
            <div className="modal-dark-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmarEliminacion} disabled={eliminando}>{eliminando ? "Eliminando..." : "Eliminar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SociosList;