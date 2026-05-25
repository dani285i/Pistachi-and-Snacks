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
import { FavoritosProvider } from './context/favoritos/Favoritos';
import Favoritos from './views/favoritos/Favoritos';
import Registro from './views/registro/Registro';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import Footer from './components/footer/Footer';
import { AdminDashboard } from './views/admindashboard/AdminDashboard';
import { ToastProvider } from './context/toast/Toast';
import ToastContainer from './components/toast/ToastContainer';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <FavoritosProvider>
            <BrowserRouter>
              <ToastContainer />
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navbar />
                  
                  <div style={{ flex: 1 }}> 
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/registro" element={<Registro />} />
                      <Route path="/productos" element={<Productos />} />
                      <Route path="/producto/:id" element={<DetalleProducto />} />
                      <Route path="/favoritos" element={<Favoritos />} />
                      <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} /> 
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    </Routes>
                  </div>

                  <Footer />
                </div>
            </BrowserRouter>
          </FavoritosProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;