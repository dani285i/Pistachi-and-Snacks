import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import Login from './views/login/Login';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;