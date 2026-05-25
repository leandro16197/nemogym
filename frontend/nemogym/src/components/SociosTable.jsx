import React from 'react';
import { Loader2, Pencil, Trash2, Mail } from 'lucide-react';

export const SociosTable = ({ 
  loading, 
  socios, 
  roles, 
  planes, 
  currentUser, 
  onEdit, 
  onDelete, 
  onRoleChange, 
  onPlanChange 
}) => (
  <div className="table-container-scroll">
    <table className="routine-table">
      <thead>
        <tr>
          <th style={{ textAlign: 'center' }}>SOCIO</th>
          <th style={{ textAlign: 'center' }}>EMAIL</th>
          <th style={{ textAlign: 'center' }}>ROL</th>
          <th style={{ textAlign: 'center' }}>PLAN</th>
          <th style={{ textAlign: 'center' }}>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="no-results" style={{ textAlign: 'center' }}>
              <Loader2 className="spinning" /> Cargando...
            </td>
          </tr>
        ) : socios.length > 0 ? (
          socios.map((s) => {
            const userRoleName = Array.isArray(s.roles) ? s.roles[0] : null;
            const matchingRole = roles.find(r => 
              (r.name?.toUpperCase() === userRoleName?.toUpperCase()) || 
              (r.nombre?.toUpperCase() === userRoleName?.toUpperCase())
            );

            return (
              <tr key={s.id}>
                <td style={{ textAlign: 'center' }}><div className="socio-name">{s.name || '-'}</div></td>
                <td style={{ textAlign: 'center' }}>
                  <div className="socio-email" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                    <Mail size={14} /> {s.email}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <select
                    className="table-select-rol"
                    value={matchingRole ? matchingRole.id.toString() : ""}
                    onChange={(e) => onRoleChange(s.id, e.target.value)}
                    disabled={currentUser?.id === s.id}
                  >
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id.toString()}>{rol.nombre || rol.name}</option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <select
                    className="table-select-plan"
                    value={s.planId || ""}
                    onChange={(e) => onPlanChange(s.id, e.target.value)}
                  >
                    <option value="">Sin plan</option>
                    {planes.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.nombre}</option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="actions-cell-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => onEdit(s)} className="btn-icon-edit" title="Editar">
                      <Pencil size={18} />
                    </button>
                    {currentUser?.id !== s.id && (
                      <button onClick={() => onDelete(s)} className="btn-icon-delete" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr><td colSpan="5" className="no-results" style={{ textAlign: 'center' }}>No se encontraron socios</td></tr>
        )}
      </tbody>
    </table>
  </div>
);