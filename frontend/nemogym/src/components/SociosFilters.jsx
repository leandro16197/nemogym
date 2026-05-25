export const SociosFilters = ({ search, setSearch, genero, setGenero, rolId, setRolId, roles, setPage }) => (
  <div className="table-controls">
    <div className="search-box">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
      />
      {search && <X size={16} className="clear-icon" onClick={() => setSearch('')} />}
    </div>
    <div className="filters-right-group" style={{ display: 'flex', gap: '10px' }}>
      <select value={genero} onChange={(e) => { setGenero(e.target.value); setPage(0); }}>
        <option value="">Géneros</option>
        <option value="HOMBRE">Hombre</option>
        <option value="MUJER">Mujer</option>
      </select>
      <select value={rolId} onChange={(e) => { setRolId(e.target.value); setPage(0); }}>
        <option value="">Todos los roles</option>
        {roles.map(rol => <option key={rol.id} value={rol.id.toString()}>{rol.nombre || rol.name}</option>)}
      </select>
    </div>
  </div>
);