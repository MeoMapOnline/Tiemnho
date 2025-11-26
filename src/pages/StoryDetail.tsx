import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { Lock, Unlock, Eye, Clock, Plus, Bookmark } from 'lucide-react';

interface UserInfo {
  encrypted_yw_id: string;
}

const StoryDetail: React.FC = () => {
  const { id } = useParams();
  const { userInfo } = useOutletContext<{ userInfo: UserInfo | null }>();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLibrary, setIsLibrary] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: '', content: '', price: 0, is_vip: false });

  const fetchStory = async () => {
    const headers: any = {};
    if (userInfo) {
      headers['X-Encrypted-Yw-ID'] = userInfo.encrypted_yw_id;
      headers['X-Is-Login'] = '1';
    }

    const response = await fetch(`https://backend.youware.com/api/stories/${id}`, { headers });
    if (response.ok) {
      const data = await response.json();
      setStory(data.story);
      setChapters(data.chapters);
      setIsLibrary(data.is_library);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [id, userInfo]);

  const handleToggleLibrary = async () => {
    if (!userInfo) return alert('Vui lòng đăng nhập');
    const response = await fetch('https://backend.youware.com/api/library/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Encrypted-Yw-ID': userInfo.encrypted_yw_id,
        'X-Is-Login': '1',
      },
      body: JSON.stringify({ storyId: parseInt(id!) }),
    });
    if (response.ok) {
      const data = await response.json();
      setIsLibrary(data.in_library);
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;

    const response = await fetch(`https://backend.youware.com/api/stories/${id}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Encrypted-Yw-ID': userInfo.encrypted_yw_id,
        'X-Is-Login': '1',
      },
      body: JSON.stringify(newChapter),
    });

    if (response.ok) {
      setShowAddChapter(false);
      setNewChapter({ title: '', content: '', price: 0, is_vip: false });
      fetchStory();
      alert('Thêm chương thành công!');
    }
  };

  const handleUnlock = async (chapterId: number, price: number) => {
    if (!userInfo) {
      alert('Vui lòng đăng nhập để mở khóa.');
      return;
    }
    if (!confirm(`Bạn có muốn mở khóa chương này với giá ${price} xu?`)) return;

    const response = await fetch('https://backend.youware.com/api/unlock-chapter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Encrypted-Yw-ID': userInfo.encrypted_yw_id,
        'X-Is-Login': '1',
      },
      body: JSON.stringify({ chapterId }),
    });

    if (response.ok) {
      alert('Mở khóa thành công!');
      fetchStory();
    } else {
      const result = await response.json();
      alert(result.error || 'Mở khóa thất bại. Kiểm tra số dư ví.');
    }
  };

  if (!story) return <div className="p-8 text-center">Đang tải...</div>;

  const isAuthor = userInfo && story.author_id === userInfo.encrypted_yw_id;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Story Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-48 aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-md">
          {story.cover_url ? (
            <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {story.views || 0} lượt xem</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 2 giờ trước</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              story.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {story.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{story.description}</p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleToggleLibrary}
              className={`px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                isLibrary ? 'bg-gray-100 text-gray-700' : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isLibrary ? "currentColor" : "none"} />
              {isLibrary ? 'Đã lưu' : 'Lưu vào tủ'}
            </button>

            {isAuthor && (
              <button 
                onClick={() => setShowAddChapter(true)}
                className="bg-purple-50 text-purple-700 px-6 py-2.5 rounded-lg font-bold hover:bg-purple-100 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Thêm chương
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách chương</h2>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="p-4 border-b border-gray-100 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-700">
              {chapter.title}
              {chapter.is_vip === 1 && (
                <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">VIP</span>
              )}
            </div>
            
            <div>
              {chapter.is_unlocked ? (
                <Link 
                  to={`/read/${id}/${chapter.id}`}
                  className="text-green-600 text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  <Unlock className="w-4 h-4" /> Đọc ngay
                </Link>
              ) : (
                <button 
                  onClick={() => handleUnlock(chapter.id, chapter.price)}
                  className="flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-purple-100"
                >
                  <Lock className="w-3 h-3" /> {chapter.price} xu
                </button>
              )}
            </div>
          </div>
        ))}
        {chapters.length === 0 && (
          <div className="p-8 text-center text-gray-500">Chưa có chương nào.</div>
        )}
      </div>

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Thêm chương mới</h2>
            <form onSubmit={handleAddChapter}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={newChapter.title}
                    onChange={e => setNewChapter({...newChapter, title: e.target.value})}
                    placeholder="Chương 1: Khởi đầu"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (xu)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={newChapter.price}
                      onChange={e => setNewChapter({...newChapter, price: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        checked={newChapter.is_vip}
                        onChange={e => setNewChapter({...newChapter, is_vip: e.target.checked})}
                      />
                      <span className="text-sm font-medium text-gray-700">Chương VIP</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea 
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-64 font-mono text-sm"
                    value={newChapter.content}
                    onChange={e => setNewChapter({...newChapter, content: e.target.value})}
                    placeholder="Nội dung chương..."
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                >
                  Đăng chương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
