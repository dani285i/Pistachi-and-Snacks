import axios from 'axios';

const API_URL = 'http://localhost:80/productos'; 

// obtener el token del localStorage
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