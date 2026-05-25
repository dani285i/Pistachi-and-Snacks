import React from 'react';
import { useToast } from '../../context/toast/Toast';
import ToastMessage from './ToastMessage';
import './Toast.css';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} message={toast} removeToast={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;