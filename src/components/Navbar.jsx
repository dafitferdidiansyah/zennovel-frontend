import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Tambah useEffect
import { Search, Menu, X, Sun, Moon, User, LogOut, BookOpen, ChevronDown } from "lucide-react";
const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false); // Menu Utama
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false); // Tambahan: Menu User Dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State login
  const navigate = useNavigate();

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload(); // Reload agar state di seluruh app bersih
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors">
            ZenNovel
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search novels..."
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-48 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1.5 text-gray-400 hover:text-red-500">
                <Search size={16} />
              </button>
            </form>
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Home</Link>
            <Link to="/library" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Library</Link>
            <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">History</Link>
            

            {/* Tombol Ganti Tema */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

{/* LOGIKA TOMBOL LOGIN / USER - GAYA DROPDOWN */}
            {isLoggedIn ? (
              <div className="relative">
                
                {/* 1. TOMBOL PEMICU (Trigger) */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-red-600 transition-colors focus:outline-none"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                    <User size={20} />
                  </div>
                  {/* Ikon Panah ke Bawah (Caret) */}
                  <ChevronDown size={14} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 2. MENU DROPDOWN */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-2">
                    
                    {/* Item 1: Link Profile & Nama */}
                    <Link 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)} // Tutup menu saat diklik
                    >
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium">{/* Coba ambil 'name', kalau kosong ambil 'username', kalau kosong tulis 'User' */}
                            {user?.name || user?.username || "User"}</span>
                    </Link>

                    {/* Divider (Garis Pembatas) */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                    {/* Item 2: Logout */}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                    
                  </div>
                )}
                
                {/* Overlay transparan (Opsional: untuk menutup menu jika klik di luar) */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-70" 
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                )}

              </div>
            ) : (
              <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-transform transform hover:scale-105 shadow-md hover:shadow-red-500/30">
                Login/Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="text-gray-600 dark:text-yellow-400">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
    {/* Mobile Menu Dropdown */}
{isOpen && (
  <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 pt-2 pb-4 space-y-3 shadow-lg">
    <form onSubmit={handleSearch} className="relative mt-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
    
    <Link to="/" className="block text-gray-600 dark:text-gray-300 hover:text-red-500 py-2">Home</Link>
                {/* Library Link */}
            <Link to="/library" onClick={() => setIsOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-red-500 py-2"> Library</Link>
            <Link to="/history" onClick={() => setIsOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-red-500 py-2"> History</Link>
    {/* LOGIKA LOGIN / DROPDOWN USER */}
    {isLoggedIn ? (
      <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
        {/* Tombol Trigger Dropdown */}
        <button 
          onClick={() => setIsUserOpen(!isUserOpen)}
          className="flex items-center justify-between w-full text-gray-600 dark:text-gray-300 hover:text-red-500 py-2 font-medium"
        >
          <span className="flex items-center gap-2">
            <User size={18} /> My Account
          </span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Isi Dropdown (Library & Logout) */}
        <div className={`pl-6 space-y-3 overflow-hidden transition-all duration-300 ${isUserOpen ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors w-full text-left"
            >
               <LogOut size={16} /> LOGOUT
            </button>
        </div>
      </div>
    ) : (
      <Link to="/login" className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors mt-4">
        Login
      </Link>
    )}
  </div>
)}
    </nav>
  );
};

export default Navbar;