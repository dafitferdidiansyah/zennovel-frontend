import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Reader from './pages/Reader';
import Library from './pages/Library'; // <--- Import Library
import Login from './pages/Login';       // <--- Import
import Register from './pages/Register'; // <--- Import
import NotFound from './pages/NotFound';

function App() {
  return (
    // Default class 'dark' agar langsung Dark Mode (sesuai selera reader)
    <div className="dark"> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novel/:id" element={<Detail />} />
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/library" element={<Library />} /> {/* <--- Tambahkan Route Ini */}
          {/* RUTE AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Menangkap semua URL yang tidak terdaftar */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;