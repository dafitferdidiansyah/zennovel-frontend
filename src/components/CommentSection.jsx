import { useState, useEffect } from 'react';
import { api } from '../api';
import { User, MessageSquare, Send, Trash2, ThumbsUp, CornerDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommentSection({ chapterId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cek Login dari Token
  const token = localStorage.getItem('access_token');
  // Decode username dari token (opsional, atau ambil dari profile API) - Di sini kita pakai logika sederhana
  const isLoggedIn = !!token;

  // 1. Fetch Comments saat component dimuat
  const fetchComments = () => {
    api.getComments(chapterId)
       .then(res => setComments(res.data))
       .catch(err => console.error("Gagal ambil komentar", err));
  };

  useEffect(() => {
    if(chapterId) fetchComments();
  }, [chapterId]);

  // 2. Handle Post Comment
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isLoggedIn) return navigate('/login');

    setLoading(true);
    try {
      await api.postComment(chapterId, newComment, token);
      setNewComment(''); // Kosongkan input
      fetchComments();   // Refresh list komentar otomatis
    } catch (err) {
      alert("Gagal mengirim komentar. Pastikan Anda login.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Delete (Opsional)
  const handleDelete = async (commentId) => {
    if(!confirm("Hapus komentar ini?")) return;
    try {
        await api.deleteComment(commentId, token);
        fetchComments();
    } catch (err) {
        alert("Gagal menghapus.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-8">
      
      {/* HEADER ALA NOVELBIN */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-600 pb-3">
        <MessageSquare size={20} className="text-zen-500" />
        <h3 className="font-bold text-lg text-gray-800 dark:text-white uppercase">
            Comments <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h3>
      </div>

      {/* INPUT BOX */}
      <div className="mb-8">
        {!isLoggedIn ? (
            <div className="bg-gray-100 dark:bg-[#1b1b1b] p-4 rounded text-center text-sm text-gray-500">
                Please <span onClick={() => navigate('/login')} className="text-zen-500 cursor-pointer font-bold hover:underline">Login</span> to post a comment.
            </div>
        ) : (
            <form onSubmit={handlePost}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-4 rounded-md bg-gray-50 dark:bg-[#1b1b1b] border border-gray-300 dark:border-gray-600 focus:border-zen-500 focus:ring-1 focus:ring-zen-500 outline-none transition text-sm text-gray-800 dark:text-gray-200"
                    placeholder="Leave a comment..."
                    rows="3"
                ></textarea>
                <div className="flex justify-end mt-2">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-zen-500 hover:bg-zen-600 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : <><Send size={14} /> Post Comment</>}
                    </button>
                </div>
            </form>
        )}
      </div>

      {/* COMMENT LIST */}
      <div className="space-y-6">
        {comments.length === 0 ? (
            <p className="text-center text-gray-400 italic text-sm">No comments yet. Be the first!</p>
        ) : (
            comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                    {/* AVATAR */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-zen-500 transition">
                            <User size={20} className="text-white" />
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                {comment.username}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                            {comment.text}
                        </p>

                        {/* ACTION BUTTONS (Like/Reply - Mockup Visual) */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                            <button className="flex items-center gap-1 hover:text-zen-500 transition">
                                <ThumbsUp size={12} /> Like
                            </button>
                            <button className="flex items-center gap-1 hover:text-zen-500 transition">
                                <CornerDownRight size={12} /> Reply
                            </button>
                            {/* Tombol Hapus (Logic kasar: kalau token ada, tampilkan. Idealnya cek ID user) */}
                            {isLoggedIn && (
                                <button onClick={() => handleDelete(comment.id)} className="flex items-center gap-1 hover:text-red-500 transition ml-auto opacity-0 group-hover:opacity-100">
                                    <Trash2 size={12} /> Delete
                                </button>
                            )}
                        </div>
                        <div className="border-b border-gray-100 dark:border-gray-700/50 mt-4"></div>
                    </div>
                </div>
            ))
        )}
      </div>

    </div>
  );
}