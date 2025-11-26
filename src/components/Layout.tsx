import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, LogIn } from 'lucide-react';
import Navigation from './Navigation';

interface UserInfo {
  encrypted_yw_id: string;
  photo_url?: string;
  display_name?: string;
}

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info from Youware Backend
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://backend.youware.com/__user_info__');
        const result = await response.json();
        if (result.code === 0) {
          setUserInfo(result.data);
          fetchNotifications(result.data.encrypted_yw_id);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const response = await fetch('https://backend.youware.com/api/notifications', {
        headers: { 'X-Encrypted-Yw-ID': userId, 'X-Is-Login': '1' }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Link to="/" className="text-xl font-bold text-gray-900">
            TruyệnNhỏ
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/search')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 font-bold text-gray-900">Thông báo</div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                        <div className="font-medium text-sm text-gray-900">{n.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{n.message}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">Không có thông báo mới</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User/Login Button in Header */}
          {userInfo?.display_name ? (
            <Link to="/profile" className="p-1 ml-1">
              {userInfo.photo_url ? (
                <img src={userInfo.photo_url} alt={userInfo.display_name} className="w-8 h-8 rounded-full border border-gray-200" />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="ml-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <Outlet context={{ userInfo }} />
      </main>

      {/* Navigation Sidebar */}
      <Navigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        userInfo={userInfo}
      />
    </div>
  );
};

export default Layout;
