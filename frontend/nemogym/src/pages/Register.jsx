import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, Loader2, KeyRound } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', genero: 'MUJER', password: '', confirmPassword: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return window.appCustom?.smallBox('nok', 'Las contraseñas no coinciden');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, genero: formData.genero, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) window.appCustom?.smallBox('ok', 'Cuenta creada. ¡Bienvenido!', () => navigate('/login'));
      else window.appCustom?.smallBox('nok', data.message || 'Error al registrarse');
    } catch (err) { window.appCustom?.smallBox('nok', 'Error de conexión'); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <UserCheck size={40} className="auth-logo-icon" />
          <h1>Nemo<span>Gym</span></h1>
          <p>Crea tu cuenta de socio</p>
        </header>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input type="text" name="name" placeholder="Nombre completo" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <select name="genero" className="auth-select" value={formData.genero} onChange={handleChange}>
              <option value="MUJER">Mujer</option>
              <option value="HOMBRE">Hombre</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type="password" name="password" placeholder="Contraseña (min. 6)" onChange={handleChange} required minLength={6} />
          </div>
          <div className="input-group">
            <KeyRound className="input-icon" size={20} />
            <input type="password" name="confirmPassword" placeholder="Repetir contraseña" onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : "Crear cuenta"}
          </button>
        </form>
        <footer className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </footer>
      </div>
    </div>
  );
}
export default Register;