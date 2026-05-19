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
import SocioForm from './pages/SocioForm';
import Register from './pages/Register';
import Membresias from './pages/Membresias';
import RolesManager from './pages/RolesManager';
import ClasesPersonalizadas from './pages/PersonalizadasList'; 
import CustomToast from './components/CustomToast';
import './App.css';



const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="loading-screen">Verificando permisos...</div>;
    const isStaff = user?.role === 'ADMIN' || user?.role === 'COACH' || 
                    user?.roles?.includes('ADMIN') || user?.roles?.includes('COACH');

    return isStaff ? children : <Navigate to="/dashboard" replace />;
};

const OnlyAdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="loading-screen">Verificando nivel de acceso...</div>;

    const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

    return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const PersonalizadasRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="loading-screen">Verificando suscripción...</div>;

    const isStaff = user?.role === 'ADMIN' || user?.role === 'COACH' || 
                    user?.roles?.includes('ADMIN') || user?.roles?.includes('COACH');
    
    const hasFullPlan = user?.nombrePlan?.toUpperCase().includes('FULL') || 
                        user?.plan?.toUpperCase().includes('FULL');

    return (isStaff || hasFullPlan) ? children : <Navigate to="/dashboard" replace />;
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
                    <Route path="/register" element={<Register />} /> 
                    
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/membresias" element={<Membresias />} />
                        <Route path="/clases" element={<AdminRoute><ClasesList /></AdminRoute>} />
                        <Route path="/clases/nueva" element={<AdminRoute><ClasesForm /></AdminRoute>} />
                        <Route path="/clases/editar/:id" element={<AdminRoute><ClasesForm /></AdminRoute>} />
                        <Route path="/avisos" element={<AdminRoute><AvisosList /></AdminRoute>} />
                        <Route path="/socios" element={<AdminRoute><SociosList /></AdminRoute>} />
                        <Route path="/admin/users/edit/:id" element={<AdminRoute><SocioForm /></AdminRoute>} />
                        <Route path="/clases-personalizadas" element={<PersonalizadasRoute><ClasesPersonalizadas /></PersonalizadasRoute>} />
                        <Route path="/roles" element={<OnlyAdminRoute><RolesManager /></OnlyAdminRoute>} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;