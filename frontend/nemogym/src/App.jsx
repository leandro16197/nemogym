import { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ClasesForm from './pages/ClasesForm';
import ClasesList from './pages/ClasesList';
import AvisosList from './pages/AvisosList';
import SociosList from './pages/SociosList';
import SocioForm from './pages/SocioForm'; // Importar el componente de edición de socios
import CustomToast from './components/CustomToast';
import './App.css';

// Componente para proteger rutas de Gestión (Admin o Coach)
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="loading-screen">Verificando permisos...</div>;

  // Verificamos si es ADMIN o COACH (ajusta las strings según tu Backend)
  const hasPermission = 
    user?.role === 'ADMIN' || 
    user?.role === 'COACH' || 
    user?.roles?.includes('ADMIN') || 
    user?.roles?.includes('COACH');

  if (!hasPermission) return <Navigate to="/dashboard" replace />;
  
  return children;
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="dashboard-layout">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      <div className="main-container">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        <main className="content-area">
          <Outlet context={[isSidebarOpen]} />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.appCustom = {
      smallBox: (type, msg, callback, duration = 4000) => {
        setToast({ type, msg, duration });
        setTimeout(() => {
          setToast(null);
          if (callback) callback();
        }, duration);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <CustomToast toast={toast} onClose={() => setToast(null)} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clases" element={<AdminRoute><ClasesList /></AdminRoute>} />
            <Route path="/clases/nueva" element={<AdminRoute><ClasesForm /></AdminRoute>} />
            <Route path="/clases/editar/:id" element={<AdminRoute><ClasesForm /></AdminRoute>} />
            <Route path="/avisos" element={<AdminRoute><AvisosList /></AdminRoute>} />
            <Route path="/socios" element={<AdminRoute><SociosList /></AdminRoute>} />
            <Route path="/admin/users/edit/:id" element={<AdminRoute><SocioForm /></AdminRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;