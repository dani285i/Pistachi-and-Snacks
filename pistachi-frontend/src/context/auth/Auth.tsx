import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

interface Usuario {
    id: number;
    username: string;
    nombre: string;
    apellidos?: string;
    email: string;
    tachis?: number;
    tipoSuscripcion?: string;
    proximaEntrega?: string;
    productosFavoritos?: unknown[];
}

interface AuthContextType {
    usuario: Usuario | null;
    login: (userData: Usuario) => void;
    logout: () => void;
    updateUsuario: (nuevosDatos: Partial<Usuario>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// este componente es el que se encarga de recordar quien eres en toda la pagina, guarda tu sesion en el navegador para que no tengas que loguearte cada dos por tres y ademas va preguntando al backend cada 10 segundos cuantos tachis tienes, como por ejemplo si te gastas puntos en un pedido se te actualizan al momento en la cabecera
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const saved = sessionStorage.getItem('user_session');
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
                sessionStorage.setItem('user_session', JSON.stringify(data));
            } else if (res.status === 404) {
                setUsuario(null);
                sessionStorage.removeItem('user_session');
                window.location.href = '/login';
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
        sessionStorage.setItem('user_session', JSON.stringify(userData));
    };

    const updateUsuario = (nuevosDatos: Partial<Usuario>) => {
        setUsuario((prev) => {
            if (!prev) return prev;
            const actualizado = { ...prev, ...nuevosDatos };
            sessionStorage.setItem('user_session', JSON.stringify(actualizado));
            return actualizado;
        });
    };

    const logout = () => {
        setUsuario(null);
        sessionStorage.removeItem('user_session');
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