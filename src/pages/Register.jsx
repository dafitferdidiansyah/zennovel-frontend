import { useState } from 'react';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.register(formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      // Tampilkan error dari backend (misal: username sudah ada)
      const msg = err.response?.data?.username?.[0] || "Registration failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] dark:bg-[#151515] text-[#333] dark:text-[#bbb] p-4 font-sans transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#232323] p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
             <UserPlus className="text-blue-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h2>
          <p className="text-sm text-gray-500">Join ZenNovel community</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1b] focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1b] focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1b] focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-bold">Login Here</Link></p>
        </div>

      </div>
    </div>
  );
}  