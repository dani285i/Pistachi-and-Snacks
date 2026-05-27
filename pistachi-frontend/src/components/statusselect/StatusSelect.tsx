import { useState, useRef, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { getStatusClass } from '../statuspill/StatusPill';
import './StatusSelect.css';

interface StatusSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const ESTADOS = ['Cancelado', 'En Proceso', 'En Tránsito', 'Entregado'];

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Cierra el menú si se hace clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="status-select-container" ref={selectRef}>
            <div 
                className={`status-pill ${getStatusClass(value)} status-select-trigger`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value}</span>
                <CaretDown size={14} weight="bold" className={`status-arrow-icon ${isOpen ? 'open' : ''}`} />
            </div>

            {isOpen && (
                <ul className="status-select-options">
                    {ESTADOS.map((estado) => (
                        <li 
                            key={estado}
                            className={`status-select-option ${estado === value ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(estado);
                                setIsOpen(false);
                            }}
                        >
                            <span className={`status-pill ${getStatusClass(estado)} option-pill`}>
                                {estado}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
