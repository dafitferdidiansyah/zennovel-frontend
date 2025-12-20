import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 py-10 mt-auto transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-80">
                <Zap className="text-zen-500 fill-current" size={20} />
                <span className="font-bold text-lg dark:text-white">ZenNovel</span>
            </div>
            
            <div className="text-sm text-gray-500 text-center md:text-right">
                <p>&copy; {new Date().getFullYear()} ZenNovel. All rights reserved.</p>
                <p className="text-xs mt-1">Read anywhere, anytime.</p>
            </div>
        </div>
    </footer>
  );
}