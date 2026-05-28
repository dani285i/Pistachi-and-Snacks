import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, cantidad: number) => void;
    getTotal: () => number;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};

// y este componente de aqui es el que maneja tu carrito de la compra mientras vas navegando, guarda todo lo que le vas metiendo para que no se pierda al cambiar de pagina, como por ejemplo cuando añades un donut y luego te vas a ver los snacks
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                const newCantidad = Math.min(existing.cantidad + item.cantidad, 10);
                return prev.map(i => i.id === item.id ? { ...i, cantidad: newCantidad } : i);
            }
            return [...prev, { ...item, cantidad: Math.min(item.cantidad, 10) }];
        });
    };
    
    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number, cantidad: number) => {
        if (cantidad < 1) return;
        if (cantidad > 10) return;
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
    };

    const getTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotal, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};