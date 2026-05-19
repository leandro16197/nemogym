import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const RolesTable = ({ roles, onEdit, onDelete, editingId }) => {
  return (
    <div className="table-container-scroll">
      <table className="routine-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>ID</th>
            <th>NOMBRE DEL ROL</th>
            <th style={{ textAlign: 'right' }}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((r) => (
              <tr key={r.id} className={editingId === r.id ? 'editing-row' : ''}>
                <td>
                   <div className="socio-name" style={{ color: '#94a3b8' }}>#{r.id}</div>
                </td>
                <td>
                  <span className={`badge-role ${r.name.toLowerCase()}`}>
                    {r.name}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      className="btn-icon-edit" 
                      title="Editar rol"
                      onClick={() => onEdit(r)}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      className="btn-icon-delete" 
                      title="Eliminar rol"
                      onClick={() => onDelete(r)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-results">No hay roles registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RolesTable;