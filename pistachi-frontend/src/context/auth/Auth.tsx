import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

interface Usuario {
    id: number;
    username: string;
    nombre: string;
    email: string;
    tachis?: number;
    tipoSuscripcion?: string;
    proximaEntrega?: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    login: (userData: Usuario) => void;
    logout: () => void;
    updateUsuario: (nuevosDatos: Partial<Usuario>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const saved = localStorage.getItem('user_session');
        return saved ? JSON.parse(saved) : null;
    });

    const refrescarUsuario = async () => {
        if (!usuario) return;
        try {
            const res = await fetch(`http://localhost:9090/auth/usuarios/${usuario.id}`, {
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setUsuario(data);
                localStorage.setItem('user_session', JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error al refrescar usuario", error);
        }
    };

    useEffect(() => {
        if (usuario) {
             
            refrescarUsuario();
            const interval = setInterval(refrescarUsuario, 10000); // Poll cada 10s
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario?.id]);

    const login = (userData: Usuario) => {
        setUsuario(userData);
        localStorage.setItem('user_session', JSON.stringify(userData));
    };

    const updateUsuario = (nuevosDatos: Partial<Usuario>) => {
        setUsuario((prev) => {
            if (!prev) return prev;
            const actualizado = { ...prev, ...nuevosDatos };
            localStorage.setItem('user_session', JSON.stringify(actualizado));
            return actualizado;
        });
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, updateUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};