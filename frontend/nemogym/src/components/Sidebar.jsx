import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings as SettingsIcon, 
  Megaphone, 
  CreditCard, 
  ShieldCheck,
  Star
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const { user } = useContext(AuthContext); 

  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');
  const isCoach = user?.role === 'COACH' || user?.roles?.includes('COACH');
  
  const hasFullPlan = user?.nombrePlan && user?.nombrePlan.toUpperCase() === 'FULL';

  const menuItems = [
    { icon: <Home size={20} />, label: 'Inicio', path: '/dashboard' },
    
    ...(isAdmin ? [
      { icon: <Users size={20} />, label: 'Socios', path: '/socios' }
    ] : []),
    
    { icon: <Calendar size={20} />, label: 'Clases', path: '/clases' },
    
    ...(!isAdmin && !isCoach && hasFullPlan ? [
      { 
        icon: <Star size={20} className="text-yellow-400" />, 
        label: 'Mis Personalizadas', 
        path: `/clases-personalizadas/${user?.id}` 
      }
    ] : []),

    ...(isAdmin || isCoach ? [
      { 
        icon: <Star size={20} className="text-yellow-400" />, 
        label: 'Personalizadas', 
        path: `/clases-personalizadas` 
      }
    ] : []),
    ...(isAdmin ? [
      { icon: <CreditCard size={20} />, label: 'Membresía', path: '/membresias' }
    ] : []),
    ...(isAdmin ? [
      { icon: <ShieldCheck size={20} />, label: 'Roles', path: '/roles' }
    ] : []),
    ...(isAdmin || isCoach ? [
      { icon: <Megaphone size={20} />, label: 'Avisos', path: '/avisos' }
    ] : []),

    ...(isAdmin ? [
      { icon: <BarChart3 size={20} />, label: 'Reportes', path: '/reportes' }
    ] : []),
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
            {isAdmin && (
              <Link 
                to="/settings" 
                className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`} 
                onClick={closeSidebar}
              >
                <SettingsIcon size={20} />
                <span>Ajustes</span>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;