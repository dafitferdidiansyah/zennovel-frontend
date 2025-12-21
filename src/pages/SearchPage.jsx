import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import { ArrowLeft, Search as SearchIcon, BookOpen } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

  const doSearch = (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearchParams({ q });
    api.getNovels({ q })
       .then(res => setNovels(res.data.results || []))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (query) doSearch(query);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(inputValue);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans pb-20">
      <div className="sticky top-0 bg-white dark:bg-[#232323] shadow-md z-50 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
              <Link to="/" className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-zen-500 hover:text-white transition">
                  <ArrowLeft size={20} />
              </Link>
              <form onSubmit={handleSubmit} className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search novels..." 
                    className="w-full h-full pl-4 pr-12 rounded-full bg-gray-100 dark:bg-[#1a1a1a] border border-transparent focus:border-zen-500 focus:outline-none transition"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-zen-500">
                      <SearchIcon size={20} />
                  </button>
              </form>
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
          {loading ? (
              <div className="text-center py-20 animate-pulse text-gray-500">Searching...</div>
          ) : novels.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {novels.map(novel => (
                      <Link to={`/novel/${novel.id}`} key={novel.id} className="group">
                          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 shadow-md relative">
                              <img src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'} className="w-full h-full object-cover group-hover:scale-110 transition duration-300"/>
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                                  {novel.rating} ★
                              </div>
                          </div>
                          <h3 className="font-bold text-sm line-clamp-2 group-hover:text-zen-500 transition">{novel.title}</h3>
                      </Link>
                  ))}
              </div>
          ) : (
              <div className="text-center py-20 opacity-50">
                  <BookOpen size={48} className="mx-auto mb-4"/>
                  <p>No results found for "{query}"</p>
              </div>
          )}
      </div>
    </div>
  );
}