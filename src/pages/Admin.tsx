import React, { useState, useEffect } from 'react';
import { CheckCircle, DollarSign, FileText } from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'topups'>('stories');
  const [pendingStories, setPendingStories] = useState<any[]>([]);
  const [pendingTopups, setPendingTopups] = useState<any[]>([]);

  const fetchPendingStories = async () => {
    const response = await fetch('https://backend.youware.com/api/admin/stories');
    if (response.ok) {
      const data = await response.json();
      setPendingStories(data);
    }
  };

  const fetchPendingTopups = async () => {
    const response = await fetch('https://backend.youware.com/api/admin/topup-requests');
    if (response.ok) {
      const data = await response.json();
      setPendingTopups(data);
    }
  };

  useEffect(() => {
    if (activeTab === 'stories') fetchPendingStories();
    if (activeTab === 'topups') fetchPendingTopups();
  }, [activeTab]);

  const handleApproveStory = async (storyId: number) => {
    const response = await fetch('https://backend.youware.com/api/admin/approve-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId }),
    });
    if (response.ok) {
      alert('Đã duyệt truyện!');
      fetchPendingStories();
    }
  };

  const handleApproveTopup = async (requestId: number) => {
    const response = await fetch('https://backend.youware.com/api/admin/approve-topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    });
    if (response.ok) {
      alert('Đã duyệt nạp tiền!');
      fetchPendingTopups();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Trang Quản trị</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'stories' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Duyệt Truyện
        </button>
        <button 
          onClick={() => setActiveTab('topups')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'topups' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Duyệt Nạp tiền
        </button>
      </div>

      {activeTab === 'stories' && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" /> Truyện chờ duyệt
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {pendingStories.map((story) => (
              <div key={story.id} className="p-4 border-b border-gray-100 last:border-0 flex gap-4">
                <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0">
                  {story.cover_url && <img src={story.cover_url} className="w-full h-full object-cover rounded" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{story.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{story.description}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApproveStory(story.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700"
                    >
                      Duyệt
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingStories.length === 0 && (
              <div className="p-8 text-center text-gray-500">Không có truyện nào chờ duyệt.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'topups' && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" /> Yêu cầu nạp tiền
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {pendingTopups.map((req) => (
              <div key={req.id} className="p-4 border-b border-gray-100 last:border-0 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900">{req.amount.toLocaleString()} xu</div>
                  <div className="text-sm text-gray-500">Mã GD: {req.transaction_code}</div>
                  <div className="text-xs text-gray-400">User ID: {req.user_id}</div>
                </div>
                <button 
                  onClick={() => handleApproveTopup(req.id)}
                  className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700"
                >
                  Xác nhận
                </button>
              </div>
            ))}
            {pendingTopups.length === 0 && (
              <div className="p-8 text-center text-gray-500">Không có yêu cầu nạp tiền nào.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
