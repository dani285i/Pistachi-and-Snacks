import React from 'react';
import { CheckCircle, X } from '@phosphor-icons/react';
import './Toast.css';

interface ToastMessageProps {
    message: { id: number; text: string };
    removeToast: (id: number) => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, removeToast }) => {
    return (
        <div className="toast-item">
            <div className="toast-content">
                <CheckCircle size={22} weight="fill" color="var(--color-success)" className="check-icon" />
                <p>{message.text}</p>
            </div>
            
            {/* Boton X para cerrar manualmente */}
            <button className="btn-close-toast" onClick={() => removeToast(message.id)}>
                <X size={16} weight="bold" />
            </button>
            
            {/* La barra regresiva ultra fina */}
            <div className="toast-progress-bar">
                <div className="progress-fill"></div>
            </div>
        </div>
    );
};

export default ToastMessage;