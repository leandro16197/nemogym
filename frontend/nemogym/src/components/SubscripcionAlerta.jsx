import React from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionAlert = ({ diasRestantes }) => {
  const navigate = useNavigate();
  if (diasRestantes > 10) return null;

  const isCritical = diasRestantes <= 5;

  const containerStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    fontWeight: '600',
    border: `1px solid ${isCritical ? '#f44336' : '#ff9800'}`,
    backgroundColor: isCritical ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)',
    color: isCritical ? '#f44336' : '#ff9800',
    flexWrap: 'wrap'
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={20} />
        <span style={{ fontSize: '0.9rem' }}>
            {diasRestantes < 0 
                ? "Tu suscripción ha vencido." 
                : diasRestantes === 0 
                ? "¡Tu suscripción termina hoy!" 
                : `Tu suscripción vence en ${diasRestantes} días.`}
            </span>
      </div>
      
      <button 
        onClick={() => navigate('/membresias')}
        style={{ 
          background: isCritical ? '#f44336' : '#ff9800', 
          color: '#fff', 
          border: 'none', 
          padding: '6px 12px', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap'
        }}
      >
        <CreditCard size={14} /> Renovar
      </button>
    </div>
  );
};

export default SubscriptionAlert;