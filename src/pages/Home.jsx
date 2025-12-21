import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Flame, Clock, Zap, LogOut, User , Search} from 'lucide-react';
import { api, BASE_URL } from '../api'; 

export default function Home() {
  const [data, setData] = useState({ hot: [], latest: [], completed: [], recent: [] });
  const [genres, setGenres] = useState([]);
  const [continueReading, setContinueReading] = useState([]); // State untuk Continue Reading
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    const fetchData = async () => {
        try {
            // Ambil data Home & Genre secara paralel
            const [homeRes, genreRes] = await Promise.all([
                api.getHomeData(token),
                api.getGenres()
            ]);
            
            const homeData = homeRes.data || {};

            // --- 1. LOGIKA HYBRID CONTINUE READING ---
            if (token) {
                // A. JIKA LOGIN: Ambil dari API
                setContinueReading(homeData.recent || []);
            } else {
                // B. JIKA TAMU: Ambil dari LocalStorage
                const localHistory = JSON.parse(localStorage.getItem('reading_history')) || [];
                setContinueReading(localHistory);
            }

            // --- 2. LOGIKA DATA HOME ---
            setData(homeData);

            // --- 3. LOGIKA GENRE (Anti-Error) ---
            let genresData = [];
            if (Array.isArray(genreRes.data)) {
                genresData = genreRes.data;
            } else if (genreRes.data && Array.isArray(genreRes.data.results)) {
                genresData = genreRes.data.results;
            }
            setGenres(genresData);

       } catch (err) {
            console.error(err);
            // Fallback agar tidak blank
            setData({ hot: [], latest: [], completed: [], recent: [] });
            setGenres([]); 
            setContinueReading([]);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading library...</div>;

  return (
    <div className="min-h-screen pb-20 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] transition-colors duration-300 font-sans">
      
      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* HOT NOVEL GRID */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
             <Flame className="text-red-500" size={20} />
             <h2 className="text-lg font-bold uppercase text-red-500">Hot Novel</h2>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {data.hot?.map(novel => (
              <Link to={`/novel/${novel.id}`} key={novel.id} className="group relative">
                <div className="aspect-[2/3] overflow-hidden rounded shadow-md bg-gray-200 dark:bg-gray-800">
                   <img 
                      src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                   />
                   <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-br font-bold shadow-sm">HOT</div>
                </div>
                <h3 className="mt-2 text-sm font-bold truncate text-gray-800 dark:text-gray-200 group-hover:text-zen-500">
                    {novel.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LATEST RELEASE (Main Column) */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
               <Clock className="text-blue-500" size={20} />
               <h2 className="text-lg font-bold uppercase text-blue-500">Latest Release</h2>
            </div>

            <div className="space-y-4">
              {data.latest?.map(novel => (
                <div key={novel.id} className="flex gap-4 p-3 bg-white dark:bg-[#232323] rounded shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                  <div className="w-16 h-24 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                    <img src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'} className="w-full h-full object-cover"/>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <Link to={`/novel/${novel.id}`}>
                            <h3 className="font-bold text-md truncate hover:text-zen-500 text-gray-800 dark:text-gray-200">
                                {novel.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Link 
                                to={`/genre/${novel.genre}`} 
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded hover:bg-zen-500 hover:text-white cursor-pointer transition text-gray-600 dark:text-gray-300 hover:text-black"
                                onClick={(e) => e.stopPropagation()} 
                            >
                                {novel.genre}
                            </Link>
                            <span>•</span>
                            <span className="text-zen-500">{novel.author}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs text-gray-400">
                             {novel.chapter_count ? `${novel.chapter_count} Chapters` : 'No Chapter'}
                         </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR (Continue Reading, Genres, Completed) */}
          <div className="w-full md:w-80 space-y-8">
             
             {/* --- 1. CONTINUE READING (NEW LOCATION) --- */}
             {continueReading && continueReading.length > 0 && (
                <div className="bg-white dark:bg-[#232323] p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-600 pb-2 mb-3">
                        <BookOpen className="text-purple-500" size={18} />
                        <h3 className="font-bold text-gray-800 dark:text-white">Continue Reading</h3>
                   </div>
                   
                   <div className="space-y-3">
                       {/* Map data Continue Reading */}
                       {continueReading.slice(0, 5).map(item => ( // Tampilkan max 5 agar tidak kepanjangan
                           <Link 
                                key={`${item.id}-${item.chapter_id}`} 
                                to={`/read/${item.id}/${item.chapter_id}`} 
                                className="flex gap-3 group"
                           >
                               <div className="w-12 h-16 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                        src={item.cover ? (item.cover.startsWith('http') ? item.cover : `${BASE_URL}${item.cover}`) : 'https://placehold.co/400x600'} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    />
                               </div>
                               <div className="flex flex-col justify-center min-w-0">
                                   <h4 className="text-xs font-bold group-hover:text-purple-500 text-gray-800 dark:text-gray-200 line-clamp-2">
                                        {item.title}
                                   </h4>
                                   <span className="text-[10px] text-gray-500 mt-0.5 truncate">
                                        {item.chapter_title ? item.chapter_title : `Chapter ${item.chapter_order}`}
                                   </span>
                                   <span className="text-[10px] text-purple-500 font-bold mt-1">▶ Lanjut Baca</span>
                               </div>
                           </Link>
                       ))}
                   </div>
                </div>
             )}

             {/* --- 2. GENRES --- */}
             <div className="bg-white dark:bg-[#232323] p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold border-b border-gray-300 dark:border-gray-600 pb-2 mb-3 text-gray-800 dark:text-white">Genres</h3>
                <div className="flex flex-wrap gap-2">
                   {genres && genres.length > 0 ? genres.map(g => (
                      <Link 
                        key={g} 
                        to={`/genre/${g}`} 
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded hover:bg-zen-500 hover:text-white cursor-pointer transition text-gray-600 dark:text-gray-300 hover:text-black"
                      >
                        {g}
                      </Link>
                   )) : (
                     <span className="text-xs text-gray-500">No genres found.</span>
                   )}
                </div>
             </div>

             {/* --- 3. COMPLETED --- */}
             <div className="bg-white dark:bg-[#232323] p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold border-b border-gray-300 dark:border-gray-600 pb-2 mb-3 text-green-500">Novel Completed</h3>
                <div className="space-y-3">
                   {data.completed?.map(novel => (
                      <Link to={`/novel/${novel.id}`} key={novel.id} className="flex gap-3 group">
                         <div className="w-12 h-16 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                            <img src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'} className="w-full h-full object-cover"/>
                         </div>
                         <div>
                            <h4 className="text-xs font-bold group-hover:text-green-500 text-gray-800 dark:text-gray-200 line-clamp-2">{novel.title}</h4>
                            <span className="text-[10px] bg-green-100 text-green-800 px-1.5 rounded mt-1 inline-block">Full</span>
                         </div>
                      </Link>
                   ))}
                   {(!data.completed || data.completed.length === 0) && <p className="text-xs text-gray-500">No completed novels yet.</p>}
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}