import { useEffect, useState } from 'react'
import CustomSelect from '../../components/customselect/CustomSelect'
// import { useNavigate } from 'react-router-dom'
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
                        <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><path d="M224,120v88a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V120a8,8,0,0,1,16,0v88H208V120a8,8,0,0,1,16,0ZM88,160a8,8,0,0,0,8-8V112a8,8,0,0,0-16,0v40A8,8,0,0,0,88,160Zm40,0a8,8,0,0,0,8-8V112a8,8,0,0,0-16,0v40A8,8,0,0,0,128,160Zm40,0a8,8,0,0,0,8-8V112a8,8,0,0,0-16,0v40A8,8,0,0,0,168,160ZM232,80H24A8,8,0,0,1,24,64H232a8,8,0,0,1,0,16Z"></path></svg>
                        Productos
                    </button>
                    <button onClick={() => setSeccionActiva('pedidos')} className={seccionActiva === 'pedidos' ? 'nav-item active' : 'nav-item'}>
                        <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><path d="M200,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H56V48H200V208ZM168,88a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,88Zm0,40a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,128Zm0,40a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path></svg>
                        Pedidos
                    </button>
                    <button onClick={() => setSeccionActiva('usuarios')} className={seccionActiva === 'usuarios' ? 'nav-item active' : 'nav-item'}>
                        <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,202.76a8,8,0,1,0,13.94,8.48,80,80,0,0,1,133.06,0,8,8,0,1,0,13.94-8.48A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.71a8,8,0,0,1-11.07,2.45,80,80,0,0,0-97.14-12.15,8,8,0,0,1-9.17-13.13,95.78,95.78,0,0,1,114.93,11.76A8,8,0,0,1,250.14,206.71ZM172,152a44,44,0,1,1,44-44A44.05,44.05,0,0,1,172,152Zm0-72a28,28,0,1,0,28,28A28,28,0,0,0,172,80Z"></path></svg>
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
                            <svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
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
                                                <svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
                                            </button>
                                            <button onClick={() => handleEliminarProducto(p.id)} className="icon-btn delete">
                                                <svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
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
                                <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
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
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </button>
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, precio: Math.max(0, parseFloat((formData.precio - 0.10).toFixed(2)))})}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
                                            { value: 'Café', label: 'Café' }
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
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </button>
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, unidades: Math.max(1, formData.unidades - 1)})}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </button>
                                            <button type="button" className="spinner-btn" onClick={() => setFormData({...formData, stock: Math.max(0, formData.stock - 1)})}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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