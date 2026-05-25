export const DeleteSocioModal = ({ isOpen, socio, onClose, onConfirm, eliminando }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-dark-overlay">
      <div className="modal-dark-card">
        <AlertTriangle size={40} className="text-yellow-400" />
        <h3>¿Eliminar socio?</h3>
        <p>Estás a punto de eliminar a <strong>{socio?.name}</strong>.</p>
        <div className="modal-dark-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-danger" onClick={onConfirm} disabled={eliminando}>
            {eliminando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};