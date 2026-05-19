import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ChevronDown, Settings, Menu } from 'lucide-react';

function Navbar({ toggleSidebar }) { 
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* BOTÓN HAMBURGUESA: Visible solo en móviles */}
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>

        <div className="nav-brand">Nemo<span>Gym</span></div>
      </div>

      <div className="nav-right">
        <div className="profile-container" ref={dropdownRef}>
          <div 
            className={`profile-trigger ${isOpen ? 'active' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="avatar-circle">
              {user?.nombre?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-text">
              <span className="profile-name">{user?.nombre || 'Usuario'}</span>
              <span className="profile-role">{user?.nombrePlan || 'Sin Plan'}</span>
            </div>
            <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
          </div>

          {isOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="header-label">Cuenta conectada</p>
                <p className="header-email">{user?.email}</p>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-body">
                <button className="dropdown-item" onClick={() => setIsOpen(false)}>
                  <Settings size={16} /> <span>Configuración</span>
                </button>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="dropdown-item logout"
                >
                  <LogOut size={16} /> <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;