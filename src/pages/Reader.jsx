import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Settings, Type, Moon, Sun, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Reader() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [showMenu, setShowMenu] = useState(true);
  
  // --- STATE SETTINGAN (Ala IReader) ---
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState('dark'); // 'light', 'sepia', 'dark'

  useEffect(() => {
    setChapter(null); // Reset saat ganti chapter
    window.scrollTo(0, 0);
    api.getChapter(id).then(res => setChapter(res.data));
  }, [id]);

  // Definisi Warna Tema (Gabungan ZenNovel + IReader)
  const themes = {
    light: { bg: '#ffffff', text: '#1a1a1a', ui: '#f3f4f6', border: '#e5e7eb' },
    sepia: { bg: '#f4ecd8', text: '#5b4636', ui: '#eaddc5', border: '#dcc6a0' },
    dark:  { bg: '#1a1a1a', text: '#d1d5db', ui: '#252525', border: '#333333' }, // Zen Default
    amoled:{ bg: '#000000', text: '#9ca3af', ui: '#111111', border: '#333333' }
  };
  
  const currentTheme = themes[theme];

  if (!chapter) return <div className="flex h-screen items-center justify-center">Loading Chapter...</div>;

  return (
    <div 
      className="min-h-screen transition-colors duration-300 relative font-serif"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      
      {/* 1. TOP BAR (Navigasi) - Muncul saat diklik */}
      <div 
        className={`fixed top-0 w-full p-4 flex items-center gap-4 transition-transform duration-300 z-50 border-b backdrop-blur-md`}
        style={{ 
          transform: showMenu ? 'translateY(0)' : 'translateY(-100%)',
          backgroundColor: currentTheme.ui + 'ee', // transparan dikit
          borderColor: currentTheme.border
        }}
      >
         <Link to="/" className="p-2 rounded-full hover:bg-black/10">
            <ArrowLeft size={22} />
         </Link>
         <div className="flex-1 min-w-0">
           <h1 className="font-sans text-sm font-bold truncate">{chapter.title}</h1>
           <p className="font-sans text-xs opacity-70 truncate">ZenNovel Reader</p>
         </div>
         <button onClick={() => setShowMenu(false)}>
            <Settings size={22} className="text-zen-500" />
         </button>
      </div>

      {/* 2. KANVAS BACA (Area Sentuh) */}
      <div 
        className="max-w-2xl mx-auto px-6 py-24 min-h-screen cursor-pointer"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div 
          className="content-body"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          dangerouslySetInnerHTML={{ __html: chapter.content }} 
        />
      </div>

      {/* 3. SETTINGS MENU (Ala IReader Bottom Sheet) */}
      <div 
        className={`fixed bottom-0 w-full p-6 pb-8 rounded-t-2xl shadow-2xl transition-transform duration-300 z-50`}
        style={{ 
          transform: showMenu ? 'translateY(0)' : 'translateY(100%)',
          backgroundColor: currentTheme.ui,
          borderTop: `1px solid ${currentTheme.border}`
        }}
      >
        {/* Navigasi Next/Prev Cepat */}
        <div className="flex justify-between mb-6 gap-4 font-sans">
            <button className="flex-1 py-3 bg-black/5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zen-500 hover:text-black transition-colors disabled:opacity-30">
                <ChevronLeft size={18}/> Prev
            </button>
            <button className="flex-1 py-3 bg-zen-500 text-black rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zen-600 transition-colors">
                Next <ChevronRight size={18}/>
            </button>
        </div>

        {/* Pengaturan Tampilan */}
        <div className="space-y-5 font-sans">
            
            {/* Ukuran Font */}
            <div className="flex items-center justify-between">
                <Type size={18} className="opacity-70" />
                <div className="flex items-center gap-4 bg-black/10 rounded-full px-2 py-1">
                    <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="w-10 h-10 rounded-full hover:bg-white/20 font-bold text-sm">A-</button>
                    <span className="w-8 text-center font-mono">{fontSize}</span>
                    <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="w-10 h-10 rounded-full hover:bg-white/20 font-bold text-lg">A+</button>
                </div>
            </div>

            {/* Tema Warna */}
            <div className="flex justify-between gap-2 bg-black/10 p-1 rounded-xl">
                {['light', 'sepia', 'dark', 'amoled'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${theme === t ? 'ring-2 ring-zen-500 scale-105 shadow-md' : 'opacity-60'}`}
                        style={{ 
                            backgroundColor: themes[t].bg, 
                            color: themes[t].text,
                            border: `1px solid ${themes[t].border}` 
                        }}
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