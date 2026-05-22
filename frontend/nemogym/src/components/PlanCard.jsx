import React from 'react';
import { Check, HelpCircle, X } from 'lucide-react';

const PlanCard = ({ plan, isCurrentPlan, isAdmin, iconMap, onAction, onDelete }) => {
  return (
    <div className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'active-plan' : ''}`}>
    
      {isAdmin && (
        <button 
          className="btn-delete-plan" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(plan.id); 
          }}
          title="Eliminar Plan"
        >
          <X size={20} />
        </button>
      )}

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
        onClick={() => onAction(plan)}
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
};

export default PlanCard;