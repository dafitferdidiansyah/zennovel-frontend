import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ChevronLeft, ChevronRight, List, ArrowUp, ArrowDown } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import ReaderHeader from '../components/reader/ReaderHeader'; // Import Baru
import ReaderFooter from '../components/reader/ReaderFooter'; // Import Baru

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Settings
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [themeMode, setThemeMode] = useState('dark');

  const themes = {
    light: { bg: '#F4F4F4', text: '#333', ui: '#fff', border: '#e5e7eb' },
    sepia: { bg: '#EAE4D3', text: '#5b4636', ui: '#F4F4E4', border: '#dcc6a0' },
    dark:  { bg: '#232323', text: '#bbb', ui: '#1b1b1b', border: '#333' },
  };
  const currentTheme = themes[themeMode];

  useEffect(() => {
    setLoading(true); setChapter(null); window.scrollTo(0, 0);
    api.getChapter(id).then(res => { setChapter(res.data); document.title = res.data.title; })
       .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollAction = () => window.scrollTo({ top: showScrollTop ? 0 : document.body.scrollHeight, behavior: 'smooth' });

  if (loading) return <div className="min-h-screen bg-[#232323] flex items-center justify-center text-gray-500">Loading...</div>;
  if (!chapter) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans relative selection:bg-zen-500 selection:text-white"
         style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      
      {/* --- HEADER --- */}
      <ReaderHeader 
        title={chapter.title} 
        showMenu={showMenu} 
        setShowMenu={setShowMenu} 
        novelId={chapter.novel_id} 
        theme={currentTheme} 
      />

      <div className="max-w-3xl mx-auto px-5 pt-24 pb-40">
         {/* NAVIGASI ATAS */}
         <div className="flex items-center gap-3 mb-10">
            <button disabled={!chapter.prev_chapter_id} onClick={() => navigate(`/read/${chapter.prev_chapter_id}`)} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm">
                <ChevronLeft size={18}/> <span>Prev</span>
            </button>
            <Link to={`/novel/${chapter.novel_id}`} className="px-4 py-3 border border-gray-400 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-zen-500 hover:text-white transition shadow-sm">
                <List size={20} />
            </Link>
            <button disabled={!chapter.next_chapter_id} onClick={() => navigate(`/read/${chapter.next_chapter_id}`)} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm">
                <span>Next</span> <ChevronRight size={18}/>
            </button>
         </div>

         {/* CONTENT */}
         <div className="prose dark:prose-invert max-w-none mb-12 select-none md:select-text cursor-pointer leading-relaxed"
              style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
              dangerouslySetInnerHTML={{ __html: chapter.content }}
              onClick={() => setShowMenu(!showMenu)} />

         {/* NAVIGASI BAWAH */}
         <div className="flex items-center gap-3 mb-10 pt-8 border-t border-dashed border-gray-400 dark:border-gray-700">
            <button disabled={!chapter.prev_chapter_id} onClick={() => { window.scrollTo(0,0); navigate(`/read/${chapter.prev_chapter_id}`); }} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md">
                <ChevronLeft size={18}/> <span>Prev</span>
            </button>
            <Link to={`/novel/${chapter.novel_id}`} className="px-4 py-3 border border-gray-400 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-zen-500 hover:text-white transition shadow-md">
                <List size={20} />
            </Link>
            <button disabled={!chapter.next_chapter_id} onClick={() => { window.scrollTo(0,0); navigate(`/read/${chapter.next_chapter_id}`); }} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md">
                <span>Next</span> <ChevronRight size={18}/>
            </button>
         </div>

         <CommentSection chapterId={chapter.id} />
      </div>

      {/* SCROLL BUTTON */}
      <div className={`fixed bottom-24 right-5 z-40 transition-all duration-500 transform ${showMenu ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-50 hover:opacity-100 hover:translate-y-0'}`}>
          <button onClick={handleScrollAction} className="p-3 bg-gray-800/80 dark:bg-white/10 backdrop-blur-md text-white border border-gray-700 dark:border-gray-500 rounded-full shadow-xl hover:bg-zen-500 hover:border-zen-500 transition-all transform hover:scale-110">
            {showScrollTop ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
          </button>
      </div>

      {/* --- FOOTER SETTINGS --- */}
      <ReaderFooter 
        showMenu={showMenu} 
        fontSize={fontSize} setFontSize={setFontSize}
        lineHeight={lineHeight} setLineHeight={setLineHeight}
        themeMode={themeMode} setTheme={setThemeMode}
        theme={currentTheme}
      />
    </div>
  );
}