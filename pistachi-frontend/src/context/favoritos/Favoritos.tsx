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



    const [favoritos, setFavoritos] = useState<ProductoFav[]>([]);

    // Al iniciar o cambiar de usuario, cargamos los favoritos desde la base de datos (que vienen en el objeto usuario)
    useEffect(() => {
        if (usuario && usuario.productosFavoritos) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFavoritos(usuario.productosFavoritos as ProductoFav[]);
        } else if (!usuario) {
            // Si es invitado, mantenemos la lógica de localStorage
            const guardados = localStorage.getItem('pistachi_favoritos_guest');
            if (guardados) {
                setFavoritos(JSON.parse(guardados));
            } else {
                setFavoritos([]);
            }
        }
    }, [usuario, usuario?.productosFavoritos]);

    // Cada vez que cambian los favoritos de un INVITADO, los guardamos en su localstorage
    useEffect(() => {
        if (!usuario) {
            localStorage.setItem('pistachi_favoritos_guest', JSON.stringify(favoritos));
        }
    }, [favoritos, usuario]);

    // Función que da o quita el like dependiendo de si ya existe
    const toggleFavorito = async (producto: ProductoFav) => {
        const existe = favoritos.find(p => p.id === producto.id);
        
        // Actualización optimista del estado local
        if (existe) {
            setFavoritos(prev => prev.filter(p => p.id !== producto.id));
        } else {
            setFavoritos(prev => [...prev, producto]);
        }

        // Si hay usuario logueado, hacemos la petición a la BD
        if (usuario?.id) {
            try {
                const url = `http://localhost:9090/auth/usuarios/${usuario.id}/favoritos/${producto.id}`;
                await fetch(url, {
                    method: existe ? 'DELETE' : 'POST'
                });
            } catch (err) {
                console.error("Error actualizando favorito en base de datos:", err);
            }
        }
    };

    // Función específica para borrar (útil para el modal de la vista de Favoritos)
    const removerFavorito = async (id: number) => {
        setFavoritos(prev => prev.filter(p => p.id !== id));
        if (usuario?.id) {
            try {
                await fetch(`http://localhost:9090/auth/usuarios/${usuario.id}/favoritos/${id}`, {
                    method: 'DELETE'
                });
            } catch (err) {
                console.error("Error eliminando favorito en base de datos:", err);
            }
        }
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