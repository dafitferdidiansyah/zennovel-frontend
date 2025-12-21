import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Flame, Clock } from 'lucide-react';
import { api, BASE_URL } from '../api'; 

export default function Home() {
  const [data, setData] = useState({ hot: [], latest: [], completed: [], recent: [] });
  const [genres, setGenres] = useState([]);
  const [continueReading, setContinueReading] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    const fetchData = async () => {
        try {
            const [homeRes, genreRes] = await Promise.all([
                api.getHomeData(token),
                api.getGenres()
            ]);
            
            const homeData = homeRes.data || {};

            // LOGIKA HYBRID
            if (token) {
                setContinueReading(homeData.recent || []);
            } else {
                const localHistory = JSON.parse(localStorage.getItem('reading_history')) || [];
                setContinueReading(localHistory);
            }

            setData(homeData);

            let genresData = [];
            if (Array.isArray(genreRes.data)) {
                genresData = genreRes.data;
            } else if (genreRes.data && Array.isArray(genreRes.data.results)) {
                genresData = genreRes.data.results;
            }
            setGenres(genresData);

       } catch (err) {
            console.error(err);
            setData({ hot: [], latest: [], completed: [], recent: [] });
            setGenres([]); 
            setContinueReading([]);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading library...</div>;

  return (
    <div className="min-h-screen pb-20 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] transition-colors duration-300 font-sans">
      
      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* ========================================================= */}
        {/* [MOBILE ONLY] CONTINUE READING (HORIZONTAL SCROLL)        */}
        {/* Posisi: Di Atas Hot Novel                                 */}
        {/* Class 'md:hidden' artinya: HILANG saat layar Desktop      */}
        {/* ========================================================= */}
        {continueReading && continueReading.length > 0 && (
          <div className="mb-8 animate-fade-in md:hidden">
             <div className="flex items-center gap-2 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                 <BookOpen className="text-purple-500" size={20} />
                 <h2 className="text-lg font-bold uppercase text-purple-500">Continue Reading</h2>
             </div>
             
             {/* Geser Samping (overflow-x-auto) */}
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {continueReading.map(item => (
                     <Link 
                        key={`mob-${item.id}-${item.chapter_id}`} 
                        to={`/read/${item.id}/${item.chapter_id}`} 
                        className="min-w-[240px] flex gap-3 p-3 bg-white dark:bg-[#232323] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:shadow-md transition group"
                     >
                         <div className="w-14 h-20 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                             <img 
                                src={item.cover ? (item.cover.startsWith('http') ? item.cover : `${BASE_URL}${item.cover}`) : 'https://placehold.co/400x600?text=No+Cover'} 
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                alt={item.title}
                             />
                         </div>
                         <div className="flex flex-col justify-center min-w-0 flex-1">
                             <h4 className="font-bold text-sm truncate text-gray-800 dark:text-gray-200 group-hover:text-purple-500">
                                {item.title}
                             </h4>
                             <span className="text-xs text-gray-500 truncate mt-1">
                                {item.chapter_title ? item.chapter_title : `Chapter ${item.chapter_order}`}
                             </span>
                             <div className="flex items-center gap-1 mt-2 text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">
                                <span>▶ Lanjut Baca</span>
                             </div>
                         </div>
                     </Link>
                 ))}
             </div>
          </div>
        )}

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

          {/* SIDEBAR */}
          <div className="w-full md:w-80 space-y-8">
             
             {/* ========================================================= */}
             {/* [DESKTOP ONLY] CONTINUE READING (VERTICAL LIST)           */}
             {/* Posisi: Di Sidebar, Atas Genre                            */}
             {/* Class 'hidden md:block' artinya: MUNCUL hanya di Desktop  */}
             {/* ========================================================= */}
             {continueReading && continueReading.length > 0 && (
                <div className="hidden md:block bg-white dark:bg-[#232323] p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
                   <div className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-600 pb-2 mb-3">
                        <BookOpen className="text-purple-500" size={18} />
                        <h3 className="font-bold text-gray-800 dark:text-white">Continue Reading</h3>
                   </div>
                   
                   <div className="space-y-3">
                       {/* List ke Bawah (Vertical) */}
                       {continueReading.slice(0, 5).map(item => ( 
                           <Link 
                                key={`desk-${item.id}-${item.chapter_id}`} 
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

             {/* Genres */}
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

             {/* Completed */}
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