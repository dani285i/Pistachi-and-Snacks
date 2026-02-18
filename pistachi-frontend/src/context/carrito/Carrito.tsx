import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
}

interface CarritoType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, cantidad: number) => void;
    getTotal: () => number;
}

export const Carrito = createContext<CarritoType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(Carrito);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + item.cantidad } : i);
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number, cantidad: number) => {
        if (cantidad < 1) return;
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
    };

    const getTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    };

    return (
        <Carrito.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotal }}>
            {children}
        </Carrito.Provider>
    );
};