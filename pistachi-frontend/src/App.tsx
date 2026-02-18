import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar/Navbar';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Productos from './views/producto/Producto'; 
import DetalleProducto from './views/detalleproducto/DetalleProducto';
import Carrito from './views/carrito/Carrito';
import { CartProvider } from './context/carrito/Carrito';
import Registro from './views/registro/Registro';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} /> 
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;