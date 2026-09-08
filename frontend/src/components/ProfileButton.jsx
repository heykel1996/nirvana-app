import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.full_name || user.username || 'User';
  const userRole = user.role || 'Engineer';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout berhasil!');
    navigate('/login');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (resetData.new_password !== resetData.confirm_password) {
      toast.error('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    if (resetData.new_password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    setResetLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          old_password: resetData.old_password,
          new_password: resetData.new_password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        toast.success('Password berhasil direset!');
        setShowResetModal(false);
        setResetData({ old_password: '', new_password: '', confirm_password: '' });
        setIsOpen(false);
      } else {
        toast.error(response.data?.message || 'Gagal reset password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      {/* Floating Profile Button - Kanan Bawah */}
      <div className="fixed bottom-6 right-6 z-40" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
          aria-label="Profile"
        >
          {userName.charAt(0).toUpperCase()}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
            {/* Profile Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{userName}</p>
                  <p className="text-xs text-gray-500">@{user.username || 'user'}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setShowResetModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span>🔑</span>
                <span>Reset Password</span>
              </button>
              <button
                onClick={() => {
                  toast.info('Fitur settings segera hadir');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span>⚙️</span>
                <span>Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">🔑 Reset Password</h3>
              <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                <input
                  type="password"
                  value={resetData.old_password}
                  onChange={(e) => setResetData({ ...resetData, old_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={resetData.new_password}
                  onChange={(e) => setResetData({ ...resetData, new_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <input
                  type="password"
                  value={resetData.confirm_password}
                  onChange={(e) => setResetData({ ...resetData, confirm_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {resetLoading ? 'Memproses...' : 'Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileButton;