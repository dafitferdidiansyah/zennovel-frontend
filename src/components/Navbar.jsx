import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Menu, X, Sun, Moon, User, LogOut, ChevronDown, Filter } from "lucide-react";
import { api } from "../api";

const Navbar = ({ theme, toggleTheme }) => {
  // --- State Utama ---
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // --- State Filter ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ genres: [], tags: [], status: '' });
  
  // --- State Data Dinamis ---
  const [genreList, setGenreList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  // Cek apakah user sedang di halaman search agar search bar navbar disembunyikan (opsional, sesuai kode Anda)
  const isSearchPage = location.pathname === '/search';

  // --- Fetch Data ---
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    // Get Genres
    api.getGenres()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setGenreList(data);
      })
      .catch(err => console.error("Error genres:", err));

    // Get Tags (Fallback Statis jika API belum ada)
    if (api.getTags) {
        api.getTags().then(res => {
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setTagList(data);
        }).catch(() => setTagList(['Magic', 'System', 'Overpowered', 'Cultivation', 'Isekai', 'Romance']));
    } else {
        setTagList(['Magic', 'System', 'Overpowered', 'Cultivation', 'Isekai', 'Romance']);
    }
  }, []);

  // --- Handlers ---

  const handleSearch = (e) => {
    e.preventDefault();
    applySearchFilter();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const applySearchFilter = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery);
    if (filters.genres.length > 0) params.append('genre', filters.genres.join(','));
    if (filters.tags.length > 0) params.append('tag', filters.tags.join(','));
    if (filters.status) params.append('status', filters.status);

    setIsOpen(false);
    setIsFilterOpen(false);
    setSearchQuery("");
    navigate(`/search?${params.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO */}
            <Link to="/" className="text-2xl font-bold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors">
              ZenNovel
            </Link>

            {/* --- DESKTOP MENU --- */}
            <div className="hidden md:flex items-center space-x-8">
              
              {/* Search Bar Desktop */}
              {!isSearchPage && (
                <div className="relative group">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1.5 w-60 focus-within:ring-2 focus-within:ring-red-500 ease-in-out shadow-sm">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent text-gray-800 dark:text-gray-200 text-sm focus:outline-none w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                        
                        {/* Tombol Clear (X) Desktop */}
                        {searchQuery && (
                            <button onClick={clearSearch} className="mr-2 text-gray-400 hover:text-red-500 transition-colors">
                                <X size={14} />
                            </button>
                        )}
                        

                        <button onClick={handleSearch} className="ml-1 text-gray-400 hover:text-red-500 p-1">
                            <Search size={16} />
                        </button>

                        {/* Divider */}
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        {/* Tombol Filter Desktop */}
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className={`text-gray-400 hover:text-red-500 transition-colors p-1 ${filters.genres.length > 0 || filters.tags.length > 0 ? 'text-red-500' : ''}`}
                            title="Advanced Filter"
                        >
                            <Filter size={16} />
                        </button>
                    </div>
                </div>
              )}

              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Home</Link>
              <Link to="/library" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">Library</Link>
              <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">History</Link>
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Dropdown */}
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-red-600 transition-colors focus:outline-none"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                      <User size={20} />
                    </div>
                    <ChevronDown size={14} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-2">
                        <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                            <User size={16} className="text-gray-400" />
                            <span className="font-medium truncate">{user?.name || user?.username || "User"}</span>
                        </div>
                        <button 
                            onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 mt-1"
                        >
                            <LogOut size={16} /> <span>Logout</span>
                        </button>
                        </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-transform transform hover:scale-105 shadow-md hover:shadow-red-500/30">
                  Login
                </Link>
              )}
            </div>

            {/* --- MOBILE BUTTONS --- */}
            <div className="md:hidden flex items-center gap-3">
              <button onClick={toggleTheme} className="text-gray-600 dark:text-yellow-400 p-2">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 p-2">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* --- MOBILE MENU DROPDOWN (Burger Content) --- */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 pt-4 pb-6 space-y-4 shadow-lg animate-fade-in">
            
            {/* SEARCH BAR MOBILE (Updated: Filter & Clear buttons INSIDE) */}
            {!isSearchPage && (
                <form onSubmit={handleSearch} className="relative">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2.5 w-full focus-within:ring-2 focus-within:ring-red-500 transition-all">
                        <input
                            type="text"
                            placeholder="Search novels..."
                            className="bg-transparent text-gray-800 dark:text-gray-200 text-sm focus:outline-none w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        
                        {/* Tombol Clear (X) Mobile */}
                        {searchQuery && (
                            <button type="button" onClick={clearSearch} className="mr-2 text-gray-400 hover:text-red-500 transition-colors">
                                <X size={16} />
                            </button>
                        )}


                        <button type="submit" className="ml-2 text-gray-500 hover:text-red-500 transition-colors">
                            <Search size={18} />
                        </button>
                        {/* Divider */}
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                        {/* Tombol Filter Trigger Mobile */}
                        <button 
                            type="button"
                            onClick={() => { setIsOpen(false); setIsFilterOpen(true); }}
                            className={`text-gray-500 hover:text-red-500 p-1 transition-colors ${filters.genres.length > 0 ? 'text-red-500' : ''}`}
                        >
                            <Filter size={18} />
                        </button>

                    </div>
                </form>
            )}
            
            <div className="space-y-1">
                <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium py-2 border-b dark:border-gray-700/50 hover:text-red-500">Home</Link>
                <Link to="/library" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium py-2 border-b dark:border-gray-700/50 hover:text-red-500">Library</Link>
                <Link to="/history" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-200 font-medium py-2 border-b dark:border-gray-700/50 hover:text-red-500">History</Link>
            </div>
            
            {isLoggedIn ? (
              <div className="pt-2">
                <button 
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex items-center justify-between w-full text-gray-700 dark:text-gray-200 hover:text-red-500 py-2 font-medium"
                >
                  <span className="flex items-center gap-2"><User size={18} /> My Account</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-300 ${isUserOpen ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-2">
                        Hi, {user?.name || user?.username || "User"}
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                       <LogOut size={16} /> LOGOUT
                    </button>
                </div>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95">
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* ================================================= */}
      {/* ADVANCED FILTER DRAWER (DINAMIS & GLOBAL)         */}
      {/* ================================================= */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsFilterOpen(false)}
        />

        {/* Drawer Panel */}
        <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#1e1e1e] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header Drawer */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-[#1e1e1e] z-10">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
               <Filter size={20} className="text-red-600"/> Filters
            </h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Isi Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
            
            {/* 1. Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Status</label>
              <div className="grid grid-cols-3 gap-2">
                 {['', 'Ongoing', 'Completed'].map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setFilters({...filters, status: stat})}
                      className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                        filters.status === stat 
                        ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-400'
                      }`}
                    >
                      {stat || 'All'}
                    </button>
                 ))}
              </div>
            </div>

            {/* 2. Genres Filter (Dinamis) */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genreList.length > 0 ? genreList.map((g) => {
                  const genreName = typeof g === 'object' ? g.name : g; // Handle jika object/string
                  return (
                    <button
                        key={genreName}
                        onClick={() => toggleFilter('genres', genreName)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                        filters.genres.includes(genreName)
                            ? 'bg-red-600 border-red-600 text-white shadow-md'
                            : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-400'
                        }`}
                    >
                        {genreName}
                    </button>
                  )
                }) : (
                  <p className="text-xs text-gray-500 italic">Loading genres...</p>
                )}
              </div>
            </div>

            {/* 3. Tags Filter (Dinamis) */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tagList.length > 0 ? tagList.map((t) => {
                   const tagName = typeof t === 'object' ? t.name : t;
                   return (
                    <button
                        key={tagName}
                        onClick={() => toggleFilter('tags', tagName)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        filters.tags.includes(tagName)
                            ? 'bg-red-600 border-red-600 text-white shadow-md'
                            : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-400'
                        }`}
                    >
                        #{tagName}
                    </button>
                   )
                }) : (
                    <p className="text-xs text-gray-500 italic">No tags available.</p>
                )}
              </div>
            </div>

          </div>

          {/* Footer Drawer (Tombol Aksi) */}
          <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] flex gap-3">
             <button 
               onClick={() => setFilters({ genres: [], tags: [], status: '' })}
               className="flex-1 py-3 text-xs font-bold text-gray-500 hover:text-red-500 transition border border-gray-200 dark:border-gray-700 rounded-xl"
             >
               RESET
             </button>
             <button 
               onClick={applySearchFilter}
               className="flex-[2] py-3 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-red-700 transition transform active:scale-95"
             >
               APPLY FILTERS
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;