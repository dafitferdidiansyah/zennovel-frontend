import { useEffect, useState } from 'react';
import { BASE_URL } from '../api';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengambil data murni dari LocalStorage (Client-side history)
    const localData = JSON.parse(localStorage.getItem('reading_history')) || [];
    const sortedData = localData.sort((a, b) => b.timestamp - a.timestamp);
    setHistory(sortedData);
    setLoading(false);
  }, []);

  // --- HELPER: FORMAT WAKTU RELATIF ---
  const getRelativeTime = (timestamp) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getImageUrl = (coverPath) => {
    if (!coverPath) return 'https://placehold.co/150x200?text=No+Cover';
    if (coverPath.startsWith('http')) return coverPath;
    return `${BASE_URL}${coverPath}`;
  };

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
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="min-h-screen pb-20 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans transition-colors duration-300">
        
        {/* NAVBAR DALAM PAGE (Consistency with Library) */}
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

        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-200 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">No History Yet</h3>
              <p className="text-gray-500 mb-8">You haven't read any novels yet. Your history is saved locally.</p>
              <Link to="/" className="bg-zen-500 text-white px-8 py-3 rounded-full font-bold hover:bg-zen-600 transition shadow-lg inline-block">
                Start Reading
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([label, items]) => (
                items.length > 0 && (
                  <div key={label} className="animate-fade-in">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1 flex items-center gap-2">
                      <Calendar size={14} /> {label}
                    </h2>

                    <div className="grid gap-4">
                      {items.map(item => (
                        <div key={`${item.id}-${item.timestamp}`} className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                          <Link 
                            to={`/read/${item.id}/${item.chapter_id}`}
                            className="flex items-center gap-4 p-4 group"
                          >
                            <div className="w-12 h-16 flex-shrink-0 rounded bg-gray-200 overflow-hidden shadow-sm">
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
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-zen-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                                  {item.chapter_index > 0 ? `Ch ${item.chapter_index}` : "Reading"}
                                </span>
                                <span className="text-xs text-gray-400 truncate hidden sm:block">
                                  {item.chapter_title}
                                </span>
                              </div>
                            </div>

                            <div className="text-right flex items-center gap-3">
                              <span className="text-xs font-medium text-gray-400 whitespace-nowrap italic">
                                {getRelativeTime(item.timestamp)}
                              </span>
                              <ChevronRight size={16} className="text-gray-300 group-hover:text-zen-500 transition-colors" />
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
    </main>
  );
}