import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.full_name || user.username || 'User';
  const userRole = user.role || 'Engineer';
  const userDepartment = user.department || 'MEP';

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
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Gagal reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      {/* Profile Button di Header */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition shadow-sm"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* Profile Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">@{user.username || 'user'}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span></span>
                  <span>{userDepartment} Department</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👤</span>
                  <span>{userRole}</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
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
                  toast.info('Fitur profile akan segera hadir');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span>⚙️</span>
                <span>Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200 pt-2">
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">🔑 Reset Password</h3>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
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
                <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={resetData.confirm_password}
                  onChange={(e) => setResetData({ ...resetData, confirm_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {resetLoading ? 'Memproses...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;