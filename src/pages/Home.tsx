import React from 'react';
import { Link } from 'react-router-dom';
import BecomeAuthorBanner from '../components/BecomeAuthorBanner';

const Home: React.FC = () => {
  return (
    <div className="max-w-md mx-auto pt-6">
      {/* Hero Section */}
      <div className="px-4 mb-8">
        <div className="relative rounded-2xl overflow-hidden aspect-[2/1] shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" 
            alt="Featured Story" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
            <h2 className="text-white text-xl font-bold mb-1">Truyện Nhỏ</h2>
            <p className="text-white/80 text-sm">Tuyển tập truyện ngắn đặc sắc đang chờ bạn khám phá.</p>
          </div>
        </div>
      </div>

      {/* Featured List */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-900">Gợi ý</h3>
          <Link to="/genres" className="text-sm text-gray-500 hover:text-gray-900">Xem tất cả</Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Story Card 1 */}
          <Link to="/story/1" className="group">
            <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop" 
                alt="Book Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 mb-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">Huyền Huyễn</span>
              </div>
              <h4 className="font-bold text-gray-900 line-clamp-2 text-sm">Thiên Đạo Đồ Thư Quán</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>👁 150.000</span>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">Full</span>
              </div>
            </div>
          </Link>

          {/* Story Card 2 */}
          <Link to="/story/2" className="group">
            <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop" 
                alt="Book Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Tiên Hiệp</span>
              </div>
              <h4 className="font-bold text-gray-900 line-clamp-2 text-sm">Phàm Nhân Tu Tiên</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>👁 230.000</span>
                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px]">Đang ra</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Become Author Banner */}
      <BecomeAuthorBanner />

      {/* New Updates */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-900">Mới cập nhật</h3>
          <Link to="/latest" className="text-sm text-gray-500 hover:text-gray-900">Xem tất cả</Link>
        </div>
        {/* List items would go here */}
      </div>
    </div>
  );
};

export default Home;
