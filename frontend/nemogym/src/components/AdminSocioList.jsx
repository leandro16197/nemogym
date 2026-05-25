import React, { useState, useMemo, useEffect } from 'react';
import { Mail, Plus, Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminSocioList = ({ socios, onGestionar }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsToShow, setItemsToShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsToShow]);

    const allFiltered = useMemo(() => {
        return socios.filter(socio => 
            socio.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [socios, searchTerm]);

    const totalPages = Math.ceil(allFiltered.length / itemsToShow);
    const startIndex = (currentPage - 1) * itemsToShow;
    
    const paginatedSocios = useMemo(() => {
        return allFiltered.slice(startIndex, startIndex + itemsToShow);
    }, [allFiltered, startIndex, itemsToShow]);

    return (
        <div className="list-card admin-socios-dark">
            <div className="table-controls">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text"
                        placeholder="Buscar socio por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="show-count">
                    <Users size={16} />
                    <span>Mostrar:</span>
                    <select 
                        value={itemsToShow} 
                        onChange={(e) => setItemsToShow(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={socios.length || 100}>Todos</option>
                    </select>
                </div>
            </div>

            <div className="table-container-scroll">
                <table className="routine-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>SOCIO</th>
                            <th style={{ textAlign: 'center' }}>EMAIL</th>
                            <th style={{ textAlign: 'center' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSocios.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-results" style={{ textAlign: 'center' }}>
                                    {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : "No hay socios aptos."}
                                </td>
                            </tr>
                        ) : (
                            paginatedSocios.map((socio) => (
                                <tr key={socio.id}>
                                    <td style={{ textAlign: 'center' }}><div className="socio-name">{socio.name}</div></td>
                                    <td style={{ textAlign: 'center' }}><div className="socio-email" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}><Mail size={14} /> {socio.email}</div></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button className="btn-assign" onClick={() => onGestionar(socio)}>
                                                <Plus size={16} /> Gestionar Rutinas
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="table-footer">
                <div className="info">
                    Mostrando {paginatedSocios.length} de {allFiltered.length} socios
                </div>
                
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="page-btn"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        <span className="page-indicator">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="page-btn"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSocioList;