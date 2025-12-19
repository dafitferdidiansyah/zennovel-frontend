import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import { ArrowLeft, Hash } from 'lucide-react';

export default function TagPage() {
  const { slug } = useParams();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getNovelsByTag(slug)
      .then(res => setNovels(res.data.results))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen pb-20 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans">
      <nav className="bg-white dark:bg-[#232323] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm p-4">
         <div className="max-w-6xl mx-auto flex items-center gap-4">
             <Link to="/" className="text-gray-500 hover:text-zen-500"><ArrowLeft/></Link>
             <h1 className="text-xl font-bold uppercase flex items-center gap-2">
                <Hash className="text-zen-500"/> Tag: {slug}
             </h1>
         </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
            <div className="text-center py-20">Loading...</div>
        ) : novels.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No novels found with this tag.</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {novels.map(novel => (
                    <Link to={`/novel/${novel.id}`} key={novel.id} className="group">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md mb-2">
                             <img src={`${BASE_URL}${novel.cover}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300"/>
                        </div>
                        <h3 className="font-bold text-sm line-clamp-2 group-hover:text-zen-500">{novel.title}</h3>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}