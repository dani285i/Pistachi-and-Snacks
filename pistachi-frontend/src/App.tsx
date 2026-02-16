import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Navbar from './components/navbar/Navbar';
import Home from './views/home/Home';
import Login from './views/login/Login';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;