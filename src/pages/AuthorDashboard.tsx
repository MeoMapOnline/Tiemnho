import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Plus, BookOpen, Lock, DollarSign } from 'lucide-react';

interface UserInfo {
  encrypted_yw_id: string;
}

const AuthorDashboard: React.FC = () => {
  const { userInfo } = useOutletContext<{ userInfo: UserInfo | null }>();
  const [stories, setStories] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '', cover_url: '' });

  const fetchStories = async () => {
    if (!userInfo) return;
    const response = await fetch('https://backend.youware.com/api/my-stories', {
      headers: {
        'X-Encrypted-Yw-ID': userInfo.encrypted_yw_id,
        'X-Is-Login': '1',
      }
    });
    if (response.ok) {
      const data = await response.json();
      setStories(data);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [userInfo]);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;

    const response = await fetch('https://backend.youware.com/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Encrypted-Yw-ID': userInfo.encrypted_yw_id,
        'X-Is-Login': '1',
      },
      body: JSON.stringify(newStory),
    });

    if (response.ok) {
      setShowCreateModal(false);
      setNewStory({ title: '', description: '', cover_url: '' });
      fetchStories();
      alert('Đăng truyện thành công! Chờ duyệt.');
    }
  };

  if (!userInfo) return <div>Vui lòng đăng nhập.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Truyện</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" /> Đăng truyện mới
        </button>
      </div>

      <div className="grid gap-4">
        {stories.map((story) => (
          <div key={story.id} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4">
            <div className="w-20 h-28 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {story.cover_url ? (
                <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900">{story.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  story.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {story.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                </span>
              </div>
              <p className="text-gray-500 text-sm line-clamp-2 mt-1">{story.description}</p>
              
              <div className="mt-4 flex gap-2">
                <Link 
                  to={`/story/${story.id}`} 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Xem chi tiết
                </Link>
                <button className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Thêm chương
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {stories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            Bạn chưa đăng truyện nào.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Đăng truyện mới</h2>
            <form onSubmit={handleCreateStory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên truyện</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={newStory.title}
                    onChange={e => setNewStory({...newStory, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea 
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                    value={newStory.description}
                    onChange={e => setNewStory({...newStory, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh bìa (URL)</label>
                  <input 
                    type="url" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={newStory.cover_url}
                    onChange={e => setNewStory({...newStory, cover_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                >
                  Đăng truyện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
