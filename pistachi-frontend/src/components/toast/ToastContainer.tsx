import React, { useEffect, useState } from 'react';
import './Toast.css';
import { Toast } from '../../context/toast/ToastContext';
import { CheckCircle, Info, XCircle, X } from '@phosphor-icons/react';

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="toast-global-container">
            {toasts.map((toast) => (
                <ToastElement key={toast.id} toast={toast} removeToast={removeToast} />
            ))}
        </div>
    );
};

interface ToastElementProps {
    toast: Toast;
    removeToast: (id: number) => void;
}

const ToastElement: React.FC<ToastElementProps> = ({ toast, removeToast }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Comienza la animación de salida cómica a los 3.5 segundos
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 3500);

        // Desmonta el componente después de que termine la animación
        const removeTimer = setTimeout(() => {
            removeToast(toast.id);
        }, 4100); // 600ms de animación

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [toast.id, removeToast]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), 600);
    };

    return (
        <div className={`toast-item toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle size={24} weight="fill" />}
                {toast.type === 'error' && <XCircle size={24} weight="fill" />}
                {toast.type === 'info' && <Info size={24} weight="fill" />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button type="button" className="toast-close" onClick={handleClose}>
                <X size={16} weight="bold" />
            </button>
        </div>
    );
};