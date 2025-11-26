import React from 'react';
import { Link } from 'react-router-dom';

const BecomeAuthorBanner: React.FC = () => {
  return (
    <div className="bg-[#7C3AED] text-white p-6 rounded-2xl shadow-lg mx-4 mb-8 relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-2">Trở thành Tác giả?</h3>
        <p className="text-white/90 text-sm mb-4 max-w-[80%]">
          Đăng tải truyện của bạn ngay hôm nay.
        </p>
        <Link 
          to="/author/register"
          className="inline-block w-full text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Gửi yêu cầu
        </Link>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl" />
    </div>
  );
};

export default BecomeAuthorBanner;
