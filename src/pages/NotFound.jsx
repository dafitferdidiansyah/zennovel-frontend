import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F4] dark:bg-[#151515] text-gray-800 dark:text-white transition-colors duration-300">
      <AlertTriangle size={64} className="text-zen-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-8 opacity-70">Page not found</p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-zen-500 hover:bg-zen-600 text-white px-6 py-3 rounded-full font-bold transition transform hover:scale-105"
      >
        <Home size={20} /> Back to Home
      </Link>
    </div>
  );
}