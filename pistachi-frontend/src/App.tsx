import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar/Navbar';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Productos from './views/producto/Producto'; 
import DetalleProducto from './views/detalleproducto/DetalleProducto';
import Carrito from './views/carrito/Carrito';
import { CartProvider } from './context/carrito/Carrito';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          {/* Añadimos la ruta del carrito */}
          <Route path="/carrito" element={<Carrito />} /> 
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;