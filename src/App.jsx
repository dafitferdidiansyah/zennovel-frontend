// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Reader from "./pages/Reader";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import TagPage from "./pages/TagPage";
import { useEffect, useState } from "react";

function App() {
  // State untuk tema global
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fungsi toggle yang akan dipass ke Navbar
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Pass props theme dan toggleTheme ke MainLayout */}
        <Route path="/" element={<MainLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Home />} />
          <Route path="novel/:id" element={<Detail />} />
          <Route path="library" element={<Library />} />
          <Route path="search" element={<SearchPage />} />
          {/* PERUBAHAN DISINI: Pisahkan Route Tag dan Genre */}
          <Route path="tag/:tagName" element={<TagPage />} />
          <Route path="genre/:genreName" element={<TagPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/read/:novelId/:chapterId" element={<Reader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;