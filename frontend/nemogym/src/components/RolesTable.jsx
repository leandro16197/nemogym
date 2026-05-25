import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const RolesTable = ({ roles, onEdit, onDelete, editingId }) => {
  return (
    <div className="table-container-scroll">
      <table className="routine-table">
        <thead>
          <tr>
            <th style={{ width: '80px', textAlign: 'center' }}>ID</th>
            <th style={{ textAlign: 'center' }}>NOMBRE DEL ROL</th>
            <th style={{ textAlign: 'center' }}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((r) => (
              <tr key={r.id} className={editingId === r.id ? 'editing-row' : ''}>
                <td style={{ textAlign: 'center' }}>
                   <div className="socio-name" style={{ color: '#94a3b8' }}>#{r.id}</div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge-role ${r.name.toLowerCase()}`}>
                    {r.name}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
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
              <td colSpan="3" className="no-results" style={{ textAlign: 'center' }}>
                No hay roles registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RolesTable;