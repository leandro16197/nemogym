import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, Plus, Trash2, Loader2, Edit2, X, Save } from 'lucide-react';


function RolesManager() {
  const { getToken } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleEditClick = (role) => {
    setNewRole(role.name);
    setEditingId(role.id);
  };


  const cancelEdit = () => {
    setNewRole('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    setLoading(true);

    try {

      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/roles/update/${editingId}?name=${newRole.toUpperCase()}`
        : `${import.meta.env.VITE_API_URL}/roles/create?name=${newRole.toUpperCase()}`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (res.ok) {
        setNewRole('');
        setEditingId(null);
        fetchRoles();
        if (window.appCustom) {
          window.appCustom.smallBox('ok', editingId ? 'Rol actualizado correctamente' : 'Rol creado correctamente');
        }
      }
    } catch (error) {
      if (window.appCustom) window.appCustom.smallBox('nok', 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="section-header-list">
        <Shield size={28} className="primary-color" />
        <h2 className="section-title">Gestión de Roles</h2>
      </div>

      {/* Formulario compacto para Añadir/Editar */}
      <div className="filters-bar-container" style={{ marginTop: '20px' }}>
        <form onSubmit={handleSubmit} className="filters-bar" style={{ maxWidth: '600px', padding: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
               <input 
                className="minimal-input" 
                placeholder="Nombre del rol (ej: NUTRICIONISTA)" 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ width: '100%', paddingRight: editingId ? '40px' : '10px' }}
              />
              {editingId && (
                <X 
                  size={16} 
                  className="cancel-icon" 
                  onClick={cancelEdit} 
                  style={{ position: 'absolute', right: '12px', top: '30%', cursor: 'pointer', color: '#94a3b8' }}
                />
              )}
            </div>
            
            <button className={editingId ? "btn-action-view" : "btn-save"} type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                editingId ? <Save size={20} /> : <Plus size={20} />
              )}
              <span style={{ marginLeft: '8px' }}>{editingId ? 'Guardar' : 'Añadir Rol'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="table-wrapper" style={{ marginTop: '20px' }}>
        <table className="routine-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Nombre del Rol</th>
              <th style={{ textAlign: 'center', width: '150px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id} className={editingId === r.id ? 'editing-row' : ''}>
                <td>{r.id}</td>
                <td>
                  <span className={`badge-role ${r.name.toLowerCase()}`}>
                    {r.name}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                      className="btn-action-edit" 
                      onClick={() => handleEditClick(r)}
                      title="Editar rol"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn-action-delete" 
                      title="Eliminar rol"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RolesManager;