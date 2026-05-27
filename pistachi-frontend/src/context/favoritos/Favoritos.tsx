import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/Auth';

export interface ProductoFav {
    id: number;
    nombre?: string;
    descripcion?: string;
    precio?: number;
    imagen?: string;
    categoria?: string;
}

interface FavoritosContextType {
    favoritos: ProductoFav[];
    toggleFavorito: (producto: ProductoFav) => void;
    removerFavorito: (id: number) => void;
}

const FavoritosContext = createContext<FavoritosContextType | null>(null);

export const FavoritosProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuario } = useAuth();

    const getStorageKey = (userId: number | undefined) => {
        return userId ? `pistachi_favoritos_${userId}` : 'pistachi_favoritos_guest';
    };

    const [favoritos, setFavoritos] = useState<ProductoFav[]>([]);

    // Al iniciar o cambiar de usuario, cargamos los favoritos específicos de ese usuario
    useEffect(() => {
        const key = getStorageKey(usuario?.id);
        const guardados = localStorage.getItem(key);
        if (guardados) {
            setFavoritos(JSON.parse(guardados));
        } else {
            setFavoritos([]);
        }
    }, [usuario?.id]);

    // Cada vez que cambian los favoritos, los guardamos en el perfil del usuario actual
    useEffect(() => {
        const key = getStorageKey(usuario?.id);
        localStorage.setItem(key, JSON.stringify(favoritos));
    }, [favoritos, usuario?.id]);

    // Función que da o quita el like dependiendo de si ya existe
    const toggleFavorito = (producto: ProductoFav) => {
        setFavoritos(prev => {
            const existe = prev.find(p => p.id === producto.id);
            if (existe) {
                return prev.filter(p => p.id !== producto.id);
            } else {
                return [...prev, producto];
            }
        });
    };

    // Función específica para borrar (útil para el modal de la vista de Favoritos)
    const removerFavorito = (id: number) => {
        setFavoritos(prev => prev.filter(p => p.id !== id));
    };

    return (
        <FavoritosContext.Provider value={{ favoritos, toggleFavorito, removerFavorito }}>
            {children}
        </FavoritosContext.Provider>
    );
};

export const useFavoritos = () => {
    const context = useContext(FavoritosContext);
    if (!context) throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
    return context;
};