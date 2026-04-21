import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Save, ArrowLeft, Loader2, User as UserIcon, Mail } from 'lucide-react';

function SocioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useContext(AuthContext);
  
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [socio, setSocio] = useState({ name: '', email: '', genero: 'MUJER' });

  useEffect(() => {
    const fetchSocio = async () => {
      setLoadingDatos(true);
      console.log("getToken:", getToken());
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const json = await res.json();
        const data = json.data || json;
        setSocio({
          name: data.name || '',
          email: data.email || '',
          genero: data.genero || 'MUJER'
        });
      } catch (err) {
        window.appCustom.smallBox('nok', 'No se pudo cargar la información del socio');
        navigate('/socios');
      } finally {
        setLoadingDatos(false);
      }
    };
    fetchSocio();
  }, [id, getToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}` 
        },
        body: JSON.stringify(socio)
      });

      if (res.ok) {
        window.appCustom.smallBox('ok', '¡Perfil de socio actualizado!', () => {
          navigate('/socios'); 
        }, 2000);
      } else {
        const errorData = await res.json();
        window.appCustom.smallBox('nok', errorData.message || 'Error al actualizar');
      }
    } catch (err) {
      window.appCustom.smallBox('nok', 'Error de red al intentar guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (loadingDatos) {
    return (
      <div className="loading-full-container">
        <Loader2 className="spinner-icon" size={48} />
        <p>Cargando datos del socio...</p>
      </div>
    );
  }

  return (
    <div className="clases-manager-container">
      <button onClick={() => navigate('/socios')} className="clases-manager-btn-back">
        <ArrowLeft size={18} /> Volver a Socios
      </button>
      
      <div className="clases-manager-card">
        <div className="title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
             <UserIcon size={24} className="primary-color" />
             <h2 className="clases-manager-title" style={{ margin: 0 }}>Editar Perfil de Socio</h2>
        </div>

        <form onSubmit={handleSubmit} className="clases-manager-form">
          
          <div className="clases-manager-header-grid">
            {/* NOMBRE COMPLETO */}
            <div className="clases-manager-input-group">
              <label>NOMBRE COMPLETO</label>
              <input 
                type="text" 
                placeholder="Nombre del socio"
                value={socio.name} 
                onChange={e => setSocio({...socio, name: e.target.value})} 
                required 
              />
            </div>
            
            {/* GÉNERO */}
            <div className="clases-manager-input-group">
              <label>GÉNERO</label>
              <select 
                value={socio.genero} 
                onChange={e => setSocio({...socio, genero: e.target.value})}
              >
                <option value="MUJER">Mujer</option>
                <option value="HOMBRE">Hombre</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          <div className="clases-manager-ejercicios-section" style={{ marginTop: '20px' }}>
            <h3 className="clases-manager-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Mail size={16} /> Información de Contacto
            </h3>
            
            {/* CORREO ELECTRÓNICO - Asegurando clase input-group */}
            <div className="clases-manager-input-group">
              <label>CORREO ELECTRÓNICO</label>
              <input 
                type="email" 
                placeholder="stella@gmail.com"
                value={socio.email} 
                onChange={e => setSocio({...socio, email: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="clases-manager-footer" style={{ marginTop: '30px' }}>
            <button 
              type="submit" 
              className="clases-manager-btn-save" 
              disabled={guardando}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {guardando ? (
                <><Loader2 size={18} className="spinner-icon" /> Guardando...</>
              ) : (
                <><Save size={18} /> Guardar Cambios</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SocioForm;