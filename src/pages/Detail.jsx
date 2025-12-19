import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { BookOpen, Star, ArrowLeft, Bookmark, Zap, LogOut, User } from 'lucide-react';

const BACKEND_URL = "https://dafit29.pythonanywhere.com";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    window.scrollTo(0, 0);
    api.getDetail(id)
       .then(res => setNovel(res.data))
       .catch(err => console.error(err));
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };
  
  // Fungsi Add Bookmark
  const handleBookmark = async () => {
    const token = localStorage.getItem('access_token');
    if(!token) return navigate('/login');
    
    try {
        await api.toggleBookmark(novel.id, token);
        alert("Success! Check your Library.");
    } catch (err) {
        console.error(err);
        alert("Failed to bookmark.");
    }
  };

  if (!novel) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen pb-10 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-transparent absolute top-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
           <Link to="/" className="p-2 bg-black/40 rounded-full text-white hover:bg-zen-500 transition backdrop-blur-sm">
                <ArrowLeft size={20} />
           </Link>
           
           <div className="flex items-center gap-4">
              {isLoggedIn ? (
                 <button onClick={handleLogout} className="px-4 py-1.5 bg-black/40 text-white rounded-full text-xs font-bold hover:bg-red-600 transition backdrop-blur-sm flex items-center gap-1">
                    <LogOut size={14} /> LOGOUT
                 </button>
              ) : (
                 <Link to="/login" className="px-4 py-1.5 bg-zen-500 text-white rounded-full text-xs font-bold hover:bg-zen-600 transition shadow-lg flex items-center gap-1">
                    <User size={14} /> LOGIN
                 </Link>
              )}
           </div>
        </div>
      </nav>

      {/* HEADER GAMBAR BESAR */}
      <div className="relative h-72 w-full overflow-hidden">
        <img 
          src={novel.cover ? `${BACKEND_URL}${novel.cover}` : 'https://placehold.co/400x600'} 
          className="w-full h-full object-cover opacity-60 blur-sm transform scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F4F4] dark:from-[#151515] via-[#151515]/60 to-transparent" />
      </div>

      {/* INFO NOVEL */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover Depan */}
            <div className="w-44 mx-auto md:mx-0 flex-shrink-0 rounded-lg shadow-2xl overflow-hidden border-4 border-white dark:border-[#232323] bg-gray-200 relative group">
                 <img 
                    src={novel.cover ? `${BACKEND_URL}${novel.cover}` : 'https://placehold.co/400x600'} 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Teks Info */}
            <div className="flex-1 text-center md:text-left pt-2 md:pt-12">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight drop-shadow-md">{novel.title}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-300 mb-6">
                     <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">{novel.genre}</span>
                     <span className="flex items-center gap-1"><BookOpen size={16}/> {novel.status}</span>
                     <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current"/> {novel.rating || 'N/A'}</span>
                </div>

                <div className="flex justify-center md:justify-start gap-3">
                    {novel.chapters?.length > 0 ? (
                        <Link 
                            to={`/read/${novel.chapters[0].id}`} 
                            className="bg-zen-500 text-white font-bold py-2.5 px-8 rounded-full hover:bg-zen-600 transition shadow-lg shadow-zen-500/30"
                        >
                            READ NOW
                        </Link>
                    ) : (
                        <button disabled className="bg-gray-500 text-white py-2.5 px-8 rounded-full cursor-not-allowed opacity-70">No Chapter</button>
                    )}
                    <button 
                        onClick={handleBookmark}
                        className="bg-white dark:bg-[#232323] text-gray-800 dark:text-white py-2.5 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                        <Bookmark size={18} /> Library
                    </button>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className="mt-10">
             <div className="flex border-b border-gray-300 dark:border-gray-700 mb-0">
                <button 
                onClick={() => setActiveTab('desc')}
                className={`px-6 py-3 font-bold text-sm uppercase transition-all relative ${activeTab === 'desc' ? 'text-zen-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                Description
                {activeTab === 'desc' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zen-500"></span>}
                </button>
                <button 
                onClick={() => setActiveTab('chap')}
                className={`px-6 py-3 font-bold text-sm uppercase transition-all relative ${activeTab === 'chap' ? 'text-zen-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                Chapters ({novel.chapters?.length || 0})
                {activeTab === 'chap' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zen-500"></span>}
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="bg-white dark:bg-[#232323] p-6 rounded-b-lg shadow-sm border border-t-0 border-gray-200 dark:border-gray-700 min-h-[300px]">
                
                {activeTab === 'desc' && (
                <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p className="whitespace-pre-line">{novel.synopsis || "No synopsis available."}</p>
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Author</span>
                            <span className="text-zen-500 font-semibold">{novel.author}</span>
                        </div>
                        <div>
                           <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Uploaded</span>
                           <span className="text-gray-700 dark:text-gray-300">{new Date(novel.uploaded_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                )}

                {activeTab === 'chap' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                    {novel.chapters?.map((chap) => (
                        <Link 
                            key={chap.id} 
                            to={`/read/${chap.id}`}
                            className="border-b border-dashed border-gray-200 dark:border-gray-700 py-3 hover:text-zen-500 truncate text-sm text-gray-600 dark:text-gray-300 block flex items-center justify-between group"
                        >
                            <span>{chap.title}</span>
                            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition">READ</span>
                        </Link>
                    ))}
                    {(!novel.chapters || novel.chapters.length === 0) && (
                        <p className="text-gray-500 italic py-10 text-center">No chapters uploaded yet.</p>
                    )}
                </div>
                )}

            </div>
        </div>

      </div>
    </div>
  );
}