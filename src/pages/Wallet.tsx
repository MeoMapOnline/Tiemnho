import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowUpRight, History, CreditCard, Copy, Smartphone } from 'lucide-react';
import momoQr from '../assets/momo-qr.jpeg';

interface UserInfo {
  encrypted_yw_id: string;
}

const Wallet: React.FC = () => {
  const { userInfo } = useOutletContext<{ userInfo: UserInfo | null }>();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'bank' | 'momo'>('momo');

  const fetchBalance = async () => {
    try {
      const response = await fetch('https://backend.youware.com/api/wallet', {
        headers: {
          'X-Encrypted-Yw-ID': userInfo?.encrypted_yw_id || '',
          'X-Is-Login': userInfo ? '1' : '0',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance', error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const handleTopupRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;
    setLoading(true);
    try {
      const response = await fetch('https://backend.youware.com/api/wallet/topup-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Encrypted-Yw-ID': userInfo.encrypted_yw_id,
          'X-Is-Login': '1',
        },
        body: JSON.stringify({ 
          amount: parseInt(amount), 
          transactionCode,
          method: activeTab 
        }),
      });
      
      if (response.ok) {
        alert('Gửi yêu cầu nạp tiền thành công! Vui lòng chờ Admin duyệt.');
        setAmount('');
        setTransactionCode('');
      }
    } catch (error) {
      alert('Lỗi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return <div className="p-8 text-center">Vui lòng đăng nhập để sử dụng Ví.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-6 h-6" />
            <span className="font-medium opacity-90">Số dư hiện tại</span>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Xu</span>
        </div>
        <div className="text-4xl font-bold mb-6">
          {balance.toLocaleString()} <span className="text-2xl opacity-80">xu</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('momo')}
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'momo' ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Smartphone className="w-5 h-5" /> Ví MoMo
          </button>
          <button 
            onClick={() => setActiveTab('bank')}
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'bank' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <CreditCard className="w-5 h-5" /> Ngân hàng
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Payment Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin chuyển khoản</h3>
            
            {activeTab === 'momo' ? (
              <div className="text-center">
                <div className="bg-pink-50 p-4 rounded-xl inline-block mb-4">
                  <img src={momoQr} alt="MoMo QR" className="w-48 h-auto rounded-lg" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-bold text-gray-900">ĐẶNG THỊ THƯƠNG</div>
                  <div className="text-gray-500">Quét mã để thanh toán</div>
                  <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
                    Nội dung: <strong>NAP {userInfo.encrypted_yw_id.substring(0, 6)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 mb-1">Ngân hàng</div>
                  <div className="font-bold text-gray-900">MB Bank (Quân Đội)</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 mb-1">Số tài khoản</div>
                  <div className="font-bold text-gray-900 flex justify-between items-center">
                    0123456789999
                    <button className="text-purple-600 hover:text-purple-700"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 mb-1">Chủ tài khoản</div>
                  <div className="font-bold text-gray-900">YOUWARE COMPANY</div>
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-xs">
                  Nội dung CK: <strong>NAP {userInfo.encrypted_yw_id.substring(0, 6)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Form */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-green-600" /> Xác nhận nạp
            </h3>
            <form onSubmit={handleTopupRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền đã chuyển</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Ví dụ: 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  value={transactionCode}
                  onChange={e => setTransactionCode(e.target.value)}
                  placeholder="Nhập mã giao dịch từ App"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-bold rounded-lg transition-colors disabled:bg-gray-300 ${
                  activeTab === 'momo' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Đang gửi...' : 'Gửi yêu cầu nạp tiền'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" /> Lịch sử giao dịch
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center text-gray-500 text-sm">
          Chưa có giao dịch nào gần đây.
        </div>
      </div>
    </div>
  );
};

export default Wallet;
