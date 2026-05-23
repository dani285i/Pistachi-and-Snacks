import { createContext, useState, useContext, type ReactNode } from 'react';

interface Usuario {
    username: string;
    nombre: string;
    email: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    login: (userData: Usuario) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const saved = localStorage.getItem('user_session');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData: Usuario) => {
        setUsuario(userData);
        localStorage.setItem('user_session', JSON.stringify(userData));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};