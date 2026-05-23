import axios from 'axios';

// Ajusta el puerto al de tu backend, según tu config era el 80
const API_URL = 'http://localhost:80/productos'; 

// Función auxiliar para obtener el token del localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Petición pública
export const getProductos = () => axios.get(API_URL);

// Peticiones protegidas (Requieren rol ADMIN en tu Spring Security)
export const crearProducto = (producto: any) => axios.post(API_URL, producto, getAuthHeaders());
export const actualizarProducto = (id: number, producto: any) => axios.put(`${API_URL}/${id}`, producto, getAuthHeaders());
export const eliminarProducto = (id: number) => axios.delete(`${API_URL}/${id}`, getAuthHeaders());