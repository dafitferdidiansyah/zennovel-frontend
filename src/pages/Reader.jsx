import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ChevronLeft, ChevronRight, List, ArrowUp, ArrowDown, X  } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import ReaderHeader from '../components/reader/ReaderHeader'; 
import ReaderFooter from '../components/reader/ReaderFooter'; 

export default function Reader() {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chaptersList, setChaptersList] = useState([]); // Daftar semua chapter
  const [showChapterList, setShowChapterList] = useState(false); // Status buka/tutup drawer
  const activeChapterRef = useRef(null); // Agar list otomatis scroll ke chapter saat ini

  // Settings
 const [fontSize, setFontSize] = useState(() => {
      // Ambil dari local storage, kalau tidak ada pakai 18
      return parseInt(localStorage.getItem('reader_fontsize')) || 18;
  });

  // 2. Line Height (Simpan di LocalStorage)
  const [lineHeight, setLineHeight] = useState(() => {
      // Ambil dari local storage, kalau tidak ada pakai 1.8
      return parseFloat(localStorage.getItem('reader_lineheight')) || 1.8;
  });

  // 3. Tema (Simpan di LocalStorage - Kode sebelumnya)
  const [themeMode, setThemeMode] = useState(() => {
      return localStorage.getItem('reader_theme') || 'dark';
  });

  // --- TAMBAHKAN USE EFFECT UNTUK MENYIMPAN PERUBAHAN ---

  // Simpan Font Size setiap kali berubah
  useEffect(() => {
      localStorage.setItem('reader_fontsize', fontSize);
  }, [fontSize]);

  // Simpan Line Height setiap kali berubah
  useEffect(() => {
      localStorage.setItem('reader_lineheight', lineHeight);
  }, [lineHeight]);

  // Simpan Tema setiap kali berubah
  useEffect(() => {
      localStorage.setItem('reader_theme', themeMode);
  }, [themeMode]);

  const themes = {
    light: { bg: '#F4F4F4', text: '#333', ui: '#fff', border: '#e5e7eb' },
    sepia: { bg: '#EAE4D3', text: '#5b4636', ui: '#F4F4E4', border: '#dcc6a0' },
    dark:  { bg: '#232323', text: '#bbb', ui: '#1b1b1b', border: '#333' },
  };
  const currentTheme = themes[themeMode];

  const saveToLocalStorage = (chap) => {
    let history = JSON.parse(localStorage.getItem('reading_history')) || [];
    
    // 1. Hapus riwayat lama novel ini
    history = history.filter(item => item.id !== chap.novel_id);
    
    // 2. Buat object data baru
    // DATA INI DIAMBIL DARI BACKEND YANG SUDAH DIPERBAIKI (ChapterDetailSerializer)
    const newEntry = {
        id: chap.novel_id,
        title: chap.novel_title,     
        cover: chap.novel_cover,     
        chapter_id: chap.id,
        chapter_title: chap.title,
        chapter_order: chap.chapter_number,
        chapter_index: chap.chapter_index, 
        timestamp: new Date().getTime()
    };
    
    // 3. Masukkan ke paling depan
    history.unshift(newEntry);
    
    // 4. Batasi maksimal 10
    if (history.length > 10) history.pop();
    
    // 5. Simpan
    localStorage.setItem('reading_history', JSON.stringify(history));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setChapter(null);
    setShowChapterList(false); // Tutup drawer saat ganti chapter
    
    const token = localStorage.getItem('access_token');
    
    // 1. Ambil Konten Chapter
    const fetchChapter = api.getChapter(chapterId);

    // 2. Ambil Daftar Chapter (Hanya jika belum ada datanya)
    const fetchNovelList = chaptersList.length === 0 ? api.getDetail(novelId) : Promise.resolve(null);

    Promise.all([fetchChapter, fetchNovelList]).then(([chapRes, novelRes]) => {
        const chapData = chapRes.data;
        setChapter(chapData); 
        document.title = chapData.title;

        // Simpan daftar chapter jika baru fetch
        if (novelRes) {
            setChaptersList(novelRes.data.chapters || []);
        }
        saveToLocalStorage(chapData);

        if (token) {
            api.updateProgress(chapData.novel_id, chapterId, token)
               .catch(err => console.error("Gagal sync progress ke server", err));
        }
    }).catch(err => {
    })
    .finally(() => setLoading(false));

  }, [chapterId, novelId]);

  useEffect(() => {
    if (showChapterList && activeChapterRef.current) {
        activeChapterRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showChapterList]);

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
        chapterNumber={chapter.chapter_number}
        showMenu={showMenu} 
        setShowMenu={setShowMenu} 
        novelId={chapter.novel_id} 
        theme={currentTheme} 
      />

      {/* --- MODAL DRAWER DAFTAR CHAPTER --- */}
      {showChapterList && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div 
                className="w-full max-w-md max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
                style={{ backgroundColor: currentTheme.ui, border: `1px solid ${currentTheme.border}` }}
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: currentTheme.border }}>
                    <h3 className="font-bold text-lg">Chapter List</h3>
                    <button onClick={() => setShowChapterList(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                        <X size={24} style={{ color: currentTheme.text }} />
                    </button>
                </div>

                {/* List Chapter */}
                <div className="flex-1 overflow-y-auto p-2">
                    {chaptersList.map((c) => (
                        <button
                            key={c.id}
                            ref={c.id == chapterId ? activeChapterRef : null}
                            onClick={() => navigate(`/read/${novelId}/${c.id}`)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-1 text-sm font-medium transition flex justify-between items-center
                                ${c.id == chapterId 
                                    ? 'bg-zen-500 text-white' 
                                    : 'hover:opacity-70'
                                }`}
                             style={{ color: c.id == chapterId ? '#fff' : currentTheme.text }}>
                        
                            <span className="truncate">
                                {c.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-5 pt-24 pb-40">
              {/* --- 1. TAMBAHKAN JUDUL DISINI (DI ATAS NAVIGASI) --- */}
       <div className="text-center mb-12 animate-fade-in">
           <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight mb-2">
               {/* Logika Tampilan: "Chapter X: Judul" atau Judul saja */}
              {chapter.novel_title}
           </h1>
           {/* Nama Novel (Opsional, biar makin jelas) */}
           <p className="text-sm opacity-60 font-sans font-serif tracking-wider leading-tight">
            {(() => {
                 // Logika Anti-Double "Chapter" & Side Chapter TETAP AMAN
                 if (chapter.chapter_number % 1 !== 0) return chapter.title; 
                 if (chapter.title.toLowerCase().startsWith('chapter')) return chapter.title;
                 return `Chapter ${chapter.chapter_number}: ${chapter.title}`;
             })()}
           </p>
       </div>
       {/* --------------------------------------------------- */}
         {/* NAVIGASI ATAS */}
         <div className="flex items-center gap-3 mb-10">
            <button disabled={!chapter.prev_chapter_id} onClick={() => navigate(`/read/${novelId}/${chapter.prev_chapter_id}`)} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm">
                <ChevronLeft size={18}/> <span className="hidden md:inline">Prev</span>
            </button>
            <button 
                onClick={() => setShowChapterList(true)} 
                className="px-4 py-3 border border-gray-400 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-zen-500 hover:text-white transition shadow-sm"
            >
                <List size={20} />
            </button>
            <button disabled={!chapter.next_chapter_id} onClick={() => navigate(`/read/${novelId}/${chapter.next_chapter_id}`)} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm">
                <span className="hidden md:inline">Next</span> <ChevronRight size={18}/>
            </button>
         </div>

         {/* CONTENT */}
            <h1 className="text-2xl md:text-3xl font-bold text-zen-500 font-serif leading-tight mb-2"
                style={{ 
            // Judul kita set 1.6 kali lebih besar dari font body
            // Misal font body 18px -> Judul jadi 28.8px
            fontSize: `${fontSize * 1.6}px`, 
            lineHeight: 1.2 
    }}
            >

            {(() => {
                 // Logika Anti-Double "Chapter" & Side Chapter TETAP AMAN
                 if (chapter.chapter_number % 1 !== 0) return chapter.title; 
                 if (chapter.title.toLowerCase().startsWith('chapter')) return chapter.title;
                 return `Chapter ${chapter.chapter_number}: ${chapter.title}`;
             })()}
           </h1>
        <div 
          className={`prose max-w-none mb-12 select-none md:select-text cursor-pointer leading-relaxed ${themeMode === 'dark' ? 'prose-invert' : ''}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          dangerouslySetInnerHTML={{ __html: chapter.content }}
          onClick={() => setShowMenu(!showMenu)} 
        />

         {/* NAVIGASI BAWAH */}
         <div className="flex items-center gap-3 mb-10 pt-8 border-t border-dashed border-gray-400 dark:border-gray-700">
            <button disabled={!chapter.prev_chapter_id} onClick={() => { window.scrollTo(0,0); navigate(`/read/${novelId}/${chapter.prev_chapter_id}`); }} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md">
                <ChevronLeft size={18}/> <span className="hidden md:inline">Prev</span>
            </button>
{/* Cari bagian NAVIGASI BAWAH, ganti <Link> icon List dengan ini: */}
            <button 
                onClick={() => setShowChapterList(true)} 
                className="px-4 py-3 border border-gray-400 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-zen-500 hover:text-white transition shadow-md"
            >
                <List size={20} />
            </button>
            <button disabled={!chapter.next_chapter_id} onClick={() => { window.scrollTo(0,0); navigate(`/read/${novelId}/${chapter.next_chapter_id}`); }} 
                    className="flex-1 bg-zen-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-zen-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md">
                <span className="hidden md:inline">Next</span> <ChevronRight size={18}/>
            </button>
         </div>

         <CommentSection chapterId={chapter.id} />
      </div>

{/* SCROLL BUTTON YANG SUDAH DINAMIS */}
      <div className={`fixed bottom-24 right-5 z-40 transition-all duration-500 transform ${showMenu ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-50 hover:opacity-100 hover:translate-y-0'}`}>
          <button 
            onClick={handleScrollAction} 
            className="p-3 backdrop-blur-md border rounded-full shadow-xl transition-all transform hover:scale-110"
            // INI PERUBAHANNYA: Menggunakan warna dari tema aktif
            style={{ 
               backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : currentTheme.ui, // Transparan di dark, solid di light/sepia
               color: currentTheme.text,
               borderColor: currentTheme.border 
            }}
          >
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