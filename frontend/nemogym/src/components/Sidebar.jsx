import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BarChart3, Settings as SettingsIcon, Megaphone } from 'lucide-react'; // Importamos Megaphone
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Obtenemos el usuario para validar el rol
  
  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

  const menuItems = [
    { icon: <Home size={20} />, label: 'Inicio', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Socios', path: '/socios' },
    { icon: <Calendar size={20} />, label: 'Clases', path: '/clases' },
    
    ...(isAdmin ? [
      { icon: <Megaphone size={20} />, label: 'Avisos', path: '/avisos' }
    ] : []),
    
    { icon: <BarChart3 size={20} />, label: 'Reportes', path: '/reportes' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <Link to="/settings" className="sidebar-link" onClick={closeSidebar}>
              <SettingsIcon size={20} />
              <span>Ajustes</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;