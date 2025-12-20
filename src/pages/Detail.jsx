import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, BASE_URL } from '../api'; 
import { BookOpen, Star, ArrowLeft, Bookmark, Hash, Eye } from 'lucide-react';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');
  const [userRating, setUserRating] = useState(0);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getDetail(id).then(res => setNovel(res.data)).catch(console.error);
  }, [id]);

  const handleRate = async (score) => {
    if (!token) return navigate('/login');
    try {
        const res = await api.rateNovel(novel.id, score, token);
        setNovel(prev => ({...prev, rating: res.data.new_rating}));
        alert(`Rated ${score} stars!`);
    } catch { alert("Failed to rate."); }
  }

  const handleBookmark = async () => {
    if(!token) return navigate('/login');
    try { await api.toggleBookmark(novel.id, token); alert("Library updated!"); } catch { alert("Failed."); }
  };

  if (!novel) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen pb-10 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans">
      {/* HEADER IMAGE */}
      <div className="relative h-72 w-full overflow-hidden">
        <img src={novel.cover ? `${BASE_URL}${novel.cover}` : ''} className="w-full h-full object-cover opacity-60 blur-sm scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F4F4] dark:from-[#151515] to-transparent" />
        <Link to="/" className="absolute top-4 left-4 p-2 bg-black/30 rounded-full text-white hover:bg-zen-500 transition"><ArrowLeft size={20}/></Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* COVER BUKU */}
            <div className="w-44 flex-shrink-0 rounded-lg shadow-2xl overflow-hidden border-4 border-white dark:border-[#232323]">
                 <img src={novel.cover ? `${BASE_URL}${novel.cover}` : ''} className="w-full h-full object-cover"/>
            </div>
            
            {/* INFO TEXT */}
            <div className="flex-1 pt-2 md:pt-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{novel.title}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-4">
                     <span className="bg-zen-500 text-white px-2 py-0.5 rounded">{novel.genre}</span>
                     <span className="flex items-center gap-1"><Eye size={16}/> {novel.views}</span>
                     <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current"/> {novel.rating}</span>
                </div>
                
                {/* RATING INTERAKTIF */}
                <div className="flex items-center gap-1 mb-6 bg-black/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                    {[1,2,3,4,5].map(s => (
                        <Star key={s} size={24} 
                              fill={s <= (userRating || Math.round(novel.rating)) ? "gold" : "none"}
                              className="text-yellow-400 cursor-pointer hover:scale-110 transition"
                              onMouseEnter={() => setUserRating(s)} onMouseLeave={() => setUserRating(0)} onClick={() => handleRate(s)}/>
                    ))}
                </div>

                <div className="flex gap-3">
                    {novel.chapters?.length > 0 ? (
                        <Link to={`/read/${novel.chapters[0].id}`} className="bg-zen-500 text-white font-bold py-2.5 px-8 rounded-full hover:bg-zen-500 transition shadow-lg">READ NOW</Link>
                    ) : <button disabled className="bg-gray-500 text-white py-2.5 px-8 rounded-full opacity-50">No Chapter</button>}
                    <button onClick={handleBookmark} className="bg-white dark:bg-[#333] text-gray-800 dark:text-white py-2.5 px-6 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100"><Bookmark size={18} /> Library</button>
                </div>
            </div>
        </div>

        {/* TABS (DESKRIPSI / CHAPTER) */}
        <div className="mt-10 bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
                <button onClick={() => setActiveTab('desc')} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === 'desc' ? 'border-zen-500 text-zen-500' : 'border-transparent text-gray-500'}`}>Description</button>
                <button onClick={() => setActiveTab('chap')} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === 'chap' ? 'border-zen-500 text-zen-500' : 'border-transparent text-gray-500'}`}>Chapters</button>
            </div>

            {activeTab === 'desc' && (
                <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300">
                    <p className="whitespace-pre-line mb-6">{novel.synopsis}</p>
                    
                    {/* --- TAGS (SUDAH DIPERBAIKI) --- */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {novel.tags && novel.tags.length > 0 ? novel.tags.map(tag => (
                            <Link key={tag.id} to={`/tag/${tag.slug}`} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-zen-500 hover:text-white px-3 py-1 rounded-full text-xs transition">
                                <Hash size={12}/> {tag.name}
                            </Link>
                        )) : <span className="italic opacity-50 text-xs">No tags available</span>}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-zen-500 block text-xs uppercase mb-1">Author</span>
                        <span className="text-lg font-medium">{novel.author}</span>
                    </div>
                </div>
            )}

            {activeTab === 'chap' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {novel.chapters?.map((chap) => (
                        <Link key={chap.id} to={`/read/${chap.id}`} className="border-b border-dashed border-gray-200 dark:border-gray-700 py-3 hover:text-zen-500 truncate text-sm block transition-colors">
                            {chap.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}