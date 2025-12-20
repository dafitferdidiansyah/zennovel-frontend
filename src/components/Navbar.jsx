import { Link, useLocation } from 'react-router-dom';
import { Zap, Search, User, LogOut, Library } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  // Cek login status dari localStorage (sederhana)
  const isLoggedIn = !!localStorage.getItem('access_token');

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 dark:bg-[#151515]/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
            <Zap className="text-zen-500 fill-current group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Zen<span className="text-zen-500">Novel</span>
            </h1>
        </Link>

        {/* MENU KANAN */}
        <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <Link to="/search" className="p-2 text-gray-600 dark:text-gray-300 hover:text-zen-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                <Search size={22} />
            </Link>

            {/* Library (Kalau Login) */}
            {isLoggedIn && (
                <Link to="/library" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-zen-500 transition">
                    <Library size={20}/> Library
                </Link>
            )}

            {/* Tombol Login/Logout */}
            {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition">
                    <LogOut size={16}/> <span className="hidden sm:inline">LOGOUT</span>
                </button>
            ) : (
                <Link to="/login" className="flex items-center gap-2 px-5 py-2 bg-zen-500 text-white rounded-full text-xs font-bold hover:bg-zen-600 shadow-lg shadow-zen-500/30 transition transform hover:-translate-y-0.5">
                    <User size={16}/> LOGIN
                </Link>
            )}
        </div>
      </div>
    </nav>
  );
}