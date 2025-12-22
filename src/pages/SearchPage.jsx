import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import { ArrowLeft, Search as SearchIcon, BookOpen, X, Filter, Tag as TagIcon, Layers } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Data Dinamis
  const [genreList, setGenreList] = useState([]);
  const tagList = ['Magic', 'Reincarnation', 'System', 'OP MC', 'Cultivation', 'Martial Arts', 'Isekai', 'Kingdom'];

  const [filters, setFilters] = useState({ 
    genres: searchParams.get('genre') ? searchParams.get('genre').split(',') : [],
    tags: searchParams.get('tag') ? searchParams.get('tag').split(',') : [],
    status: searchParams.get('status') || '' 
  });

  useEffect(() => {
    api.getGenres()
      .then(res => {
         const data = Array.isArray(res.data) ? res.data : res.data.results || [];
         setGenreList(data);
      })
      .catch(err => console.error("Gagal ambil genre", err));
  }, []);

  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const doSearch = (q, currentFilters = filters) => {
    setLoading(true);
    
    const params = { q };
    if (currentFilters.genres.length > 0) params.genre = currentFilters.genres.join(',');
    if (currentFilters.tags.length > 0) params.tag = currentFilters.tags.join(',');
    if (currentFilters.status) params.status = currentFilters.status;
    
    setSearchParams(params);

    api.getNovels(params)
       .then(res => setNovels(res.data.results || []))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (query || filters.genres.length > 0 || filters.tags.length > 0 || filters.status) {
      setInputValue(query);
      doSearch(query);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(inputValue);
  };

  // Fungsi Clear Search
  const handleClearSearch = () => {
    setInputValue(''); // Kosongkan input
    // Opsional: Jika ingin langsung reset pencarian saat di-clear, uncomment baris bawah:
    doSearch(''); 
  };

  return (
    <>
      {/* ================================================= */}
      {/* ADVANCED SEARCH DRAWER                            */}
      {/* ================================================= */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isDrawerOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#1e1e1e] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-[#1e1e1e] z-10">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
               <Filter size={20} className="text-red-600"/> Filter
            </h2>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                    <Layers size={12}/> Status
                </label>
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

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                 <BookOpen size={12}/> Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {genreList.length > 0 ? genreList.map((g) => {
                   const genreName = typeof g === 'object' ? g.name : g;
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
                }) : <span className="text-xs text-gray-500 italic">Loading...</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                 <TagIcon size={12}/> Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleFilter('tags', tag)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      filters.tags.includes(tag)
                        ? 'bg-red-600 border-red-600 text-white shadow-md'
                        : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-400'
                    }`}
                  >
                    # {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] flex gap-3">
              <button
                onClick={() => { setFilters({ genres: [], tags: [], status: '' }); }}
                className="flex-1 py-3 text-xs font-bold text-gray-500 hover:text-red-500 transition border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                RESET
              </button>
              <button
                onClick={() => { setIsDrawerOpen(false); doSearch(inputValue); }}
                className="flex-[2] py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-red-500/30 transition transform active:scale-95"
              >
                APPLY FILTER
              </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* HALAMAN UTAMA                                     */}
      {/* ================================================= */}
      <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans pb-20 transition-colors duration-300">
        
        {/* HEADER SEARCH */}
        <div className="sticky top-0 bg-white dark:bg-[#232323] border-b border-gray-200 dark:border-gray-700 shadow-sm z-30 p-4">
          <div className="max-w-6xl mx-auto flex gap-3 h-10 items-center">
            <Link to="/" className="p-2 -ml-2 text-gray-500 hover:text-red-600 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            
            <form onSubmit={handleSubmit} className="flex-1 relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search novels..."
                // UBAH: pr-12 jadi pr-20 agar cukup untuk 2 icon (X dan Search)
                className="w-full h-10 pl-10 pr-20 rounded-full bg-gray-100 dark:bg-[#1a1a1a] border border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-black focus:outline-none transition-all text-sm"
                autoFocus
              />
              
              {/* TOMBOL CLEAR SEARCH (X) - Hanya muncul jika ada input value */}
              {inputValue && (
                <button 
                  type="button" 
                  onClick={handleClearSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              {/* TOMBOL SUBMIT SEARCH */}
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <SearchIcon size={18} />
              </button>
            </form>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`p-2.5 rounded-full transition-all relative ${
                filters.genres.length > 0 || filters.tags.length > 0 || filters.status 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <Filter size={20} />
              {(filters.genres.length > 0 || filters.tags.length > 0 || filters.status) && (
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Searching...</p>
            </div>
          ) : novels.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in">
              {novels.map(novel => (
                <Link to={`/novel/${novel.id}`} key={novel.id} className="group">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-md relative bg-gray-200 dark:bg-gray-800">
                    <img
                      src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      alt={novel.title}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                      {novel.rating} ★
                    </div>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-2 group-hover:text-red-600 transition-colors leading-snug text-gray-800 dark:text-gray-200">
                      {novel.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter truncate">{novel.author}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 opacity-40">
              <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}