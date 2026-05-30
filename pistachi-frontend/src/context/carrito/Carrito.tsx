import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
    stock?: number;
    unidades?: number;
}

interface AddToCartResult {
    success: boolean;
    reason?: 'STOCK' | 'LIMIT';
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => AddToCartResult;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, cantidad: number) => AddToCartResult;
    getTotal: () => number;
    clearCart: () => void;
    validarInventario: (productosApi: any[]) => void;
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

    const addToCart = (item: CartItem): AddToCartResult => {
        const existing = cartItems.find(i => i.id === item.id);
        const currentQty = existing ? existing.cantidad : 0;
        
        const unitsPerPack = item.unidades || 1;
        const maxPacksAllowed = Math.floor((item.stock || 0) / unitsPerPack);
        const MAX_CART_LIMIT = 10;
        
        if (currentQty + item.cantidad > maxPacksAllowed) {
            return { success: false, reason: 'STOCK' };
        }
        
        if (currentQty + item.cantidad > MAX_CART_LIMIT) {
            return { success: false, reason: 'LIMIT' };
        }

        setCartItems(prev => {
            const ext = prev.find(i => i.id === item.id);
            if (ext) {
                const newCantidad = Math.min(ext.cantidad + item.cantidad, Math.min(maxPacksAllowed, MAX_CART_LIMIT));
                return prev.map(i => i.id === item.id ? { ...i, cantidad: newCantidad } : i);
            }
            return [...prev, { ...item, cantidad: Math.min(item.cantidad, Math.min(maxPacksAllowed, MAX_CART_LIMIT)) }];
        });
        return { success: true };
    };
    
    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number, cantidad: number): AddToCartResult => {
        if (cantidad < 1) return { success: true };
        const existing = cartItems.find(i => i.id === id);
        
        if (existing) {
            const unitsPerPack = existing.unidades || 1;
            const maxPacksAllowed = Math.floor((existing.stock || 0) / unitsPerPack);
            const MAX_CART_LIMIT = 10;
            
            if (cantidad > maxPacksAllowed) {
                return { success: false, reason: 'STOCK' };
            }
            if (cantidad > MAX_CART_LIMIT) {
                return { success: false, reason: 'LIMIT' };
            }
            
            setCartItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: Math.min(cantidad, Math.min(maxPacksAllowed, MAX_CART_LIMIT)) } : i));
        }
        return { success: true };
    };

    const validarInventario = (productosApi: any[]) => {
        setCartItems(prev => {
            const currentItems = [...prev];
            let changed = false;
            const validItems = currentItems.filter(item => {
                const prod = productosApi.find(p => p.id === item.id);
                if (!prod) return true; 
                
                const unitsPerPack = prod.unidades || 1;
                const maxPacksAllowed = Math.floor((prod.stock || 0) / unitsPerPack);
                
                if (maxPacksAllowed <= 0) {
                    window.dispatchEvent(new CustomEvent('cartItemEvicted', { detail: item.nombre }));
                    changed = true;
                    return false;
                }
                return true;
            });
            return changed ? validItems : prev;
        });
    };

    const getTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotal, clearCart, validarInventario }}>
            {children}
        </CartContext.Provider>
    );
};