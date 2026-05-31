import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar/Navbar';
import Breadcrumbs from './components/breadcrumbs/Breadcrumbs';
const Home = React.lazy(() => import('./views/home/Home'));
const Login = React.lazy(() => import('./views/login/Login'));
const Productos = React.lazy(() => import('./views/producto/Producto'));
const DetalleProducto = React.lazy(() => import('./views/detalleproducto/DetalleProducto'));
const Carrito = React.lazy(() => import('./views/carrito/Carrito'));
const Checkout = React.lazy(() => import('./views/checkout/Checkout'));
const Exito = React.lazy(() => import('./views/checkout/Exito'));
import { CartProvider } from './context/carrito/Carrito';
import { AuthProvider } from './context/auth/Auth';
import { FavoritosProvider } from './context/favoritos/Favoritos';
const Favoritos = React.lazy(() => import('./views/favoritos/Favoritos'));
const Registro = React.lazy(() => import('./views/registro/Registro'));
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import Footer from './components/footer/Footer';
const AdminDashboard = React.lazy(() => import('./views/admindashboard/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
import { ToastProvider } from './context/toast/ToastContext';
const DetallePedido = React.lazy(() => import('./views/detallepedido/DetallePedido'));


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <FavoritosProvider>
            <BrowserRouter>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navbar />
                  <Breadcrumbs />
                  
                  <main style={{ flex: 1 }}>
                    <Suspense fallback={<div className="loading-spinner">Cargando...</div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/registro" element={<Registro />} />
                      <Route path="/productos" element={<Productos />} />
                      <Route path="/producto/:id" element={<DetalleProducto />} />
                      <Route path="/favoritos" element={<Favoritos />} />
                      <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} /> 
                      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} /> 
                      <Route path="/exito" element={<ProtectedRoute><Exito /></ProtectedRoute>} /> 
                      <Route path="/pedido/:id" element={<ProtectedRoute><DetallePedido /></ProtectedRoute>} /> 
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    </Routes>
                    </Suspense>
                  </main>

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