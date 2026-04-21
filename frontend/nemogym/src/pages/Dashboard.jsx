import { useEffect, useState, useContext } from 'react';
import { Dumbbell, Megaphone, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const [clases, setClases] = useState([]);
  const [avisos, setAvisos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingAvisos, setLoadingAvisos] = useState(true);

  const { getToken, logout, user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const baseUrl = import.meta.env.VITE_API_URL;
    const token = getToken();
    if (!token) return;

    fetch(`${baseUrl}/clases`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 403) {
          logout();
          throw new Error("403");
        }
        return res.json();
      })
      .then(json => {
        const filtradas = (json.data || []).filter(
          c => c.genero?.toUpperCase() === user.genero?.toUpperCase()
        );

        setClases(filtradas.sort((a, b) => a.dia - b.dia));
      })
      .catch(err => console.error("Error clases:", err))
      .finally(() => setLoading(false));
    fetch(`${baseUrl}/avisos`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
        setAvisos(json.data || json || []);
      })
      .catch(err => console.error("Error avisos:", err))
      .finally(() => setLoadingAvisos(false));

  }, [user, getToken, logout]);
  if (loading) {
    return (
      <div className="loading-full-container">
        <Loader2 className="spinner-icon" size={48} />
        <p>Cargando planificación...</p>
      </div>
    );
  }

  const maxEjercicios = clases.length > 0
    ? Math.max(...clases.map(c => c.ejercicios?.length || 0))
    : 0;

  const renderTable = (rutinas) => (
    <div className="routine-container">
      <div className="table-wrapper">
        <table className="routine-table">
          <thead>
            <tr>
              {rutinas.map((r, index) => (
                <th key={index} style={{ color: r.color }}>
                  DÍA {r.dia || index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(maxEjercicios)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {rutinas.map((clase, colIndex) => {
                  const ej = clase.ejercicios?.[rowIndex];
                  return (
                    <td key={colIndex}>
                      {ej ? (
                        <div className="cell-content">
                          <span className="ej-name">{ej.nombre}</span>
                          <span className="ej-reps">{ej.repeticiones} reps</span>
                        </div>
                      ) : (
                        <span className="empty-cell">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="content-area">
      <div className="dashboard-grid">


        <section className="main-content">
          <div className="section-header">
            <Dumbbell size={24} className="primary-color" />
            <h2>Planificación Semanal ({user?.genero || 'Usuario'})</h2>
          </div>

          {clases.length > 0 ? (
            renderTable(clases)
          ) : (
            <div className="no-data">
              No hay rutinas cargadas para el género: {user?.genero}
            </div>
          )}
        </section>

        <aside className="announcements-sidebar">
          <div className="section-header">
            <Megaphone size={20} className="accent-color" />
            <h2>Avisos del Coach</h2>
          </div>

          {loadingAvisos ? (
            <div style={{ padding: '10px' }}>
              <Loader2 className="spinner-icon" size={20} />
            </div>
          ) : avisos.length > 0 ? (
            avisos.slice(0, 3).map((a) => (
              <div key={a.id} className="announcement-card">
                <div className="announcement-date">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : 'HOY'}
                </div>

                <p className="announcement-text">
                  {a.mensaje}
                </p>
              </div>
            ))
          ) : (
            <div className="announcement-card" style={{ opacity: 0.6 }}>
              <p className="announcement-text">
                No hay avisos por el momento.
              </p>
            </div>
          )}

        </aside>

      </div>
    </div>
  );
}

export default Dashboard;