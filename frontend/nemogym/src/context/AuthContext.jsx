import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nemogym_token');
    const savedUser = localStorage.getItem('nemogym_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const verifyPlan = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        
   
        const updatedUserData = {
          id: data.id,
          email: data.email,
          nombre: data.name,
          role: data.roles[0], 
          genero: data.genero,
          hasActivePlan: data.hasActivePlan,
          nombrePlan: data.nombrePlan,
        };


        localStorage.setItem('nemogym_user', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
        return updatedUserData.hasActivePlan;
      }
    } catch (error) {
      console.error("Error actualizando estado del usuario:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); 

      if (!response.ok || !data.success) {
        return { 
          success: false, 
          message: data.message || 'Credenciales inválidas' 
        };
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        nombre: data.user.name,
        role: data.user.roles[0], 
        genero: data.user.genero,
        hasActivePlan: data.user.hasActivePlan || false,
        nombrePlan: data.user.nombrePlan
      };

      localStorage.setItem('nemogym_token', data.token);
      localStorage.setItem('nemogym_user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };

    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('nemogym_token');
    localStorage.removeItem('nemogym_user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('nemogym_token');

  return (

    <AuthContext.Provider value={{ user, login, logout, loading, getToken, verifyPlan }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};