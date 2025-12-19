import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import CommentSection from '../components/CommentSection'; // Import Komponen Komentar

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [showMenu, setShowMenu] = useState(true);
  
  // Reader Settings (Default Dark)
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setChapter(null);
    window.scrollTo(0, 0);
    api.getChapter(id)
       .then(res => setChapter(res.data))
       .catch(err => console.error(err));
  }, [id]);

  // Theme Config (Warna Persis NovelBin)
  const themes = {
    light: { bg: '#F4F4F4', text: '#333', ui: '#fff', border: '#ddd' },
    sepia: { bg: '#EAE4D3', text: '#5b4636', ui: '#F4F4E4', border: '#dcc6a0' },
    dark:  { bg: '#232323', text: '#bbb', ui: '#1b1b1b', border: '#333' },
  };
  const currentTheme = themes[theme];

  if (!chapter) return <div className="text-center py-20 text-[#bbb] bg-[#232323] min-h-screen">Loading chapter...</div>;

  return (
    <div 
      className="min-h-screen transition-colors duration-300 font-sans"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      {/* 1. HEADER NAVIGASI */}
      <div 
        className={`fixed top-0 w-full p-3 flex items-center justify-between shadow-md z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ backgroundColor: currentTheme.ui, borderBottom: `1px solid ${currentTheme.border}` }}
      >
         <div className="flex items-center gap-3">
             <Link to={`/novel/${chapter.novel_id}`} className="p-2 hover:bg-black/10 rounded transition">
                <ArrowLeft size={18} />
             </Link>
             <Link to="/" className="p-2 hover:bg-black/10 rounded transition">
                <Home size={18} />
             </Link>
             <span className="font-bold truncate max-w-[200px] text-sm hidden md:block">
                {chapter.title}
             </span>
         </div>
         <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-black/10 rounded transition text-[#d9534f]">
            <Settings size={20}/>
         </button>
      </div>

      {/* 2. WRAPPER UTAMA */}
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-32">
         
         {/* JUDUL CHAPTER */}
         <div className="mb-6 border-b border-dashed border-gray-400 dark:border-[#444] pb-4">
             <h1 className="text-2xl font-bold mb-2 text-[#d9534f]">{chapter.title}</h1>
             <div className="flex gap-2">
                <button disabled={!chapter.prev_chapter_id} onClick={() => navigate(`/read/${chapter.prev_chapter_id}`)} className="bg-[#5cb85c] text-white px-3 py-1 rounded text-xs hover:bg-[#449d44] disabled:opacity-50">
                    <ChevronLeft size={12} className="inline"/> Prev
                </button>
                <button disabled={!chapter.next_chapter_id} onClick={() => navigate(`/read/${chapter.next_chapter_id}`)} className="bg-[#5cb85c] text-white px-3 py-1 rounded text-xs hover:bg-[#449d44] disabled:opacity-50">
                    Next <ChevronRight size={12} className="inline"/>
                </button>
             </div>
         </div>

         {/* 3. TEKS NOVEL */}
         <div 
            className="prose dark:prose-invert max-w-none mb-10 select-none md:select-text"
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight, fontFamily: 'Arial, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: chapter.content }}
            onClick={() => setShowMenu(!showMenu)} 
         />

         {/* 4. NAVIGASI BAWAH (MIRIP NOVELBIN) */}
         <div className="flex justify-between gap-2 mb-8">
            <button 
              disabled={!chapter.prev_chapter_id}
              onClick={() => { window.scrollTo(0,0); navigate(`/read/${chapter.prev_chapter_id}`); }}
              className="flex-1 bg-[#5cb85c] text-white py-2 rounded text-sm font-bold hover:bg-[#449d44] transition disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <ChevronLeft size={16}/> Prev Chapter
            </button>
            <button 
              disabled={!chapter.next_chapter_id}
              onClick={() => { window.scrollTo(0,0); navigate(`/read/${chapter.next_chapter_id}`); }}
              className="flex-1 bg-[#5cb85c] text-white py-2 rounded text-sm font-bold hover:bg-[#449d44] transition disabled:opacity-50 flex items-center justify-center gap-1"
            >
              Next Chapter <ChevronRight size={16}/>
            </button>
         </div>

         {/* 5. KOMENTAR (KOMPONEN TERPISAH) */}
         <CommentSection chapterId={chapter.id} />
      
      </div>

      {/* 6. FOOTER SETTINGS PANEL */}
      <div 
        className={`fixed bottom-0 w-full p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ backgroundColor: currentTheme.ui, borderTop: `1px solid ${currentTheme.border}` }}
      >
         <div className="max-w-3xl mx-auto space-y-4">
             {/* Font Size & Line Height */}
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     <span className="text-xs font-bold uppercase opacity-70 w-16">Font</span>
                     <button onClick={() => setFontSize(s => Math.max(14, s-2))} className="px-3 py-1 bg-gray-200 dark:bg-[#333] rounded">-</button>
                     <span className="text-sm w-6 text-center">{fontSize}</span>
                     <button onClick={() => setFontSize(s => Math.min(32, s+2))} className="px-3 py-1 bg-gray-200 dark:bg-[#333] rounded">+</button>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="text-xs font-bold uppercase opacity-70">Line</span>
                     <select 
                        value={lineHeight} 
                        onChange={(e) => setLineHeight(e.target.value)}
                        className="bg-gray-200 dark:bg-[#333] text-xs p-1 rounded outline-none"
                     >
                        <option value="1.4">140%</option>
                        <option value="1.6">160%</option>
                        <option value="1.8">180%</option>
                        <option value="2.0">200%</option>
                     </select>
                 </div>
             </div>
             
             {/* Background Theme */}
             <div className="flex items-center gap-2">
                 <span className="text-xs font-bold uppercase opacity-70 w-16">Color</span>
                 <div className="flex gap-2 flex-1">
                     {['light', 'sepia', 'dark'].map(t => (
                         <button 
                            key={t} 
                            onClick={() => setTheme(t)}
                            className={`flex-1 py-1 rounded text-xs font-bold capitalize border ${theme === t ? 'border-[#d9534f] text-[#d9534f]' : 'border-transparent opacity-70'}`}
                            style={{ backgroundColor: themes[t].bg, color: theme === t ? '#d9534f' : themes[t].text }}
                         >
                            {t}
                         </button>
                     ))}
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}