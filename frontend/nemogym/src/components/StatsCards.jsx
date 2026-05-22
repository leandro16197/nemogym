import React from 'react';

export const StatCard = ({ title, value, color }) => (
    <div className="stat-card">
        <h3>{title}</h3>
        <p style={{ color: color || '#f8fafc' }}>{value}</p>
    </div>
);