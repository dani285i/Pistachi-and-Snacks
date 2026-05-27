import { useEffect, useState, useRef } from 'react'
import CustomSelect from '../../components/customselect/CustomSelect'
import { CustomDatePicker } from '../../components/datepicker/CustomDatePicker'
import { Package, Receipt, Users, Plus, Pencil, Trash, X, CaretUp, CaretDown, WarningCircle } from '@phosphor-icons/react'
import { useToast } from '../../context/toast/ToastContext'
import './AdminDashboard.css'

interface Producto {
    id?: number
    nombre: string
    descripcion: string
    precio: number
    imagen: string
    categoria: string
    destacado: boolean
    unidades: number
    stock: number
}

interface Pedido {
    id: number;
    fecha: string;
    total: number;
    estado: string;
}

interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    rol: string;
    username: string;
    tachis: number;
    fechaNacimiento: string;
    proximaEntrega?: string;
    tipoSuscripcion?: string;
}

const estadoInicial: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    categoria: 'Snacks',
    destacado: false,
    unidades: 1,
    stock: 0
}

const getStockStyle = (stock: number) => {
    if (stock === 0) return { background: 'rgba(231, 76, 60, 0.15)', color: '#E74C3C' }; // Rojo
    if (stock <= 5) return { background: 'rgba(255, 152, 0, 0.15)', color: '#E65100' }; // Naranja
    if (stock < 20) return { background: 'rgba(139, 195, 74, 0.15)', color: '#4A6741' }; // Verde
    return { background: 'rgba(33, 150, 243, 0.15)', color: '#1565C0' }; // Azul
};

