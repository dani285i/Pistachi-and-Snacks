import React from 'react';
import './Toast.css';

interface ToastMessageProps {
    message: { id: number; text: string };
    removeToast: (id: number) => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, removeToast }) => {
    return (
        <div className="toast-item">
            <div className="toast-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BC34A" strokeWidth="2.5" className="check-icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <p>{message.text}</p>
            </div>
            
            {/* Boton X para cerrar manualmente */}
            <button className="btn-close-toast" onClick={() => removeToast(message.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* La barra regresiva ultra fina */}
            <div className="toast-progress-bar">
                <div className="progress-fill"></div>
            </div>
        </div>
    );
};

export default ToastMessage;