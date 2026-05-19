import React from 'react';
import { Megaphone, Calendar, Loader2 } from 'lucide-react';

const AnnouncementsSidebar = ({ avisos, loading }) => {
    return (
        <aside className="announcements-sidebar">
            <div className="list-card admin-socios-dark" style={{ padding: '20px' }}>
                <div className="section-header-list" style={{ border: 'none', marginBottom: '15px', padding: 0 }}>
                    <div className="title-group">
                        <Megaphone size={18} style={{ color: '#f59e0b' }} />
                        <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Avisos</h3>
                    </div>
                </div>

                <div className="avisos-feed" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loading ? (
                        <Loader2 className="spinning" size={20} />
                    ) : avisos.length > 0 ? (
                        avisos.slice(0, 4).map((a) => (
                            <div key={a.id} style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={10} />
                                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Hoy'}
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.4' }}>{a.mensaje}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>Sin avisos nuevos.</p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default AnnouncementsSidebar;