import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, List, ArrowUp, ArrowDown } from 'lucide-react';
import CommentSection from '../components/CommentSection';

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  
  // Reader Settings
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState('dark');

  // Themes Config
  const themes = {
    light: { bg: '#F4F4F4', text: '#333', ui: '#fff', border: '#ddd' },
    sepia: { bg: '#EAE4D3', text: '#5b4636', ui: '#F4F4E4', border: '#dcc6a0' },
    dark:  { bg: '#232323', text: '#bbb', ui: '#1b1b1b', border: '#333' },
  };
  const currentTheme = themes[theme];

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    setChapter(null);
    window.scrollTo(0, 0); // Reset scroll ke atas
    
    api.getChapter(id)
       .then(res => {
           setChapter(res.data);
           // Update Judul Tab Browser
           document.title = `${res.data.title} - ZenNovel`; 
       })
       .catch(err => {
           console.error(err);
           navigate('/404'); // Redirect ke 404 jika chapter error
       })
       .finally(() => setLoading(false));

    // Reset title saat keluar halaman
    return () => document.title = 'ZenNovel';
  }, [id, navigate]);

  // Scroll Helpers
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  // Komponen Loading Skeleton
  if (loading || !chapter) return (
    <div className="min-h-screen bg-[#232323] p-4 pt-20 max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
        <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
            ))}
        </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen transition-colors duration-300 font-sans relative"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      {/* 1. HEADER NAVIGASI (Sticky Top) */}
      <div 
        className={`fixed top-0 w-full px-4 py-3 flex items-center justify-between shadow-md z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ backgroundColor: currentTheme.ui, borderBottom: `1px solid ${currentTheme.border}` }}
      >
         <div className="flex items-center gap-4 min-w-0">
             <Link 
                to={`/novel/${chapter.novel_id}`} 
                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition"
                title="Back to Novel"
             >
                <ArrowLeft size={20} />
             </Link>
             <span className="font-bold truncate text-sm md:text-base pr-2">
                {chapter.title}
             </span>
         </div>
         <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition text-zen-500">
            <Settings size={20}/>
         </button>
      </div>

      {/* 2. KONTEN BACA */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-32">
         
         {/* JUDUL & NAVIGASI ATAS */}
         <div className="mb-8 border-b border-dashed border-gray-400 dark:border-gray-600 pb-6">
             <h1 className="text-2xl md:text-3xl font-bold mb-6 text-zen-500 text-center">{chapter.title}</h1>
             
             {/* Tombol Navigasi Atas (Konsisten) */}
             <div className="flex justify-between items-center gap-2">
                <button 
                    disabled={!chapter.prev_chapter_id} 
                    onClick={() => navigate(`/read/${chapter.prev_chapter_id}`)} 
                    className="flex-1 bg-zen-500 text-white py-2 rounded text-sm font-bold hover:bg-zen-600 disabled:opacity-50 disabled:bg-gray-500 transition flex items-center justify-center gap-1"
                >
                    <ChevronLeft size={16}/> <span className="hidden sm:inline">Prev</span>
                </button>

                <Link 
                    to={`/novel/${chapter.novel_id}`} 
                    className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-zen-500 hover:text-white hover:border-zen-500 transition"
                    title="Table of Contents"
                >
                    <List size={20} />
                </Link>

                <button 
                    disabled={!chapter.next_chapter_id} 
                    onClick={() => navigate(`/read/${chapter.next_chapter_id}`)} 
                    className="flex-1 bg-zen-500 text-white py-2 rounded text-sm font-bold hover:bg-zen-600 disabled:opacity-50 disabled:bg-gray-500 transition flex items-center justify-center gap-1"
                >
                    <span className="hidden sm:inline">Next</span> <ChevronRight size={16}/>
                </button>
             </div>
         </div>

         {/* TEXT NOVEL */}
         <div 
            className="prose dark:prose-invert max-w-none mb-12 select-none md:select-text cursor-pointer"
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
            dangerouslySetInnerHTML={{ __html: chapter.content }}
            onClick={() => setShowMenu(!showMenu)} 
         />

         {/* NAVIGASI BAWAH */}
         <div className="flex justify-between items-center gap-3 mb-10">
            <button 
              disabled={!chapter.prev_chapter_id}
              onClick={() => { window.scrollTo(0,0); navigate(`/read/${chapter.prev_chapter_id}`); }}
              className="flex-1 py-3 border border-gray-400 dark:border-gray-600 rounded font-bold hover:bg-zen-500 hover:text-white hover:border-zen-500 transition disabled:opacity-30 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18}/> Prev
            </button>
            
            <Link 
                to={`/novel/${chapter.novel_id}`} 
                className="py-3 px-4 border border-gray-400 dark:border-gray-600 rounded hover:bg-zen-500 hover:text-white hover:border-zen-500 transition"
            >
                <List size={20} />
            </Link>

            <button 
              disabled={!chapter.next_chapter_id}
              onClick={() => { window.scrollTo(0,0); navigate(`/read/${chapter.next_chapter_id}`); }}
              className="flex-1 py-3 border border-gray-400 dark:border-gray-600 rounded font-bold hover:bg-zen-500 hover:text-white hover:border-zen-500 transition disabled:opacity-30 flex items-center justify-center gap-2"
            >
              Next <ChevronRight size={18}/>
            </button>
         </div>

         {/* KOMENTAR */}
         <CommentSection chapterId={chapter.id} />
      
      </div>

      {/* 3. FLOATING SCROLL BUTTONS (Kanan Bawah) */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-40 opacity-70 hover:opacity-100 transition">
          <button 
            onClick={scrollToTop} 
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg hover:bg-zen-500 hover:text-white transition"
          >
            <ArrowUp size={20} />
          </button>
          <button 
            onClick={scrollToBottom} 
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg hover:bg-zen-500 hover:text-white transition"
          >
            <ArrowDown size={20} />
          </button>
      </div>

      {/* 4. FOOTER SETTINGS PANEL */}
      <div 
        className={`fixed bottom-0 w-full p-5 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ backgroundColor: currentTheme.ui, borderTop: `1px solid ${currentTheme.border}` }}
      >
         <div className="max-w-3xl mx-auto space-y-5">
             
             {/* Font Size & Line Height */}
             <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#333] p-1 rounded-lg">
                     <button onClick={() => setFontSize(s => Math.max(14, s-2))} className="w-8 h-8 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold">-</button>
                     <span className="w-8 text-center text-sm font-mono">{fontSize}</span>
                     <button onClick={() => setFontSize(s => Math.min(32, s+2))} className="w-8 h-8 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold">+</button>
                 </div>
                 
                 <div className="flex items-center gap-2">
                     <span className="text-xs font-bold uppercase opacity-60">Line</span>
                     <select 
                        value={lineHeight} 
                        onChange={(e) => setLineHeight(e.target.value)}
                        className="bg-gray-100 dark:bg-[#333] text-sm py-1.5 px-2 rounded outline-none border border-transparent focus:border-zen-500"
                     >
                        <option value="1.4">Compact</option>
                        <option value="1.8">Normal</option>
                        <option value="2.2">Loose</option>
                     </select>
                 </div>
             </div>
             
             {/* Theme Selection */}
             <div className="flex gap-2">
                 {['light', 'sepia', 'dark'].map(t => (
                     <button 
                        key={t} 
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-2 rounded text-xs font-bold capitalize border-2 transition ${theme === t ? 'border-zen-500 text-zen-500 bg-zen-500/10' : 'border-gray-200 dark:border-gray-600 opacity-60'}`}
                     >
                        {t}
                     </button>
                 ))}
             </div>

         </div>
      </div>
    </div>
  );
}