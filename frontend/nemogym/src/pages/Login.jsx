import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import heroImg from '../assets/hero.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); 
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(result.message);
      }
    } catch (error) {
      setErrorMsg('Error inesperado. Intente más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <img src={heroImg} className="auth-logo" alt="NemoGym" />
          <h1>Nemo<span>Gym</span></h1>
          <p>Potencia tu entrenamiento</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          {errorMsg && <div className="error-banner">{errorMsg}</div>}
          
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                <span>Entrar</span>
                <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer">
          <p>¿Problemas técnicos? <a href="#">Soporte</a></p>
        </footer>
      </div>
    </div>
  );
}

export default Login;