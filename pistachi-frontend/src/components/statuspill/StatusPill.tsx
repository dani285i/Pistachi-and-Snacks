import React from 'react';
import './StatusPill.css';

interface StatusPillProps {
    status: string;
}

export const getStatusClass = (st: string) => {
    if (!st) return 'status-default';
    const normalized = st.toUpperCase().trim();
    switch (normalized) {
        case 'CANCELADO':
            return 'status-cancelado';
        case 'EN PROCESO':
        case 'EN_PROCESO':
            return 'status-proceso';
        case 'EN TRÁNSITO':
        case 'EN TRANSITO':
        case 'EN_TRANSITO':
            return 'status-transito';
        case 'ENTREGADO':
            return 'status-entregado';
        default:
            return 'status-default';
    }
};

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {

    // Formatear texto a mostrar
    const getDisplayText = (st: string) => {
        const normalized = st.toUpperCase().trim();
        switch (normalized) {
            case 'EN_PROCESO': return 'En Proceso';
            case 'EN_TRANSITO': return 'En Tránsito';
            default: 
                return st.charAt(0).toUpperCase() + st.slice(1).toLowerCase().replace('_', ' ');
        }
    };

    return (
        <span className={`status-pill ${getStatusClass(status)}`}>
            {getDisplayText(status)}
        </span>
    );
};
