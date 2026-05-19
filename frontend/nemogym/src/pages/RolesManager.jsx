import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, Plus, Loader2, X, Save } from 'lucide-react';
import RolesTable from '../components/RolesTable';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

function RolesManager() {
  const { getToken } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para el borrado
  const [roleAEliminar, setRoleAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

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

  useEffect(() => {
    fetchRoles();
  }, []);

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
        window.appCustom?.smallBox('ok', editingId ? 'Rol actualizado correctamente' : 'Rol creado correctamente');
      }
    } catch (error) {
      window.appCustom?.smallBox('nok', 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!roleAEliminar) return;
    setEliminando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles/delete/${roleAEliminar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (res.ok) {
        fetchRoles();
        window.appCustom?.smallBox('ok', 'Rol eliminado correctamente');
      } else {
        window.appCustom?.smallBox('nok', 'No se pudo eliminar el rol');
      }
    } catch (error) {
      window.appCustom?.smallBox('nok', 'Error de conexión');
    } finally {
      setEliminando(false);
      setRoleAEliminar(null);
    }
  };

  return (
    <div className="personalizadas-container">
      {/* Header Estilo App */}
      <div className="header-wrapper">
        <h2>
          <div className="icon-box"><Shield size={20} /></div>
          Gestión de Roles
        </h2>
        <p>Define los niveles de acceso para los usuarios del sistema.</p>
      </div>

      <div className="filters-bar-container" style={{ marginTop: '20px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        <form onSubmit={handleSubmit} className="filters-bar" style={{ maxWidth: '100%', padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                className="minimal-input" 
                placeholder="Nombre del rol (ej: NUTRICIONISTA)" 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ 
                  width: '100%', 
                  paddingRight: editingId ? '45px' : '15px',
                  height: '45px',
                  boxSizing: 'border-box'
                }}
              />
              {editingId && (
                <X 
                  size={18} 
                  onClick={cancelEdit} 
                  style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer', 
                    color: '#94a3b8',
                    zIndex: 2
                  }}
                />
              )}
            </div>
            

            <button 
              className={editingId ? "mbr-btn-submit" : "clases-manager-btn-add"} 
              type="submit" 
              disabled={loading} 
              style={{ 
                margin: 0, 
                height: '45px', 
                whiteSpace: 'nowrap', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'fit-content',
                padding: '0 20px'
              }}
            >
              {loading ? (
                <Loader2 className="spinning" size={20} />
              ) : (
                editingId ? <Save size={20} /> : <Plus size={20} />
              )}
              <span style={{ marginLeft: '8px' }}>
                {editingId ? 'Guardar Cambios' : 'Crear Rol'}
              </span>
            </button>

          </div>
        </form>
      </div>

      {/* Tabla de Roles */}
      <div className="list-card admin-socios-dark" style={{ marginTop: '20px' }}>
        <RolesTable 
          roles={roles}
          onEdit={handleEditClick}
          onDelete={(role) => setRoleAEliminar(role)}
          editingId={editingId}
        />
      </div>

      {/* Modal de Confirmación */}
      <ConfirmDeleteModal 
        isOpen={!!roleAEliminar}
        onClose={() => setRoleAEliminar(null)}
        onConfirm={handleEliminar}
        eliminando={eliminando}
        titulo="¿Eliminar Rol?"
        mensaje={`Estás por eliminar el rol "${roleAEliminar?.name}". Ten en cuenta que los usuarios asignados a este rol podrían tener problemas de acceso.`}
      />
    </div>
  );
}

export default RolesManager;