import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // Layout baru
import Home from './pages/Home';
import Detail from './pages/Detail';
import Reader from './pages/Reader';
import Library from './pages/Library';
import SearchPage from './pages/SearchPage';
import TagPage from './pages/TagPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
     
      <BrowserRouter>
        <Routes>
          {/* Halaman dengan Navbar & Footer */}
          <Route element={<MainLayout />}>
             <Route path="/" element={<Home />} />
             <Route path="/library" element={<Library />} />
             <Route path="/search" element={<SearchPage />} />
             <Route path="/tag/:slug" element={<TagPage />} />
             {/* Detail juga pakai layout biar ada footer */}
             <Route path="/novel/:id" element={<Detail />} /> 
          </Route>

          {/* Halaman Standalone (Tanpa Navbar/Footer Standar) */}
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;