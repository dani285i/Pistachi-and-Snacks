import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritosContext = createContext<any>(null);

export const FavoritosProvider = ({ children }: { children: React.ReactNode }) => {
    // Inicializamos leyendo del almacenamiento local por si el usuario ya tenía likes guardados
    const [favoritos, setFavoritos] = useState<any[]>(() => {
        const guardados = localStorage.getItem('pistachi_favoritos');
        return guardados ? JSON.parse(guardados) : [];
    });

    // Cada vez que cambian los favoritos, los guardamos en memoria
    useEffect(() => {
        localStorage.setItem('pistachi_favoritos', JSON.stringify(favoritos));
    }, [favoritos]);

    // Función que da o quita el like dependiendo de si ya existe
    const toggleFavorito = (producto: any) => {
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

export const useFavoritos = () => useContext(FavoritosContext);