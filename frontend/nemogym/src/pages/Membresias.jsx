import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Check, Plus, Dumbbell, Zap, HelpCircle, X } from 'lucide-react';

const Membresias = () => {
  const { getToken, user, verifyPlan } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', precio: '', icono: 'Dumbbell', tipo: 'basic', popular: false, features: ''
  });

  // --- Lógica de Usuario basada en tu JSON ---
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('COACH');
  const userPlanActual = user?.nombrePlan; // Ej: "PLAN FULL"
  const tienePlanActivo = user?.hasActivePlan; // true/false

  const iconMap = {
    'Dumbbell': <Dumbbell color="#a1a1aa" size={32} />,
    'Zap': <Zap color="#3b82f6" size={32} />,
  };

  const fetchPlanes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/membresias`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new Error("Error al cargar membresías");
      const data = await response.json();
      setPlanes(data);
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchPlanes(); 
  }, [getToken]);

  const handleAdquirir = async (plan) => {
    if (window.appCustom?.smallBox) {
      window.appCustom.smallBox('question', `¿Deseas suscribirte al ${plan.nombre}?`, async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/membresias/adquirir/${plan.id}`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${getToken()}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            await verifyPlan(); // Actualiza el contexto global
            window.appCustom.smallBox('ok', '¡Membresía activada con éxito!', () => {
              navigate('/'); 
            }, 3000);
          } else {
            const errorMsg = await response.text();
            window.appCustom.smallBox('error', errorMsg || 'Error al procesar la suscripción.');
          }
        } catch (err) {
          window.appCustom.smallBox('error', 'Error de conexión con el servidor.');
        }
      });
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ 
        ...plan, 
        features: Array.isArray(plan.features) ? plan.features.join(', ') : plan.features 
      });
    } else {
      setEditingPlan(null);
      setFormData({ nombre: '', precio: '', icono: 'Dumbbell', tipo: 'basic', popular: false, features: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingPlan 
      ? `${import.meta.env.VITE_API_URL}/membresias/${editingPlan.id}`
      : `${import.meta.env.VITE_API_URL}/membresias`;
    
    const body = {
      ...formData,
      precio: parseFloat(formData.precio),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== "")
    };

    try {
      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowModal(false);
        fetchPlanes();
        if (window.appCustom?.smallBox) {
          window.appCustom.smallBox('ok', editingPlan ? "Actualizado" : "Creado");
        }
      }
    } catch (err) { 
      console.error("Error al guardar", err); 
    }
  };

  if (loading) return <div className="loading-screen">Cargando...</div>;

  return (
    <div className="membresias-container">
      <div className="membresias-header">
        <div className="membresias-title">
          <h1>Membresías</h1>
          <p>Elegí el plan que mejor se adapte a tu entrenamiento</p>
        </div>
        {isAdmin && (
          <button className="btn-create-plan" onClick={() => openModal()}>
            <Plus size={20} /> Nuevo Plan
          </button>
        )}
      </div>

      <div className="planes-grid">
        {planes.map((plan) => {
          // Lógica para detectar si es el plan que el usuario tiene activo
          const isCurrentPlan = tienePlanActivo && 
            userPlanActual?.toUpperCase() === plan.nombre?.toUpperCase();

          return (
            <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'active-plan' : ''}`}>
              {plan.popular && <span className="recommended-tag">Recomendado</span>}
              {isCurrentPlan && <span className="active-tag">Tu Plan Actual</span>}
              
              <div className="plan-icon">
                {iconMap[plan.icono] || <HelpCircle size={32} color="#a1a1aa" />}
                <h2 className="plan-name">{plan.nombre}</h2>
              </div>
              
              <div className="plan-price-container">
                <span className="plan-price">${plan.precio}</span>
                <span className="plan-period">/ mes</span>
              </div>
              
              <ul className="plan-features">
                {plan.features?.map((f, i) => (
                  <li key={i} className="feature-item">
                    <Check size={14} color="#3b82f6" /> {f}
                  </li>
                ))}
              </ul>

              <button 
                className={`btn-plan ${plan.tipo} ${isCurrentPlan ? 'subscribed' : ''}`}
                onClick={() => isAdmin ? openModal(plan) : (!isCurrentPlan && handleAdquirir(plan))}
                disabled={isCurrentPlan && !isAdmin}
              >
                {isAdmin 
                  ? 'Editar Plan' 
                  : isCurrentPlan 
                    ? 'Suscrito' 
                    : 'Suscribirme Ahora'
                }
              </button>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="mbr-modal-overlay">
          <div className="mbr-modal-card">
            <div className="mbr-modal-header">
              <h2 className="mbr-modal-title">
                {editingPlan ? 'Editar Membresía' : 'Nueva Membresía'}
              </h2>
              <button className="mbr-modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mbr-modal-form">
              <div className="mbr-form-group">
                <label>Nombre del Plan</label>
                <input 
                  className="mbr-input" 
                  value={formData.nombre} 
                  onChange={e => setFormData({...formData, nombre: e.target.value})} 
                  required 
                />
              </div>
              <div className="mbr-form-group">
                <label>Precio Mensual</label>
                <input 
                  className="mbr-input" 
                  type="number" 
                  value={formData.precio} 
                  onChange={e => setFormData({...formData, precio: e.target.value})} 
                  required 
                />
              </div>
              <div className="mbr-form-row">
                <div className="mbr-form-group">
                  <label>Icono</label>
                  <select 
                    className="mbr-select" 
                    value={formData.icono} 
                    onChange={e => setFormData({...formData, icono: e.target.value})}
                  >
                    <option value="Dumbbell">Pesas</option>
                    <option value="Zap">Rayo</option>
                  </select>
                </div>
                <div className="mbr-form-group">
                  <label>Estilo Visual</label>
                  <select 
                    className="mbr-select" 
                    value={formData.tipo} 
                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="basic">Básico</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>
              <div className="mbr-form-group">
                <label>Beneficios (separados por coma)</label>
                <textarea 
                  className="mbr-textarea" 
                  value={formData.features} 
                  onChange={e => setFormData({...formData, features: e.target.value})} 
                  required 
                />
              </div>
              <div className="mbr-checkbox-container">
                <input 
                  id="popular-check" 
                  type="checkbox" 
                  className="mbr-checkbox" 
                  checked={formData.popular} 
                  onChange={e => setFormData({...formData, popular: e.target.checked})} 
                />
                <label htmlFor="popular-check">Plan Recomendado</label>
              </div>
              <button type="submit" className="mbr-btn-submit">
                {editingPlan ? 'Actualizar Plan' : 'Crear Membresía'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membresias;