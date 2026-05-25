
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastMessage {
    id: number;
    text: string;
}

interface ToastContextData {
    addToast: (message: string) => void;
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string) => {
        const id = Date.now(); // Generamos un ID único basado en el tiempo
        
        setToasts(prevToasts => [...prevToasts, { id, text: message }]);

        // Programamos su desaparición automática tras 3 segundos
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);