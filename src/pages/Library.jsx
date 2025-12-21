import { useEffect, useState } from 'react';
import { api, BASE_URL } from '../api'; // Import BASE_URL untuk gambar
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, ArrowLeft, Zap, LogOut, BookOpen, User } from 'lucide-react';


export default function Library() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      api.getBookmarks(token)
        .then(res => setNovels(res.data))
        .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 401) {
                // Token expired/invalid, logout
                handleLogout();
            }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleRemove = async (e, novelId) => {
      e.preventDefault(); // Biar gak kebuka link novelnya
      if (!window.confirm("Remove from library?")) return;

      const token = localStorage.getItem('access_token');
      try {
          // Panggil API Toggle Bookmark (kalau sudah ada, dia akan remove)
          await api.toggleBookmark(novelId, token);
          
          // Update UI: Buang novel yang dihapus dari state tanpa refresh halaman
          setNovels(prev => prev.filter(n => n.id !== novelId));
      } catch (err) {
          alert("Failed to remove novel");
      }
  };
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-20 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-[#232323] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm mb-6">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-zen-500">
                <ArrowLeft />
             </Link>
             <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center gap-2">
               My <span className="text-zen-500">Library</span>
             </h1>
           </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4">
        {!isLoggedIn ? (
          <div className="text-center py-20">
            <div className="bg-gray-200 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Login Required</h3>
            <p className="text-gray-500 mb-8">Please login to view your bookmarks and reading history.</p>
            <Link to="/login" className="bg-zen-500 text-white px-8 py-3 rounded-full font-bold hover:bg-zen-600 transition shadow-lg">
                Login Now
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-gray-400">Loading library...</div>
        ) : novels.length === 0 ? (
          <div className="text-center py-20">
             <div className="bg-gray-200 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Library Empty</h3>
            <p className="text-gray-500 mb-6">You haven't bookmarked any novels yet.</p>
            <Link to="/" className="text-zen-500 font-bold hover:underline">Browse Novels</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {novels.map((novel) => (
              <Link to={`/novel/${novel.id}`} key={novel.id} className="group relative">
                <div className="aspect-[2/3] overflow-hidden rounded shadow-md bg-gray-200 dark:bg-gray-800">
                   <img 
                      src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                   />
                </div>
                <h3 className="mt-2 text-sm font-bold truncate text-gray-800 dark:text-gray-200 group-hover:text-zen-500">
                    {novel.title}
                </h3>
                <span className="text-xs text-gray-500">{novel.chapter_count || 0} Chapters</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}