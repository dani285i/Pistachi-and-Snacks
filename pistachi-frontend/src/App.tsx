import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const Home = () => <h1 className="text-center mt-5">Bienvenido a Pistachi & Snacks</h1>;
const Productos = () => <h1>Catálogo de Pistachos</h1>;
const Login = () => <h1>Iniciar Sesión</h1>;
const Carrito = () => <h1>Tu Carrito</h1>;

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} /> {/* */}
          <Route path="/productos" element={<Productos />} /> {/* */}
          <Route path="/login" element={<Login />} /> {/* */}
          <Route path="/carrito" element={<Carrito />} /> {/* */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;