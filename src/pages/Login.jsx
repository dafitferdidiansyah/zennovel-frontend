import { useState } from 'react';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Login ke API
      const res = await api.login({ username, password });
      const token = res.data.access;

      // 2. Simpan token & user data
      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', res.data.refresh);
      
      const userData = {
        username: username,
        name: username 
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // --- LOGIKA SINKRONISASI HISTORY (BARU) ---
      try {
          // A. Ambil history local (tamu)
          const localHistory = JSON.parse(localStorage.getItem('reading_history')) || [];

          // B. Push history local ke server (Upload progress tamu ke akun)
          // Kita pakai Promise.all agar prosesnya paralel dan cepat
          if (localHistory.length > 0) {
              await Promise.all(localHistory.map(item => 
                  api.updateProgress(item.id, item.chapter_id, token)
                     .catch(err => console.error(`Gagal sync novel ${item.title}`, err))
              ));
          }

          // C. Pull history terbaru dari server (Download progress gabungan)
          const serverHistoryRes = await api.getHistory(token);
          
          // D. Format data dari server agar sesuai format LocalStorage Frontend
          // Pastikan field-nya cocok dengan yang dipakai di Reader.jsx/Detail.jsx
          const mergedHistory = serverHistoryRes.data.map(h => ({
              id: h.id,
              title: h.title,
              cover: h.cover, // Pastikan backend kirim full URL atau path
              chapter_id: h.current_chapter_id,
              chapter_title: h.current_chapter_title,
              chapter_order: h.current_chapter_number,
              timestamp: new Date(h.last_read_at).getTime()
          }));

          // E. Timpa LocalStorage dengan data fresh dari server
          localStorage.setItem('reading_history', JSON.stringify(mergedHistory));

      } catch (syncErr) {
          console.error("Sinkronisasi gagal, tapi login berhasil:", syncErr);
          // Tetap lanjut login walaupun sync error (jangan halangi user masuk)
      }
      // ------------------------------------------

      // 3. Redirect ke Home (Reload agar state aplikasi segar)
      window.location.href = '/'; 

    } catch (err) {
      console.error(err);
      setError('Username atau Password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] p-4 font-sans transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#232323] p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
             <Zap className="text-zen-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-gray-500">Login to continue reading</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1b] focus:outline-none focus:border-zen-500 transition"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1b] focus:outline-none focus:border-zen-500 transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zen-500 hover:bg-zen-600 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>Don't have an account? <Link to="/register" className="text-zen-500 hover:underline font-bold">Sign Up</Link></p>
          <p className="mt-2"><Link to="/" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back to Home</Link></p>
        </div>

      </div>
    </div>
  );
}