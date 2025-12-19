import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { BookOpen, Zap } from 'lucide-react';

export default function Home() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNovels()
      .then(res => setNovels(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* HEADER */}
      <nav className="bg-zen-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-2">
          <Zap className="text-zen-500" fill="#ffc107" />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Zen<span className="text-zen-500">Novel</span>
          </h1>
        </div>
      </nav>

      {/* CONTENT GRID */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        <h2 className="text-xl font-semibold mb-6 border-l-4 border-zen-500 pl-3">
          Popular Updates
        </h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading library...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {novels.map((novel) => (
              <Link to={`/read/${novel.chapters?.[0]?.id || 1}`} key={novel.id} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md bg-gray-800">
                  <img 
                    src={novel.cover} 
                    alt={novel.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 p-3 w-full">
                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-zen-500 transition-colors">
                      {novel.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <BookOpen size={12} />
                      <span>{novel.chapters?.length || 0} Chs</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}