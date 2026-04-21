import { CheckCircle, XCircle, X, Loader2 } from 'lucide-react';

const CustomToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const config = {
    ok: { 
      icon: <CheckCircle size={24} />, 
      class: 'toast-ok' 
    },
    nok: { 
      icon: <XCircle size={24} />, 
      class: 'toast-nok' 
    }
  };

  const current = config[toast.type] || config.ok;

  return (
    <div className={`custom-toast-container ${current.class}`}>
      <div className="toast-icon">{current.icon}</div>
      <div className="toast-content">
        <p className="toast-message">{toast.msg}</p>
      </div>
      <button onClick={onClose} className="toast-close-btn">
        <X size={18} />
      </button>
      <div className="toast-progress-bar" style={{ animationDuration: `${toast.duration}ms` }}></div>
    </div>
  );
};

export default CustomToast;