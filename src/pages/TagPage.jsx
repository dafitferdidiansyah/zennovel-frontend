import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import { ArrowLeft, Hash, Tag } from 'lucide-react'; // Tambah icon Tag

export default function TagPage() {
  // Ambil parameter dari URL (bisa tagName atau genreName tergantung route)
  const { tagName, genreName } = useParams();
  
  // LOGIC PENENTUAN MODE
  // Jika genreName ada isinya, berarti user akses /genre/...
  // Jika tidak, berarti user akses /tag/...
  const isGenre = Boolean(genreName);
  const query = isGenre ? genreName : tagName;

  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Pilih fungsi API yang sesuai
    const fetchFunc = isGenre 
        ? api.getNovelsByGenre(query) 
        : api.getNovelsByTag(query);

    fetchFunc
      .then((res) => {
        // Handle pagination response (results) atau array langsung
        const data = res.data.results ? res.data.results : res.data;
        setNovels(data);
      })
      .catch((err) => {
        console.error("Error fetching novels:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, isGenre]);

  return (
    <div className="min-h-screen pb-20 bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] font-sans">
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-[#232323] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm p-4">
         <div className="max-w-6xl mx-auto flex items-center gap-4">
             <Link to="/" className="text-gray-500 hover:text-zen-500"><ArrowLeft/></Link>
             
             {/* JUDUL DINAMIS SESUAI TIPE */}
             <h1 className="text-xl font-bold uppercase flex items-center gap-2">
                {isGenre ? <Tag className="text-zen-500"/> : <Hash className="text-zen-500"/>}
                {isGenre ? 'Genre' : 'Tag'}: {query}
             </h1>
         </div>
      </nav>

      {/* KONTEN GRID (TIDAK DIUBAH TAMPILANNYA) */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
            <div className="text-center py-20">Loading...</div>
        ) : novels.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
                No novels found with this {isGenre ? 'genre' : 'tag'}.
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {novels.map(novel => (
                    <Link to={`/novel/${novel.id}`} key={novel.id} className="group">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md mb-2">
                             <img 
                                src={novel.cover ? `${BASE_URL}${novel.cover}` : 'https://placehold.co/400x600'} 
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                             />
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