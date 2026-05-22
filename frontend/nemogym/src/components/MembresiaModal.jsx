import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const MembresiaModal = ({ isOpen, onClose, onSubmit, editingPlan, formData, setFormData }) => {
  
  useEffect(() => {
    if (isOpen && editingPlan) {
      setFormData(editingPlan);
    }
  }, [isOpen, editingPlan, setFormData]);

  if (!isOpen) return null;

  return (
    <div className="mbr-modal-overlay">
      <div className="mbr-modal-card">
        <div className="mbr-modal-header">
          <h2 className="mbr-modal-title">
            {editingPlan ? 'Editar Membresía' : 'Nueva Membresía'}
          </h2>
          <button type="button" className="mbr-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mbr-modal-form">
          <div className="mbr-form-group">
            <label>Nombre del Plan</label>
            <input className="mbr-input" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
          </div>
          
          <div className="mbr-form-group">
            <label>Precio Mensual</label>
            <input className="mbr-input" type="number" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required />
          </div>
          
          <div className="mbr-form-row">
            <div className="mbr-form-group">
              <label>Icono</label>
              <select className="mbr-select" value={formData.icono} onChange={e => setFormData({...formData, icono: e.target.value})}>
                <option value="Dumbbell">Pesas</option>
                <option value="Zap">Rayo</option>
              </select>
            </div>
            <div className="mbr-form-group">
              <label>Estilo Visual</label>
              <select className="mbr-select" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option value="basic">Básico</option>
                <option value="full">Full</option>
              </select>
            </div>
          </div>
          
          <div className="mbr-form-group">
            <label>Beneficios (separados por coma)</label>
            <textarea className="mbr-textarea" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} required />
          </div>
          
          <div className="mbr-checkbox-container">
            <input id="popular-check" type="checkbox" className="mbr-checkbox" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} />
            <label htmlFor="popular-check">Plan Recomendado</label>
          </div>
          
          <button type="submit" className="mbr-btn-submit">
            {editingPlan ? 'Actualizar Plan' : 'Crear Membresía'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MembresiaModal;