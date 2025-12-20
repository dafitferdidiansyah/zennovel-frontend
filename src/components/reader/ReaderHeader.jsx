import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';

export default function ReaderHeader({ title, showMenu, setShowMenu, novelId, theme }) {
  return (
    <div 
      className={`fixed top-0 w-full h-14 flex items-center justify-between px-4 shadow-md z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ backgroundColor: theme.ui, borderBottom: `1px solid ${theme.border}` }}
    >
        <Link to={`/novel/${novelId}`} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition z-20">
           <ArrowLeft size={20} style={{ color: theme.text }} />
        </Link>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 w-3/5 text-center">
           <span className="font-bold truncate block text-sm md:text-base opacity-90 cursor-default" style={{ color: theme.text }}>
               {title}
           </span>
        </div>

        <button onClick={() => setShowMenu(false)} className="p-2 text-zen-500 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition z-20">
           <Settings size={20}/>
        </button>
    </div>
  );
}