export const AdminDashboard = () => {
    // defino los estados para controlar la navegacion y la carga de datos del panel, separando la logica para que no se mezcle todo
    const [seccionActiva, setSeccionActiva] = useState('productos')
    const [productos, setProductos] = useState<Producto[]>([])
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [mostrarModal, setMostrarModal] = useState(false)
    const [formData, setFormData] = useState<Producto>(estadoInicial)

    const { addToast } = useToast();
    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [usuarioData, setUsuarioData] = useState<Partial<Usuario>>({});
    
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [mostrarConfirmacionEdicion, setMostrarConfirmacionEdicion] = useState(false);
    const [cuentaRegresiva, setCuentaRegresiva] = useState(5);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const getClaseSuscripcion = (tipo: string | undefined) => {
        if (!tipo || tipo.toLowerCase() === 'ninguna') return 'ninguna';
        if (tipo === 'Degustación') return 'degustacion';
        if (tipo === 'Premium') return 'premium';
        return 'ninguna';
    };

    const getAuthHeaders = () => {
        // preparo las cabeceras con el token de seguridad que tengo guardado para demostrarle al backend que soy el administrador
        const sesionString = localStorage.getItem('user_session')
        const token = sesionString ? JSON.parse(sesionString).token : ''
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    const cargarProductos = async () => {
        try {
            const response = await fetch('http://localhost:9090/productos', {
                method: 'GET',
                headers: getAuthHeaders()
            })
            if (response.ok) {
                const data = await response.json()
                setProductos(data)
            }
        } catch (error) {
            console.error("error al cargar productos", error)
        }
    }

    const cargarPedidos = async () => {
        try {
            const response = await fetch('http://localhost:9090/pedidos', {
                method: 'GET',
                headers: getAuthHeaders()
            })
            if (response.ok) {
                const data = await response.json()
                setPedidos(data)
            }
        } catch (error) {
            console.error("error al cargar pedidos", error)
        }
    }

    const cargarUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:9090/auth/usuarios', {
                method: 'GET',
                headers: getAuthHeaders()
            })
            if (response.ok) {
                const data = await response.json()
                setUsuarios(data)
            }
        } catch (error) {
            console.error("error al cargar usuarios", error)
        }
    }

    useEffect(() => {
        // vigilo los cambios en el menu lateral para pedirle al servidor solo los datos que el usuario quiere ver en ese momento
        if (seccionActiva === 'productos') cargarProductos()
        if (seccionActiva === 'pedidos') cargarPedidos()
        if (seccionActiva === 'usuarios') cargarUsuarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seccionActiva])

    const handleEliminarProducto = async (id: number | undefined) => {
        // lanzo una alerta de confirmacion antes de mandar la peticion de borrado para evitar desastres si hago un clic accidental
        if (!id) return
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto de la base de datos?")) {
            try {
                const response = await fetch(`http://localhost:9090/productos/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                })
                if (response.ok) {
                    cargarProductos()
                    addToast("Producto eliminado correctamente", 'success');
                } else {
                    addToast("Error al eliminar el producto", 'error');
                }
            } catch (error) {
                console.error("error al eliminar", error)
                addToast("Fallo de conexión al eliminar el producto", 'error');
            }
        }
    }

    const handleCambiarEstadoPedido = async (id: number, nuevoEstado: string) => {
        try {
            const response = await fetch(`http://localhost:9090/pedidos/${id}/estado`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ estado: nuevoEstado })
            })
            if (response.ok) {
                cargarPedidos();
            } else {
                addToast("Error al actualizar el estado del pedido", 'error');
            }
        } catch (error) {
            console.error("error al actualizar estado", error)
        }
    }

    const handleEliminarUsuarioInicio = (usuario: Usuario) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            if (window.confirm("¿Seguro que quieres eliminarlo? Esta acción es irreversible.")) {
                if (window.confirm("¿Última oportunidad, de verdad quieres eliminarlo?")) {
                    setUsuarioAEliminar(usuario);
                    setCuentaRegresiva(5);
                    setMostrarModalEliminar(true);
                    
                    timerRef.current = setInterval(() => {
                        setCuentaRegresiva((prev) => {
                            if (prev <= 1) {
                                clearInterval(timerRef.current as number);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            }
        }
    };

    const handleEliminarUsuarioFinal = async () => {
        if (!usuarioAEliminar) return;
        try {
            const response = await fetch(`http://localhost:9090/auth/usuarios/${usuarioAEliminar.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                setMostrarModalEliminar(false);
                cargarUsuarios();
                addToast(`El usuario "${usuarioAEliminar.username || usuarioAEliminar.nombre}" ha sido eliminado.`, 'success');
            }
        } catch (error) {
            console.error("error al eliminar usuario", error);
        }
    };

    const cancelarEliminacion = () => {
        clearInterval(timerRef.current as number);
        setMostrarModalEliminar(false);
        setUsuarioAEliminar(null);
    };

    const handleEditarUsuarioClick = (usuario: Usuario) => {
        setUsuarioData(usuario);
        setMostrarModalUsuario(true);
    };

    const handleSubmitUsuario = (e: React.FormEvent) => {
        e.preventDefault();
        setMostrarConfirmacionEdicion(true);
    };

    const confirmarEdicionUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:9090/auth/usuarios/${usuarioData.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(usuarioData)
            });
            if (response.ok) {
                setMostrarConfirmacionEdicion(false);
                setMostrarModalUsuario(false);
                cargarUsuarios();
                addToast(`Los datos de ${usuarioData.nombre} han sido guardados`, 'success');
            } else {
                addToast("Error al actualizar el usuario", 'error');
            }
        } catch (error) {
            console.error("error al editar usuario", error);
        }
    };

    const handleSubmitProducto = async (e: React.FormEvent) => {
        // intercepto el formulario para enviar los datos con fetch y saber si tengo que actualizar un id existente o crear uno nuevo
        e.preventDefault()
        const url = formData.id ? `http://localhost:9090/productos/${formData.id}` : 'http://localhost:9090/productos'
        const method = formData.id ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                setMostrarModal(false)
                cargarProductos()
                addToast("Producto guardado correctamente", 'success');
            } else {
                addToast("Error al guardar el producto. El servidor devolvió código: " + response.status, 'error');
            }
        } catch (error) {
            console.error("error al guardar producto", error)
            addToast("Fallo de conexión al guardar el producto", 'error');
        }
    }

    return (
        <div className="admin-dashboard-layout">
            
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="brand-circle">P</div>
                    <div className="brand-text">
                        <h3>Panel Admin</h3>
                        <span>Pistachi & Snacks</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button onClick={() => setSeccionActiva('productos')} className={seccionActiva === 'productos' ? 'nav-item active' : 'nav-item'}>
                        <Package size={20} weight={seccionActiva === 'productos' ? 'fill' : 'regular'} />
                        Productos
                    </button>
                    <button onClick={() => setSeccionActiva('pedidos')} className={seccionActiva === 'pedidos' ? 'nav-item active' : 'nav-item'}>
                        <Receipt size={20} weight={seccionActiva === 'pedidos' ? 'fill' : 'regular'} />
                        Pedidos
                    </button>
                    <button onClick={() => setSeccionActiva('usuarios')} className={seccionActiva === 'usuarios' ? 'nav-item active' : 'nav-item'}>
                        <Users size={20} weight={seccionActiva === 'usuarios' ? 'fill' : 'regular'} />
                        Usuarios
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="main-header">
                    <div className="header-info">
                        <h1>{seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1)}</h1>
                        <p>Gestiona los datos de tu plataforma en tiempo real</p>
                    </div>
                    {seccionActiva === 'productos' && (
                        <button onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }} className="add-btn pistachio-accent">
                            <Plus size={18} weight="bold" />
                            Nuevo Producto
                        </button>
                    )}
                </header>

                <div className="content-card">
                    {seccionActiva === 'productos' && (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Stock</th>
                                    <th>Uds/Pack</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td className="p-name">{p.nombre}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '6px', 
                                                background: getStockStyle(p.stock).background,
                                                color: getStockStyle(p.stock).color,
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td>{p.unidades || 1} uds.</td>
                                        <td>{p.precio.toFixed(2)}€</td>
                                        <td className="actions-cell">
                                            <button onClick={() => { 
                                                // Aseguramos que unidades y stock no sean undefined si la DB los devuelve nulos
                                                setFormData({
                                                    ...p,
                                                    unidades: p.unidades ?? 1,
                                                    stock: p.stock ?? 0
                                                }); 
                                                setMostrarModal(true); 
                                            }} className="icon-btn edit">
                                                <Pencil size={18} weight="bold" />
                                            </button>
                                            <button onClick={() => handleEliminarProducto(p.id)} className="icon-btn delete">
                                                <Trash size={18} weight="bold" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {seccionActiva === 'pedidos' && (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado Actual</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td>{new Date(p.fecha).toLocaleDateString()}</td>
                                        <td>{p.total?.toFixed(2)}€</td>
                                        <td>
                                            <select 
                                                value={p.estado} 
                                                onChange={(e) => handleCambiarEstadoPedido(p.id, e.target.value)}
                                                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                            >
                                                <option value="Pagado y En Proceso">En Proceso</option>
                                                <option value="Enviado">Enviado</option>
                                                <option value="Entregado">Entregado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </td>
                                        <td className="actions-cell">
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Auto-guardado</span>
                                        </td>
                                    </tr>
                                ))}
                                {pedidos.length === 0 && (
                                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem', color: '#888'}}>Aún no hay pedidos registrados.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    {seccionActiva === 'usuarios' && (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Email</th>
                                    <th>Tachis</th>
                                    <th>F. Nacimiento</th>
                                    <th>Próx. Entrega</th>
                                    <th>Suscripción</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>#{u.id}</td>
                                        <td><strong>{u.nombre} {u.apellidos}</strong></td>
                                        <td>{u.email}</td>
                                        <td><strong>{Number(u.tachis || 0).toLocaleString('de-DE')}</strong></td>
                                        <td>{u.fechaNacimiento ? new Date(u.fechaNacimiento).toLocaleDateString() : 'N/A'}</td>
                                        <td>{u.proximaEntrega ? new Date(u.proximaEntrega).toLocaleDateString() : '--'}</td>
                                        <td><span className={`badge-suscripcion ${getClaseSuscripcion(u.tipoSuscripcion)}`}>{u.tipoSuscripcion || 'Ninguna'}</span></td>
                                        <td><span className="categoria-badge">{u.rol}</span></td>
                                        <td className="actions-cell">
                                            <button onClick={() => handleEditarUsuarioClick(u)} className="icon-btn edit" title="Editar Usuario">
                                                <Pencil size={18} weight="bold" />
                                            </button>
                                            <button onClick={() => handleEliminarUsuarioInicio(u)} className="icon-btn delete" title="Eliminar Usuario">
                                                <Trash size={18} weight="bold" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {usuarios.length === 0 && (
                                    <tr><td colSpan={8} style={{textAlign: 'center', padding: '2rem', color: '#888'}}>No hay usuarios registrados.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="glass-modal">
                        <div className="modal-header">
                            <h2>{formData.id ? 'Editar Producto' : 'Añadir al Stock'}</h2>
                            <button onClick={() => setMostrarModal(false)} className="close-x">
                                <X size={24} weight="bold" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitProducto} className="admin-form">
                            
                            <div className="form-group">
                                <label>Nombre del Producto</label>
                                <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Croissant de Pistacho" />
                            </div>
                            
                            {/* este contenedor flex row garantiza que precio y categoria se dividan el espacio de forma limpia */}
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Precio (€)</label>
                                    <div className="number-input-wrapper">
                                        <input required type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: parseFloat(e.target.value) || 0})} placeholder="0.00" />
                                        <div className="spinner-controls">
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, precio: parseFloat((formData.precio + 0.10).toFixed(2))})}>
                                                <CaretUp size={16} weight="bold" />
                                            </button>
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, precio: Math.max(0, parseFloat((formData.precio - 0.10).toFixed(2)))})}>
                                                <CaretDown size={16} weight="bold" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group flex-1">
                                    <label>Categoría</label>
                                    <CustomSelect 
                                        options={[
                                            { value: 'Snacks', label: 'Snacks' },
                                            { value: 'Bollería', label: 'Bollería' },
                                            { value: 'Repostería', label: 'Repostería' },
                                            { value: 'Tartas', label: 'Tartas' },
                                            { value: 'Bebidas', label: 'Bebidas' },
                                            { value: 'Café', label: 'Café' },
                                            { value: 'Helados', label: 'Helados' }
                                        ]}
                                        value={formData.categoria}
                                        onChange={(val) => setFormData({...formData, categoria: val})}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Unidades por Pack</label>
                                    <div className="number-input-wrapper">
                                        <input required type="number" min="1" step="1" value={formData.unidades} onChange={e => setFormData({...formData, unidades: parseInt(e.target.value) || 1})} placeholder="Ej: 5" />
                                        <div className="spinner-controls">
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, unidades: formData.unidades + 1})}>
                                                <CaretUp size={16} weight="bold" />
                                            </button>
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, unidades: Math.max(1, formData.unidades - 1)})}>
                                                <CaretDown size={16} weight="bold" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group flex-1">
                                    <label>Stock Disponible</label>
                                    <div className="number-input-wrapper">
                                        <input required type="number" min="0" step="1" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} placeholder="Ej: 10" />
                                        <div className="spinner-controls">
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, stock: formData.stock + 1})}>
                                                <CaretUp size={16} weight="bold" />
                                            </button>
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, stock: Math.max(0, formData.stock - 1)})}>
                                                <CaretDown size={16} weight="bold" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea required value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} placeholder="Cuenta qué hace especial a este producto..." rows={3} />
                            </div>
                            
                            <div className="form-group">
                                <label>Imagen del Producto</label>
                                <input type="text" value={formData.imagen} onChange={e => setFormData({...formData, imagen: e.target.value})} placeholder="Ruta local (/img/foto.jpg) o URL externa" />
                                <div className="help-box">
                                    <span className="help-icon">💡</span>
                                    <p>Guarda tus fotos generadas por IA en la carpeta <strong>public/img</strong> de tu proyecto React y escribe la ruta aquí.</p>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setMostrarModal(false)} className="btn-cancel">Descartar</button>
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {mostrarModalUsuario && (
                <div className="modal-overlay">
                    <div className="glass-modal" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Editar Usuario</h2>
                            <button onClick={() => setMostrarModalUsuario(false)} className="close-x">
                                <X size={24} weight="bold" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitUsuario} className="admin-form">
                            <div className="form-row" style={{ marginBottom: '-8px' }}>
                                <div className="form-group flex-1">
                                    <label>Nombre</label>
                                    <input required type="text" value={usuarioData.nombre || ''} onChange={e => setUsuarioData({...usuarioData, nombre: e.target.value})} />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Apellidos</label>
                                    <input required type="text" value={usuarioData.apellidos || ''} onChange={e => setUsuarioData({...usuarioData, apellidos: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '-8px' }}>
                                <label>Email</label>
                                <input required type="email" value={usuarioData.email || ''} onChange={e => setUsuarioData({...usuarioData, email: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '-8px' }}>
                                <label>Username</label>
                                <input required type="text" value={usuarioData.username || ''} onChange={e => setUsuarioData({...usuarioData, username: e.target.value})} />
                            </div>
                            <div className="form-row" style={{ alignItems: 'flex-end' }}>
                                <div className="form-group flex-1">
                                    <label style={{ marginBottom: '2px' }}>Tachis (Puntos)</label>
                                    <input required type="number" min="0" value={usuarioData.tachis || 0} onChange={e => setUsuarioData({...usuarioData, tachis: parseInt(e.target.value) || 0})} />
                                </div>
                                <div className="form-group flex-1">
                                    <CustomDatePicker 
                                        value={usuarioData.fechaNacimiento || ''}
                                        onChange={(val) => setUsuarioData({...usuarioData, fechaNacimiento: val})}
                                        mode="birthdate"
                                        label="Fecha de Nacimiento"
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ alignItems: 'flex-end' }}>
                                <div className="form-group flex-1">
                                    <label style={{ marginBottom: '2px' }}>Suscripción Actual</label>
                                    <select 
                                        value={usuarioData.tipoSuscripcion || 'Ninguna'} 
                                        onChange={e => setUsuarioData({...usuarioData, tipoSuscripcion: e.target.value})}
                                    >
                                        <option value="Ninguna">Ninguna</option>
                                        <option value="Degustación">Degustación</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <CustomDatePicker 
                                        value={usuarioData.proximaEntrega || ''}
                                        onChange={(val) => setUsuarioData({...usuarioData, proximaEntrega: val})}
                                        mode="future"
                                        label="Próxima Entrega"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Rol (No modificable por seguridad)</label>
                                <input type="text" value={usuarioData.rol || ''} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setMostrarModalUsuario(false)} className="btn-cancel">Descartar</button>
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarConfirmacionEdicion && (
                <div className="modal-overlay" style={{ zIndex: 10001 }}>
                    <div className="glass-modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <WarningCircle size={80} weight="fill" color="#F39C12" style={{ margin: '0 auto 20px auto' }} />
                        <h2 style={{ color: '#F39C12', marginBottom: '15px' }}>Confirmar Edición</h2>
                        <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                            ¿Estás seguro de que quieres aplicar y guardar los cambios para el usuario <strong>{usuarioData.username}</strong>?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="btn-cancel" onClick={() => setMostrarConfirmacionEdicion(false)}>
                                Cancelar
                            </button>
                            <button className="btn-save" style={{ backgroundColor: '#F39C12' }} onClick={confirmarEdicionUsuario}>
                                Sí, guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalEliminar && (
                <div className="modal-overlay">
                    <div className="glass-modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <WarningCircle size={80} weight="fill" color="#E74C3C" style={{ margin: '0 auto 20px auto' }} />
                        <h2 style={{ color: '#E74C3C', marginBottom: '15px' }}>¡CUIDADO!</h2>
                        <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                            Estás a punto de eliminar permanentemente al usuario <strong>{usuarioAEliminar?.username}</strong>.
                            Esta acción destruirá sus datos y no podrá ser deshecha.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button 
                                onClick={handleEliminarUsuarioFinal} 
                                disabled={cuentaRegresiva > 0}
                                style={{
                                    backgroundColor: cuentaRegresiva > 0 ? '#ccc' : '#E74C3C',
                                    color: 'white',
                                    padding: '12px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: cuentaRegresiva > 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cuentaRegresiva > 0 ? `Esperando... (${cuentaRegresiva}s)` : 'Eliminar Definitivamente'}
                            </button>
                            <button 
                                onClick={cancelarEliminacion}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#666',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}