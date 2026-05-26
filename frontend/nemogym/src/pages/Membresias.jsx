import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Dumbbell, Zap } from 'lucide-react';
import PlanCard from '../components/PlanCard';
import MembresiaModal from '../components/MembresiaModal';

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

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'COACH';
  const userPlanActual = user?.nombrePlan;
  const tienePlanActivo = user?.hasActivePlan;

  const iconMap = {
    Dumbbell: <Dumbbell color="#a1a1aa" size={32} />,
    Zap: <Zap color="#3b82f6" size={32} />,
  };

  const fetchPlanes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/membresias`, {
        headers: { Authorization: `Bearer ${getToken()}` }
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

const handleAdquirir = async (plan) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    window.appCustom.smallBox('info', 'Preparando el pago...');
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/crear-preferencia/${plan.id}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json' 
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al crear preferencia");
    }

    const data = await response.json();
    const urlRedireccion = data.init_point || data.initPoint;

    if (urlRedireccion) {
      await delay(5000);
      window.appCustom.smallBox('ok', 'Redirigiendo a Mercado Pago ...');
      await delay(5000);
      window.location.assign(urlRedireccion);
    } else {
      window.appCustom.smallBox('error', 'La respuesta del servidor no contiene una URL válida.');
    }
  } catch (err) {
    console.error("Error en handleAdquirir:", err);
    window.appCustom.smallBox('error', 'No se pudo iniciar el pago: ' + err.message);
  }
};

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: typeof formData.features === 'string' 
        ? formData.features.split(',').map(item => item.trim()) 
        : formData.features
    };

    try {
      const url = editingPlan 
        ? `${import.meta.env.VITE_API_URL}/membresias/${editingPlan.id}` 
        : `${import.meta.env.VITE_API_URL}/membresias`;
      
      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error al guardar");
      handleCloseModal();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handlePlanAction = (plan) => {
    if (isAdmin) {
      setEditingPlan(plan);
      setFormData({ 
        ...plan, 
        features: Array.isArray(plan.features) ? plan.features.join(', ') : plan.features 
      });
      setShowModal(true);
    } else {
      handleAdquirir(plan);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({ nombre: '', precio: '', icono: 'Dumbbell', tipo: 'basic', popular: false, features: '' });
    fetchPlanes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este plan?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/membresias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!response.ok) throw new Error("Error al eliminar");
      fetchPlanes();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="membresias-container">
      <div className="membresias-header">
        <h1>Membresías</h1>
        {isAdmin && (
          <button className="btn-create-plan" onClick={() => { 
            setEditingPlan(null); 
            setFormData({ nombre: '', precio: '', icono: 'Dumbbell', tipo: 'basic', popular: false, features: '' });
            setShowModal(true); 
          }}>
            <Plus size={20} /> Nuevo Plan
          </button>
        )}
      </div>

      <div className="planes-grid">
        {planes.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isAdmin={isAdmin}
            isCurrentPlan={tienePlanActivo && userPlanActual?.toUpperCase() === plan.nombre?.toUpperCase()}
            iconMap={iconMap}
            onAction={handlePlanAction}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <MembresiaModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit} 
        editingPlan={editingPlan}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Membresias;