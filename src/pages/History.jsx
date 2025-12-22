import { useEffect, useState } from 'react';
import { api, BASE_URL } from '../api';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data langsung dari LocalStorage
    const localData = JSON.parse(localStorage.getItem('reading_history')) || [];
    // Urutkan berdasarkan aktivitas terbaru
    const sortedData = localData.sort((a, b) => b.timestamp - a.timestamp);
    
    setHistory(sortedData);
    setLoading(false);
  }, []);

  // Helper Waktu Relatif dengan huruf kecil sesuai permintaan
  const getRelativeTime = (ts) => {
    const diff = new Date().getTime() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs} hours ago`;
    return new Date(ts).toLocaleDateString().toLowerCase();
  };

  const getImageUrl = (path) => path?.startsWith('http') ? path : `${BASE_URL}${path}`;

  const groupHistoryByDate = (data) => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - (24 * 60 * 60 * 1000);

    data.forEach(item => {
      const itemTime = item.timestamp;
      if (itemTime >= today) groups.Today.push(item);
      else if (itemTime >= yesterday) groups.Yesterday.push(item);
      else groups.Older.push(item);
    });
    return groups;
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans transition-colors duration-300">
      
      {/* NAV INTERNAL (Identik dengan Library.jsx menggunakan sticky top-0) */}
      <nav className="bg-white dark:bg-[#232323] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm mb-6">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-zen-500">
                <ArrowLeft size={24} />
             </Link>
             <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center gap-2">
               Reading <span className="text-zen-500">History</span>
             </h1>
           </div>
        </div>
      </nav>

      <div className="flex-grow max-w-6xl mx-auto px-4 w-full"> 
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
             <Clock size={48} className="mx-auto mb-4 text-gray-300" />
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">History Empty</h3>
             <p className="text-gray-500">You haven't read anything yet.</p>
             <Link to="/" className="mt-4 inline-block text-zen-500 font-bold hover:underline">Browse Novels</Link>
          </div>
        ) : (
          <div className="space-y-8 pb-20">
            {Object.entries(groupedHistory).map(([label, items]) => (
              items.length > 0 && (
                <div key={label} className="animate-fade-in">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1 flex items-center gap-2">
                    <Calendar size={14} /> {label}
                  </h2>

                  <div className="grid gap-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-zen-500 transition-all duration-300 group">
                        <Link 
                          to={`/read/${item.id}/${item.chapter_id}`}
                          className="flex items-center gap-4 p-4"
                        >
                          <div className="w-14 h-20 flex-shrink-0 rounded shadow-sm bg-gray-200 dark:bg-gray-800 overflow-hidden">
                            <img 
                              src={getImageUrl(item.cover)}
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-zen-500 transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] font-bold text-zen-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900/50">
                                Ch {item.chapter_index}
                              </span>
                              <span className="text-xs text-gray-400 truncate font-medium lowercase">
                                {item.chapter_title}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex items-center gap-3">
                            <span className="text-[11px] font-medium text-gray-400 lowercase">
                              {getRelativeTime(item.timestamp)}
                            </span>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-zen-500 transition-all" />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}