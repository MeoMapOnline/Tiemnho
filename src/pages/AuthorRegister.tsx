import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface UserInfo {
  encrypted_yw_id: string;
  photo_url?: string;
  display_name?: string;
}

const AuthorRegister: React.FC = () => {
  const { userInfo } = useOutletContext<{ userInfo: UserInfo | null }>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo?.encrypted_yw_id) {
      setMessage('Vui lòng đăng nhập để gửi yêu cầu.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('https://backend.youware.com/api/author-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Tôi muốn trở thành tác giả để chia sẻ những câu chuyện của mình.',
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage('Yêu cầu đã được gửi thành công! Chúng tôi sẽ xem xét sớm.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Lỗi kết nối. Vui lòng kiểm tra mạng.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Đăng ký trở thành Tác giả</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tài khoản của bạn</label>
          {userInfo?.display_name ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {userInfo.photo_url && (
                <img src={userInfo.photo_url} alt="Avatar" className="w-10 h-10 rounded-full" />
              )}
              <div>
                <div className="font-medium text-gray-900">{userInfo.display_name}</div>
                <div className="text-xs text-gray-500">ID: {userInfo.encrypted_yw_id.substring(0, 8)}...</div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
              Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.
            </div>
          )}
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gửi yêu cầu thành công!</h3>
            <p className="text-gray-500 mb-6">{message}</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do đăng ký</label>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all min-h-[120px]"
                placeholder="Hãy chia sẻ một chút về bản thân và lý do bạn muốn trở thành tác giả..."
                defaultValue="Tôi muốn trở thành tác giả để chia sẻ những câu chuyện của mình."
              ></textarea>
            </div>

            {message && status === 'error' && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {message}
              </div>
            )}

            <button 
              type="submit"
              disabled={status === 'loading' || !userInfo?.encrypted_yw_id}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                status === 'loading' || !userInfo?.encrypted_yw_id
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200'
              }`}
            >
              {status === 'loading' ? 'Đang xử lý...' : 'Gửi yêu cầu đăng ký'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthorRegister;
