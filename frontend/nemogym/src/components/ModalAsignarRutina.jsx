import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Save, Loader2, Dumbbell, Calendar, Filter } from 'lucide-react';

function ModalAsignarRutina({ socio, onClose, getToken, onSuccess }) {
    const [submitting, setSubmitting] = useState(false);
    const [loadingRutinas, setLoadingRutinas] = useState(true);
    const [rutinasActuales, setRutinasActuales] = useState([]);
    const [filtroDia, setFiltroDia] = useState(''); 

    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    
    const estadoInicial = { dia: 1, tipo: 'PERSONALIZADA', ejercicios: [{ nombre: '', repeticiones: '' }] };
    const [clase, setClase] = useState(estadoInicial);
    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => { cargarRutinasSocio(); }, [socio.id]);

    const cargarRutinasSocio = async () => {
        setLoadingRutinas(true);
        try {
            const res = await fetch(`${baseUrl}/coach/clases-personalizadas/${socio.id}`, {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            const data = await res.json();
            setRutinasActuales(data);
        } catch (error) {
            console.error("Error al cargar rutinas");
        } finally { setLoadingRutinas(false); }
    };

    const handleEjercicioChange = (index, e) => {
        const nuevosEjercicios = [...clase.ejercicios];
        nuevosEjercicios[index][e.target.name] = e.target.value;
        setClase({ ...clase, ejercicios: nuevosEjercicios });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${baseUrl}/coach/clases-personalizadas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ user_id: socio.id, ...clase })
            });

            if (response.ok) {
                window.appCustom?.smallBox('ok', "Rutina asignada", null, 2000);
                setClase(estadoInicial);
                cargarRutinasSocio();
                onSuccess(true); 
            }
        } catch (error) {
            window.appCustom?.smallBox('nok', "Error al guardar", null, 4000);
        } finally { setSubmitting(false); }
    };

    const handleOpenDelete = (id, nombre) => {
        setDeleteConfirm({ show: true, id, name: nombre });
    };

    const confirmarEliminar = async () => {
        const { id } = deleteConfirm;
        try {
            const response = await fetch(`${baseUrl}/coach/clases-personalizadas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            
            if (response.ok) {
                setRutinasActuales(prev => prev.filter(r => r.id !== id));
                window.appCustom?.smallBox('ok', "Rutina eliminada", null, 2000);
                onSuccess(true); 
            }
        } catch (error) {
            window.appCustom?.smallBox('nok', "Error al eliminar", null, 4000);
        } finally {
            setDeleteConfirm({ show: false, id: null, name: '' });
        }
    };

    const rutinasFiltradas = rutinasActuales
        .filter(r => {
            if (!filtroDia) return true;
            return r.dia.toString() === filtroDia;
        })
        .sort((a, b) => a.dia - b.dia);

    return (
        <div className="modal-overlay">
            <div className="modal-content-custom wide">
                <div className="modal-header">
                    <h3>Gestión de Rutinas: {socio.name}</h3>
                    <button className="btn-close-modal" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="modal-body-split">
                    <form onSubmit={handleSubmit} className="clases-manager-form">
                        <div className="form-section-title"><Plus size={16}/> Asignar Nueva</div>
                        <div className="clases-manager-header-grid">
                            <div className="clases-manager-input-group">
                                <label>Día</label>
                                <select value={clase.dia} onChange={(e) => setClase({ ...clase, dia: e.target.value })}>
                                    {[1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>Día {d}</option>)}
                                </select>
                            </div>
                            <div className="clases-manager-input-group-flex">
                                <label>Enfoque (Tipo)</label>
                                <input type="text" value={clase.tipo} onChange={(e) => setClase({ ...clase, tipo: e.target.value })} placeholder="Ej: Pecho y Triceps" required />
                            </div>
                        </div>

                        <div className="ejercicios-scroll-area mini">
                            {clase.ejercicios.map((ej, index) => (
                                <div key={index} className="clases-manager-ejercicio-row">
                                    <input className="input-ejercicio" placeholder="Ejercicio" name="nombre" value={ej.nombre} onChange={(e) => handleEjercicioChange(index, e)} required />
                                    <input className="input-reps" placeholder="Reps" name="repeticiones" value={ej.repeticiones} onChange={(e) => handleEjercicioChange(index, e)} required />
                                    <button type="button" onClick={() => setClase({ ...clase, ejercicios: clase.ejercicios.filter((_, i) => i !== index) })} className="clases-manager-btn-remove" disabled={clase.ejercicios.length === 1}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="clases-manager-footer">
                            <button type="button" onClick={() => setClase({ ...clase, ejercicios: [...clase.ejercicios, { nombre: '', repeticiones: '' }] })} className="clases-manager-btn-add">
                                <Plus size={18} /> Añadir
                            </button>
                            <button type="submit" className="clases-manager-btn-save" disabled={submitting}>
                                {submitting ? <Loader2 size={18} className="spinner-icon" /> : <><Save size={18} /> Guardar</>}
                            </button>
                        </div>
                    </form>

                    <div className="modal-v-divider" />

                    <div className="current-routines-section">
                        <div className="form-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Dumbbell size={16}/> <span>Rutinas Actuales</span>
                            </div>
                            
                            <div className="filter-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Filter size={14} style={{ color: '#64748b' }} />
                                <select 
                                    value={filtroDia}
                                    onChange={(e) => setFiltroDia(e.target.value)}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #1e293b',
                                        backgroundColor: '#0f172a',
                                        color: 'white',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="">Todos</option>
                                    {[1, 2, 3, 4, 5, 6].map(d => (
                                        <option key={d} value={d}>Día {d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="rutinas-scroll-container">
                            <div className="rutinas-list-mini">
                                {loadingRutinas ? (
                                    <div className="loading-centered"><Loader2 className="spinner-icon" /></div>
                                ) : rutinasFiltradas.length === 0 ? (
                                    <div className="empty-state-mini">
                                        <Calendar size={24} />
                                        <p>{filtroDia ? `No hay rutinas el Día ${filtroDia}` : 'Sin rutinas asignadas.'}</p>
                                    </div>
                                ) : (
                                    rutinasFiltradas.map(r => (
                                        <div key={r.id} className="rutina-card-mini">
                                            <div className="rutina-badge-dia">D{r.dia}</div>
                                            <div className="rutina-content">
                                                <span className="rutina-name">{r.nombre}</span>
                                                <span className="rutina-detail">{r.repeticiones} reps</span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => handleOpenDelete(r.id, r.nombre)} 
                                                className="btn-delete-action"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {deleteConfirm.show && (
                <div className="mini-modal-overlay">
                    <div className="mini-modal-content">
                        <div className="mini-modal-icon"><Trash2 size={28} /></div>
                        <h4>¿Eliminar rutina?</h4>
                        <p>Se borrará <strong>{deleteConfirm.name}</strong> de forma permanente.</p>
                        <div className="mini-modal-actions">
                            <button className="btn-mini-cancel" onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}>
                                Cancelar
                            </button>
                            <button className="btn-mini-confirm" onClick={confirmarEliminar}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModalAsignarRutina;