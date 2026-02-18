import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar/Navbar';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Productos from './views/producto/Producto'; 
import DetalleProducto from './views/detalleproducto/DetalleProducto';
import Carrito from './views/carrito/Carrito';
import { CartProvider } from './context/carrito/Carrito';
import { AuthProvider } from './context/auth/Auth';
import Registro from './views/registro/Registro';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import Footer from './components/footer/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            
            <div style={{ flex: 1 }}> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} /> 
              </Routes>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;