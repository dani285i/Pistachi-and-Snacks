import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../.././context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Usamos tus variables globales

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    // Añade el resto de campos según tu modelo
}

export const AdminDashboard = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const { usuario } = useContext(AuthContext) as any;
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir si no hay usuario o si tuvieras lógica de roles
        if (!usuario) {
            navigate('/login');
            return;
        }
        cargarProductos();
    }, [usuario, navigate]);

    const cargarProductos = async () => {
        try {
            const response = await fetch('http://localhost:80/productos');
            if (response.ok) {
                const data = await response.json();
                setProductos(data);
            }
        } catch (error) {
            console.error("Error al cargar el inventario:", error);
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                // Aquí deberías pasar el token JWT si tu ruta backend está protegida
                const response = await fetch(`http://localhost:80/productos/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    cargarProductos(); // Recarga la tabla
                } else {
                    alert("Error al eliminar. Revisa tus permisos.");
                }
            } catch (error) {
                console.error("Error en la petición de borrado:", error);
            }
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '100vh', padding: '40px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>Gestión de Inventario</h1>
                <button 
                    style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    Añadir Nuevo Producto
                </button>
            </header>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--bg-app)' }}>
                            <th style={{ padding: '16px' }}>ID</th>
                            <th style={{ padding: '16px' }}>Nombre</th>
                            <th style={{ padding: '16px' }}>Precio</th>
                            <th style={{ padding: '16px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '16px' }}>{p.id}</td>
                                <td style={{ padding: '16px' }}>{p.nombre}</td>
                                <td style={{ padding: '16px' }}>{p.precio.toFixed(2)}€</td>
                                <td style={{ padding: '16px' }}>
                                    <button style={{ marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}>Editar</button>
                                    <button 
                                        style={{ backgroundColor: 'var(--rojo-eliminar)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        onClick={() => handleEliminar(p.id)}
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};