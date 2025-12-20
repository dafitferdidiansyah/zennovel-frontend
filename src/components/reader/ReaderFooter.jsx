export default function ReaderFooter({ showMenu, fontSize, setFontSize, lineHeight, setLineHeight, themeMode, setTheme, theme }) {
  return (
    <div 
      className={`fixed bottom-0 w-full p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] z-50 transition-transform duration-300 ${showMenu ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ backgroundColor: theme.ui, borderTop: `1px solid ${theme.border}` }}
    >
       <div className="max-w-3xl mx-auto space-y-5">
           <div className="flex justify-between items-center gap-4">
               {/* Font Control */}
               <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 p-1.5 rounded-lg border border-black/10 dark:border-white/10">
                   <button onClick={() => setFontSize(s=>Math.max(14,s-2))} className="w-10 h-8 font-bold hover:text-zen-500" style={{ color: theme.text }}>-</button>
                   <span className="w-8 text-center text-sm font-mono opacity-80" style={{ color: theme.text }}>{fontSize}</span>
                   <button onClick={() => setFontSize(s=>Math.min(32,s+2))} className="w-10 h-8 font-bold hover:text-zen-500" style={{ color: theme.text }}>+</button>
               </div>

               {/* Line Height */}
               <select 
                  value={lineHeight} 
                  onChange={(e) => setLineHeight(e.target.value)} 
                  className="bg-black/5 dark:bg-white/10 py-2 px-4 rounded-lg border border-black/10 dark:border-white/10 outline-none focus:border-zen-500 text-sm"
                  style={{ color: theme.text }}
               >
                 <option value="1.4" style={{ color: 'black' }}>Compact</option>
                  <option value="1.8" style={{ color: 'black' }}>Comfortable</option>
                  <option value="2.2" style={{ color: 'black' }}>Loose</option>
               </select>
           </div>

           {/* Theme Control */}
           <div className="flex gap-3">
               {['light', 'sepia', 'dark'].map(t => (
                   <button 
                      key={t} 
                      onClick={() => setTheme(t)} 
                      className={`flex-1 py-2.5 rounded-lg capitalize text-sm font-bold border-2 transition-all ${themeMode===t ? 'border-zen-500 text-zen-500 bg-zen-500/5' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      style={{ color: themeMode===t ? '' : theme.text, borderColor: themeMode===t ? '' : 'rgba(128,128,128,0.2)' }}
                   >
                      {t}
                   </button>
               ))}
           </div>
       </div>
    </div>
  );
}