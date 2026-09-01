import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/lvmdp', label: 'LVMDP', icon: '⚡', subtitle: 'Panel Tegangan Rendah' },
    { path: '/stp', label: 'STP', icon: '🌊', subtitle: 'Sewage Treatment Plant' },
    { path: '/water-level', label: 'Water Log', icon: '💧', subtitle: 'Water Log Sheet' },
    { path: '/genset-log', label: 'Genset Log', icon: '⚙️', subtitle: 'Log Sheet Genset' },
    { path: '/elektrikal', label: 'Electrical Log', icon: '🔌', subtitle: 'Electrical Log Sheet' },
    { path: '/check-sheets', label: 'Check Sheets', icon: '📋', subtitle: 'Building Equipment' },
    { path: '/photo-documentation', label: 'Photo Docs', icon: '📷', subtitle: 'Photo Documentation' },
    { path: '/shift-handover', label: 'Shift Handover', icon: '🔄', subtitle: 'Serah Terima Shift' },
    { path: '/reports', label: 'Reports', icon: '📊', subtitle: 'Laporan' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-2xl z-50`}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.9"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">NIRVANA</h1>
              <p className="text-xs text-blue-300">MEP Engineering</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user.username && (
        <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
          <p className="text-sm font-medium text-white">{user.full_name || user.username}</p>
          <p className="text-xs text-slate-400 capitalize">{user.role}</p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    {item.subtitle && (
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                    )}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors text-sm"
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;