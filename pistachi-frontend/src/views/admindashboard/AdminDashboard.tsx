import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    destacado: boolean;
}

const estadoInicial: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    categoria: 'Snacks',
    destacado: false
};

export const AdminDashboard = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [formData, setFormData] = useState<Producto>(estadoInicial);
    
    const { usuario } = useContext(AuthContext) as any;
    const navigate = useNavigate();

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        cargarProductos();
    }, [usuario, navigate]);

    const cargarProductos = async () => {
        // recupero la sesion del usuario desde el almacenamiento local para extraer su token de seguridad si lo tiene
        const sesionString = localStorage.getItem('user_session')
        const token = sesionString ? JSON.parse(sesionString).token : ''

        // lanzo la peticion al servidor adjuntando el token en la cabecera para que spring security me reconozca como administrador y me devuelva los datos
        try {
            const response = await fetch('http://localhost:9090/productos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setProductos(data)
            } else {
                console.error("el servidor ha rechazado la conexion revisa los permisos o el cors")
            }
        } catch (error) {
            console.error("error de red al intentar conectar con el backend", error)
        }
    }

    const handleEliminar = async (id: number | undefined) => {
        // compruebo que el id exista antes de hacer nada para no enviar peticiones vacias que rompan el servidor
        if (!id) return
        
        if (window.confirm("¿estás seguro de eliminar este producto?")) {
            // saco el token de la caja fuerte del navegador por si el servidor me pide identificacion al borrar
            const sesionString = localStorage.getItem('user_session')
            const token = sesionString ? JSON.parse(sesionString).token : ''

            try {
                const response = await fetch(`http://localhost:9090/productos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        // le meto mi carnet de administrador en la cabecera para que spring security me deje eliminar el registro
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok) cargarProductos()
            } catch (error) {
                console.error("error al eliminar", error)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        // freno el envio por defecto del formulario para que no me recargue la pagina y pueda gestionar yo el envio
        e.preventDefault()

        // recupero la sesion para extraer la llave de acceso y poder escribir en la base de datos
        const sesionString = localStorage.getItem('user_session')
        const token = sesionString ? JSON.parse(sesionString).token : ''

        const url = formData.id ? `http://localhost:9090/productos/${formData.id}` : 'http://localhost:9090/productos'
        const method = formData.id ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // adjunto mi token de seguridad en la carta para que el servidor confie en los datos nuevos
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setMostrarModal(false)
                cargarProductos()
            } else {
                console.error("el servidor ha rechazado los cambios revisa los permisos o el cors")
            }
        } catch (error) {
            console.error("error en la peticion", error)
        }
    }

    const abrirModalCrear = () => {
        setFormData(estadoInicial);
        setMostrarModal(true);
    };

    const abrirModalEditar = (producto: Producto) => {
        setFormData(producto);
        setMostrarModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const valorFinal = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData({ ...formData, [name]: valorFinal });
    };


    return (
        <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '100vh', padding: '40px', position: 'relative' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>Gestión de Inventario</h1>
                <button 
                    onClick={abrirModalCrear}
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
                                <td style={{ padding: '16px' }}>{p.precio}€</td>
                                <td style={{ padding: '16px' }}>
                                    <button 
                                        onClick={() => abrirModalEditar(p)}
                                        style={{ marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}
                                    >
                                        Editar
                                    </button>
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

            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>
                            {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Nombre</label>
                                <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Descripción</label>
                                <textarea required name="descripcion" value={formData.descripcion} onChange={handleInputChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Precio (€)</label>
                                    <input required type="number" step="0.01" name="precio" value={formData.precio} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Categoría</label>
                                    <select name="categoria" value={formData.categoria} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
                                        <option value="Snacks">Snacks</option>
                                        <option value="Bollería">Bollería</option>
                                        <option value="Bebidas">Bebidas</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>URL de la Imagen</label>
                                <input type="text" name="imagen" value={formData.imagen} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleInputChange} />
                                <label>Producto Destacado (Aparecerá en Novedades)</label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: 'transparent' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};