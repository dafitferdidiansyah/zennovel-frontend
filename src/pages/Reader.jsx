import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, Home, Menu } from 'lucide-react';

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [showMenu, setShowMenu] = useState(true);
  
  // Reader Settings
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState('dark'); // Options: 'light', 'sepia', 'dark'

  useEffect(() => {
    setChapter(null);
    window.scrollTo(0, 0);
    api.getChapter(id)
       .then(res => setChapter(res.data))
       .catch(err => console.error(err));
  }, [id]);

  // Theme Config ala NovelBin
  const themes = {
    light: { bg: '#F4F4F4', text: '#333', ui: '#fff', border: '#ddd' },
    sepia: { bg: '#EAE4D3', text: '#5b4636', ui: '#F4F4E4', border: '#dcc6a0' },
    dark:  { bg: '#232323', text: '#bbb', ui: '#1b1b1b', border: '#333' },
  };
  const currentTheme = themes[theme];

  if (!chapter) return <div className="text-center py-20">Loading chapter...</div>;

  return (
    <div 
      className="min-h-screen transition-colors duration-300 font-sans"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      {/* HEADER NAVIGASI */}
      <div 
        className={`fixed top-0 w-full p-3 flex items-center justify-between shadow-md z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ backgroundColor: currentTheme.ui, borderBottom: `1px solid ${currentTheme.border}` }}
      >
         <div className="flex items-center gap-4">
             <Link to={`/novel/${chapter.novel_id}`} className="p-2 hover:bg-black/10 rounded-full transition">
                <ArrowLeft size={20} />
             </Link>
             <Link to="/" className="p-2 hover:bg-black/10 rounded-full transition">
                <Home size={20} />
             </Link>
             <span className="font-bold truncate max-w-[150px] md:max-w-md text-sm md:text-base">
                {chapter.title}
             </span>
         </div>
         <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-black/10 rounded-full transition">
            <Settings size={20}/>
         </button>
      </div>

      {/* KONTEN BACA */}
      <div 
        className="max-w-3xl mx-auto px-4 py-24 cursor-pointer min-h-screen select-none md:select-text"
        onClick={() => setShowMenu(!showMenu)}
      >
         <div 
            className="prose dark:prose-invert max-w-none leading-relaxed"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: chapter.content }} 
         />
      </div>

      {/* FOOTER NAVIGASI & SETTING PANEL */}
      <div 
        className={`fixed bottom-0 w-full p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ backgroundColor: currentTheme.ui, borderTop: `1px solid ${currentTheme.border}` }}
      >
         
         {/* Tombol Next/Prev */}
         <div className="flex justify-between gap-4 max-w-3xl mx-auto mb-6">
            <button 
              disabled={!chapter.prev_chapter_id}
              onClick={() => navigate(`/read/${chapter.prev_chapter_id}`)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2.5 rounded font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <ChevronLeft size={18}/> Prev
            </button>
            <button 
              disabled={!chapter.next_chapter_id}
              onClick={() => navigate(`/read/${chapter.next_chapter_id}`)}
              className="flex-1 bg-zen-500 text-white py-2.5 rounded font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-zen-600 transition"
            >
              Next <ChevronRight size={18}/>
            </button>
         </div>

         {/* Panel Setting */}
         <div className="max-w-3xl mx-auto flex items-center justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
             <div className="flex items-center gap-3">
                 <span className="text-xs font-bold uppercase opacity-70">Font</span>
                 <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <button onClick={() => setFontSize(s => Math.max(14, s-2))} className="w-10 h-8 hover:bg-black/10 flex items-center justify-center font-bold">-</button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm">{fontSize}</span>
                    <button onClick={() => setFontSize(s => Math.min(32, s+2))} className="w-10 h-8 hover:bg-black/10 flex items-center justify-center font-bold">+</button>
                 </div>
             </div>
             
             <div className="flex items-center gap-3">
                 <span className="text-xs font-bold uppercase opacity-70">Theme</span>
                 <div className="flex gap-2">
                     {['light', 'sepia', 'dark'].map(t => (
                         <button 
                            key={t} 
                            onClick={() => setTheme(t)}
                            className={`w-8 h-8 rounded-full border-2 transition ${theme === t ? 'border-zen-500 scale-110' : 'border-gray-400 dark:border-gray-600'}`}
                            style={{ backgroundColor: themes[t].bg }}
                            title={t}
                         />
                     ))}
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}