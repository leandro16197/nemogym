import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from 'lucide-react';

function ClasesForm() {
  const { getToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(esEdicion);
  const estadoInicial = { dia: 1, genero: 'MUJER', tipo: 'MIXTO (4 SUP / 2 INF)', ejercicios: [{ nombre: '', repeticiones: '' }] };
  const [clase, setClase] = useState(estadoInicial);

  useEffect(() => {
    if (!esEdicion) return;
    const fetchClase = async () => {
      setLoadingDatos(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/clases/${id}`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Error al cargar la clase");
        setClase({
          dia: json.data.dia,
          genero: json.data.genero,
          tipo: json.data.tipo,
          ejercicios: json.data.ejercicios?.length > 0 ? json.data.ejercicios : [{ nombre: '', repeticiones: '' }]
        });
      } catch (err) {
        console.error(err);
        window.appCustom.smallBox('nok', "No se pudo cargar la rutina", () => navigate('/clases'), 3000);
      } finally { setLoadingDatos(false); }
    };
    fetchClase();
  }, [id, esEdicion, getToken, navigate]);

  const handleChange = (e) => {
    const value = e.target.name === 'dia' ? parseInt(e.target.value) : e.target.value;
    setClase({ ...clase, [e.target.name]: value });
  };

  const handleEjercicioChange = (index, e) => {
    const nuevosEjercicios = [...clase.ejercicios];
    nuevosEjercicios[index][e.target.name] = e.target.value;
    setClase({ ...clase, ejercicios: nuevosEjercicios });
  };

  const agregarEjercicio = () => setClase({ ...clase, ejercicios: [...clase.ejercicios, { nombre: '', repeticiones: '' }] });

  const eliminarEjercicio = (index) => {
    if (clase.ejercicios.length === 1) return;
    setClase({ ...clase, ejercicios: clase.ejercicios.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const url = esEdicion ? `${import.meta.env.VITE_API_URL}/clases/${id}` : `${import.meta.env.VITE_API_URL}/clases`;
    const method = esEdicion ? 'PUT' : 'POST';
    const payload = esEdicion ? { ...clase } : { fecha: new Date().toISOString().split('T')[0], clases: [clase] };
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        const msg = esEdicion ? "¡Rutina actualizada!" : "¡Rutina guardada con éxito!";
        window.appCustom.smallBox('ok', msg, () => {
          navigate('/clases'); 
        }, 2500);
      } else {
        window.appCustom.smallBox('nok', data.message || "Error al procesar la solicitud", null, 4000);
      }
    } catch (error) {
      window.appCustom.smallBox('nok', "Error de red. Intenta de nuevo.", null, 4000);
    } finally { 
      setLoading(false); 
    }
  };

  if (loadingDatos) return <div className="loading-full-container"><Loader2 className="spinner-icon" size={48} /><p>Cargando rutina...</p></div>;

  return (
    <div className="clases-manager-container">
      <button onClick={() => navigate('/clases')} className="clases-manager-btn-back"><ArrowLeft size={18} /> Volver</button>
      <div className="clases-manager-card">
        <h2 className="clases-manager-title">{esEdicion ? 'Editar Rutina' : 'Nueva Rutina'}</h2>
        <form onSubmit={handleSubmit} className="clases-manager-form">
          <div className="clases-manager-header-grid">
            <div className="clases-manager-input-group">
              <label>Día</label>
              <select name="dia" value={clase.dia} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>Día {d}</option>)}
              </select>
            </div>
            <div className="clases-manager-input-group">
              <label>Género</label>
              <select name="genero" value={clase.genero} onChange={handleChange}>
                <option value="MUJER">Mujer</option>
                <option value="HOMBRE">Hombre</option>
              </select>
            </div>
            <div className="clases-manager-input-group" style={{ flex: 2 }}>
              <label>Tipo de Entrenamiento</label>
              <input type="text" name="tipo" placeholder="Ej: MIXTO" value={clase.tipo} onChange={handleChange} required />
            </div>
          </div>
          <div className="clases-manager-ejercicios-section">
            <h3 className="clases-manager-sub-title">Ejercicios</h3>
            {clase.ejercicios.map((ej, index) => (
              <div key={index} className="clases-manager-ejercicio-row">
                <input className="name-field" placeholder="Nombre" name="nombre" value={ej.nombre} onChange={(e) => handleEjercicioChange(index, e)} required />
                <input className="reps-field" placeholder="Reps" name="repeticiones" value={ej.repeticiones} onChange={(e) => handleEjercicioChange(index, e)} required />
                <button type="button" onClick={() => eliminarEjercicio(index)} className="clases-manager-btn-remove" disabled={clase.ejercicios.length === 1}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <div className="clases-manager-footer">
            <button type="button" onClick={agregarEjercicio} className="clases-manager-btn-add"><Plus size={18} /> Añadir</button>
            <button type="submit" className="clases-manager-btn-save" disabled={loading}>
              {loading ? <><Loader2 size={16} className="spinner-icon" /> Guardando...</> : <><Save size={18} /> {esEdicion ? 'Actualizar' : 'Guardar'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClasesForm;