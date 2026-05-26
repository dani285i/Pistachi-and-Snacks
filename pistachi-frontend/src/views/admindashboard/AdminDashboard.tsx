import { useEffect, useState } from 'react'
import CustomSelect from '../../components/customselect/CustomSelect'
import { Package, Receipt, Users, Plus, Pencil, Trash, X, CaretUp, CaretDown } from '@phosphor-icons/react'
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
    const [pedidos, setPedidos] = useState<any[]>([])
    const [usuarios, setUsuarios] = useState<any[]>([])
    const [mostrarModal, setMostrarModal] = useState(false)
    const [formData, setFormData] = useState<Producto>(estadoInicial)

    useEffect(() => {
        // vigilo los cambios en el menu lateral para pedirle al servidor solo los datos que el usuario quiere ver en ese momento
        if (seccionActiva === 'productos') cargarProductos()
        if (seccionActiva === 'pedidos') cargarPedidos()
        if (seccionActiva === 'usuarios') cargarUsuarios()
    }, [seccionActiva])

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

    const handleEliminarProducto = async (id: number | undefined) => {
        // lanzo una alerta de confirmacion antes de mandar la peticion de borrado para evitar desastres si hago un clic accidental
        if (!id) return
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto de la base de datos?")) {
            try {
                const response = await fetch(`http://localhost:9090/productos/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                })
                if (response.ok) cargarProductos()
            } catch (error) {
                console.error("error al eliminar", error)
            }
        }
    }

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
                alert("Producto guardado correctamente");
            } else {
                alert("Error al guardar el producto. El servidor devolvió código: " + response.status);
            }
        } catch (error) {
            console.error("error al guardar", error)
            alert("Fallo de conexión al guardar el producto");
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
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            <p>Sección en construcción. Hay {pedidos.length} pedidos registrados.</p>
                        </div>
                    )}
                    {seccionActiva === 'usuarios' && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                            <p>Sección en construcción. Hay {usuarios.length} usuarios registrados.</p>
                        </div>
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
        </div>
    )
}