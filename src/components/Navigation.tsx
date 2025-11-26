import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Library, History, List, LogIn, User, X } from 'lucide-react';

interface UserInfo {
  encrypted_yw_id: string;
  photo_url?: string;
  display_name?: string;
}

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo | null;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, userInfo }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative w-80 max-w-[80%] bg-white h-full shadow-xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <Link 
            to="/library" 
            className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onClose}
          >
            <Library className="w-5 h-5" />
            <span className="font-medium">Thư Viện</span>
          </Link>

          <Link 
            to="/history" 
            className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onClose}
          >
            <History className="w-5 h-5" />
            <span className="font-medium">Lịch Sử Đọc</span>
          </Link>

          <Link 
            to="/genres" 
            className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onClose}
          >
            <List className="w-5 h-5" />
            <span className="font-medium">Thể Loại</span>
          </Link>

          <Link 
            to="/wallet" 
            className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            <span className="font-medium">Ví của tôi</span>
          </Link>

          <Link 
            to="/author/register" 
            className="flex items-center gap-4 px-4 py-3 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            <span className="font-medium">Đăng ký Tác giả</span>
          </Link>

          <div className="my-4 border-t border-gray-100" />

          {userInfo?.display_name ? (
            <Link 
              to="/profile" 
              className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              {userInfo.photo_url ? (
                <img src={userInfo.photo_url} alt={userInfo.display_name} className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="font-medium">{userInfo.display_name}</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Đăng nhập / Đăng ký</span>
            </Link>
          )}
        </nav>

        <div className="mt-auto">
           {/* Footer or additional links */}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
