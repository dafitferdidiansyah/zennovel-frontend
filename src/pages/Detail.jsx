import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, BASE_URL } from '../api'; 
import { BookOpen, Star, ArrowLeft, Eye, Check, Plus, Hash, ArrowDownUp } from 'lucide-react';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');
  const [userRating, setUserRating] = useState(0);
  
  // State untuk status library
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [readChapterIds, setReadChapterIds] = useState(new Set());
  const [lastRead, setLastRead] = useState(null);
  
  // Sorting State: True = Oldest (1, 2, 3), False = Latest (End, ... , 1)
  const [isOldestFirst, setIsOldestFirst] = useState(false);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Kirim token saat request detail
    api.getDetail(id, token).then(res => {
        setNovel(res.data);
        
        // Cek status bookmark dari respon backend
        if (res.data.is_bookmarked) {
            setIsInLibrary(true);
        } else {
            setIsInLibrary(false);
        }

        const history = JSON.parse(localStorage.getItem('reading_history')) || [];
        
        // 1. Cari riwayat terakhir novel ini untuk tombol "Continue"
        const currentNovelHistory = history.find(h => h.id == id); // id novel
        if (currentNovelHistory) {
            setLastRead(currentNovelHistory);
        }
        
        const readIds = new Set(
            history
            .filter(h => h.id == id)
            .map(h => h.chapter_id) // Ambil ID chapternya
        );
        setReadChapterIds(readIds);
    }).catch(console.error);
    
  }, [id, token]);

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
    try { 
        await api.toggleBookmark(novel.id, token); 
        // Update state UI secara langsung
        setIsInLibrary(prev => !prev);
    } catch { 
        alert("Failed to update library."); 
    }
  };

  // --- FUNGSI BARU: PERBAIKAN LOGIKA GAMBAR ---
  const getImageUrl = (coverPath) => {
    if (!coverPath) return 'https://placehold.co/400x600?text=No+Cover'; // Fallback jika null
    if (coverPath.startsWith('http')) return coverPath; // Jika sudah URL lengkap, pakai langsung
    return `${BASE_URL}${coverPath}`; // Jika path relatif, tambahkan BASE_URL
  };

  if (!novel) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen pb-10 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans">
      {/* HEADER IMAGE */}
      <div className="relative h-72 w-full overflow-hidden">
        {/* Update src menggunakan helper function */}
        <img 
            src={getImageUrl(novel.cover)} 
            className="w-full h-full object-cover opacity-60 blur-sm scale-110"
            onError={(e) => {e.target.src = 'https://placehold.co/400x600?text=Error'}} // Fallback jika error load
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F4F4] dark:from-[#151515] to-transparent" />
        <Link to="/" className="absolute top-4 left-4 p-2 bg-black/30 rounded-full text-white hover:bg-red-600 transition"><ArrowLeft size={20}/></Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* COVER BUKU */}
            <div className="w-44 flex-shrink-0 rounded-lg shadow-2xl overflow-hidden border-4 border-white dark:border-[#232323]">
                 {/* Update src menggunakan helper function */}
                 <img 
                    src={getImageUrl(novel.cover)} 
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = 'https://placehold.co/400x600?text=Error'}} 
                 />
            </div>
            
            {/* INFO TEXT */}
            <div className="flex-1 pt-2 md:pt-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{novel.title}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Link to={`/genre/${novel.genre}`} className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-200 dark:border-red-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors">
                {novel.genre}
                </Link>                      <span className="flex items-center gap-1"><Eye size={16}/> {novel.views}</span>
                                        <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current"/> {novel.rating}</span>
                </div>
                
                {/* RATING INTERAKTIF */}
                <div className="flex items-center gap-1 mb-8 bg-black/5 dark:bg-white/5 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5">
                    {[1,2,3,4,5].map(s => (
                        <Star key={s} size={24} 
                              fill={s <= (userRating || Math.round(novel.rating)) ? "gold" : "none"}
                              className="text-yellow-400 cursor-pointer hover:scale-110 transition"
                              onMouseEnter={() => setUserRating(s)} onMouseLeave={() => setUserRating(0)} onClick={() => handleRate(s)}/>
                    ))}
                </div>

                {/* --- TOMBOL SMART (START / CONTINUE) --- */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {novel.chapters?.length > 0 ? (
                        <Link 
                            // LOGIKA LINK: Kalau ada lastRead, ke sana. Kalau tidak, ke chapter pertama [0]
                            to={lastRead 
                                ? `/read/${novel.id}/${lastRead.chapter_id}` 
                                : `/read/${novel.id}/${novel.chapters[0].id}`
                            } 
                            className="group flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-3.5 px-6 rounded-2xl font-bold text-base shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2"
                        >
                            <BookOpen size={20} className="group-hover:animate-pulse" />
                            {/* LOGIKA TEXT: Ganti text tombol */}
<span className="truncate">
        {lastRead ? (
            // LOGIKA BARU:
            // Cek apakah ada chapter_index?
            lastRead.chapter_index > 0 
                ? `Continue: Ch ${lastRead.chapter_index}` // Hasil: "Continue: Ch 590"
                : `Continue: ${lastRead.chapter_title}`    // Fallback: "Continue: Prologue"
        ) : (
            "Start Reading"
        )}
    </span>
                        </Link>
                    ) : (
                        <button disabled className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-500 py-3.5 px-6 rounded-2xl font-bold cursor-not-allowed flex justify-center items-center gap-2">
                            <span>No Chapters</span>
                        </button>
                    )}

                    <button onClick={handleBookmark} className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-base border-2 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2 ${isInLibrary ? "bg-gray-100 dark:bg-gray-800 text-gray-400 border-transparent cursor-pointer shadow-none" : "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 shadow-sm hover:shadow-md"}`}>
                        {isInLibrary ? <><Check size={20} /><span>In Library</span></> : <><Plus size={20} /><span>Add to Library</span></>}
                    </button>
                </div>
                {/* --- AKHIR TOMBOL --- */}

            </div>
        </div>

        {/* TABS */}
        <div className="mt-10 bg-white dark:bg-[#232323] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
                <button onClick={() => setActiveTab('desc')} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === 'desc' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500'}`}>Description</button>
                <button onClick={() => setActiveTab('chap')} className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === 'chap' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500'}`}>Chapters</button>
            </div>

            {activeTab === 'desc' && (
                <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300">
                    <p className="whitespace-pre-line mb-6 leading-relaxed">{novel.synopsis}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {novel.tags && novel.tags.length > 0 ? novel.tags.map(tag => (
                            <Link key={tag.id} to={`/tag/${tag.slug}`} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full text-xs transition">
                                <Hash size={12}/> {tag.name}
                            </Link>
                        )) : <span className="italic opacity-50 text-xs">No tags available</span>}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-red-500 block text-xs uppercase mb-1">Author</span>
                        <span className="text-lg font-medium">{novel.author}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-red-500 block text-xs uppercase mb-1">Alternative Title</span>
                        <span className="text-lg font-medium leading-tight italic">{novel.alternative_title}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-red-500 block text-xs uppercase mb-1">Status</span>
                        <span className="text-lg font-medium">{novel.status}</span>
                    </div>
                </div>
            )}

            {activeTab === 'chap' && (
                <div>
                    {/* FILTER SORTING CHAPTER (DITAMBAHKAN) */}
                    <div className="flex justify-end mb-2">
                        <button 
                            onClick={() => setIsOldestFirst(!isOldestFirst)}
                            className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider"
                        >
                            <ArrowDownUp size={14} />
                            {isOldestFirst ? "Oldest" : "Latest"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {/* LOGIKA SORTING (DITAMBAHKAN) */}
                        {novel.chapters && [...novel.chapters]
                            .sort((a, b) => {
                                // Mengubah "10.5" -> 10.5 (Float)
                                const numA = parseFloat(a.chapter_number || a.order || 0); 
                                const numB = parseFloat(b.chapter_number || b.order || 0);
                                // Urutkan berdasarkan state
                                return isOldestFirst ? numA - numB : numB - numA;
                            })
                            .map((chap) => (
                                <Link key={chap.id} to={`/read/${novel.id}/${chap.id}`} className="border-b border-dashed border-gray-200 dark:border-gray-700 py-3 hover:text-red-500 truncate text-sm block transition-colors">
                                    {chap.title}
                                </Link>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}